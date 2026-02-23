'use client';

import { useState } from 'react';

type Alert = {
    type: 'ok' | 'warning' | 'critical';
    icon: string;
    msg: string;
};

export default function PredictiveMaintenance({ active }: { active: boolean }) {
    const [odometer, setOdometer] = useState<string>('');
    const [lastDate, setLastDate] = useState<string>('');
    const [alerts, setAlerts] = useState<Alert[] | null>(null);

    if (!active) return null;

    const checkMaintenance = (e: React.FormEvent) => {
        e.preventDefault();
        const odo = parseInt(odometer);
        const dateObj = new Date(lastDate);

        if (!odo || isNaN(dateObj.getTime())) return;

        const now = new Date();
        const daysSinceService = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
        const newAlerts: Alert[] = [];

        if (daysSinceService > 180 || (odo % 10000 >= 9000 || odo % 10000 < 1000)) {
            newAlerts.push({ type: 'warning', icon: '🛢️', msg: 'Engine Oil & Filter change due. Old oil increases friction and CO2 emissions.' });
        } else {
            newAlerts.push({ type: 'ok', icon: '✅', msg: `General Service: OK — Done ${Math.floor(daysSinceService / 30)} month(s) ago` });
        }

        if (odo > 50000 && odo % 50000 < 2000) {
            newAlerts.push({ type: 'warning', icon: '🔄', msg: 'Tire Replacement Recommended. Worn tires increase PM2.5 non-exhaust emissions.' });
        }

        if (odo > 80000 && odo % 80000 < 3000) {
            newAlerts.push({ type: 'critical', icon: '⚠️', msg: 'Catalytic Converter/DPF inspection required! Failure causes severe NOx & PM pollution.' });
        }

        if (odo > 30000 && odo % 30000 < 1500) {
            newAlerts.push({ type: 'warning', icon: '🛑', msg: 'Brake pad inspection. Worn brake pads generate toxic metallic particulate matter.' });
        }

        setAlerts(newAlerts);
    };

    return (
        <section className="tab-content active">
            <div className="tab-header">
                <h2 className="tab-title">Predictive Maintenance</h2>
                <p className="tab-subtitle">Stay ahead of your vehicle service schedule to reduce emissions and breakdowns</p>
            </div>
            <div className="glass-card form-card">
                <form onSubmit={checkMaintenance}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 8v4l3 3" />
                                </svg>
                                Current Odometer (km)
                            </label>
                            <input
                                type="number"
                                value={odometer}
                                onChange={e => setOdometer(e.target.value)}
                                placeholder="e.g. 50000"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                Last Service Date
                            </label>
                            <input
                                type="date"
                                value={lastDate}
                                onChange={e => setLastDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="action-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                        Check Maintenance Status
                    </button>
                </form>

                {alerts && (
                    <div className="result-list">
                        {alerts.map((a, i) => (
                            <div key={i} className={`alert-item ${a.type}`}>
                                <span className="alert-icon">{a.icon}</span>
                                <span>{a.msg}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
