'use client';

import { useState } from 'react';
import MatIcon from './MatIcon';

export default function EmailReminders() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setEmail('');
      // Reset after some time
      setTimeout(() => setSubmitted(false), 8000);
    }, 1500);
  };

  return (
    <div className="md-card history-section" style={{ 
      marginTop: 'var(--sp-xl)', 
      overflow: 'hidden', 
      position: 'relative',
      padding: '2.5rem',
      backgroundColor: 'var(--md-surface-container)' 
    }}>
      <div className="email-reminders-content" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem', 
        alignItems: 'center', 
        textAlign: 'center' 
      }}>
        <div className="email-icon-wrapper" style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '24px', 
          background: 'var(--md-primary-container)', 
          color: 'var(--md-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--md-elev-1)'
        }}>
          <MatIcon name="notifications_active" size={32} filled />
        </div>
        
        <div className="email-text">
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            marginBottom: '0.5rem', 
            color: 'var(--md-on-surface)',
            fontFamily: 'Outfit, sans-serif'
          }}>
            Maintenance Reminders
          </h2>
          <label htmlFor="reminder-email" style={{ 
            fontSize: '1rem', 
            color: 'var(--md-on-surface-variant)', 
            maxWidth: '450px',
            display: 'block'
          }}>
            Enter your email to get reminders about Vehicle servicing
          </label>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ 
            width: '100%', 
            maxWidth: '500px', 
            display: 'flex', 
            gap: '12px', 
            marginTop: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <div className="email-input-group" style={{ flex: 1, minWidth: '260px' }}>
              <input
                id="reminder-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  height: '56px',
                  padding: '0 20px',
                  borderRadius: '16px',
                  border: '1.5px solid var(--md-outline)',
                  background: 'var(--md-surface)',
                  color: 'var(--md-on-surface)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
                }}
                className="reminder-input"
              />
            </div>
            <button 
              type="submit" 
              className="action-btn" 
              disabled={loading}
              style={{ 
                width: 'auto', 
                padding: '0 32px', 
                height: '56px',
                borderRadius: '16px',
                background: 'var(--md-primary)',
                color: 'var(--md-on-primary)',
                fontWeight: 700,
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: 'var(--md-elev-2)',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <div className="spinner" />
              ) : (
                <>
                  <span>Subscribe</span>
                  <MatIcon name="arrow_forward" size={20} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="success-feedback" style={{ 
            animation: 'fadeInUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--md-primary-container)',
            padding: '16px 32px',
            borderRadius: '20px',
            color: 'var(--md-on-primary-container)',
            fontWeight: 700,
            fontSize: '1.1rem',
            marginTop: '0.5rem',
            boxShadow: 'var(--md-elev-1)'
          }}>
            <MatIcon name="check_circle" size={28} filled />
            <span>Reminders activated!</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .reminder-input:focus {
          border-color: var(--md-primary) !important;
          box-shadow: 0 0 0 4px rgba(46, 125, 50, 0.2) !important;
          transform: translateY(-1px);
        }
        .action-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--md-elev-3);
          background: var(--md-on-primary-container);
        }
        .action-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .spinner {
          width: 20px; 
          height: 20px; 
          border: 3px solid rgba(255,255,255,0.3); 
          border-top-color: #fff; 
          border-radius: 50%; 
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
