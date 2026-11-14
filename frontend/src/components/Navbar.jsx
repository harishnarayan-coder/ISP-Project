import React, { useState } from 'react';
import { 
  Sun, 
  Wind, 
  Cloud, 
  MapPin, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activePage, setActivePage, weatherData }) {
  const { user, isAuthenticated, loginWithGoogle, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // If authenticated, show all operational tabs; otherwise only public tabs
  const navItems = isAuthenticated
    ? [
        { id: 'overview', label: 'Overview' },
        { id: 'dashboard', label: 'Forecast' },
        { id: 'models', label: 'Models' },
        { id: 'weather', label: 'Weather' },
        { id: 'datasets', label: 'Datasets' },
        { id: 'history', label: 'History' },
        { id: 'about', label: 'Methodology' }
      ]
    : [
        { id: 'overview', label: 'Overview' },
        { id: 'about', label: 'Methodology' }
      ];

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await loginWithGoogle();
      setActivePage('dashboard');
      setMobileMenuOpen(false);
    } catch (err) {
      console.error('Sign in error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    setActivePage('overview');
  };

  const handleNavClick = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-subtle)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px'
      }}>
        {/* Brand & Logo */}
        <div 
          onClick={() => handleNavClick('overview')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          {/* Minimal Sun + Wind Emblem */}
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#29241F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F7F4EF',
            position: 'relative',
            flexShrink: 0
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="9" r="4" stroke="#C79A4B" strokeWidth="2.2" />
              <path d="M5 16h8a3 3 0 0 0 0-6h-1" stroke="#5E7657" strokeWidth="2.2" />
              <path d="M7 20h11a2.5 2.5 0 0 0 0-5" stroke="#B79B7A" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '1.05rem',
                letterSpacing: '0.04em',
                color: '#25221F'
              }}>RENEWCAST</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#6F6962', margin: 0, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
              Adaptive Renewable Forecasting
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Hidden on mobile < 860px via CSS .desktop-nav) */}
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  background: isActive ? '#EFE9DF' : 'transparent',
                  color: isActive ? '#25221F' : '#6F6962',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  border: 'none',
                  transition: 'all 150ms ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls: Profile / Sign-in & Mobile Hamburger Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Weather telemetry (visible on desktop) */}
          {isAuthenticated && weatherData?.current && (
            <div className="navbar-weather-badge" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '0.35rem 0.7rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              color: '#25221F'
            }}>
              <Cloud size={14} color="#526B73" />
              <span>{weatherData.current.temperature}°C</span>
              <span style={{ color: '#D4C9BC' }}>|</span>
              <Wind size={14} color="#5E7657" />
              <span>{weatherData.current.wind_speed} km/h</span>
            </div>
          )}

          {/* Authentication State */}
          {!isAuthenticated ? (
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.8125rem',
                borderRadius: '8px',
                fontWeight: 600
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{isSigningIn ? '...' : 'Sign In'}</span>
            </button>
          ) : (
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.55rem',
                  borderRadius: '20px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#8A6A4A',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown size={13} color="#6F6962" />
              </div>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-subtle)',
                  padding: '0.75rem',
                  minWidth: '220px',
                  zIndex: 200
                }}>
                  <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {user.displayName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email || 'Researcher Account'}
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      color: '#B23B3B',
                      background: 'transparent',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FDF2F2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Menu Button (Visible on mobile < 860px) */}
          <button 
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Collapsible dropdown on mobile screens) */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  background: isActive ? '#EFE9DF' : 'transparent',
                  color: isActive ? '#25221F' : '#6F6962',
                  fontWeight: isActive ? 700 : 500,
                  border: 'none'
                }}
              >
                <span>{item.label}</span>
                {isActive && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8A6A4A' }} />}
              </button>
            );
          })}

          {/* Weather telemetry in mobile drawer if logged in */}
          {isAuthenticated && weatherData?.current && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '8px',
              marginTop: '0.5rem',
              fontSize: '0.8125rem'
            }}>
              <span style={{ color: 'var(--text-secondary)' }}>Weather Telemetry</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <span>{weatherData.current.temperature}°C</span>
                <span>•</span>
                <span>{weatherData.current.wind_speed} km/h</span>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
