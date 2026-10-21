import axios from 'axios';
import { citiesData, stationsData, airQualityData, forecastData, weatherData, historicalData, monitoringOverviewData, dataQualityData, modelPerformanceData, driftData, incidentsData } from '../data/mockData';

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000,
});

// Simulated network delay for mock mode
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const handleRequest = async (mockDataFn, apiCallFn) => {
  if (useMockData) {
    await delay(500);
    return mockDataFn();
  }
  try {
    const response = await apiCallFn();
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error.response?.data?.message || error.message || 'An error occurred during the API request');
  }
};

// Air Quality
export const getCities = () => handleRequest(() => citiesData, () => apiClient.get('/cities'));
export const getStations = (cityId) => handleRequest(() => cityId ? stationsData.filter(s => s.cityId === cityId) : stationsData, () => apiClient.get(`/stations`, { params: { cityId } }));
export const getAirQuality = (stationId) => handleRequest(() => airQualityData, () => apiClient.get(`/air-quality/${stationId}`));
export const getHistoricalData = (stationId, pollutant, timeRange) => handleRequest(() => historicalData, () => apiClient.get(`/historical`, { params: { stationId, pollutant, timeRange } }));

// Forecast & Weather

// Existing forecast function.
// Keep this for pages that still use mock data.
export const getForecast = (stationId) =>
  handleRequest(
    () => forecastData,
    () => apiClient.get('/forecast', { params: { stationId } })
  );

// Fetch actual predictions from FastAPI.
export const getModelForecasts = async (stationId = null) => {
  try {
    const endpoint = stationId
      ? `/api/v1/forecasts/${encodeURIComponent(stationId)}`
      : '/api/v1/forecasts';

    const response = await apiClient.get(endpoint);

    return response.data;
  } catch (error) {
    console.error('Model forecast API error:', error);

    const detail = error.response?.data?.detail;

    throw new Error(
      typeof detail === 'string'
        ? detail
        : detail
          ? JSON.stringify(detail)
          : error.message || 'Unable to fetch model forecasts'
    );
  }
};

// Existing weather function.
export const getWeather = (stationId) =>
  handleRequest(
    () => weatherData,
    () => apiClient.get('/weather', { params: { stationId } })
  );

// Monitoring
export const getMonitoringMetrics = () => handleRequest(() => monitoringOverviewData, () => apiClient.get('/monitoring'));
export const getDataQuality = () => handleRequest(() => dataQualityData, () => apiClient.get('/monitoring/data-quality'));
export const getModelPerformance = () => handleRequest(() => modelPerformanceData, () => apiClient.get('/monitoring/model-performance'));
export const getDriftData = () => handleRequest(() => driftData, () => apiClient.get('/monitoring/drift'));

// Incidents
export const getIncidents = () => handleRequest(() => incidentsData, () => apiClient.get('/incidents'));
export const getIncidentById = (id) => handleRequest(() => incidentsData.find(i => i.id === id), () => apiClient.get(`/incidents/${id}`));
export const createIncident = (data) => handleRequest(async () => { await delay(300); return { success: true, data }; }, () => apiClient.post('/incidents', data));
export const updateIncident = (id, data) => handleRequest(async () => { await delay(300); return { success: true, id, data }; }, () => apiClient.put(`/incidents/${id}`, data));

// Retraining
export const startRetraining = () => handleRequest(async () => { await delay(1500); return { success: true }; }, () => apiClient.post('/models/retrain'));
export const getRetrainingStatus = () => handleRequest(() => ({ status: 'Not Required' }), () => apiClient.get('/models/retrain/status'));
export const getModels = () => handleRequest(() => [], () => apiClient.get('/models'));
