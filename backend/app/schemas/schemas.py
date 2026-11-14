"""
Pydantic Schemas for RENEWCAST API Endpoints
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime

class WeatherData(BaseModel):
    temperature: float = Field(..., description="Ambient temperature in °C")
    humidity: float = Field(..., description="Relative humidity percentage")
    cloud_cover: float = Field(..., description="Cloud cover percentage (0-100)")
    solar_irradiance: float = Field(..., description="Global Horizontal Irradiance in W/m²")
    wind_speed: float = Field(..., description="Wind speed at 100m in km/h or m/s")
    wind_direction: float = Field(..., description="Wind direction in degrees (0-360)")
    pressure: float = Field(..., description="Atmospheric pressure in hPa")
    condition_description: Optional[str] = "Partly Cloudy"
    timestamp: Optional[str] = None

class WeatherHourlyPoint(BaseModel):
    time: str
    temperature: float
    cloud_cover: float
    solar_irradiance: float
    wind_speed: float

class WeatherResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    current: WeatherData
    timeline: List[WeatherHourlyPoint]
    is_live_api: bool = True

class ForecastRequest(BaseModel):
    location: str = "Solar-Wind Complex Alpha (34.05°N, 118.25°W)"
    horizon: str = Field("6h", description="Forecast horizon: 1h, 6h, 12h, 24h")
    strategy: str = Field("adaptive_fusion", description="adaptive_fusion, lstm, gru, cnn_lstm")
    data_source: str = Field("open_meteo", description="open_meteo or custom_dataset")
    use_current_weather: bool = True
    dataset_name: Optional[str] = "weatherHistory.csv"

class ForecastSeriesPoint(BaseModel):
    timestamp: str
    is_forecast: bool
    solar_actual: Optional[float] = None
    wind_actual: Optional[float] = None
    total_actual: Optional[float] = None
    solar_pred: float
    wind_pred: float
    total_pred: float
    confidence_lower: float
    confidence_upper: float

class ForecastResponse(BaseModel):
    location: str
    horizon: str
    strategy: str
    run_timestamp: str
    solar_prediction_mw: float
    wind_prediction_mw: float
    total_prediction_mw: float
    solar_delta_pct: float
    wind_delta_pct: float
    total_delta_pct: float
    model_confidence_pct: float
    fusion_weights: Dict[str, float]
    weather_regime: str
    weather_influence_note: str
    series: List[ForecastSeriesPoint]
    is_demo_baseline: bool = False
    data_source: str = "open_meteo"
    dataset_used: Optional[str] = None
    data_source_mode: Optional[str] = "Live Open-Meteo Weather API"

class ModelMetricItem(BaseModel):
    model: str
    name: str
    mae: float
    rmse: float
    mape: float
    r2: float
    inference_time_ms: float
    best_at: Optional[str] = None

class ModelComparisonResponse(BaseModel):
    horizon: str
    best_model: str
    adaptive_gain_pct: float
    is_demo_data: bool = True
    metrics: List[ModelMetricItem]
    fusion_weights: Dict[str, float]
    regime_description: str

class DatasetInfoResponse(BaseModel):
    filename: str
    rows: int
    columns: int
    missing_values: int
    date_range_start: str
    date_range_end: str
    detected_features: List[str]
    missing_expected_features: List[str]
    preview: List[Dict[str, Any]]

class PreprocessingResponse(BaseModel):
    raw_records: int
    cleaned_records: int
    missing_handled: int
    duplicates_removed: int
    normalization_status: str
    sequence_length: int
    train_count: int
    val_count: int
    test_count: int
    status: str

class HistoryRecord(BaseModel):
    id: str
    date: str
    location: str
    horizon: str
    solar_mw: float
    wind_mw: float
    total_mw: float
    strategy: str
    status: str = "Completed"

class HealthResponse(BaseModel):
    status: str
    version: str
    models_loaded: List[str]
    timestamp: str
