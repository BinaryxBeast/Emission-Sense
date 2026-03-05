'use client';

export default function Header() {
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
                <button className="nav-btn active">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    Emission Calculator
                </button>
            </nav>
        </header>
    );
}
