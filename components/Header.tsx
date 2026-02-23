'use client';

export default function Header({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
    return (
        <header className="header">
            <div className="logo">
                <div className="logo-icon">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" strokeWidth="2.5" />
                        <path d="M14 26 C14 18, 20 12, 20 12 C20 12, 26 18, 26 26" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M17 26 C17 21, 20 16, 20 16 C20 16, 23 21, 23 26" fill="url(#logoGrad)" opacity="0.3" />
                        <circle cx="20" cy="10" r="2" fill="url(#logoGrad)" opacity="0.6" />
                        <defs>
                            <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                                <stop offset="0%" stopColor="#00e676" />
                                <stop offset="100%" stopColor="#00b0ff" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h1>Emission-Sense</h1>
            </div>
            <p className="tagline">Scientifically accurate vehicle emission calculator</p>

            <nav className="main-nav">
                <button className={`nav-btn ${activeTab === 'emission' ? 'active' : ''}`} onClick={() => setActiveTab('emission')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    Emission Calculator
                </button>
                <button className={`nav-btn ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                        <line x1="9" y1="3" x2="9" y2="18" />
                        <line x1="15" y1="6" x2="15" y2="21" />
                    </svg>
                    Regulatory Map
                </button>
                <button className={`nav-btn ${activeTab === 'maintenance' ? 'active' : ''}`} onClick={() => setActiveTab('maintenance')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                    </svg>
                    Maintenance
                </button>
                <button className={`nav-btn ${activeTab === 'policy' ? 'active' : ''}`} onClick={() => setActiveTab('policy')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    Policy
                </button>
            </nav>
        </header>
    );
}
