import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ModelComparisonPage from './pages/ModelComparisonPage';
import WeatherPage from './pages/WeatherPage';
import DatasetPage from './pages/DatasetPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import { apiService } from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Lock } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const [activePage, setActivePage] = useState('overview');
  const [currentLocation, setLocation] = useState('Solar-Wind Complex Alpha (34.05°N, 118.25°W)');
  const [currentHorizon, setHorizon] = useState('6h');
  const [strategy, setStrategy] = useState('adaptive_fusion');
  const [dataSource, setDataSource] = useState('open_meteo');
  const [datasetName, setDatasetName] = useState('weatherHistory.csv');
  
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initial data loading
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      apiService.getWeather(currentLocation),
      apiService.getForecast({
        location: currentLocation,
        horizon: currentHorizon,
        strategy: strategy,
        data_source: dataSource,
        dataset_name: datasetName
      })
    ]).then(([weather, forecast]) => {
      if (isMounted) {
        setWeatherData(weather);
        setForecastData(forecast);
        setIsLoading(false);
      }
    }).catch((err) => {
      console.error('Initialization error:', err);
      if (isMounted) setIsLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const handleRunForecast = (loc, horiz, strat, src, dsName) => {
    setIsLoading(true);
    const resolvedSrc = src !== undefined ? src : dataSource;
    const resolvedDs = dsName !== undefined ? dsName : datasetName;
    apiService.getForecast({
      location: loc || currentLocation,
      horizon: horiz || currentHorizon,
      strategy: strat || strategy,
      data_source: resolvedSrc,
      dataset_name: resolvedDs
    }).then((forecast) => {
      setForecastData(forecast);
      setIsLoading(false);
    }).catch((err) => {
      console.error('Forecast run error:', err);
      setIsLoading(false);
    });
  };

  // If user is not authenticated and tries to view a protected page, render auth barrier
  const isProtectedPage = ['dashboard', 'models', 'weather', 'datasets', 'history'].includes(activePage);

  return (
    <div className="app-container">
      {/* Top Fixed Sticky Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        weatherData={weatherData}
      />

      {/* Main Content Viewport */}
      <main className="main-content">
        {/* Public Landing Showcase */}
        {activePage === 'overview' && (
          <LandingPage
            setActivePage={setActivePage}
            forecastData={forecastData}
          />
        )}

        {/* Public Project Methodology */}
        {activePage === 'about' && (
          <AboutPage />
        )}

        {/* Auth Gate for Protected Pages */}
        {isProtectedPage && !isAuthenticated && (
          <div className="renew-card" style={{
            maxWidth: '520px',
            margin: '4rem auto',
            padding: '3rem 2.5rem',
            textAlign: 'center',
            borderTop: '4px solid #8A6A4A'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-secondary)',
              color: '#8A6A4A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Lock size={26} />
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.65rem' }}>
              Researcher Access Required
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
              Multi-model forecasting pipelines, real-time weather telemetry, and model comparison benchmarking are restricted to verified academic researchers.
            </p>

            <button
              onClick={() => loginWithGoogle()}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.8rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

            <button
              onClick={() => setActivePage('overview')}
              style={{
                marginTop: '1.25rem',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                textDecoration: 'underline'
              }}
            >
              Return to Project Overview
            </button>
          </div>
        )}

        {/* Protected Pages (Only when authenticated) */}
        {isAuthenticated && activePage === 'dashboard' && (
          <DashboardPage
            forecastData={forecastData}
            weatherData={weatherData}
            onRunForecast={handleRunForecast}
            isLoading={isLoading}
            currentHorizon={currentHorizon}
            setHorizon={setHorizon}
            currentLocation={currentLocation}
            setLocation={setLocation}
            strategy={strategy}
            setStrategy={setStrategy}
            dataSource={dataSource}
            setDataSource={setDataSource}
            datasetName={datasetName}
            setDatasetName={setDatasetName}
          />
        )}

        {isAuthenticated && activePage === 'models' && (
          <ModelComparisonPage />
        )}

        {isAuthenticated && activePage === 'weather' && (
          <WeatherPage
            weatherData={weatherData}
            currentLocation={currentLocation}
          />
        )}

        {isAuthenticated && activePage === 'datasets' && (
          <DatasetPage />
        )}

        {isAuthenticated && activePage === 'history' && (
          <HistoryPage />
        )}
      </main>

      {/* Professional Footer */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-color)',
        padding: '2.5rem 2rem 2rem 2rem',
        marginTop: 'auto'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)'
        }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
              RENEWCAST
            </div>
            <div>
              Weather-Aware Adaptive Multi-Model Deep Learning System for Solar and Wind Energy Forecasting
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Industry Specialization Project (ISP) • Deep Learning & Renewable Energy Systems
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              Project Team: T. Harish Narayan • O. Sai Chakradhar Reddy • T. Praneeth
            </div>
            <div style={{ fontSize: '0.78rem', color: '#8A6A4A', marginTop: '0.2rem' }}>
              Faculty Guide: Dr. P. Pandiselvam
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
