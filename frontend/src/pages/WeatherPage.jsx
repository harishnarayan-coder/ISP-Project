import React, { useState, useEffect } from 'react';
import {
  Thermometer,
  Droplets,
  Cloud,
  Sun,
  Wind,
  Compass,
  Gauge,
  ArrowRight,
  Sliders,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { apiService } from '../services/api';
import WeatherPanel from '../components/WeatherPanel';

export default function WeatherPage({ weatherData, currentLocation }) {
  const [fusionInfo, setFusionInfo] = useState(null);

  useEffect(() => {
    let isMounted = true;
    apiService.getFusionWeights().then((res) => {
      if (isMounted) setFusionInfo(res);
    });
    return () => { isMounted = false; };
  }, []);

  const weights = fusionInfo?.weights || { lstm: 0.31, gru: 0.27, cnn_lstm: 0.42 };
  const current = weatherData?.current || {
    temperature: 28.0,
    humidity: 58.0,
    cloud_cover: 28.0,
    solar_irradiance: 684.0,
    wind_speed: 14.5,
    wind_direction: 215.0,
    pressure: 1013.2
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Weather Intelligence & Adaptation
          </h1>
          <span className="badge badge-green">Continuous Telemetry</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Atmospheric state observation and dynamic deep learning model parameter modulation.
        </p>
      </div>

      {/* Main Meteorological Observation Panel */}
      <WeatherPanel weatherData={weatherData} />

      {/* Weather-Aware Adaptation Section */}
      <div className="renew-card" style={{ padding: '1.75rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Weather-Aware Model Adaptation Mechanics
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            How atmospheric conditions dynamically adjust model influence and confidence weights.
          </p>
        </div>

        {/* 2-Column Comparison: Current Conditions vs Model Response */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Current Conditions Card */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#8A6A4A', letterSpacing: '0.04em', marginBottom: '1rem' }}>
              Current Meteorological State
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Solar Irradiance:</span>
                <strong>{current.solar_irradiance > 500 ? 'High' : (current.solar_irradiance > 200 ? 'Moderate' : 'Low')} ({current.solar_irradiance} W/m²)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Cloud Cover:</span>
                <strong>{current.cloud_cover > 50 ? 'Overcast / High' : (current.cloud_cover > 25 ? 'Moderate' : 'Clear')} ({current.cloud_cover}%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Wind Speed (100m):</span>
                <strong>{current.wind_speed > 12 ? 'High' : 'Moderate'} ({current.wind_speed} km/h)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Atmospheric Stability:</span>
                <strong style={{ color: '#5E7657' }}>Nominal Convective</strong>
              </div>
            </div>
          </div>

          {/* Model Response Weights Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-subtle)'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#5E7657', letterSpacing: '0.04em', marginBottom: '1rem' }}>
              Adaptive Model Weights Response
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>LSTM Weight (α₁):</span>
                <strong style={{ color: '#8A6A4A' }}>{weights.lstm.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>GRU Weight (α₂):</span>
                <strong style={{ color: '#526B73' }}>{weights.gru.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>CNN-LSTM Weight (α₃):</span>
                <strong style={{ color: '#5E7657' }}>{weights.cnn_lstm.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Normalized Sum Σα:</span>
                <strong style={{ color: '#25221F' }}>1.00</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Stage Relationship Visualization Flow:
            Weather Conditions → Feature Processing → Model Predictions → Adaptive Weighting → Final Forecast */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem'
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
            Adaptive Pipeline Transformation Sequence
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            {[
              { step: '01', title: 'Weather Conditions', desc: 'Solar Irradiance, Wind Velocity, Surface Pressure' },
              { step: '02', title: 'Feature Processing', desc: 'MinMax Scaling, Cyclical Time Encoding, Lag Windows' },
              { step: '03', title: 'Model Predictions', desc: 'Independent Inference via LSTM, GRU, CNN-LSTM' },
              { step: '04', title: 'Adaptive Weighting', desc: 'Convex dynamic optimization based on weather regime' },
              { step: '05', title: 'Final Forecast', desc: 'Aggregated Solar + Wind = Total Renewable Generation' }
            ].map((st, idx) => (
              <div key={idx} style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.85rem',
                minHeight: '110px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#8A6A4A' }}>{st.step}</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                    {st.title}
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.3 }}>
                  {st.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
