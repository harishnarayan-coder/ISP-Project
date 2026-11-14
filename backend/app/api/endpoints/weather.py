"""
Weather Intelligence API Endpoints
"""

from fastapi import APIRouter, Query
from ...schemas.schemas import WeatherResponse
from ...services.weather_service import weather_service

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("", response_model=WeatherResponse)
async def get_weather(location: str = Query("Solar-Wind Complex Alpha (34.05°N, 118.25°W)")):
    return await weather_service.get_current_and_forecast_weather(location)

@router.get("/intelligence")
async def get_weather_intelligence(location: str = Query("Solar-Wind Complex Alpha (34.05°N, 118.25°W)")):
    res = await weather_service.get_current_and_forecast_weather(location)
    curr = res.current
    
    # Assess meteorological factors influencing solar and wind generation
    solar_condition = "Optimal" if curr.solar_irradiance > 500 and curr.cloud_cover < 30 else ("Moderate" if curr.solar_irradiance > 200 else "Muted / Low")
    wind_condition = "High Generation" if curr.wind_speed > 14 else ("Moderate Yield" if curr.wind_speed > 7 else "Light / Below Cut-in")
    
    return {
        "location": res.location,
        "is_live_api": res.is_live_api,
        "solar_assessment": {
            "status": solar_condition,
            "irradiance_wm2": curr.solar_irradiance,
            "cloud_cover_pct": curr.cloud_cover,
            "note": "Clear atmospheric window maximizes photovoltaic conversion." if curr.cloud_cover < 30 else "Cloud attenuation dampens direct normal beam irradiance."
        },
        "wind_assessment": {
            "status": wind_condition,
            "wind_speed_kmh": curr.wind_speed,
            "direction_deg": curr.wind_direction,
            "air_density_kgm3": round(1.225 * (curr.pressure / 1013.25) * (288.15 / (curr.temperature + 273.15)), 3),
            "note": "Wind speed in optimal cubic power region." if 7 <= curr.wind_speed <= 20 else "Wind regime below optimal rotor torque."
        },
        "influence_summary": "Weather conditions influencing the current forecast"
    }
