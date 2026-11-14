"""
Sample Dataset Generator for NREL Solar PVDAQ and WIND Toolkit Formats
Produces realistic hourly time-series data with physics-based meteorological relationships:
- Solar: Diurnal solar zenith angle, direct/diffuse radiation, temperature derating
- Wind: Weibull distributed wind speeds, power curve cubic relationship with cut-in / rated / cut-out speeds
- Combined: Joint multivariate dataset
"""

import math
import random
from datetime import datetime, timedelta
import csv
import os

def generate_samples(output_dir="data/sample", days=14):
    os.makedirs(output_dir, exist_ok=True)
    random.seed(42)
    
    start_time = datetime(2026, 6, 1, 0, 0, 0)
    total_hours = days * 24
    
    solar_rows = []
    wind_rows = []
    combined_rows = []
    
    # Base meteorological states
    base_temp = 24.0
    base_pressure = 1013.25
    
    for i in range(total_hours):
        current_time = start_time + timedelta(hours=i)
        hour = current_time.hour
        day_of_year = current_time.timetuple().tm_yday
        timestamp_str = current_time.strftime("%Y-%m-%d %H:%M:%S")
        
        # Diurnal temperature cycle (peaks at 15:00, lowest at 05:00)
        temp_cycle = math.sin((hour - 9) * math.pi / 12)
        ambient_temp = round(base_temp + temp_cycle * 7.5 + random.uniform(-1.2, 1.2), 2)
        humidity = max(20, min(95, round(65 - temp_cycle * 25 + random.uniform(-5, 5), 1)))
        pressure = round(base_pressure + random.uniform(-4, 4), 1)
        
        # Cloud cover variation (smoothed noise)
        cloud_factor = max(0.0, min(1.0, 0.25 + 0.3 * math.sin(i / 18.0) + random.uniform(-0.15, 0.15)))
        cloud_cover_pct = round(cloud_factor * 100, 1)
        
        # 1. Solar Physics
        # Solar elevation angle approximation (positive between 6am and 18pm)
        if 6 <= hour <= 18:
            solar_elevation = math.sin((hour - 6) * math.pi / 12)
            solar_zenith_angle = round(90.0 - (solar_elevation * 72.0), 2)
            
            # Direct Normal Irradiance (DNI) and Global Horizontal Irradiance (GHI)
            clear_sky_dni = 950.0 * (solar_elevation ** 1.1)
            dni = max(0.0, clear_sky_dni * (1.0 - cloud_factor * 0.85) + random.uniform(-20, 20))
            dhi = max(0.0, 120.0 * (solar_elevation ** 0.8) + (cloud_factor * 150) + random.uniform(-10, 10))
            ghi = round(dni * math.cos(math.radians(solar_zenith_angle)) + dhi, 2)
            dni = round(dni, 2)
            dhi = round(dhi, 2)
            
            # Module temperature rises above ambient under irradiance
            module_temp = round(ambient_temp + (ghi / 800.0) * 22.0 + random.uniform(-1.0, 1.0), 2)
            
            # Solar panel nominal rated capacity = 10.0 MW
            # Efficiency derating with module temperature (-0.4%/°C above 25°C)
            temp_derate = 1.0 - 0.004 * max(0.0, module_temp - 25.0)
            solar_power_mw = round(max(0.0, (ghi / 1000.0) * 10.0 * temp_derate * (1 - cloud_factor * 0.6) + random.uniform(-0.1, 0.1)), 2)
        else:
            solar_zenith_angle = 90.0 + (min(hour, 24 - hour) * 4.5)
            dni = 0.0
            dhi = 0.0
            ghi = 0.0
            module_temp = round(ambient_temp - random.uniform(0.5, 2.0), 2)
            solar_power_mw = 0.0
            
        # 2. Wind Physics
        # Wind speed following diurnal pattern + atmospheric waves (higher in late afternoon/night)
        diurnal_wind = 1.5 * math.sin((hour - 14) * math.pi / 12)
        synoptic_wind = 4.0 * math.sin(i / 36.0)  # Multi-day pressure wave
        wind_speed_80m = max(0.8, round(7.2 + diurnal_wind + synoptic_wind + random.gauss(0, 1.4), 2))
        wind_speed_100m = round(wind_speed_80m * (100.0 / 80.0) ** 0.143, 2)  # Hellmann power law shear
        wind_direction = round((210 + math.sin(i / 24.0) * 45 + random.uniform(-15, 15)) % 360, 1)
        air_density = round(1.225 * (pressure / 1013.25) * (288.15 / (ambient_temp + 273.15)), 3)
        
        # Wind turbine power curve (10 MW rated farm, Cut-in: 3 m/s, Rated: 12 m/s, Cut-out: 25 m/s)
        if wind_speed_100m < 3.0 or wind_speed_100m > 25.0:
            wind_power_mw = 0.0
        elif wind_speed_100m >= 12.0:
            wind_power_mw = round(10.0 * (air_density / 1.225) + random.uniform(-0.1, 0.1), 2)
        else:
            # Cubic power relationship between cut-in and rated
            ratio = (wind_speed_100m - 3.0) / (12.0 - 3.0)
            wind_power_mw = round(10.0 * (ratio ** 2.8) * (air_density / 1.225) + random.uniform(-0.15, 0.15), 2)
        wind_power_mw = max(0.0, min(10.0, wind_power_mw))
        
        total_power_mw = round(solar_power_mw + wind_power_mw, 2)
        
        # Rows
        solar_rows.append({
            "timestamp": timestamp_str,
            "dni": dni,
            "dhi": dhi,
            "ghi": ghi,
            "ambient_temperature": ambient_temp,
            "module_temperature": module_temp,
            "relative_humidity": humidity,
            "solar_zenith_angle": solar_zenith_angle,
            "solar_power_mw": solar_power_mw
        })
        
        wind_rows.append({
            "timestamp": timestamp_str,
            "wind_speed_80m": wind_speed_80m,
            "wind_speed_100m": wind_speed_100m,
            "wind_direction": wind_direction,
            "air_density": air_density,
            "surface_pressure": pressure,
            "ambient_temperature": ambient_temp,
            "wind_power_mw": wind_power_mw
        })
        
        combined_rows.append({
            "timestamp": timestamp_str,
            "solar_power_mw": solar_power_mw,
            "wind_power_mw": wind_power_mw,
            "total_power_mw": total_power_mw,
            "temperature": ambient_temp,
            "humidity": humidity,
            "cloud_cover": cloud_cover_pct,
            "solar_irradiance": ghi,
            "wind_speed": wind_speed_100m,
            "wind_direction": wind_direction,
            "pressure": pressure
        })
    
    # Write solar dataset
    solar_path = os.path.join(output_dir, "nrel_solar_pvdaq_sample.csv")
    with open(solar_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(solar_rows[0].keys()))
        writer.writeheader()
        writer.writerows(solar_rows)
    print(f"Generated {len(solar_rows)} rows in {solar_path}")
    
    # Write wind dataset
    wind_path = os.path.join(output_dir, "nrel_wind_toolkit_sample.csv")
    with open(wind_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(wind_rows[0].keys()))
        writer.writeheader()
        writer.writerows(wind_rows)
    print(f"Generated {len(wind_rows)} rows in {wind_path}")
    
    # Write combined dataset
    combined_path = os.path.join(output_dir, "combined_renewable_sample.csv")
    with open(combined_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(combined_rows[0].keys()))
        writer.writeheader()
        writer.writerows(combined_rows)
    print(f"Generated {len(combined_rows)} rows in {combined_path}")

if __name__ == "__main__":
    generate_samples()
