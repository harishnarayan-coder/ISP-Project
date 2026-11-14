import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function KpiCard({ title, value, unit, delta, deltaType = 'up', icon: Icon, subtitle, accentColor = '#8A6A4A' }) {
  const isPositive = deltaType === 'up';
  const isNeutral = deltaType === 'neutral';

  return (
    <div className="renew-card" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '135px',
      position: 'relative'
    }}>
      {/* Top Header: Title & Minimal Icon */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '0.8125rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {title}
        </span>
        {Icon && (
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor
          }}>
            <Icon size={15} />
          </div>
        )}
      </div>

      {/* Primary Value Display */}
      <div style={{ margin: '0.75rem 0 0.25rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
          <span style={{
            fontSize: '1.85rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1
          }}>
            {value}
          </span>
          {unit && (
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-secondary)'
            }}>
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Trend Delta & Context */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
        {delta !== undefined && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.2rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: isNeutral ? 'var(--text-muted)' : (isPositive ? 'var(--renewable-green)' : '#9E5343')
          }}>
            {isPositive ? <ArrowUpRight size={13} /> : (isNeutral ? <Minus size={13} /> : <ArrowDownRight size={13} />)}
            <span>{isPositive ? `↑ ${Math.abs(delta)}%` : (isNeutral ? `${delta}%` : `↓ ${Math.abs(delta)}%`)}</span>
          </div>
        )}
        {subtitle && (
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
