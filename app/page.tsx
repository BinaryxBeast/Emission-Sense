'use client';

import Header from '@/components/Header';
import EmissionCalculator from '@/components/EmissionCalculator';

export default function Home() {

  return (
    <>      <div className="container">
      <Header />

      <main>
        <EmissionCalculator active={true} />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="url(#footerGrad)" strokeWidth="2" />
              <path d="M14 26 C14 18, 20 12, 20 12 C20 12, 26 18, 26 26" stroke="url(#footerGrad)" strokeWidth="2" strokeLinecap="round" fill="none" />
              <defs>
                <linearGradient id="footerGrad" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#00e676" />
                  <stop offset="100%" stopColor="#00b0ff" />
                </linearGradient>
              </defs>
            </svg>
            <strong>Emission-Sense</strong>
          </div>
          <p>ASEP Group 11 | Vehicle Emission Analysis Project</p>
          <p className="footer-note">Standards: IPCC / COPERT / EMEP-EEA / CPCB India</p>
        </div>
      </footer>
    </div>
    </>
  );
}
