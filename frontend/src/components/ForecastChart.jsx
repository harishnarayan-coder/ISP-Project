import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';

export default function ForecastChart({ series = [], horizon = '6h' }) {
  const [viewMode, setViewMode] = useState('combined'); // 'solar', 'wind', 'combined'

  // Custom clean tooltip matching the design system
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const isForecast = dataPoint.is_forecast;

      return (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          boxShadow: 'var(--shadow-dropdown)',
          fontSize: '0.8125rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
            <span className={`badge ${isForecast ? 'badge-demo' : 'badge-neutral'}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
              {isForecast ? `Forecast (+${horizon})` : 'Historical Actual'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {(viewMode === 'solar' || viewMode === 'combined') && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem' }}>
                <span style={{ color: '#C79A4B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C79A4B' }}></span>
                  Solar Power:
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {isForecast ? dataPoint.solar_pred : dataPoint.solar_actual} MW
                </span>
              </div>
            )}

            {(viewMode === 'wind' || viewMode === 'combined') && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem' }}>
                <span style={{ color: '#526B73', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#526B73' }}></span>
                  Wind Power:
                </span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {isForecast ? dataPoint.wind_pred : dataPoint.wind_actual} MW
                </span>
              </div>
            )}

            {viewMode === 'combined' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '0.3rem', marginTop: '0.2rem' }}>
                <span style={{ color: '#5E7657', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5E7657' }}></span>
                  Total Renewable:
                </span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {isForecast ? dataPoint.total_pred : dataPoint.total_actual} MW
                </span>
              </div>
            )}

            {isForecast && (
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Confidence Interval: [{dataPoint.confidence_lower} – {dataPoint.confidence_upper} MW]
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Find index of transition between actual and forecast for the reference line
  const forecastStartIndex = series.findIndex(pt => pt.is_forecast);
  const transitionTime = forecastStartIndex > 0 ? series[forecastStartIndex].timestamp : null;

  return (
    <div className="renew-card" style={{ padding: '1.5rem' }}>
      {/* Header & Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            Renewable Power Forecast
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Continuous generation timeline: Solid lines denote historical observations, dashed lines indicate multi-model predictions.
          </p>
        </div>

        {/* View Switcher: Solar | Wind | Combined */}
        <div className="segmented-control">
          <button
            className={`segmented-btn ${viewMode === 'combined' ? 'active' : ''}`}
            onClick={() => setViewMode('combined')}
          >
            Combined Total
          </button>
          <button
            className={`segmented-btn ${viewMode === 'solar' ? 'active' : ''}`}
            onClick={() => setViewMode('solar')}
          >
            Solar Only
          </button>
          <button
            className={`segmented-btn ${viewMode === 'wind' ? 'active' : ''}`}
            onClick={() => setViewMode('wind')}
          >
            Wind Only
          </button>
        </div>
      </div>

      {/* Recharts Chart Canvas */}
      <div style={{ width: '100%', height: '380px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={series} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6DED4" vertical={false} />
            <XAxis
              dataKey="timestamp"
              stroke="#6F6962"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E6DED4' }}
            />
            <YAxis
              stroke="#6F6962"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E6DED4' }}
              tickFormatter={(v) => `${v} MW`}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Transition separator line between Historical and Forecast */}
            {transitionTime && (
              <ReferenceLine
                x={transitionTime}
                stroke="#8A6A4A"
                strokeDasharray="4 4"
                label={{ value: 'Forecast Horizon Start', position: 'top', fill: '#8A6A4A', fontSize: 10 }}
              />
            )}

            {/* Subtle confidence band for forecast total */}
            {viewMode === 'combined' && (
              <Area
                type="monotone"
                dataKey="confidence_upper"
                stroke="none"
                fill="#5E7657"
                fillOpacity={0.07}
                name="Confidence Band"
              />
            )}

            {/* --- SOLAR LINES --- */}
            {(viewMode === 'solar' || viewMode === 'combined') && (
              <>
                <Line
                  type="monotone"
                  dataKey="solar_actual"
                  stroke="#C79A4B"
                  strokeWidth={2.2}
                  dot={false}
                  name="Solar Actual"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="solar_pred"
                  stroke="#C79A4B"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2.5, fill: '#C79A4B' }}
                  name="Solar Forecast"
                />
              </>
            )}

            {/* --- WIND LINES --- */}
            {(viewMode === 'wind' || viewMode === 'combined') && (
              <>
                <Line
                  type="monotone"
                  dataKey="wind_actual"
                  stroke="#526B73"
                  strokeWidth={2.2}
                  dot={false}
                  name="Wind Actual"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="wind_pred"
                  stroke="#526B73"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2.5, fill: '#526B73' }}
                  name="Wind Forecast"
                />
              </>
            )}

            {/* --- TOTAL COMBINED LINES --- */}
            {viewMode === 'combined' && (
              <>
                <Line
                  type="monotone"
                  dataKey="total_actual"
                  stroke="#25221F"
                  strokeWidth={2.5}
                  dot={false}
                  name="Total Actual"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="total_pred"
                  stroke="#5E7657"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: '#5E7657' }}
                  name="Total Forecast"
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Notation */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.75rem',
        marginTop: '1.25rem',
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.78rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ display: 'inline-block', width: '22px', height: '2px', backgroundColor: '#25221F' }}></span>
          <span>Actual (Historical ━━━━━)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ display: 'inline-block', width: '22px', height: '0', borderTop: '2px dashed #5E7657' }}></span>
          <span>Forecast (Multi-Model - - - - -)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: 'rgba(94, 118, 87, 0.15)', borderRadius: '2px' }}></span>
          <span>Confidence Interval Band</span>
        </div>
      </div>
    </div>
  );
}
