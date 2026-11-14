import React, { useState, useEffect } from 'react';
import { Search, Filter, RotateCw, History, CheckCircle2, ChevronDown, Download } from 'lucide-react';
import { apiService } from '../services/api';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [horizonFilter, setHorizonFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchHistory = () => {
    setLoading(true);
    apiService.getHistory(search, horizonFilter)
      .then((records) => {
        setHistory(records);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, [search, horizonFilter]);

  const exportCSV = () => {
    if (!history.length) return;
    const headers = ['ID', 'Date', 'Location', 'Horizon', 'Solar_MW', 'Wind_MW', 'Total_MW', 'Strategy', 'Status'];
    const rows = history.map(r => [r.id, r.date, `"${r.location}"`, r.horizon, r.solar_mw, r.wind_mw, r.total_mw, `"${r.strategy}"`, r.status]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `renewcast_prediction_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Prediction Audit History
            </h1>
            <span className="badge badge-neutral">Audit Trail</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Chronological log of multi-model forecast executions with constituent generation splits and meteorological metadata.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={exportCSV} disabled={!history.length}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button className="btn-secondary" onClick={fetchHistory} disabled={loading}>
            <RotateCw size={14} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Search Input */}
        <div style={{
          position: 'relative',
          minWidth: '280px',
          flex: '1 1 300px'
        }}>
          <Search size={15} color="#8A6A4A" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="text-input"
            placeholder="Search by facility location or strategy..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.25rem' }}
          />
        </div>

        {/* Horizon Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Filter Horizon:</span>
          <div className="segmented-control">
            <button
              className={`segmented-btn ${horizonFilter === '' ? 'active' : ''}`}
              onClick={() => setHorizonFilter('')}
            >
              All
            </button>
            {['1h', '6h', '12h', '24h'].map((h) => (
              <button
                key={h}
                className={`segmented-btn ${horizonFilter === h ? 'active' : ''}`}
                onClick={() => setHorizonFilter(h)}
              >
                {h.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Table Card */}
      <div className="renew-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive" style={{ border: 'none', borderRadius: 0 }}>
          <table className="renew-table">
            <thead>
              <tr>
                <th>Execution Date</th>
                <th>Location / Complex</th>
                <th>Horizon</th>
                <th>Solar Forecast</th>
                <th>Wind Forecast</th>
                <th>Total Renewable</th>
                <th>Model Strategy</th>
                <th>Inference Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((record) => (
                  <tr key={record.id}>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {record.date}
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {record.location}
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
                        {record.horizon.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ color: '#C79A4B', fontWeight: 600 }}>
                      {record.solar_mw} MW
                    </td>
                    <td style={{ color: '#526B73', fontWeight: 600 }}>
                      {record.wind_mw} MW
                    </td>
                    <td style={{ fontWeight: 700, color: '#5E7657' }}>
                      {record.total_mw} MW
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem' }}>{record.strategy}</span>
                    </td>
                    <td>
                      <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                        <CheckCircle2 size={12} />
                        <span>{record.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No prediction history found matching current filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
