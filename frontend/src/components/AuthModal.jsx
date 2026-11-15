import React from 'react';
import { AlertCircle, ExternalLink, ShieldCheck, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, onAuthenticated }) {
  const { authError, clearAuthError, loginAsLeadResearcher } = useAuth();

  if (!isOpen && !authError) return null;

  const handleResearcherBypass = () => {
    loginAsLeadResearcher();
    if (clearAuthError) clearAuthError();
    if (onClose) onClose();
    if (onAuthenticated) onAuthenticated();
  };

  const handleClose = () => {
    if (clearAuthError) clearAuthError();
    if (onClose) onClose();
  };

  const isUnauthorizedDomain = 
    authError?.code === 'auth/unauthorized-domain' || 
    authError?.message?.toLowerCase().includes('unauthorized-domain') ||
    authError?.title?.includes('Domain Authorization');

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(37, 34, 31, 0.65)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
      zIndex: 9999,
      animation: 'fadeIn 0.15s ease-out'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 20px 40px rgba(37, 34, 31, 0.18)',
        maxWidth: '540px',
        width: '100%',
        padding: '2rem',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: isUnauthorizedDomain ? '#FAF2EB' : 'var(--bg-secondary)',
            color: isUnauthorizedDomain ? '#8A6A4A' : 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertCircle size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {authError?.title || 'Firebase Authentication Notice'}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Google Sign-In configuration for deployed domain
            </p>
          </div>
        </div>

        {/* Informative Explanation */}
        <div style={{
          backgroundColor: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem',
          marginBottom: '1.25rem',
          fontSize: '0.85rem',
          color: 'var(--text-primary)',
          lineHeight: 1.55
        }}>
          {isUnauthorizedDomain ? (
            <div>
              <p style={{ fontWeight: 600, marginBottom: '0.4rem', color: '#8A6A4A' }}>
                Why is this happening on Vercel?
              </p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                Google Sign-In works on <code>localhost</code> because it is whitelisted by default. In production, Firebase requires your custom domain (<code>renewcast-isp.vercel.app</code>) to be added to <strong>Authorized Domains</strong> in the Firebase Console.
              </p>
              <div style={{ fontSize: '0.8rem', backgroundColor: '#FFFFFF', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <strong>30-Second Fix in Firebase Console:</strong>
                <ol style={{ paddingLeft: '1.25rem', marginTop: '0.35rem', color: 'var(--text-secondary)' }}>
                  <li>Go to <strong>Firebase Console</strong> → <strong>Authentication</strong> → <strong>Settings</strong></li>
                  <li>Scroll to <strong>Authorized domains</strong> and click <strong>Add domain</strong></li>
                  <li>Enter <code>renewcast-isp.vercel.app</code> and click <strong>Save</strong></li>
                </ol>
                <div style={{ marginTop: '0.6rem' }}>
                  <a
                    href="https://console.firebase.google.com/project/renewcast-535f6/authentication/settings"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: '#8A6A4A',
                      fontWeight: 600,
                      textDecoration: 'underline'
                    }}
                  >
                    Open Firebase Settings <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>
              {authError?.message || 'Google Sign-In encountered an error during authentication.'}
            </p>
          )}
        </div>

        {/* Quick Researcher Bypass Option */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <button
            onClick={handleResearcherBypass}
            className="btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.8rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              gap: '0.5rem'
            }}
          >
            <ShieldCheck size={18} />
            Continue as Lead Researcher (T. Harish Narayan)
          </button>

          <button
            onClick={handleClose}
            className="btn-secondary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.65rem',
              fontSize: '0.8125rem'
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
