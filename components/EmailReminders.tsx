'use client';

import { useState } from 'react';
import MatIcon from './MatIcon';

interface NextServiceDate {
  label: string;
  date: string; // YYYY-MM-DD
}

interface VehicleSpecs {
  fuelType: string;
  standard: string;
  engineCC?: number;
  transmission?: string;
  fuelEfficiency?: number;
  vehicleType: string;
  age: number;
}

export interface EmailRemindersProps {
  vehicleName?: string;
  vehicleImageUrl?: string;
  vehicleSpecs?: VehicleSpecs;
  emissionResults?: { CO2: number; NOx: number; PM25: number; CO: number; HC: number };
  maintenanceScore?: number;
  nextServiceDates?: NextServiceDate[];
  recommendations?: { title: string; description: string }[];
}

export default function EmailReminders({
  vehicleName,
  vehicleImageUrl,
  vehicleSpecs,
  emissionResults,
  maintenanceScore,
  nextServiceDates,
  recommendations,
}: EmailRemindersProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasVehicleData = !!vehicleName;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          vehicleName,
          vehicleImageUrl,
          vehicleSpecs,
          emissionResults,
          maintenanceScore,
          nextServiceDates,
          recommendations,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setEmail('');
      } else {
        setError(data.error || 'Failed to send report. Please try again.');
      }
    } catch {
      setError('Connection error. Please check your setup and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="md-card history-section"
      style={{
        marginTop: 'var(--sp-xl)',
        overflow: 'hidden',
        position: 'relative',
        padding: '2.5rem',
        backgroundColor: 'var(--md-surface-container)',
        background: 'linear-gradient(135deg, rgba(0,230,118,0.04) 0%, rgba(0,176,255,0.04) 100%)',
        border: '1px solid rgba(0,230,118,0.12)',
      }}
    >
      {/* Decorative background orb */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(0,230,118,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="email-reminders-content"
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', textAlign: 'center', position: 'relative' }}
      >
        {/* Icon */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '24px',
          background: 'linear-gradient(135deg, var(--md-primary-container), rgba(0,176,255,0.15))',
          color: 'var(--md-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,230,118,0.15)',
        }}>
          <MatIcon name="mark_email_read" size={32} filled />
        </div>

        {/* Title */}
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '6px', color: 'var(--md-on-surface)', fontFamily: 'Outfit, sans-serif' }}>
            Get Your Report by Email
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--md-on-surface-variant)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            {hasVehicleData
              ? <>Receive a full emission report for <strong style={{ color: 'var(--md-primary)' }}>{vehicleName}</strong> — including results, maintenance score, and your next 3 service dates.</>
              : 'Calculate your vehicle\'s emissions first, then subscribe to get your personalized report.'}
          </p>
        </div>

        {/* Service date chips preview */}
        {nextServiceDates && nextServiceDates.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {nextServiceDates.map((s, i) => {
              const colors = ['var(--accent-green)', '#F59E0B', '#60A5FA'];
              return (
                <span key={i} style={{
                  background: `${colors[i % colors.length]}15`,
                  border: `1px solid ${colors[i % colors.length]}40`,
                  borderRadius: '20px', padding: '4px 12px',
                  fontSize: '0.78rem', color: colors[i % colors.length], fontWeight: 600
                }}>
                  {s.label} · {new Date(s.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              );
            })}
          </div>
        )}

        {/* Form / Success */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            style={{ width: '100%', maxWidth: '520px', display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <div style={{ flex: 1, minWidth: '260px' }}>
              <input
                id="reminder-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={!hasVehicleData}
                style={{
                  width: '100%', height: '52px', padding: '0 18px',
                  borderRadius: '14px', border: '1.5px solid var(--md-outline)',
                  background: hasVehicleData ? 'var(--md-surface)' : 'rgba(255,255,255,0.03)',
                  color: 'var(--md-on-surface)', fontSize: '1rem', outline: 'none',
                  transition: 'all 0.3s ease', boxSizing: 'border-box',
                  opacity: hasVehicleData ? 1 : 0.5,
                }}
                className="reminder-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !hasVehicleData}
              style={{
                height: '52px', padding: '0 28px', borderRadius: '14px',
                background: hasVehicleData
                  ? 'linear-gradient(135deg, var(--md-primary), #00b0ff)'
                  : 'rgba(255,255,255,0.08)',
                color: hasVehicleData ? 'var(--md-on-primary)' : 'var(--md-on-surface-muted)',
                fontWeight: 700, fontSize: '0.95rem', border: 'none',
                display: 'flex', alignItems: 'center', gap: '8px',
                cursor: hasVehicleData ? 'pointer' : 'not-allowed',
                boxShadow: hasVehicleData ? '0 4px 16px rgba(0,230,118,0.25)' : 'none',
                transition: 'all 0.3s ease', flexShrink: 0,
              }}
            >
              {loading ? (
                <div style={{
                  width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                }} />
              ) : (
                <>
                  <MatIcon name="send" size={18} />
                  <span>Send Report</span>
                </>
              )}
            </button>

            {error && (
              <div style={{ width: '100%', color: 'var(--md-error)', fontSize: '0.83rem', marginTop: '4px', textAlign: 'center' }}>
                <MatIcon name="error" size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                {error}
              </div>
            )}
          </form>
        ) : (
          <div style={{
            animation: 'fadeInUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            display: 'flex', alignItems: 'center', gap: '14px',
            background: 'rgba(0,230,118,0.1)', padding: '16px 32px',
            borderRadius: '20px', border: '1px solid rgba(0,230,118,0.25)',
            color: 'var(--accent-green)', fontWeight: 700, fontSize: '1.05rem',
            marginTop: '4px',
          }}>
            <MatIcon name="check_circle" size={28} filled />
            <div style={{ textAlign: 'left' }}>
              <div>Report sent! Check your inbox 📬</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 400, opacity: 0.7, marginTop: '2px' }}>This was a one-time report. No further emails will be sent.</div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .reminder-input:focus {
          border-color: var(--md-primary) !important;
          box-shadow: 0 0 0 3px rgba(0,230,118,0.15) !important;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
