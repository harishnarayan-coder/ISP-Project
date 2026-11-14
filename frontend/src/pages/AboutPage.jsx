import React from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  GraduationCap
} from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    { name: 'T. Harish Narayan', reg: '99230041261', role: 'Deep Learning Models & Backend Pipeline' },
    { name: 'O. Sai Chakradhar Reddy', reg: '99230041258', role: 'System Architecture & Adaptive Fusion' },
    { name: 'T. Praneeth', reg: '99230040435', role: 'Weather Intelligence & Frontend Interface' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--bg-secondary)', padding: '0.25rem 0.65rem', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 600, color: '#8A6A4A', marginBottom: '0.5rem' }}>
          <span>INDUSTRY SPECIALIZATION PROJECT (ISP)</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Methodology & Project Documentation
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '900px', lineHeight: 1.6 }}>
          Weather-Aware Adaptive Multi-Model Deep Learning System for Solar and Wind Energy Forecasting.
        </p>
      </div>

      {/* Project Team Card */}
      <div className="renew-card" style={{ padding: '1.75rem', borderLeft: '4px solid #8A6A4A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <GraduationCap size={22} color="#8A6A4A" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Academic Project Team & Faculty Guide</h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          {teamMembers.map((member, idx) => (
            <div key={idx} style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {member.name}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#8A6A4A', fontWeight: 600, marginTop: '0.2rem' }}>
                Reg-No: {member.reg}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                Focus: {member.role}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Award size={18} color="#5E7657" />
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Project Faculty Guide:</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Dr. P. Pandiselvam
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement & Existing Approaches */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        <div className="renew-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            1. Problem Statement
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Solar and wind energy generation are inherently intermittent and weather-dependent.
            Photovoltaic output is severely vulnerable to cloud cover transients and aerosol attenuation,
            while wind power is governed by non-linear aerodynamic power curves and Weibull atmospheric gusts.
            Standard single-model estimators fail to generalize under abrupt weather changes, leading to grid instability,
            costly spinning reserve allocation, and curtailment losses.
          </p>
        </div>

        <div className="renew-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            2. Limitations of Existing Approaches
          </h3>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Traditional numerical weather prediction (NWP) models suffer from high computational latency (6-12 hours)
            and coarse spatial resolution. Conventional statistical methods (ARIMA, SARIMAX) assume linear stationarity
            and collapse during sharp generation ramp events. Standalone machine learning models lack adaptability:
            a static model tuned for laminar winds performs poorly under turbulent squalls or multi-layered overcast skies.
          </p>
        </div>
      </div>

      {/* Proposed Multi-Model Deep Learning Architecture */}
      <div className="renew-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
          3. Proposed System Architecture & Deep Learning Models
        </h3>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          The RENEWCAST framework establishes an end-to-end multi-stream deep neural network pipeline.
          Instead of relying on a single architecture, three complementary deep learning networks operate in parallel:
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* LSTM */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8A6A4A' }}></span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>LSTM Model</h4>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Captures long-term temporal dependencies:</strong> Utilizes cell states and triple-gating
              (forget, input, and output gates) to retain multi-day diurnal periodicity and cyclical seasonal trends
              without vanishing gradients.
            </p>
          </div>

          {/* GRU */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#526B73' }}></span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>GRU Model</h4>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Provides efficient sequential learning:</strong> Employs a streamlined dual-gate structure
              (reset and update gates), reducing parameter overhead by 25% while maintaining rapid adaptation
              under steady meteorological regimes.
            </p>
          </div>

          {/* CNN-LSTM */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5E7657' }}></span>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>CNN-LSTM Hybrid</h4>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <strong>Spatial-temporal feature extraction:</strong> 1D Convolutional kernels act as localized filter banks
              to detect abrupt cloud transitions and wind gust ramp rates, feeding condensed feature maps into recurrent layers.
            </p>
          </div>
        </div>
      </div>

      {/* Adaptive Fusion & Weather-Aware Prediction */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        <div className="renew-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            4. Adaptive Model Fusion Mechanics
          </h3>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.55, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Individual model predictions are combined dynamically rather than via static arithmetic averaging.
            The fusion weight vector <strong>α = [α_LSTM, α_GRU, α_CNN]</strong> is computed via a convex combination
            conditioned on real-time atmospheric volatility and recent historical error covariance:
          </p>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '0.8125rem',
            color: 'var(--text-primary)'
          }}>
            ŷ_fused = Σ (α_i · ŷ_i) &nbsp;subject to&nbsp; Σ α_i = 1, α_i ≥ 0
          </div>
        </div>

        <div className="renew-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            5. Datasets & Technology Stack
          </h3>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.55, color: 'var(--text-secondary)' }}>
            <strong>Solar Benchmark:</strong> NREL PVDAQ (Photovoltaic Data Acquisition) hourly irradiance and generation.<br />
            <strong>Wind Benchmark:</strong> NREL WIND Toolkit (Wind Integration National Dataset) 100m anemometry.<br />
            <strong>Weather Integration:</strong> Real-time atmospheric observations via Open-Meteo REST service.<br />
            <strong>Core Stack:</strong> FastAPI (Python 3.10), Scikit-learn, React 19, Recharts, Pydantic V2.
          </p>
        </div>
      </div>
    </div>
  );
}
