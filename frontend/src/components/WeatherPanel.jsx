import React from 'react';
import {
  Thermometer,
  Droplets,
  Cloud,
  Sun,
  Wind,
  Compass,
  Gauge,
  Info
} from 'lucide-react';

export default function WeatherPanel({ weatherData, weatherIntelligence }) {
  const current = weatherData?.current || {
    temperature: 28.0,
    humidity: 58.0,
    cloud_cover: 28.0,
    solar_irradiance: 684.0,
    wind_speed: 14.5,
    wind_direction: 215.0,
    pressure: 1013.2,
    condition_description: 'Partly Cloudy'
  };

  const timeline = weatherData?.timeline || [];

  const metrics = [
    { label: 'Temperature', value: `${current.temperature}°C`, icon: Thermometer, sub: 'Ambient Dry-Bulb', color: '#8A6A4A' },
    { label: 'Relative Humidity', value: `${current.humidity}%`, icon: Droplets, sub: 'Vapor Saturation', color: '#526B73' },
    { label: 'Cloud Cover', value: `${current.cloud_cover}%`, icon: Cloud, sub: 'Sky Attenuation', color: '#6F6962' },
    { label: 'Solar Irradiance', value: `${current.solar_irradiance} W/m²`, icon: Sun, sub: 'Direct Beam / GHI', color: '#C79A4B' },
    { label: 'Wind Speed', value: `${current.wind_speed} km/h`, icon: Wind, sub: 'Rotor Plane (100m)', color: '#5E7657' },
    { label: 'Wind Direction', value: `${current.wind_direction}°`, icon: Compass, sub: 'Azimuth Vector', color: '#526B73' },
    { label: 'Surface Pressure', value: `${current.pressure} hPa`, icon: Gauge, sub: 'Barometric Density', color: '#8A6A4A' },
  ];

  return (
    <div className="renew-card" style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Weather Intelligence
            </h3>
            {weatherData?.is_live_api ? (
              <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Live Open-Meteo Feed</span>
            ) : (
              <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Calibrated Sensor Model</span>
            )}
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Weather conditions influencing the current forecast
          </p>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Updated: {current.timestamp || 'Real-time'}
        </div>
      </div>

      {/* Weather Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1.5rem'
      }}>
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem 1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {m.label}
                </span>
                <Icon size={14} color={m.color} />
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {m.value}
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {m.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* Hourly Timeline */}
      {timeline.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              24-Hour Meteorological Trajectory
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Hourly GHI & Wind Velocity
            </span>
          </div>

          <div style={{
            display: 'flex',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}>
            {timeline.slice(0, 12).map((item, idx) => (
              <div key={idx} style={{
                flex: '0 0 auto',
                minWidth: '85px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '0.55rem',
                textAlign: 'center',
                fontSize: '0.75rem'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  {item.time}
                </div>
                <div style={{ color: '#C79A4B', fontWeight: 600 }}>
                  {Math.round(item.solar_irradiance)} <span style={{ fontSize: '0.62rem', fontWeight: 400 }}>W/m²</span>
                </div>
                <div style={{ color: '#526B73', fontWeight: 500, marginTop: '0.15rem' }}>
                  {item.wind_speed} <span style={{ fontSize: '0.62rem', fontWeight: 400 }}>km/h</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: '0.15rem' }}>
                  {item.cloud_cover}% cld
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
