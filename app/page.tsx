'use client';

import Header from '@/components/Header';
import EmissionCalculator from '@/components/EmissionCalculator';
import MatIcon from '@/components/MatIcon';

export default function Home() {
  return (
    <>
      {/* Ambient pollution orb — reacts to theme-* class on html */}
      <div className="pollution-orb" aria-hidden="true" />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <Header />

        <main>
          <EmissionCalculator active={true} />
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <MatIcon name="eco" size={24} filled />
              <strong>Emission-Sense</strong>
            </div>
            <p>EVS Group</p>
            <p>Members: Rushikesh, Aditya, Vedant, Bhavika</p>
            <p className="footer-note">Standards: IPCC / COPERT / EMEP-EEA / CPCB India</p>
          </div>
        </footer>
      </div>
    </>
  );
}
