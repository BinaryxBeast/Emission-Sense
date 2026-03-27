import MatIcon from './MatIcon';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <MatIcon name="eco" size={20} filled />
        <span>Emission-Sense</span>
      </div>
      <p>ASEP Group 11 — Vehicle Emission Analysis Project</p>
      <div className="footer-note">Powered by IPCC, COPERT, EMEP-EEA &amp; CPCB India</div>
    </footer>
  );
}