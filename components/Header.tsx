'use client';
export default function Header() {
    return (
        <header className="header">
            <div className="logo">
                <div className="logo-icon">
                    <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" strokeWidth="2.5" />
                        <path d="M14 26 C14 18, 20 12, 20 12 C20 12, 26 18, 26 26" stroke="url(#logoGrad)" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M17 26 C17 21, 20 16, 20 16 C20 16, 23 21, 23 26" fill="url(#logoGrad)" opacity="0.4" />
                        <circle cx="20" cy="10" r="2" fill="url(#logoGrad)" opacity="0.8" />
                        <defs>
                            <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                                <stop offset="0%" stopColor="#10B981" />
                                <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h1>Emission-Sense</h1>
            </div>
            <p className="tagline">Track your vehicle&apos;s environmental impact in seconds</p>
        </header>
    );
}
