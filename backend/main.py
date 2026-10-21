from pathlib import Path
from contextlib import asynccontextmanager

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "AirSense_AI_Dataset"
MODEL_DIR = DATA_DIR / "trained_models"
TEST_DATA_PATH = DATA_DIR / "ml" / "test_dataset.csv"

TARGETS = ["target_1h", "target_6h", "target_24h"]

models = {}
test_data = None

# --------------------------------------------------
# LOAD MODELS AND DATA
# --------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    global test_data

    if not TEST_DATA_PATH.exists():
        raise RuntimeError(
            f"Dataset not found: {TEST_DATA_PATH}"
        )

    test_data = pd.read_csv(TEST_DATA_PATH)

    if "station_id" not in test_data.columns:
        raise RuntimeError(
            "station_id column is missing from the dataset."
        )

    if "timestamp" not in test_data.columns:
        raise RuntimeError(
            "timestamp column is missing from the dataset."
        )

    test_data["timestamp"] = pd.to_datetime(
        test_data["timestamp"],
        errors="coerce",
        utc=True,
    )

    for target in TARGETS:
        model_path = MODEL_DIR / f"{target}_model.joblib"

        if not model_path.exists():
            raise RuntimeError(
                f"Model file not found: {model_path}"
            )

        artifact = joblib.load(model_path)

        if not isinstance(artifact, dict):
            raise RuntimeError(
                f"Unexpected artifact format for {target}."
            )

        if "model" not in artifact or "features" not in artifact:
            raise RuntimeError(
                f"Model artifact is missing required fields: {target}"
            )

        models[target] = artifact

    yield

    models.clear()

# --------------------------------------------------
# FASTAPI APPLICATION
# --------------------------------------------------

app = FastAPI(
    title="AirSense AI API",
    description=(
        "Air-quality forecasting and monitoring API. "
        "Current forecasts use a synthetic demonstration dataset."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# Allow the local Vite development server to call the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AirSense AI",
        "models_loaded": len(models),
        "data_type": "synthetic demonstration",
    }
# --------------------------------------------------
# FORECAST HELPERS
# --------------------------------------------------

def get_station_forecast(station_id: str):
    if test_data is None:
        raise HTTPException(
            status_code=503,
            detail="Dataset is not loaded.",
        )

    station_data = test_data[
        test_data["station_id"].astype(str) == station_id
    ].copy()

    if station_data.empty:
        raise HTTPException(
            status_code=404,
            detail=f"Station not found: {station_id}",
        )

    station_data = station_data.dropna(
        subset=["timestamp"]
    ).sort_values("timestamp")

    if station_data.empty:
        raise HTTPException(
            status_code=404,
            detail="No valid timestamped observations for this station.",
        )

    latest_row = station_data.iloc[[-1]]

    forecasts = {}

    for target in TARGETS:
        artifact = models[target]

        model = artifact["model"]
        features = artifact["features"]

        missing_features = [
            feature
            for feature in features
            if feature not in latest_row.columns
        ]

        if missing_features:
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "Required model features are missing.",
                    "target": target,
                    "missing_features": missing_features,
                },
            )

        # Use the feature order saved during training.
        X = latest_row[features]

        try:
            prediction = float(model.predict(X)[0])
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"Prediction failed for {target}: {str(exc)}",
            ) from exc

        forecasts[target] = round(prediction, 2)

    row = latest_row.iloc[0]

    return {
        "station_id": station_id,
        "station_name": (
            str(row["station_name"])
            if "station_name" in row.index
            else station_id
        ),
        "city": (
            str(row["city"])
            if "city" in row.index
            else None
        ),
        "timestamp": row["timestamp"].isoformat(),
        "current_pm25": (
            round(float(row["PM2.5"]), 2)
            if pd.notna(row.get("PM2.5"))
            else None
        ),
        "forecasts": {
            "1_hour": forecasts["target_1h"],
            "6_hours": forecasts["target_6h"],
            "24_hours": forecasts["target_24h"],
        },
        "model": "RandomForestRegressor",
        "data_type": "synthetic demonstration",
    }


# --------------------------------------------------
# FORECAST ENDPOINTS
# --------------------------------------------------

@app.get("/api/v1/forecasts")
def get_forecasts():
    if test_data is None:
        raise HTTPException(
            status_code=503,
            detail="Dataset is not loaded.",
        )

    station_ids = (
        test_data["station_id"]
        .dropna()
        .astype(str)
        .unique()
    )

    results = []

    for station_id in station_ids:
        results.append(get_station_forecast(station_id))

    return {
        "count": len(results),
        "data_type": "synthetic demonstration",
        "forecasts": results,
    }
@app.get("/api/v1/forecasts/{station_id}")
def get_forecast_by_station(station_id: str):
    return get_station_forecast(station_id)






    