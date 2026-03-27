import os

css_additions = """
/* ========================================================= */
/* VISUAL & UX REFINEMENTS (MD3 Light Theme)                 */
/* ========================================================= */

/* 1. VEHICLE IMAGE PLACEHOLDER */
.vehicle-image-container {
  width: 100%;
  max-width: 520px;
  height: 240px;
  margin: 0 auto 24px;
  border-radius: 24px;             /* Large rounded corners */
  overflow: hidden;
  background: var(--md-surface-container);
  box-shadow: var(--md-elev-2);
  border: 1.5px solid var(--md-outline-variant);
  display: flex;
  align-items: center;
  justify-content: center;
}
.vehicle-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}
.vehicle-image-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--md-surface-variant);
}

/* 3A. HEADER */
.header-card {
  border-top: 4px solid var(--md-primary);
  border-radius: 0 0 var(--md-radius-lg) var(--md-radius-lg);
}
.header-card .logo-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-primary);
}
.header-card h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--md-primary);
}
.header-card .tagline {
  font-size: 0.875rem;
  color: var(--md-on-surface-variant);
}

/* 3B. STEP PROGRESS BAR */
.step-progress-card {
  padding: 20px 32px;
  gap: 0;
  justify-content: space-between;
  display: flex;
  margin-bottom: var(--sp-lg);
}
.step-progress {
  gap: 0;
  position: relative;
  width: 100%;
}
.step-progress::before {
  content: '';
  position: absolute;
  top: 22px;
  left: 10%;
  right: 10%;
  height: 2px;
  background: var(--md-outline-variant);
  z-index: 0;
}
.step-line {
  display: none !important; /* disabled since we use the track bar */
}
.step-indicator {
  z-index: 1;
  position: relative;
}
.step-circle {
  background: white;
}
.step-indicator.active .step-circle {
  background: var(--md-primary);
  color: white;
  box-shadow: 0 0 0 4px rgba(46,125,50,0.15);
  border: none;
}
.step-indicator.done .step-circle {
  background: var(--md-primary);
  opacity: 0.85;
  color: white;
  border: none;
}
.step-label {
  font-size: 0.72rem;
  font-weight: 500;
  margin-top: 8px;
}

/* 3C. SECTION LABELS */
.section-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--md-on-surface-variant);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.section-label .material-symbols-rounded {
  font-size: 16px !important;
}

/* 3D. VEHICLE CONFIRM CARD */
.confirm-card-wrapper {
  background: var(--md-surface-container);
  border-radius: var(--md-radius-md);
  padding: 20px;
  border: 1.5px solid var(--md-outline-variant);
  margin-bottom: 20px;
}
.spec-grid-cell {
  background: var(--md-surface-container);
  border-radius: var(--md-radius-sm);
  padding: 14px 16px;
  border: 1.5px solid var(--md-outline-variant);
}
.spec-grid-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--md-on-surface-muted);
  font-weight: 600;
}
.spec-grid-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--md-on-surface);
  margin-top: 2px;
}

/* 3E. DISTANCE CARD */
.distance-input-hidden {
  background: rgba(255,255,255,0.6) !important;
  border: 2px solid var(--md-primary) !important;
  border-radius: var(--md-radius-md) !important;
  padding: 10px 20px !important;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  max-width: 160px;
  text-align: center;
  margin: 0 auto;
  display: block;
}

/* 3F. CITY/HIGHWAY CHIPS */
.slider-chip {
  background: var(--md-surface-container);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.75rem;
  color: var(--md-on-surface-variant);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* 3G. ICON CARDS */
.icon-card {
  min-height: 108px;
  padding: 22px 14px;
}
.icon-card-icon {
  font-size: 32px !important;
  padding: 10px;
  border-radius: 50%;
  background: var(--md-surface-variant);
  margin-bottom: 4px;
  transition: background 0.2s;
  color: var(--md-on-surface); /* Reset default color if needed */
}
.icon-card.selected .icon-card-icon {
  background: var(--md-primary-container);
  color: var(--md-primary);
}
.icon-card-label {
  font-size: 0.88rem;
  font-weight: 700;
}
.icon-card-sub {
  font-size: 0.72rem;
  color: var(--md-on-surface-muted);
}

/* 3H. POLLUTANT CARDS */
.pollutant-card {
  border-left-width: 4px;
  border-left-style: solid;
  border-left-color: transparent;
}
.pollutant-card.co2  { border-left-color: var(--md-primary); }
.pollutant-card.nox  { border-left-color: #E65100; }
.pollutant-card.pm25 { border-left-color: #B71C1C; }
.pollutant-card.co   { border-left-color: #00796B; }
.pollutant-card.hc   { border-left-color: #6D4C41; }

/* Existing class rule for bar fill in specific elements */
.pollutant-card.co2  .pollutant-bar-fill { background: var(--md-primary); }
.pollutant-card.nox  .pollutant-bar-fill { background: #E65100; }
.pollutant-card.pm25 .pollutant-bar-fill { background: #B71C1C; }
.pollutant-card.co   .pollutant-bar-fill { background: #00796B; }
.pollutant-card.hc   .pollutant-bar-fill { background: #6D4C41; }

/* 3I. HERO IMPACT CARD */
.hero-eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.75;
}
.hero-co2-number {
  font-size: clamp(3.5rem, 10vw, 5.5rem);
  line-height: 1;
  margin: 8px 0;
}
.equivalence-rows {
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
  max-width: 340px !important;
  margin: 16px auto 0 !important;
  background: rgba(255,255,255,0.5) !important;
  border-radius: var(--md-radius-md) !important;
  padding: 16px 20px !important;
}
.equivalence-row {
  font-size: 0.88rem !important;
  color: var(--md-on-primary-container) !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  justify-content: flex-start !important;
}

/* 3J. CO2 COMPARISON SECTION */
.comparison-pill {
  font-size: 0.85rem;
  font-weight: 700;
  min-width: 52px;
  text-align: right;
  border-radius: 999px;
  padding: 2px 8px;
}
.comparison-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.comparison-row:nth-child(3) .comparison-bar-fill { /* Assuming nat_avg is the 2nd row (index 3 of children typically, adjusting selector later) */
  background: #9E9E9E !important; 
}

/* 3K. ECO TIPS */
.eco-tip-icon {
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;
  border-radius: 50% !important;
  background: var(--md-primary-container) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: var(--md-primary) !important;
}
.eco-tip-icon .material-symbols-rounded {
  font-size: 22px !important;
}
.impact-badge {
  border-radius: 999px !important;
  font-size: 0.72rem !important;
  padding: 4px 12px !important;
}
.impact-badge.save-badge {
  background: var(--md-secondary-container) !important;
  color: var(--md-secondary) !important;
}

/* 3L. SERVICE DATE CARDS */
.service-date-input {
  background: var(--md-surface) !important;
  border: 1.5px solid var(--md-outline) !important;
  border-radius: var(--md-radius-sm) !important;
  padding: 10px 12px !important;
  font-size: 0.9rem !important;
  width: 100% !important;
  color: var(--md-on-surface) !important;
  margin-top: 8px !important;
}
.service-date-card-header {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
  color: var(--md-on-surface-variant) !important;
  margin-bottom: 6px !important;
  justify-content: space-between;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: auto;
}
.dot-ok      { background: var(--md-primary); }
.dot-due     { background: #E65100; }
.dot-overdue { background: var(--md-error); }

/* 3M. MAINTENANCE SCORE GAUGE */
.score-badge {
  border-radius: 999px !important;
  padding: 8px 24px !important;
  font-size: 0.88rem !important;
  font-weight: 700 !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
}
.score-badge.excellent { background: var(--md-primary-container) !important; color: var(--md-primary) !important; }
.score-badge.attention { background: var(--md-warning-container) !important; color: var(--md-warning) !important; }
.score-badge.risk      { background: var(--md-error-container) !important; color: var(--md-error) !important; }

/* 3N. OVERALL CARD SPACING */
.form-card, .breakdown-card, .eco-tips, .transparency-card, .history-section {
  margin-bottom: 20px !important;
}
/* Inner padding responsive */
.md-card, .breakdown-card, .service-date-card, .hero-impact-card, .transparency-card, .eco-tip, .comparison-section, .history-section {
  padding: 28px !important;
  border-radius: 16px !important;
}
@media (max-width: 600px) {
  .md-card, .breakdown-card, .service-date-card, .hero-impact-card, .transparency-card, .eco-tip, .comparison-section, .history-section {
    padding: 20px !important;
  }
}
.tab-header .tab-title {
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  margin-bottom: 4px !important;
  color: var(--md-on-surface) !important;
  background: none; /* override existing */
}
.tab-header .tab-subtitle {
  font-size: 0.9rem !important;
  color: var(--md-on-surface-variant) !important;
  margin-bottom: 24px !important;
}

/* 3O. SEARCH BAR */
.search-container {
  background: var(--md-surface-container) !important;
  border-radius: var(--md-radius-xl) !important;
  border: 2px solid var(--md-outline) !important;
  padding: 4px 4px 4px 16px !important;
  max-width: 580px !important;
  display: flex !important;
  align-items: center !important;
  box-shadow: none !important;
}
.search-container input::placeholder {
  color: var(--md-on-surface-muted) !important;
  font-size: 0.95rem !important;
}
.search-container button {
  background: var(--md-primary) !important;
  color: white !important;
  border-radius: var(--md-radius-lg) !important;
  padding: 12px 28px !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  min-height: 48px !important;
  border: none !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}

/* 3P. SPEC BADGES */
.spec-badge-dark {
  background: var(--md-surface-variant) !important;
  color: var(--md-on-surface-variant) !important;
  border: 1.5px solid var(--md-outline) !important;
  border-radius: 999px !important;
  padding: 5px 14px !important;
  font-size: 0.78rem !important;
  font-weight: 500 !important;
}

/* 3Q. TRANSPARENCY SECTION */
.transparency-header-row {
  cursor: pointer;
  padding: 16px 20px;
  border-radius: var(--md-radius-md);
  transition: background 0.15s;
}
.transparency-header-row:hover {
  background: var(--md-surface-variant);
}
.transparency-header-row h3 {
  font-size: 1rem !important;
  font-weight: 700 !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}
.calc-detail-block {
  background: var(--md-surface-container) !important;
  border-radius: var(--md-radius-sm) !important;
  padding: 12px 16px !important;
  border: none !important;
  border-left: 3px solid var(--md-primary-container) !important;
  margin-top: 12px !important;
  font-size: 0.85rem !important;
  line-height: 1.7 !important;
}

/* 3R. FOOTER */
.footer {
  text-align: center;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.footer-brand {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  font-size: 1rem !important;
  font-weight: 700 !important;
  color: var(--md-primary) !important;
}
.footer p {
  font-size: 0.8rem;
  color: var(--md-on-surface-muted);
}
.footer-note {
  font-size: 0.72rem;
  opacity: 0.7;
  margin-top: 4px;
}

/* MINOR UX FIXES */
.search-again-link {
  color: var(--md-primary) !important;
  font-weight: 600 !important;
  text-decoration: none !important;
  font-size: 0.85rem !important;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
}
.search-again-link:hover {
  text-decoration: underline !important;
}

/* Action buttons generally */
.action-btn {
  min-height: 52px !important;
  border-radius: 999px !important; /* pill shape */
}

/* Service cards days ago */
.service-days-ago {
  font-size: 0.75rem !important;
  color: var(--md-on-surface-muted) !important;
  margin-top: 4px !important;
}
"""

with open('/home/binaryxbeast/Desktop/asep_project/app/globals.css', 'a') as f:
    f.write(css_additions)
