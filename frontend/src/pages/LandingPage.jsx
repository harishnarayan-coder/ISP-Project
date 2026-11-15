import React, { useState } from 'react';
import { ArrowRight, Sun, Wind, CloudSun, Activity, Cpu, ShieldCheck, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ setActivePage, forecastData }) {
  const { isAuthenticated, loginWithGoogle, loginAsLeadResearcher } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const solarVal = forecastData?.solar_prediction_mw ?? 4.82;
  const windVal = forecastData?.wind_prediction_mw ?? 3.17;
  const totalVal = forecastData?.total_prediction_mw ?? 7.99;

  const handleLaunch = async () => {
    if (isAuthenticated) {
      setActivePage('dashboard');
    } else {
      setIsSigningIn(true);
      try {
        await loginWithGoogle();
        setActivePage('dashboard');
      } catch (err) {
        console.error('Launch sign-in error:', err);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section className="hero-container" style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '3.5rem 3rem',
        boxShadow: 'var(--shadow-subtle)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative background watermark */}
        <div style={{
          position: 'absolute',
          right: '-50px',
          bottom: '-50px',
          opacity: 0.03,
          pointerEvents: 'none'
        }}>
          <Sun size={380} color="#25221F" />
        </div>

        <div style={{ maxWidth: '850px' }}>
          {/* Academic Project Label */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            padding: '0.3rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#8A6A4A',
            letterSpacing: '0.03em',
            marginBottom: '1.25rem'
          }}>
            <span>ISP RESEARCH</span>
            <span style={{ color: '#D4C9BC' }}>•</span>
            <span>Weather-Aware Adaptive Multi-Model Deep Learning System</span>
          </div>

          <h1 className="hero-title" style={{
            fontSize: '2.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.25rem'
          }}>
            Weather-Aware Renewable Energy Forecasting
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '2rem',
            maxWidth: '720px'
          }}>
            Adaptive deep learning for more reliable solar and wind power prediction.
            Unifying LSTM, GRU, and CNN-LSTM architectures with real-time meteorological intelligence.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <button
              className="btn-primary"
              onClick={handleLaunch}
              disabled={isSigningIn}
              style={{ padding: '0.8rem 1.6rem', fontSize: '0.9375rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              {!isAuthenticated && (
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              )}
              <span>
                {isSigningIn 
                  ? 'Signing in...' 
                  : (isAuthenticated ? 'Open Forecast Dashboard' : 'Sign in with Google to Launch')}
              </span>
              <ArrowRight size={16} />
            </button>
            <button
              className="btn-secondary"
              onClick={() => setActivePage('about')}
              style={{ padding: '0.8rem 1.6rem', fontSize: '0.9375rem' }}
            >
              <span>Explore Methodology</span>
            </button>
          </div>

          {!isAuthenticated && (
            <div style={{ marginTop: '0.85rem' }}>
              <button
                onClick={() => {
                  loginAsLeadResearcher();
                  setActivePage('dashboard');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '0.2rem 0'
                }}
              >
                Or enter research portal directly as Lead Researcher (T. Harish Narayan)
              </button>
            </div>
          )}
        </div>

        {/* Minimal Renewable Energy Flow Visualization:
            Sun → Weather → Wind → Solar/Wind Generation → Forecast */}
        <div style={{
          marginTop: '3.5rem',
          paddingTop: '2.5rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1.25rem'
          }}>
            System Flow Architecture
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            alignItems: 'center'
          }}>
            {[
              { label: 'Sun', sub: 'Direct Normal Irradiance', icon: Sun, color: '#C79A4B' },
              { label: 'Weather', sub: 'Atmospheric State & Clouds', icon: CloudSun, color: '#6F6962' },
              { label: 'Wind', sub: 'Shear & Turbine Kinetics', icon: Wind, color: '#526B73' },
              { label: 'Generation', sub: 'PV + Turbine Yield', icon: Activity, color: '#8A6A4A' },
              { label: 'Forecast', sub: 'Adaptive Multi-Model', icon: Cpu, color: '#5E7657' }
            ].map((node, i, arr) => {
              const Icon = node.icon;
              return (
                <React.Fragment key={node.label}>
                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem 1rem',
                    textAlign: 'center',
                    position: 'relative'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      padding: '0.4rem',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      marginBottom: '0.4rem',
                      color: node.color
                    }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {node.label}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {node.sub}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* Three Simple Metrics Below Hero */}
      <section>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* Solar Metric */}
          <div className="renew-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Solar Forecast
              </span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C79A4B' }}></div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {solarVal} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>MW</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Photovoltaic generation capacity conditioned on GHI and cloud dynamics.
            </div>
          </div>

          {/* Wind Metric */}
          <div className="renew-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Wind Forecast
              </span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#526B73' }}></div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {windVal} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>MW</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Turbine output evaluated across 100m hub wind speeds and atmospheric density.
            </div>
          </div>

          {/* Total Renewable Metric */}
          <div className="renew-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Renewable Forecast
              </span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#5E7657' }}></div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {totalVal} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)' }}>MW</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Adaptive consensus synthesis yielding optimal grid dispatch reliability.
            </div>
          </div>
        </div>
      </section>

      {/* Core Research Capabilities Overview */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        <div className="renew-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', color: '#8A6A4A' }}>
              <Cpu size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Multi-Model Deep Ensemble</h3>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
            Combines LSTM for long-range temporal retention, GRU for rapid sequential transitions,
            and CNN-LSTM to detect sharp localized weather ramp events.
          </p>
        </div>

        <div className="renew-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', color: '#5E7657' }}>
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Weather-Conditioned Adaptation</h3>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
            Instead of static averages, the fusion layer dynamically adjusts weights according to
            atmospheric stability, solar irradiance variability, and wind turbulence.
          </p>
        </div>

        <div className="renew-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', color: '#526B73' }}>
              <Activity size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Multi-Horizon Evaluation</h3>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
            Supports intraday and day-ahead horizons (1H, 6H, 12H, 24H) to facilitate unit commitment,
            ancillary service planning, and energy trading decisions.
          </p>
        </div>
      </section>
    </div>
  );
}
