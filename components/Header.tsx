'use client';
import MatIcon from './MatIcon';

export default function Header() {
    return (
        <header className="header header-card">
            <div className="logo">
                <div className="logo-icon">
                    <MatIcon name="eco" size={28} filled />
                </div>
                <h1>Emission-Sense</h1>
            </div>
            <p className="tagline">Track your vehicle&apos;s environmental impact in seconds</p>
        </header>
    );
}
