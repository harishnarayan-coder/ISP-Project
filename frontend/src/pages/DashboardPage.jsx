import React, { useState, useEffect } from 'react';
import {
  Sun,
  Wind,
  Zap,
  ShieldCheck,
  Play,
  RotateCw,
  Calendar,
  Clock,
  Globe,
  Database,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import ForecastChart from '../components/ForecastChart';
import WeatherPanel from '../components/WeatherPanel';
import AdaptiveFusionVisualizer from '../components/AdaptiveFusionVisualizer';
import { apiService } from '../services/api';

export default function DashboardPage({
  forecastData,
  weatherData,
  onRunForecast,
  isLoading,
  currentHorizon,
  setHorizon,
  currentLocation,
  setLocation,
  strategy,
  setStrategy,
  dataSource,
  setDataSource,
  datasetName,
  setDatasetName
}) {
  const [availableDatasets, setAvailableDatasets] = useState([]);
  const [datasetsLoaded, setDatasetsLoaded] = useState(false);

  const locations = [
    'Solar-Wind Complex Alpha (34.05°N, 118.25°W)',
    'Texas Coastal Wind & Solar Hybrid (26.90°N, 97.45°W)',
    'Pavagada Solar & Wind Hub (14.10°N, 77.28°E)',
    'Kite North Sea Renewable Node (53.50°N, 6.20°E)'
  ];

  const horizons = ['1h', '6h', '12h', '24h'];

  const strategies = [
    { id: 'adaptive_fusion', label: 'Adaptive Fusion (Ensemble)' },
    { id: 'lstm', label: 'LSTM (Long-Term Temporal)' },
    { id: 'gru', label: 'GRU (Sequential Gating)' },
    { id: 'cnn_lstm', label: 'CNN-LSTM (Feature Extractor)' }
  ];

  // Load available datasets when user switches to Custom Dataset mode
  useEffect(() => {
    if (dataSource === 'custom_dataset' && !datasetsLoaded) {
      apiService.listDatasets().then((res) => {
        const all = [
          ...(res.sample_datasets || []),
          ...(res.uploaded_datasets || [])
        ];
        setAvailableDatasets([...new Set(all)]);
        setDatasetsLoaded(true);
        if (!datasetName && all.length > 0) {
          setDatasetName(all[0]);
        }
      });
    }
  }, [dataSource]);

  const handleHorizonChange = (h) => {
    setHorizon(h);
    onRunForecast(currentLocation, h, strategy, dataSource, datasetName);
  };

  const handleLocationChange = (e) => {
    const loc = e.target.value;
    setLocation(loc);
    onRunForecast(loc, currentHorizon, strategy, dataSource, datasetName);
  };

  const handleStrategyChange = (e) => {
    const s = e.target.value;
    setStrategy(s);
    onRunForecast(currentLocation, currentHorizon, s, dataSource, datasetName);
  };

  const handleDataSourceChange = (src) => {
    setDataSource(src);
    onRunForecast(currentLocation, currentHorizon, strategy, src, datasetName);
  };

  const handleDatasetNameChange = (e) => {
    const ds = e.target.value;
    setDatasetName(ds);
    onRunForecast(currentLocation, currentHorizon, strategy, dataSource, ds);
  };

  /* ---- Data Source Pill Styles ---- */
  const pillBase = {
    display: 'flex', alignItems: 'center', gap: '0.45rem',
    padding: '0.45rem 1rem', borderRadius: '999px',
    fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
    border: '1.5px solid', transition: 'all 0.18s ease', userSelect: 'none'
  };
  const pillActive = {
    ...pillBase,
    backgroundColor: '#8A6A4A', color: '#fff', borderColor: '#8A6A4A'
  };
  const pillInactive = {
    ...pillBase,
    backgroundColor: '#fff', color: '#6F6962', borderColor: '#D9D0C4'
  };

  const sourceLabel = forecastData?.data_source_mode || (
    dataSource === 'custom_dataset' ? `Custom Dataset (${datasetName})` : 'Live Open-Meteo Weather API'
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* ── Header Row ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: '1.5rem',
        borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Renewable Energy Forecast
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Weather-aware multi-model prediction for solar, wind and combined renewable generation.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
          {/* Location Selector (only relevant for Open-Meteo) */}
          {dataSource === 'open_meteo' && (
            <select
              className="select-input"
              value={currentLocation}
              onChange={handleLocationChange}
              style={{ maxWidth: '280px' }}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          )}

          {/* Model Strategy */}
          <select className="select-input" value={strategy} onChange={handleStrategyChange}>
            {strategies.map((st) => (
              <option key={st.id} value={st.id}>{st.label}</option>
            ))}
          </select>

          {/* Horizon Segmented Control */}
          <div className="segmented-control">
            {horizons.map((h) => (
              <button
                key={h}
                className={`segmented-btn ${currentHorizon === h ? 'active' : ''}`}
                onClick={() => handleHorizonChange(h)}
              >
                {h.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Run Forecast */}
          <button
            className="btn-primary"
            onClick={() => onRunForecast(currentLocation, currentHorizon, strategy, dataSource, datasetName)}
            disabled={isLoading}
            style={{ minWidth: '135px', justifyContent: 'center' }}
          >
            {isLoading ? (
              <><RotateCw size={14} className="spin" /><span>Running...</span></>
            ) : (
              <><Play size={14} fill="#FFFFFF" /><span>Run Forecast</span></>
            )}
          </button>
        </div>
      </div>

      {/* ── Data Source Switcher Panel ── */}
      <div style={{
        backgroundColor: '#FFFFFF', border: '1px solid var(--border-color)',
        borderRadius: '14px', padding: '1.25rem 1.5rem',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        gap: '1.25rem', justifyContent: 'space-between'
      }}>
        {/* Left: label + pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
            Data Source
          </span>

          {/* Open-Meteo pill */}
          <div
            style={dataSource === 'open_meteo' ? pillActive : pillInactive}
            onClick={() => handleDataSourceChange('open_meteo')}
            title="Use real-time weather from Open-Meteo API"
          >
            <Globe size={13} />
            <span>Open-Meteo API</span>
            {dataSource === 'open_meteo' && <CheckCircle2 size={13} />}
          </div>

          {/* Custom Dataset pill */}
          <div
            style={dataSource === 'custom_dataset' ? pillActive : pillInactive}
            onClick={() => handleDataSourceChange('custom_dataset')}
            title="Use your uploaded or sample CSV dataset"
          >
            <Database size={13} />
            <span>Custom Dataset</span>
            {dataSource === 'custom_dataset' && <CheckCircle2 size={13} />}
          </div>

          {/* Dataset file selector — only shown when custom is active */}
          {dataSource === 'custom_dataset' && (
            <select
              className="select-input"
              value={datasetName}
              onChange={handleDatasetNameChange}
              style={{ maxWidth: '260px', marginLeft: '0.25rem' }}
            >
              {availableDatasets.length > 0 ? (
                availableDatasets.map(ds => (
                  <option key={ds} value={ds}>{ds}</option>
                ))
              ) : (
                <option value="weatherHistory.csv">weatherHistory.csv</option>
              )}
            </select>
          )}
        </div>

        {/* Right: active source badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.45rem',
          padding: '0.35rem 0.85rem', borderRadius: '999px',
          backgroundColor: dataSource === 'open_meteo' ? '#EAF2EA' : '#F3EDE5',
          fontSize: '0.76rem', fontWeight: 600,
          color: dataSource === 'open_meteo' ? '#3D6B37' : '#7A5832'
        }}>
          {dataSource === 'open_meteo' ? <Globe size={12} /> : <Database size={12} />}
          <span>{sourceLabel}</span>
        </div>
      </div>

      {/* ── Metadata Strip ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        justifyContent: 'space-between', fontSize: '0.78rem',
        color: 'var(--text-secondary)', marginTop: '-1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} color="#8A6A4A" />
            <span>Horizon: <strong>{currentHorizon.toUpperCase()} Intraday</strong></span>
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} color="#8A6A4A" />
            <span>Generated: {forecastData?.run_timestamp || 'Active Run'}</span>
          </span>
        </div>
        <div>
          {dataSource === 'custom_dataset' ? (
            <span className="badge" style={{
              backgroundColor: '#F3EDE5', color: '#7A5832',
              border: '1px solid #D9C5A8', padding: '0.25rem 0.7rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600
            }}>
              Custom Dataset Mode
            </span>
          ) : (
            <span className="badge badge-live" style={{
              backgroundColor: '#EAF2EA', color: '#3D6B37',
              border: '1px solid #B3D4AE', padding: '0.25rem 0.7rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600
            }}>
              Live API Mode
            </span>
          )}
        </div>
      </div>

      {/* ── 4 KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <KpiCard
          title="Solar Forecast"
          value={forecastData?.solar_prediction_mw ?? 4.82}
          unit="MW"
          delta={forecastData?.solar_delta_pct ?? 6.4}
          deltaType={forecastData?.solar_delta_pct >= 0 ? 'up' : 'down'}
          icon={Sun}
          accentColor="#C79A4B"
          subtitle="Photovoltaic capacity"
        />
        <KpiCard
          title="Wind Forecast"
          value={forecastData?.wind_prediction_mw ?? 3.17}
          unit="MW"
          delta={forecastData?.wind_delta_pct ?? -2.1}
          deltaType={forecastData?.wind_delta_pct >= 0 ? 'up' : 'down'}
          icon={Wind}
          accentColor="#526B73"
          subtitle="Hub-height kinetic output"
        />
        <KpiCard
          title="Total Renewable"
          value={forecastData?.total_prediction_mw ?? 7.99}
          unit="MW"
          delta={forecastData?.total_delta_pct ?? 3.8}
          deltaType={forecastData?.total_delta_pct >= 0 ? 'up' : 'down'}
          icon={Zap}
          accentColor="#5E7657"
          subtitle="Solar + Wind aggregated"
        />
        <KpiCard
          title="Model Confidence"
          value={forecastData?.model_confidence_pct ?? 94.2}
          unit="%"
          deltaType="neutral"
          icon={ShieldCheck}
          accentColor="#8A6A4A"
          subtitle="Ensemble consensus variance"
        />
      </div>

      {/* ── Primary Forecast Chart ── */}
      <ForecastChart series={forecastData?.series || []} horizon={currentHorizon} />

      {/* ── Adaptive Fusion Visualizer ── */}
      <AdaptiveFusionVisualizer
        weights={forecastData?.fusion_weights}
        regime={forecastData?.weather_regime}
        weatherInfluenceNote={forecastData?.weather_influence_note}
        solarPred={forecastData?.solar_prediction_mw ?? 4.82}
        windPred={forecastData?.wind_prediction_mw ?? 3.17}
        totalPred={forecastData?.total_prediction_mw ?? 7.99}
      />

      {/* ── Weather Panel (only meaningful in Open-Meteo mode) ── */}
      <WeatherPanel weatherData={weatherData} />
    </div>
  );
}
