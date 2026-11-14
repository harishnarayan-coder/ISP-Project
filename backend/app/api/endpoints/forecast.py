"""
Forecast API Endpoints
"""

from fastapi import APIRouter, HTTPException
from ...schemas.schemas import ForecastRequest, ForecastResponse
from ...services.forecast_service import forecast_service

router = APIRouter(tags=["Forecast"])

@router.post("/forecast", response_model=ForecastResponse)
async def generate_forecast_endpoint(req: ForecastRequest):
    try:
        return await forecast_service.generate_forecast(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting engine error: {str(e)}")

@router.post("/predict", response_model=ForecastResponse)
async def predict_endpoint(req: ForecastRequest):
    return await generate_forecast_endpoint(req)
