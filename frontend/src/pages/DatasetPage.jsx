import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Sliders,
  Check,
  Database
} from 'lucide-react';
import { apiService } from '../services/api';

export default function DatasetPage() {
  const [selectedDataset, setSelectedDataset] = useState('combined_renewable_sample.csv');
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [preprocessingInfo, setPreprocessingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preprocessing, setPreprocessing] = useState(false);
  const [message, setMessage] = useState(null);

  const sampleFiles = [
    { id: 'combined_renewable_sample.csv', label: 'Combined Renewable (Solar + Wind + Weather)' },
    { id: 'nrel_solar_pvdaq_sample.csv', label: 'NREL Solar PVDAQ Hourly Sample' },
    { id: 'nrel_wind_toolkit_sample.csv', label: 'NREL WIND Toolkit High-Res Sample' }
  ];

  const loadDataset = (name) => {
    setLoading(true);
    apiService.getDatasetInfo(name)
      .then((info) => {
        setDatasetInfo(info);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadDataset(selectedDataset);
  }, [selectedDataset]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);

    apiService.uploadDataset(file)
      .then((info) => {
        setDatasetInfo(info);
        setSelectedDataset(file.name);
        setUploading(false);
        setMessage({ type: 'success', text: `Uploaded and parsed ${file.name} successfully.` });
      })
      .catch((err) => {
        setUploading(false);
        setMessage({ type: 'error', text: `Upload failed: ${err.message}` });
      });
  };

  const handleRunPreprocessing = () => {
    setPreprocessing(true);
    apiService.preprocessDataset(selectedDataset)
      .then((res) => {
        setPreprocessingInfo(res);
        setPreprocessing(false);
      })
      .catch((err) => {
        console.error(err);
        setPreprocessing(false);
      });
  };

  const previewRows = datasetInfo?.preview || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Dataset Management & Preprocessing
          </h1>
          <span className="badge badge-neutral">NREL Solar PVDAQ / WIND Toolkit Compatible</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Ingest raw meteorological and power generation CSV records, validate schema schemas, and execute time-series windowing.
        </p>
      </div>

      {/* Dataset Selection & Upload Drag-Drop Area */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Sample Datasets Selector */}
        <div className="renew-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <Database size={16} color="#8A6A4A" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Standard Benchmark Datasets</h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Select a verified benchmark dataset conforming to NREL research schemas:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sampleFiles.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedDataset(f.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${selectedDataset === f.id ? '#8A6A4A' : 'var(--border-color)'}`,
                  backgroundColor: selectedDataset === f.id ? 'var(--bg-secondary)' : '#FFFFFF',
                  color: 'var(--text-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: selectedDataset === f.id ? 600 : 400,
                  textAlign: 'left'
                }}
              >
                <span>{f.label}</span>
                {selectedDataset === f.id && <Check size={14} color="#8A6A4A" />}
              </button>
            ))}
          </div>
        </div>

        {/* Upload Custom CSV Card */}
        <div className="renew-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <UploadCloud size={16} color="#5E7657" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Upload Research CSV</h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Upload local time-series records. System automatically identifies available columns and handles missing variables.
            </p>

            <label style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed var(--border-dark)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.75rem 1rem',
              backgroundColor: 'var(--bg-card-subtle)',
              cursor: 'pointer'
            }}>
              <UploadCloud size={24} color="#6F6962" style={{ marginBottom: '0.5rem' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                {uploading ? 'Parsing CSV...' : 'Click to select or drag CSV file here'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Supports .csv files up to 50MB
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </label>
          </div>

          {message && (
            <div style={{
              marginTop: '1rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              backgroundColor: message.type === 'success' ? '#EDF3EC' : '#FBEBE8',
              color: message.type === 'success' ? '#40543B' : '#9E5343',
              border: `1px solid ${message.type === 'success' ? '#CAD9C7' : '#EFC7C2'}`
            }}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      {/* Dataset Metadata Summary Cards */}
      {datasetInfo && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          <div className="renew-card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>File Name</span>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem', wordBreak: 'break-all' }}>
              {datasetInfo.filename}
            </div>
          </div>

          <div className="renew-card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Records</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {datasetInfo.rows.toLocaleString()}
            </div>
          </div>

          <div className="renew-card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Columns</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              {datasetInfo.columns}
            </div>
          </div>

          <div className="renew-card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Missing Values</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: datasetInfo.missing_values > 0 ? '#9E5343' : '#5E7657', marginTop: '0.2rem' }}>
              {datasetInfo.missing_values}
            </div>
          </div>

          <div className="renew-card" style={{ padding: '1rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date Range</span>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {datasetInfo.date_range_start?.substring(0, 10)} to {datasetInfo.date_range_end?.substring(0, 10)}
            </div>
          </div>
        </div>
      )}

      {/* Feature Detection & Schema Verification */}
      {datasetInfo && (
        <div className="renew-card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Detected Features & Schema Validation
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              System checks for mandatory meteorological features (irradiance, wind speed) and target power generation columns.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1rem' }}>
            {datasetInfo.detected_features.map((feat) => (
              <span key={feat} className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                <Check size={11} />
                <span>{feat}</span>
              </span>
            ))}
          </div>

          {datasetInfo.missing_expected_features.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#FDF7EB',
              border: '1px solid #F5DEB3',
              borderRadius: '6px',
              padding: '0.65rem 0.85rem',
              fontSize: '0.78rem',
              color: '#8A6A4A'
            }}>
              <AlertTriangle size={14} color="#8A6A4A" />
              <span>Missing optional features imputed automatically during preprocessing: {datasetInfo.missing_expected_features.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      {/* Data Preview Table */}
      {previewRows.length > 0 && (
        <div className="renew-card" style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Data Preview (First 10 Records)
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Inspecting raw physical values prior to normalization.
            </p>
          </div>

          <div className="table-responsive">
            <table className="renew-table">
              <thead>
                <tr>
                  {Object.keys(previewRows[0]).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx} style={{ fontSize: '0.8125rem' }}>
                        {typeof val === 'number' ? Number(val).toFixed(2) : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Preprocessing Section */}
      <div className="renew-card" style={{ padding: '1.75rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Data Preprocessing & Windowing Pipeline
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Executes missing value imputation, MinMaxScaler [0, 1] normalization, cyclical time encoding, and sliding window sequence creation (T=24).
            </p>
          </div>

          <button
            className="btn-primary"
            onClick={handleRunPreprocessing}
            disabled={preprocessing}
          >
            {preprocessing ? (
              <>
                <RotateCw size={14} className="spin" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Sliders size={14} />
                <span>Execute Preprocessing</span>
              </>
            )}
          </button>
        </div>

        {/* Preprocessing Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Raw Records</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {preprocessingInfo?.raw_records ?? (datasetInfo?.rows ?? 336)}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Missing Handled</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#5E7657', marginTop: '0.25rem' }}>
              {preprocessingInfo?.missing_handled ?? (datasetInfo?.missing_values ?? 0)}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>After Cleaning</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {preprocessingInfo?.cleaned_records ?? (datasetInfo?.rows ?? 336)}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sequence Length (T)</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#8A6A4A', marginTop: '0.25rem' }}>
              {preprocessingInfo?.sequence_length ?? 24}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Train/Val/Test Split</span>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.35rem' }}>
              {preprocessingInfo ? `${preprocessingInfo.train_count} / ${preprocessingInfo.val_count} / ${preprocessingInfo.test_count}` : '70% / 15% / 15%'}
            </div>
          </div>
        </div>

        {preprocessingInfo && (
          <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--renewable-green-light)',
            border: '1px solid #CAD9C7',
            borderRadius: '6px',
            fontSize: '0.8125rem',
            color: '#40543B',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <CheckCircle2 size={16} color="#5E7657" />
            <span>{preprocessingInfo.status}</span>
          </div>
        )}
      </div>
    </div>
  );
}
