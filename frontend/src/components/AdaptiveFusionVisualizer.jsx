import React from 'react';
import { ArrowDown, Cpu, Sparkles, Sliders } from 'lucide-react';

export default function AdaptiveFusionVisualizer({
  weights = { lstm: 0.30, gru: 0.30, cnn_lstm: 0.40 },
  regime = 'default_balanced',
  weatherInfluenceNote,
  solarPred = 4.82,
  windPred = 3.17,
  totalPred = 7.99
}) {
  const models = [
    {
      id: 'lstm',
      name: 'LSTM',
      type: 'Recurrent Memory',
      weight: weights.lstm || 0.30,
      color: '#8A6A4A',
      desc: 'Long-term temporal dependency & diurnal periodicity'
    },
    {
      id: 'gru',
      name: 'GRU',
      type: 'Gated Recurrent',
      weight: weights.gru || 0.30,
      color: '#526B73',
      desc: 'Efficient sequential gating under steady conditions'
    },
    {
      id: 'cnn_lstm',
      name: 'CNN-LSTM',
      type: 'Spatial-Temporal Hybrid',
      weight: weights.cnn_lstm || 0.40,
      color: '#5E7657',
      desc: '1D convolution extracting localized ramp events & gusts'
    }
  ];

  return (
    <div className="renew-card" style={{ padding: '1.5rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Adaptive Model Fusion Architecture
          </h3>
          <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
            Regime: {regime.replace(/_/g, ' ')}
          </span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          The fusion layer dynamically combines model predictions based on their performance under current conditions.
        </p>
      </div>

      {/* Architecture Flow Diagram */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 0'
      }}>
        {/* Tier 1: 3 Deep Learning Model Blocks */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          width: '100%'
        }}>
          {models.map((m) => (
            <div key={m.id} style={{
              backgroundColor: '#FFFFFF',
              border: `1.5px solid ${m.weight > 0.35 ? m.color : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-sm)',
              padding: '1rem',
              boxShadow: 'var(--shadow-subtle)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  {m.name}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '12px',
                  color: m.color
                }}>
                  α = {Number(m.weight).toFixed(2)}
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
                {m.type}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                {m.desc}
              </p>

              {/* Progress bar of current weight */}
              <div style={{
                height: '4px',
                width: '100%',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '2px',
                marginTop: '0.75rem',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round(m.weight * 100)}%`,
                  backgroundColor: m.color,
                  transition: 'width 200ms ease'
                }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Downward Transition to Adaptive Weighting Layer */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8A6A4A' }}>
          <ArrowDown size={18} />
          <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Condition-Adaptive Weighting Layer
          </span>
        </div>

        {/* Tier 2: Adaptive Fusion Center */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.75rem',
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Sliders size={16} color="#8A6A4A" />
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                Dynamic Ensemble Convex Combination
              </span>
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Formula: <code>ŷ_final = α_LSTM·ŷ_LSTM + α_GRU·ŷ_GRU + α_CNN·ŷ_CNN</code>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Solar Output</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#C79A4B' }}>{solarPred} MW</div>
            </div>
            <span style={{ color: 'var(--border-dark)', fontSize: '1.2rem' }}>+</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Wind Output</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#526B73' }}>{windPred} MW</div>
            </div>
            <span style={{ color: 'var(--border-dark)', fontSize: '1.2rem' }}>=</span>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-color)',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#5E7657', fontWeight: 600 }}>Total Fused</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#25221F' }}>{totalPred} MW</div>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Adaptation Rationale */}
      {weatherInfluenceNote && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.5rem'
        }}>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Meteorological Influence:</span>
          <span>{weatherInfluenceNote}</span>
        </div>
      )}
    </div>
  );
}
