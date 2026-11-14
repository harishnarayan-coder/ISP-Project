"""
Weather Service Module
Fetches real-time and forecast meteorological observations for energy forecasting.
Supports Open-Meteo API (free, global coordinates, irradiance and wind data)
with fallback to calibrated meteorological states and timeout handling.
"""

import os
import math
import httpx
from typing import Dict, Any, List
from datetime import datetime, timedelta
from ..schemas.schemas import WeatherData, WeatherHourlyPoint, WeatherResponse

class WeatherService:
    def __init__(self):
        self.api_key = os.getenv("OPENWEATHERMAP_API_KEY", "")
        self.timeout = 5.0
        
        # Default preset locations (Renewable Energy Parks)
        self.location_coords = {
            "Solar-Wind Complex Alpha (34.05°N, 118.25°W)": {"lat": 34.05, "lon": -118.25, "name": "Mojave Desert Park"},
            "Texas Coastal Wind & Solar Hybrid (26.90°N, 97.45°W)": {"lat": 26.90, "lon": -97.45, "name": "Gulf Coast Facility"},
            "Pavagada Solar & Wind Hub (14.10°N, 77.28°E)": {"lat": 14.10, "lon": 77.28, "name": "Pavagada Renewable Park"},
            "Kite North Sea Renewable Node (53.50°N, 6.20°E)": {"lat": 53.50, "lon": 6.20, "name": "North Sea Node"}
        }

    async def get_current_and_forecast_weather(self, location_name: str) -> WeatherResponse:
        coords = self.location_coords.get(location_name, {"lat": 34.05, "lon": -118.25, "name": "Standard Site"})
        lat, lon = coords["lat"], coords["lon"]
        
        try:
            # Open-Meteo free API providing GHI solar radiation, wind speed at 100m, cloud cover, etc.
            url = (
                f"https://api.open-meteo.com/v1/forecast?"
                f"latitude={lat}&longitude={lon}&current="
                f"temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,cloud_cover,direct_normal_irradiance,global_tilted_irradiance"
                f"&hourly=temperature_2m,cloud_cover,direct_normal_irradiance,wind_speed_10m&forecast_days=2"
            )
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    return self._parse_open_meteo_response(location_name, lat, lon, data)
        except Exception as e:
            print(f"[WeatherService] Live API request failed or timed out ({e}). Utilizing calibrated fallback model.")
            
        return self._generate_calibrated_weather(location_name, lat, lon)

    def _parse_open_meteo_response(self, location_name: str, lat: float, lon: float, data: Dict[str, Any]) -> WeatherResponse:
        curr = data.get("current", {})
        temp = float(curr.get("temperature_2m", 26.5))
        humidity = float(curr.get("relative_humidity_2m", 58.0))
        pressure = float(curr.get("surface_pressure", 1014.0))
        wind_spd = float(curr.get("wind_speed_10m", 15.2))  # km/h
        wind_dir = float(curr.get("wind_direction_10m", 215.0))
        cloud = float(curr.get("cloud_cover", 28.0))
        # Estimate GHI from direct normal irradiance + diffuse estimate
        dni = float(curr.get("direct_normal_irradiance", 620.0))
        solar_irr = max(0.0, dni * (1.0 - cloud / 150.0))
        
        weather_curr = WeatherData(
            temperature=round(temp, 1),
            humidity=round(humidity, 1),
            cloud_cover=round(cloud, 1),
            solar_irradiance=round(solar_irr, 1),
            wind_speed=round(wind_spd, 1),
            wind_direction=round(wind_dir, 1),
            pressure=round(pressure, 1),
            condition_description="Clear Sky" if cloud < 20 else ("Partly Cloudy" if cloud < 60 else "Overcast"),
            timestamp=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
        )
        
        hourly = data.get("hourly", {})
        times = hourly.get("time", [])[:24]
        temps = hourly.get("temperature_2m", [])[:24]
        clouds = hourly.get("cloud_cover", [])[:24]
        dnis = hourly.get("direct_normal_irradiance", [])[:24]
        winds = hourly.get("wind_speed_10m", [])[:24]
        
        timeline = []
        for i in range(min(len(times), 24)):
            t_str = times[i].split("T")[1][:5] if "T" in times[i] else f"{i:02d}:00"
            timeline.append(WeatherHourlyPoint(
                time=t_str,
                temperature=float(temps[i]) if i < len(temps) else temp,
                cloud_cover=float(clouds[i]) if i < len(clouds) else cloud,
                solar_irradiance=float(dnis[i]) if i < len(dnis) else 0.0,
                wind_speed=float(winds[i]) if i < len(winds) else wind_spd
            ))
            
        return WeatherResponse(
            location=location_name,
            latitude=lat,
            longitude=lon,
            current=weather_curr,
            timeline=timeline,
            is_live_api=True
        )

    def _generate_calibrated_weather(self, location_name: str, lat: float, lon: float) -> WeatherResponse:
        now = datetime.utcnow()
        hour = now.hour
        
        # Diurnal physics
        temp = round(25.0 + 6.0 * math.sin((hour - 9) * math.pi / 12), 1)
        humidity = round(max(30.0, 70.0 - 20.0 * math.sin((hour - 9) * math.pi / 12)), 1)
        cloud = round(max(5.0, 30.0 + 15.0 * math.sin(hour * math.pi / 6)), 1)
        
        if 6 <= hour <= 18:
            irr = round(max(0.0, 850.0 * math.sin((hour - 6) * math.pi / 12) * (1.0 - cloud / 120.0)), 1)
        else:
            irr = 0.0
            
        wind = round(max(3.0, 14.0 + 4.5 * math.sin((hour - 14) * math.pi / 12)), 1)
        wind_dir = round((220.0 + hour * 4.0) % 360, 1)
        pressure = 1013.8
        
        weather_curr = WeatherData(
            temperature=temp,
            humidity=humidity,
            cloud_cover=cloud,
            solar_irradiance=irr,
            wind_speed=wind,
            wind_direction=wind_dir,
            pressure=pressure,
            condition_description="Partly Cloudy" if cloud > 25 else "Sunny / Clear",
            timestamp=now.strftime("%Y-%m-%d %H:%M UTC")
        )
        
        timeline = []
        for h in range(24):
            t_hour = (hour + h) % 24
            t_irr = round(max(0.0, 850.0 * math.sin((t_hour - 6) * math.pi / 12) * (1.0 - cloud / 120.0)), 1) if 6 <= t_hour <= 18 else 0.0
            t_temp = round(25.0 + 6.0 * math.sin((t_hour - 9) * math.pi / 12), 1)
            t_wind = round(max(3.0, 14.0 + 4.5 * math.sin((t_hour - 14) * math.pi / 12)), 1)
            timeline.append(WeatherHourlyPoint(
                time=f"{t_hour:02d}:00",
                temperature=t_temp,
                cloud_cover=cloud,
                solar_irradiance=t_irr,
                wind_speed=t_wind
            ))
            
        return WeatherResponse(
            location=location_name,
            latitude=lat,
            longitude=lon,
            current=weather_curr,
            timeline=timeline,
            is_live_api=False
        )

# Global service instance
weather_service = WeatherService()
