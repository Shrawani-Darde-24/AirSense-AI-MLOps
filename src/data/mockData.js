export const citiesData = [
  { id: 'city_01', name: 'Pune', state: 'Maharashtra', stations: 5, status: 'Monitoring', currentPM25: 72, forecastPM25: 81 },
  { id: 'city_02', name: 'Mumbai', state: 'Maharashtra', stations: 12, status: 'Normal', currentPM25: 58, forecastPM25: 63 },
  { id: 'city_03', name: 'Delhi', state: 'Delhi', stations: 15, status: 'Attention', currentPM25: 112, forecastPM25: 125 },
  { id: 'city_04', name: 'Hyderabad', state: 'Telangana', stations: 8, status: 'Normal', currentPM25: 46, forecastPM25: 51 },
  { id: 'city_05', name: 'Chennai', state: 'Tamil Nadu', stations: 7, status: 'Normal', currentPM25: 39, forecastPM25: 42 },
  { id: 'city_06', name: 'Bengaluru', state: 'Karnataka', stations: 9, status: 'Normal', currentPM25: 45, forecastPM25: 48 },
  { id: 'city_07', name: 'Kolkata', state: 'West Bengal', stations: 6, status: 'Monitoring', currentPM25: 67, forecastPM25: 73 },
  { id: 'city_08', name: 'Jaipur', state: 'Rajasthan', stations: 4, status: 'Monitoring', currentPM25: 82, forecastPM25: 88 },
  { id: 'city_09', name: 'Lucknow', state: 'Uttar Pradesh', stations: 5, status: 'Attention', currentPM25: 91, forecastPM25: 97 }
];

export const stationsData = [
  { id: 'site_5409', cityId: 'city_01', name: 'Revenue Colony-Shivajinagar', area: 'Shivajinagar', lat: 18.5314, lng: 73.8456, pm25: 68, pm10: 102, no2: 28, parameters: '7/7', status: 'Online' },
  { id: 'site_5766', cityId: 'city_01', name: 'Katraj Dairy', area: 'Katraj', lat: 18.4486, lng: 73.8454, pm25: 72, pm10: 108, no2: 31, parameters: '7/7', status: 'Online' },
  { id: 'site_3211', cityId: 'city_02', name: 'Bandra', area: 'Bandra West', lat: 19.0596, lng: 72.8295, pm25: 58, pm10: 89, no2: 34, parameters: '7/7', status: 'Online' },
  { id: 'site_3212', cityId: 'city_02', name: 'Colaba', area: 'South Mumbai', lat: 18.9067, lng: 72.8147, pm25: 45, pm10: 72, no2: 25, parameters: '6/7', status: 'Offline' },
  { id: 'site_1101', cityId: 'city_03', name: 'Anand Vihar', area: 'East Delhi', lat: 28.6469, lng: 77.3160, pm25: 112, pm10: 156, no2: 45, parameters: '7/7', status: 'Online' }
];

export const airQualityData = {
  current: {
    PM25: { value: 72, unit: 'µg/m³', status: 'Poor', change: '↑ 8%' },
    PM10: { value: 108, unit: 'µg/m³', status: 'Moderate', change: '↑ 4%' },
    NO2: { value: 31, unit: 'µg/m³', status: 'Good', change: '↓ 3%' },
    SO2: { value: 9, unit: 'µg/m³', status: 'Good', change: '↓ 5%' },
    CO: { value: 0.7, unit: 'mg/m³', status: 'Good', change: 'Stable' },
    O3: { value: 42, unit: 'µg/m³', status: 'Good', change: '↓ 2%' },
    NH3: { value: 14, unit: 'µg/m³', status: 'Good', change: 'Stable' }
  }
};

export const forecastData = {
  summary: {
    current: 72,
    h1: 75,
    h6: 81,
    h24: 68
  },
  model: {
    name: 'XGBoost v3.2',
    lastTrained: '2026-09-18T00:00:00Z',
    forecastGenerated: '2026-09-25T15:00:00Z'
  },
  chart: [
    { time: '10:00', actual: 65, forecast: null, lower: null, upper: null },
    { time: '11:00', actual: 68, forecast: null, lower: null, upper: null },
    { time: '12:00', actual: 72, forecast: 72, lower: 70, upper: 74 },
    { time: '13:00', actual: null, forecast: 75, lower: 72, upper: 78 },
    { time: '18:00', actual: null, forecast: 81, lower: 76, upper: 86 }
  ]
};

export const weatherData = {
  current: {
    temperature: 28,
    humidity: 64,
    windSpeed: 3.4,
    windDirection: 'SW',
    pressure: 1008,
    precipitation: 0.0,
    cloudCover: 42,
    windGust: 5.1
  },
  chart: [
    { time: '00:00', temperature: 24, humidity: 75, windSpeed: 2.1 },
    { time: '04:00', temperature: 23, humidity: 78, windSpeed: 1.8 },
    { time: '08:00', temperature: 26, humidity: 70, windSpeed: 2.5 },
    { time: '12:00', temperature: 31, humidity: 55, windSpeed: 4.2 },
    { time: '16:00', temperature: 30, humidity: 58, windSpeed: 3.8 },
    { time: '20:00', temperature: 27, humidity: 65, windSpeed: 2.9 }
  ]
};

export const historicalData = {
  summary: {
    average: 68.5,
    min: 42.1,
    max: 112.4,
    observations: 24
  },
  chart: [
    { time: '00:00', PM25: 65, PM10: 95, NO2: 22, SO2: 8, CO: 0.5, O3: 35 },
    { time: '04:00', PM25: 58, PM10: 88, NO2: 18, SO2: 7, CO: 0.4, O3: 30 },
    { time: '08:00', PM25: 85, PM10: 120, NO2: 45, SO2: 12, CO: 1.1, O3: 25 },
    { time: '12:00', PM25: 72, PM10: 105, NO2: 38, SO2: 10, CO: 0.8, O3: 55 },
    { time: '16:00', PM25: 68, PM10: 98, NO2: 32, SO2: 9, CO: 0.7, O3: 65 },
    { time: '20:00', PM25: 75, PM10: 110, NO2: 42, SO2: 11, CO: 0.9, O3: 45 }
  ]
};

export const monitoringOverviewData = {
  dataQuality: { status: 'Healthy', explanation: '98% data completeness', timestamp: new Date().toISOString() },
  modelPerformance: { status: 'Healthy', explanation: 'RMSE within acceptable limits', timestamp: new Date().toISOString() },
  dataDrift: { status: 'Warning', explanation: 'Mild drift in humidity feature', timestamp: new Date().toISOString() },
  predictionDrift: { status: 'Healthy', explanation: 'Predictions align with historical baseline', timestamp: new Date().toISOString() },
  pipelineStatus: { status: 'Healthy', explanation: 'All jobs running successfully', timestamp: new Date().toISOString() },
  lastAnalysis: { status: 'Healthy', explanation: 'Completed successfully 5m ago', timestamp: new Date().toISOString() }
};

export const dataQualityData = {
  completeness: [
    { time: 'Mon', percentage: 99.1 },
    { time: 'Tue', percentage: 98.5 },
    { time: 'Wed', percentage: 97.2 },
    { time: 'Thu', percentage: 99.5 },
    { time: 'Fri', percentage: 98.8 },
    { time: 'Sat', percentage: 96.5 },
    { time: 'Sun', percentage: 98.9 }
  ],
  table: [
    { parameter: 'PM2.5', records: 1024, missingPercent: 0.5, outliers: 12, status: 'Healthy' },
    { parameter: 'PM10', records: 1024, missingPercent: 1.2, outliers: 8, status: 'Healthy' },
    { parameter: 'NO2', records: 1024, missingPercent: 5.4, outliers: 3, status: 'Warning' },
    { parameter: 'SO2', records: 1024, missingPercent: 1.1, outliers: 2, status: 'Healthy' },
    { parameter: 'CO', records: 1024, missingPercent: 12.5, outliers: 15, status: 'Critical' },
    { parameter: 'O3', records: 1024, missingPercent: 2.3, outliers: 5, status: 'Healthy' },
    { parameter: 'Weather', records: 1024, missingPercent: 0.1, outliers: 1, status: 'Healthy' }
  ]
};

export const modelPerformanceData = {
  metrics: {
    h1: { mae: 4.2, rmse: 6.5, r2: 0.92 },
    h6: { mae: 8.5, rmse: 12.1, r2: 0.85 },
    h24: { mae: 15.3, rmse: 21.4, r2: 0.72 }
  },
  chart: [
    { horizon: '+1h', mae: 4.2, rmse: 6.5 },
    { horizon: '+6h', mae: 8.5, rmse: 12.1 },
    { horizon: '+24h', mae: 15.3, rmse: 21.4 }
  ]
};

export const driftData = {
  summary: {
    dataDriftStatus: 'Warning',
    predictionDriftStatus: 'Healthy',
    lastChecked: new Date().toISOString(),
    affectedFeatures: 1
  },
  trendChart: [
    { time: 'Mon', score: 0.05 },
    { time: 'Tue', score: 0.08 },
    { time: 'Wed', score: 0.12 },
    { time: 'Thu', score: 0.15 },
    { time: 'Fri', score: 0.22 },
    { time: 'Sat', score: 0.28 },
    { time: 'Sun', score: 0.35 } // Passing 0.3 threshold
  ],
  table: [
    { feature: 'PM2.5', score: 0.05, threshold: 0.3, status: 'No Drift' },
    { feature: 'PM10', score: 0.08, threshold: 0.3, status: 'No Drift' },
    { feature: 'NO2', score: 0.12, threshold: 0.3, status: 'No Drift' },
    { feature: 'Temperature', score: 0.15, threshold: 0.3, status: 'No Drift' },
    { feature: 'Humidity', score: 0.35, threshold: 0.3, status: 'Drift Detected' },
    { feature: 'Wind Speed', score: 0.22, threshold: 0.3, status: 'No Drift' },
    { feature: 'Pressure', score: 0.04, threshold: 0.3, status: 'No Drift' }
  ]
};

export const incidentsData = [
  { id: 'INC-001', type: 'Data Drift', severity: 'Warning', source: 'Drift Detection', status: 'Investigating', created: new Date(Date.now() - 86400000).toISOString(), lastUpdated: new Date(Date.now() - 3600000).toISOString(), assignedTo: 'MLOps Team', description: 'Humidity feature distribution has drifted significantly from the training baseline.', feature: 'Humidity', score: '0.35', threshold: '0.30', action: 'Investigate sensor calibration or trigger retraining.' },
  { id: 'INC-002', type: 'Model Performance', severity: 'Critical', source: 'Model Monitoring', status: 'Open', created: new Date(Date.now() - 172800000).toISOString(), lastUpdated: new Date(Date.now() - 86400000).toISOString(), assignedTo: 'Data Science Team', description: 'RMSE for +24h horizon has exceeded acceptable thresholds for 3 consecutive days.', feature: '+24h Horizon', score: '21.4 RMSE', threshold: '20.0 RMSE', action: 'Evaluate recent drift and trigger model retraining with recent data.' },
  { id: 'INC-003', type: 'Data Quality', severity: 'Warning', source: 'Data Pipeline', status: 'Resolved', created: new Date(Date.now() - 432000000).toISOString(), lastUpdated: new Date(Date.now() - 259200000).toISOString(), assignedTo: 'Data Engineering', description: 'Elevated missing values detected in CO parameter stream.', feature: 'CO', score: '12.5% Missing', threshold: '5.0% Missing', action: 'Data pipeline patched. Missing values imputed via historical moving average.' }
];
