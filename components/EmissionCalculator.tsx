/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { calculateEmissions, CalculationInput } from '../lib/calculation';
import { usePollution } from './PollutionContext';
import { 
    Car, 
    Truck, 
    Bus, 
    Bike, 
    Fuel, 
    Zap, 
    CheckCircle2, 
    Wrench, 
    Wind, 
    Snowflake, 
    ThermometerSnowflake, 
    User, 
    Users, 
    Box, 
    Calendar, 
    Search, 
    RotateCcw, 
    AlertTriangle, 
    Factory, 
    AlertOctagon, 
    Globe, 
    Smartphone, 
    Trees, 
    Footprints, 
    Check, 
    Milestone, 
    Settings2, 
    Info, 
    Leaf,
    ArrowRight,
    MapPin,
    Cloud,
    Droplets,
    ShieldCheck,
    Flame,
    TrendingDown,
    ChevronDown,
    BarChart3,
    Gauge
} from 'lucide-react';

// ── Icon Card Selector ──────────────────────────────────────────────────────
function IconCardGroup({ cols, options, value, onChange }: {
    cols?: number;
    options: { val: string | number; icon: ReactNode; label: string; sub?: string }[];
    value: string | number;
    onChange: (v: string | number) => void;
}) {
    return (
        <div className={`icon-card-group cols-${cols ?? 3}`}>
            {options.map(o => (
                <button
                    key={String(o.val)}
                    type="button"
                    className={`icon-card${String(value) === String(o.val) ? ' selected' : ''}`}
                    onClick={() => onChange(o.val)}
                >
                    <span className="icon-card-icon">{o.icon}</span>
                    <span className="icon-card-label">{o.label}</span>
                    {o.sub && <span className="icon-card-sub">{o.sub}</span>}
                </button>
            ))}
        </div>
    );
}

// ── Confidence Ring ─────────────────────────────────────────────────────────
function ConfidenceRing({ pct }: { pct: number }) {
    const r = 28, circ = 2 * Math.PI * r;
    const color = pct > 85 ? '#10B981' : pct > 60 ? '#F59E0B' : '#EF4444';
    const dash = (pct / 100) * circ;
    return (
        <div className="confidence-ring-wrapper">
            <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
                    strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 1s ease' }} />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', inset: 0 }}>
                <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 800, fontSize: '1rem', color }}>{pct}%</span>
            </div>
            <span className="confidence-ring-label">Match</span>
        </div>
    );
}

// ── Emission Category Badge ─────────────────────────────────────────────────
function getEmissionCategory(fType: string, eStd: string) {
    if (fType === 'ev') return { cls: 'low', icon: <Zap size={16} />, label: 'Zero Tailpipe' };
    if (fType === 'cng') return { cls: 'low', icon: <CheckCircle2 size={16} />, label: 'Low' };
    if (eStd === 'bs6' && (fType === 'petrol' || fType === 'hybrid')) return { cls: 'low', icon: <CheckCircle2 size={16} />, label: 'Low' };
    if (eStd === 'bs6') return { cls: 'moderate', icon: <AlertTriangle size={16} />, label: 'Moderate' };
    if (eStd === 'bs4') return { cls: 'moderate', icon: <AlertTriangle size={16} />, label: 'Moderate' };
    return { cls: 'high', icon: <AlertOctagon size={16} />, label: 'High' };
}

// ── Service Helpers ─────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
    const r = 52, circ = 2 * Math.PI * r;
    const clampedScore = Math.max(0, Math.min(100, score));
    const dash = (clampedScore / 100) * circ;
    const color = clampedScore >= 85 ? '#10B981' : clampedScore >= 60 ? '#F59E0B' : '#EF4444';
    const label = clampedScore >= 85 ? 'Excellent' : clampedScore >= 60 ? 'Needs Attention' : 'High Risk';
    const badgeClass = clampedScore >= 85 ? 'excellent' : clampedScore >= 60 ? 'attention' : 'risk';
    const emoji = clampedScore >= 85 ? '🟢' : clampedScore >= 60 ? '🟡' : '🔴';
    return (
        <div className="score-gauge-wrapper">
            <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
                <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                    <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
                        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
                        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.25,1,0.5,1)', filter: `drop-shadow(0 0 8px ${color})` }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Outfit,sans-serif', fontSize: '2rem', fontWeight: 900, color, lineHeight: 1 }}>{clampedScore}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>/ 100</span>
                </div>
            </div>
            <div className={`score-badge ${badgeClass}`} style={{ marginTop: '1rem' }}>
                {emoji} {label}
            </div>
        </div>
    );
}

function daysSince(dateStr: string | undefined | null): number | null {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const now = new Date('2026-03-19'); // Consistent ref date
    return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function overdueClass(days: number | null, thresholdDays: number): 'ok' | 'due' | 'overdue' {
    if (days === null) return 'ok';
    if (days <= thresholdDays) return 'ok';
    if (days <= thresholdDays + 90) return 'due';
    return 'overdue';
}

function OverdueBadge({ days, threshold, penalties }: { days: number | null; threshold: number; penalties: string[]; }) {
    if (days === null) return null;
    const overdueDays = Math.max(0, days - threshold);
    if (overdueDays <= 0) return <span className="overdue-badge ok-badge">✓ On Track</span>;
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            <span className="overdue-badge warn-badge">{overdueDays} days overdue</span>
            {penalties.map(p => <span key={p} className="overdue-badge penalty-badge">{p}</span>)}
        </div>
    );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function EmissionCalculator({ active }: { active: boolean }) {
    const { setPollutionLevel } = usePollution();
    const [step, setStep] = useState(1);
    const [stepDir, setStepDir] = useState<'right' | 'left'>('right');
    const [inputs, setInputs] = useState<CalculationInput>({
        vType: 'car', fType: 'petrol', eStd: 'bs4', eSize: 'medium',
        dTot: 40, cityPct: 70, age: 5, maint: 'average',
        acUsage: 'Moderate', trafficIntensity: 'Medium', loadFactor: 1,
        lastServiceDate: '', lastOilChangeDate: '', lastAirFilterDate: '', lastPucDate: '',
        engineCondition: 'good', originalKmpl: null, currentKmpl: null, smokeLevel: 'none', engineNoise: 'normal'
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [isEditingSpecs, setIsEditingSpecs] = useState(false);
    const [extractedVehicle, setExtractedVehicle] = useState<{
        name: string; year: number | null; vType: any; fType: any; eStd: any; eSize: any;
        imageKeyword: string; imageUrl?: string; confidence: number;
        engineCC?: number; cylinders?: number; turbocharged?: boolean;
        fuelInjection?: string; transmission?: string; fuelEfficiencyKmpl?: number;
        kerbWeightKg?: number; variant?: string;
    } | null>(null);
    const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null);
    const [showTransparency, setShowTransparency] = useState(false);
    const [results, setResults] = useState<Record<string, any> | null>(null);
    const [history, setHistory] = useState<Record<string, string>[]>([]);
    const [recommendations, setRecommendations] = useState<{ title: string; description: string }[] | null>(null);
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
    const [livePreview, setLivePreview] = useState<number | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('emiHistory');
        if (saved) setHistory(JSON.parse(saved));
    }, []);

    // Live preview on step 2/3
    const computePreview = useCallback(() => {
        if (inputs.dTot > 0) {
            try { setLivePreview(calculateEmissions(inputs).total.CO2); } catch { /* ignore */ }
        }
    }, [inputs]);

    useEffect(() => { computePreview(); }, [computePreview]);

    if (!active) return null;

    const updateInput = (key: keyof CalculationInput, value: string | number) =>
        setInputs(prev => ({ ...prev, [key]: value }));

    const goStep = (n: number) => {
        setStepDir(n > step ? 'right' : 'left');
        setStep(n);
    };

    const handleSearch = async (e: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setIsSearching(true); setSearchError(''); setExtractedVehicle(null); setIsEditingSpecs(false);
        try {
            const res = await fetch('/api/extract-vehicle', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery }),
            });
            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                if (res.status === 429 && errorData?.errorType === 'rate_limit') {
                    setRateLimitCountdown(errorData.retryAfter || 60);
                    const interval = setInterval(() => setRateLimitCountdown(prev => {
                        if (prev === null || prev <= 1) { clearInterval(interval); return null; }
                        return prev - 1;
                    }), 1000);
                    throw new Error(errorData.error || 'Too many requests. Please wait.');
                }
                throw new Error(errorData?.error || 'Failed to find vehicle.');
            }
            const data = await res.json();
            setExtractedVehicle(data);
            setInputs(prev => {
                const calculatedAge = data.year ? (new Date().getFullYear() - data.year) : prev.age;
                return {
                    ...prev, vType: data.vType, fType: data.fType, eStd: data.eStd, eSize: data.eSize,
                    age: calculatedAge >= 0 ? calculatedAge : 0,
                    engineCC: data.engineCC, cylinders: data.cylinders, turbocharged: data.turbocharged,
                    fuelInjection: data.fuelInjection, transmission: data.transmission,
                    fuelEfficiencyKmpl: data.fuelEfficiencyKmpl, kerbWeightKg: data.kerbWeightKg, variant: data.variant
                };
            });
        } catch (err: any) {
            setSearchError(err.message || 'An error occurred.');
        } finally {
            setIsSearching(false);
        }
    };

    const getRating = (res: Record<string, any>) => {
        const score = (res.total.CO2 / 5) + (res.total.PM25 / 0.5);
        if (inputs.fType === 'ev') return { class: 'low', icon: <Leaf size={20} />, label: 'Zero Tailpipe Emissions', desc: 'CO₂ shown is from the grid' };
        if (score < 2) return { class: 'low', icon: <CheckCircle2 size={20} />, label: 'Low Emission', desc: 'Below-average daily emissions' };
        if (score < 4) return { class: 'moderate', icon: <AlertTriangle size={20} />, label: 'Moderate', desc: 'Consider reducing short trips' };
        if (score < 7) return { class: 'high', icon: <Factory size={20} />, label: 'High Emissions', desc: 'Regular maintenance helps' };
        return { class: 'critical', icon: <AlertOctagon size={20} />, label: 'Critical Emissions', desc: 'Consider EV/BS-VI upgrade' };
    };

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputs.dTot <= 0) return;
        const res = calculateEmissions(inputs);
        setResults(res);
        const rating = getRating(res);
        setPollutionLevel(rating.class as 'low' | 'moderate' | 'high' | 'critical');
        const vehName = extractedVehicle?.name || `${inputs.vType.toUpperCase()} (${inputs.fType})`;
        const co2Val = res.total.CO2.toFixed(1);
        const newHist = [{ veh: vehName, co2: co2Val, date: new Date().toLocaleDateString() }, ...history].slice(0, 5);
        setHistory(newHist);
        localStorage.setItem('emiHistory', JSON.stringify(newHist));
        setTimeout(() => document.getElementById('resultsDashboard')?.scrollIntoView({ behavior: 'smooth' }), 100);
        if (extractedVehicle) {
            setIsLoadingRecommendations(true); setRecommendations(null);
            try {
                const recRes = await fetch('/api/generate-recommendations', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: extractedVehicle.name, fuel_type: inputs.fType, emission_standard: inputs.eStd,
                        engine_size: inputs.eSize, city_highway_split: inputs.cityPct, ac_usage: inputs.acUsage, vehicle_load: inputs.loadFactor
                    })
                });
                if (recRes.ok) setRecommendations(await recRes.json());
            } catch { /* ignore */ } finally { setIsLoadingRecommendations(false); }
        }
    };

    const trafficOptions = [
        { val: 'Low', icon: <Car size={24} />, label: 'Low', sub: 'Free Flow' },
        { val: 'Medium', icon: <Car size={24} style={{ opacity: 0.7 }} />, label: 'Medium', sub: 'Some Stops' },
        { val: 'High', icon: <Car size={24} style={{ opacity: 0.4 }} />, label: 'High', sub: 'Stop & Go' },
    ];
    const acOptions = [
        { val: 'None', icon: <Wind size={24} />, label: 'None', sub: '0% usage' },
        { val: 'Moderate', icon: <Snowflake size={24} />, label: 'Moderate', sub: '~50%' },
        { val: 'Heavy', icon: <ThermometerSnowflake size={24} />, label: 'Heavy', sub: '100%' },
    ];
    const maintOptions = [
        { val: 'good', icon: <CheckCircle2 size={24} />, label: 'Good', sub: 'Regular service' },
        { val: 'average', icon: <Wrench size={24} />, label: 'Average', sub: 'Normal wear' },
        { val: 'poor', icon: <Cloud size={24} />, label: 'Poor', sub: 'Visible smoke' },
    ];
    const loadOptions = [
        { val: 1, icon: <User size={24} />, label: 'Light', sub: '1-2 people' },
        { val: 1.5, icon: <Users size={24} />, label: 'Moderate', sub: 'Family load' },
        { val: 2, icon: <Box size={24} />, label: 'Heavy', sub: 'Full capacity' },
    ];

    const emCat = extractedVehicle ? getEmissionCategory(extractedVehicle.fType, extractedVehicle.eStd) : null;
    const fuelCostEst = extractedVehicle?.fuelEfficiencyKmpl && inputs.fType !== 'ev'
        ? Math.round((inputs.dTot / extractedVehicle.fuelEfficiencyKmpl) * 105)
        : null;

    const stepAnimClass = stepDir === 'right' ? '' : 'slide-left';

    return (
        <section className="tab-content active">
            <div className="tab-header">
                <h2 className="tab-title">Vehicle Emission Estimator</h2>
                <p className="tab-subtitle">Calculate your vehicle's daily footprint — CO₂, NOx, PM2.5, CO &amp; HC — using IPCC/COPERT methods</p>
            </div>

            {/* Step Progress */}
            <div className="step-progress">
                {[{ n: 1, icon: <Car size={20} />, label: 'Vehicle' }, 
                  { n: 2, icon: <Milestone size={20} />, label: 'Driving' }, 
                  { n: 3, icon: <Settings2 size={20} />, label: 'Condition' },
                  { n: 4, icon: <Wrench size={20} />, label: 'Service' }].map(({ n, icon, label }) => (
                    <div key={n} className={`step-indicator${step >= n ? ' active' : ''}${step > n ? ' done' : ''}`}>
                        <div className="step-circle">{step > n ? <Check size={20} /> : icon}</div>
                        <span className="step-label">{label}</span>
                        {n < 4 && <div className="step-line" />}
                    </div>
                ))}
            </div>

            <div className="glass-card form-card">
                <form onSubmit={handleCalculate}>
                    {/* ── STEP 1: Vehicle ── */}
                    {step === 1 && (
                        <div className={`form-step active ${stepAnimClass}`}>
                            {!extractedVehicle ? (
                                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <h3 style={{ marginBottom: '8px', fontSize: '1.6rem', fontWeight: 700 }}>What do you drive?</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '0.95rem' }}>
                                        Search by make, model &amp; year for accurate results
                                    </p>
                                    <div style={{
                                        position: 'relative', maxWidth: '600px', margin: '0 auto',
                                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                                        borderRadius: '14px', padding: '8px', display: 'flex', alignItems: 'center',
                                        transition: 'all 0.25s', boxShadow: '0 0 0 0 rgba(16,185,129,0)'
                                    }}
                                        onFocus={e => (e.currentTarget.style.boxShadow = '0 0 32px rgba(16,185,129,0.2)')}
                                        onBlur={e => (e.currentTarget.style.boxShadow = '0 0 0 0 rgba(16,185,129,0)')}
                                    >
                                        <Search size={20} color="var(--text-secondary)" style={{ margin: '0 12px', flexShrink: 0 }} />
                                        <input type="text" value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            placeholder="e.g. 2021 Maruti Swift Petrol or Ola S1 Pro"
                                            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.05rem', padding: '12px 0', outline: 'none' }}
                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(e); } }}
                                        />
                                        <button type="button" onClick={handleSearch}
                                            disabled={isSearching || !searchQuery.trim() || rateLimitCountdown !== null}
                                            style={{
                                                background: 'var(--accent-green)', color: '#000', border: 'none', padding: '12px 24px',
                                                borderRadius: '10px', fontWeight: 700, cursor: (isSearching || !searchQuery.trim() || rateLimitCountdown !== null) ? 'not-allowed' : 'pointer',
                                                opacity: (isSearching || !searchQuery.trim() || rateLimitCountdown !== null) ? 0.6 : 1, transition: 'all 0.2s', marginLeft: '8px',
                                                boxShadow: '0 4px 16px rgba(16,185,129,0.4)'
                                            }}>
                                            {isSearching ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.15)', borderTopColor: '#000', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                                                    Searching…
                                                </div>
                                            ) : 'Search'}
                                        </button>
                                    </div>
                                    {searchError && rateLimitCountdown === null && (
                                        <div style={{ color: 'var(--severity-critical)', marginTop: '16px', fontSize: '0.9rem' }}>{searchError}</div>
                                    )}
                                    {rateLimitCountdown !== null && (
                                        <div style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '10px', padding: '12px 20px', marginTop: '16px', color: 'var(--severity-high)', fontSize: '0.9rem', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.3s ease' }}>
                                            <RotateCcw size={20} className="spin-slow" />
                                            <p style={{ margin: 0 }}>Rate limit hit. Retry in <strong style={{ color: 'var(--text-primary)', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '6px' }}>{rateLimitCountdown}s</strong></p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ animation: 'fadeInUp 0.4s ease' }}>
                                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                        {/* Vehicle image */}
                                        {(extractedVehicle.imageUrl || extractedVehicle.imageKeyword) ? (
                                            <div style={{ maxWidth: '280px', height: '180px', margin: '0 auto 20px', borderRadius: '14px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
                                                <img src={extractedVehicle.imageUrl || `https://loremflickr.com/400/300/car,${encodeURIComponent(extractedVehicle.imageKeyword.replace(/ /g, ','))}`}
                                                    alt={extractedVehicle.name}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    onError={e => {
                                                        const t = e.target as HTMLImageElement;
                                                        if (extractedVehicle.imageUrl && t.src === extractedVehicle.imageUrl)
                                                            t.src = `https://loremflickr.com/400/300/car,${encodeURIComponent(extractedVehicle.imageKeyword.replace(/ /g, ','))}`;
                                                        else t.style.display = 'none';
                                                    }} />
                                            </div>
                                        ) : (
                                            <div style={{ width: '100px', height: '100px', margin: '0 auto 20px', background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Car size={48} color="var(--accent-green)" />
                                            </div>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                            <h2 style={{ fontSize: '1.7rem', fontWeight: 700, margin: 0 }}>{extractedVehicle.name}</h2>
                                        </div>
                                        {emCat && (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                                                <span className={`emission-badge ${emCat.cls}`}>{emCat.icon} {emCat.label} Emission Class</span>
                                            </div>
                                        )}
                                        {fuelCostEst && (
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <span className="fuel-cost-row"><Fuel size={14} /> ~₹{fuelCostEst} fuel/day at {inputs.dTot} km</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Spec badges */}
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                                        {[
                                            extractedVehicle.vType === '2wheeler' ? '2-Wheeler' : extractedVehicle.vType.toUpperCase(),
                                            extractedVehicle.fType === 'ev' ? 'Electric' : extractedVehicle.fType.toUpperCase(),
                                            extractedVehicle.eStd.replace('bs', 'BS-').toUpperCase(),
                                            `${extractedVehicle.eSize} Engine`,
                                            extractedVehicle.variant && `Variant: ${extractedVehicle.variant}`,
                                            extractedVehicle.transmission,
                                            extractedVehicle.engineCC && `${extractedVehicle.engineCC}cc${extractedVehicle.turbocharged ? ' Turbo' : ''}`,
                                            extractedVehicle.fuelEfficiencyKmpl && `${extractedVehicle.fuelEfficiencyKmpl} km/l`,
                                        ].filter(Boolean).map((b, i) => (
                                            <span key={i} className="spec-badge-dark">{b as string}</span>
                                        ))}
                                    </div>

                                    {/* Confidence + confirm */}
                                    {!isEditingSpecs ? (
                                        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${extractedVehicle.confidence < 75 ? 'rgba(249,115,22,0.4)' : 'var(--glass-border)'}`, borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Search size={18} /> Confirm Your Vehicle</h4>
                                                <div style={{ position: 'relative', width: 72, height: 72 }}>
                                                    <ConfidenceRing pct={extractedVehicle.confidence} />
                                                </div>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', marginBottom: '4px' }}>
                                                {[
                                                    ['Engine', extractedVehicle.engineCC ? `${extractedVehicle.engineCC} cc` : 'N/A'],
                                                    ['Fuel', extractedVehicle.fType.toUpperCase()],
                                                    ['Class', extractedVehicle.vType.toUpperCase()],
                                                    ['Standard', extractedVehicle.eStd.toUpperCase().replace('BS', 'BS-')],
                                                ].map(([k, v]) => (
                                                    <div key={k} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px' }}>
                                                        <strong style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</strong>
                                                        <div style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>{v}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            {extractedVehicle.confidence < 75 && (
                                                <div style={{ marginTop: '14px', color: 'var(--severity-high)', fontSize: '0.85rem', display: 'flex', gap: '8px', background: 'rgba(249,115,22,0.08)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(249,115,22,0.2)' }}>
                                                    ⚠️ Some details were estimated. Try adding year &amp; fuel type for better accuracy.
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '20px', borderRadius: '14px', marginBottom: '20px', animation: 'fadeInUp 0.3s ease' }}>
                                            <h4 style={{ marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Manual Correction</h4>
                                            <div className="form-row" style={{ marginBottom: '12px' }}>
                                                <div className="form-group">
                                                    <label>Vehicle Type</label>
                                                    <select value={inputs.vType} onChange={e => updateInput('vType', e.target.value)}>
                                                        <option value="2wheeler">2-Wheeler</option>
                                                        <option value="car">Car</option>
                                                        <option value="suv">SUV / MUV</option>
                                                        <option value="bus">Bus</option>
                                                        <option value="truck">Truck</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Fuel Type</label>
                                                    <select value={inputs.fType} onChange={e => updateInput('fType', e.target.value)}>
                                                        <option value="petrol">Petrol</option>
                                                        <option value="diesel">Diesel</option>
                                                        <option value="cng">CNG/LPG</option>
                                                        <option value="hybrid">Hybrid</option>
                                                        <option value="ev">Electric (EV)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-row" style={{ marginBottom: '16px' }}>
                                                <div className="form-group">
                                                    <label>Emission Standard</label>
                                                    <select value={inputs.eStd} onChange={e => updateInput('eStd', e.target.value)}>
                                                        <option value="bs2">BS-II</option>
                                                        <option value="bs3">BS-III</option>
                                                        <option value="bs4">BS-IV</option>
                                                        <option value="bs6">BS-VI</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Engine Size</label>
                                                    <select value={inputs.eSize} onChange={e => updateInput('eSize', e.target.value)}>
                                                        <option value="small">Small (&lt;1.2L)</option>
                                                        <option value="medium">Medium (1.2–2.0L)</option>
                                                        <option value="large">Large (&gt;2.0L)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                                <button type="button" className="action-btn btn-secondary" onClick={() => setIsEditingSpecs(false)} style={{ width: 'auto', padding: '10px 20px' }}>Cancel</button>
                                                <button type="button" className="action-btn" onClick={() => goStep(2)} style={{ width: 'auto', padding: '10px 20px' }}>Confirm Fix &amp; Continue</button>
                                            </div>
                                        </div>
                                    )}

                                    {!isEditingSpecs && (
                                        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                            <button type="button" className="action-btn btn-secondary" onClick={() => setIsEditingSpecs(true)} style={{ flex: '1 1 180px', maxWidth: '220px' }}>
                                                ✏️ No, fix it
                                            </button>
                                            <button type="button" className="action-btn" onClick={() => goStep(2)} style={{ flex: '1 1 180px', maxWidth: '260px' }}>
                                                ✅ Confirm &amp; Continue →
                                            </button>
                                        </div>
                                    )}

                                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                        <button type="button" onClick={() => { setExtractedVehicle(null); setSearchQuery(''); setSearchError(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline' }}>
                                            Search again
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── STEP 2: Driving ── */}
                    {step === 2 && (
                        <div className={`form-step active ${stepAnimClass}`}>
                            {/* Distance */}
                            <div className="distance-card">
                                <div className="distance-icon"><Milestone size={32} /></div>
                                <div className="distance-value-display">{inputs.dTot}</div>
                                <div className="distance-unit">km per day</div>
                                <input type="number" className="distance-input-hidden" min="1" max="1000"
                                    value={inputs.dTot} onChange={e => updateInput('dTot', parseFloat(e.target.value) || 0)}
                                    placeholder="Enter distance in km" />
                            </div>

                            {/* City/Highway Slider */}
                            <div className="slider-group">
                                <div className="slider-header">
                                    <span className="section-label" style={{ margin: 0 }}>City vs Highway Split</span>
                                    <span className="slider-value">{inputs.cityPct}% City / {100 - inputs.cityPct}% Hwy</span>
                                </div>
                                <div className="slider-ends">
                                    <span className="slider-end-label" title="100% Highway"><MapPin size={18} /></span>
                                    <input type="range" className="range-slider" min="0" max="100" value={inputs.cityPct}
                                        onChange={e => updateInput('cityPct', parseInt(e.target.value))}
                                        style={{ background: `linear-gradient(to right, var(--accent-green) ${inputs.cityPct}%, rgba(255,255,255,0.1) ${inputs.cityPct}%)` }} />
                                    <span className="slider-end-label" title="100% City"><Globe size={18} /></span>
                                </div>
                            </div>

                            {/* Traffic */}
                            <div style={{ marginBottom: 'var(--sp-md)' }}>
                                <div className="section-label">Traffic Intensity</div>
                                <IconCardGroup options={trafficOptions} value={inputs.trafficIntensity || 'Medium'} onChange={v => updateInput('trafficIntensity', v as string)} />
                            </div>

                            {/* AC */}
                            <div>
                                <div className="section-label">AC Usage</div>
                                <IconCardGroup options={acOptions} value={inputs.acUsage || 'Moderate'} onChange={v => updateInput('acUsage', v as string)} />
                            </div>

                            {/* Live preview */}
                            {livePreview !== null && (
                                <div className="live-preview">
                                    <div className="live-preview-dot" />
                                    <span>Estimated ~<strong>{livePreview.toFixed(1)} kg CO₂</strong> today — updating live</span>
                                </div>
                            )}

                            <div className="btn-row" style={{ marginTop: '20px' }}>
                                <button type="button" className="action-btn btn-secondary" onClick={() => goStep(1)}>← Back</button>
                                <button type="button" className="action-btn" onClick={() => goStep(3)}>Next: Condition →</button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3: Condition ── */}
                    {step === 3 && (
                        <div className={`form-step active ${stepAnimClass}`}>
                            <div style={{ marginBottom: 'var(--sp-md)' }}>
                                <div className="section-label">Maintenance Level</div>
                                <IconCardGroup options={maintOptions} value={inputs.maint} onChange={v => updateInput('maint', v as string)} />
                            </div>

                            <div style={{ marginBottom: '8px' }}>
                                <div className="section-label">Passenger / Cargo Load</div>
                                <IconCardGroup options={loadOptions} value={inputs.loadFactor || 1} onChange={v => updateInput('loadFactor', v as number)} />
                                <div className="tooltip-hint">💡 More passengers or cargo = more fuel burned = higher emissions</div>
                            </div>

                            <div style={{ marginBottom: 'var(--sp-md)', marginTop: 'var(--sp-md)' }}>
                                <div className="section-label">Vehicle Age</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap:'12px', background:'rgba(255,255,255,0.04)', border:'1px solid var(--glass-border)', borderRadius:'12px', padding:'12px 16px' }}>
                                    <Calendar size={20} color="var(--text-muted)" />
                                    <input type="number" min="0" max="30" value={inputs.age} onChange={e => updateInput('age', parseInt(e.target.value))}
                                        style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize:'1.2rem', fontWeight:700, outline:'none', fontFamily:'Outfit,sans-serif' }} />
                                    <span style={{ color:'var(--text-muted)', fontSize:'0.9rem' }}>years old</span>
                                </div>
                            </div>

                            {/* Live preview */}
                            {livePreview !== null && (
                                <div className="live-preview">
                                    <div className="live-preview-dot" />
                                    <span>Estimated ~<strong>{livePreview.toFixed(1)} kg CO₂</strong> today — updating live</span>
                                </div>
                            )}

                            <div className="btn-row" style={{ marginTop: '20px' }}>
                                <button type="button" className="action-btn btn-secondary" onClick={() => goStep(2)}>← Back</button>
                                <button type="button" className="action-btn" onClick={() => goStep(4)}>
                                    Next: Service &amp; Health →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 4: Service & Health ── */}
                    {step === 4 && (() => {
                        const dService = daysSince(inputs.lastServiceDate);
                        const dOil = daysSince(inputs.lastOilChangeDate);
                        const dAirFilter = daysSince(inputs.lastAirFilterDate);
                        const dPUC = daysSince(inputs.lastPucDate);

                        const SERVICE_THRESHOLD = 180;
                        const OIL_THRESHOLD = 120;
                        const AIRFILTER_THRESHOLD = 270;
                        const PUC_THRESHOLD = 180;

                        const serviceItems = [
                            {
                                label: 'Last Servicing', icon: <Wrench size={18} color="var(--accent-green)" />, key: 'lastServiceDate' as keyof CalculationInput,
                                days: dService, threshold: SERVICE_THRESHOLD, statusClass: overdueClass(dService, SERVICE_THRESHOLD),
                                penalties: [
                                    dService && dService > SERVICE_THRESHOLD ? `+${Math.min(Math.round((dService - SERVICE_THRESHOLD) / 30 * 4), 40)}% CO` : '',
                                    dService && dService > SERVICE_THRESHOLD ? `+${Math.min(Math.round((dService - SERVICE_THRESHOLD) / 30 * 2), 30)}% HC` : '',
                                ].filter(Boolean),
                            },
                            {
                                label: 'Last Oil Change', icon: <Droplets size={18} color="#60A5FA" />, key: 'lastOilChangeDate' as keyof CalculationInput,
                                days: dOil, threshold: OIL_THRESHOLD, statusClass: overdueClass(dOil, OIL_THRESHOLD),
                                penalties: [
                                    dOil && dOil > OIL_THRESHOLD ? `+${Math.min(Math.round((dOil - OIL_THRESHOLD) / 30 * 5), 30)}% CO` : '',
                                    dOil && dOil > OIL_THRESHOLD ? `+${Math.min(Math.round((dOil - OIL_THRESHOLD) / 30 * 2), 10)}% CO₂` : '',
                                ].filter(Boolean),
                            },
                            {
                                label: 'Last Air Filter', icon: <Wind size={18} color="#A78BFA" />, key: 'lastAirFilterDate' as keyof CalculationInput,
                                days: dAirFilter, threshold: AIRFILTER_THRESHOLD, statusClass: overdueClass(dAirFilter, AIRFILTER_THRESHOLD),
                                penalties: [
                                    dAirFilter && dAirFilter > AIRFILTER_THRESHOLD ? `+${Math.min(Math.round((dAirFilter - AIRFILTER_THRESHOLD) / 90 * 3), 15)}% CO₂` : '',
                                    dAirFilter && dAirFilter > AIRFILTER_THRESHOLD ? `+${Math.min(Math.round((dAirFilter - AIRFILTER_THRESHOLD) / 90 * 2), 8)}% PM2.5` : '',
                                ].filter(Boolean),
                            },
                            {
                                label: 'Last PUC Check', icon: <ShieldCheck size={18} color="#10B981" />, key: 'lastPucDate' as keyof CalculationInput,
                                days: dPUC, threshold: PUC_THRESHOLD, statusClass: overdueClass(dPUC, PUC_THRESHOLD),
                                penalties: [
                                    dPUC && dPUC > PUC_THRESHOLD + 90 ? '+20% CO' : '',
                                    dPUC && dPUC > PUC_THRESHOLD + 90 ? '+15% HC' : '',
                                ].filter(Boolean),
                            },
                        ];

                        const mileageDrop = inputs.originalKmpl && inputs.currentKmpl && inputs.originalKmpl > 0 && inputs.currentKmpl > 0 && inputs.currentKmpl < inputs.originalKmpl
                            ? (inputs.originalKmpl - inputs.currentKmpl) / inputs.originalKmpl
                            : 0;

                        return (
                            <div className={`form-step active ${stepAnimClass}`}>
                                <div style={{ marginBottom: 'var(--sp-md)' }}>
                                    <div className="section-label" style={{ marginBottom: '12px' }}>
                                        <Calendar size={18} /> Service History (Optional)
                                    </div>
                                    <div className="service-date-grid">
                                        {serviceItems.map(item => (
                                            <div key={item.key} className={`service-date-card ${item.statusClass}`}>
                                                <div className="service-date-card-header">
                                                    {item.icon}
                                                    <span className="service-date-label">{item.label}</span>
                                                    <span className={`status-dot dot-${item.statusClass}`} />
                                                </div>
                                                <input type="date" className="service-date-input"
                                                    value={inputs[item.key] as string} onChange={e => updateInput(item.key, e.target.value)}
                                                    max={new Date('2026-03-19').toISOString().split('T')[0]} />
                                                {item.days !== null && (
                                                    <div className="service-days-ago">
                                                        {item.days} days ago
                                                        {item.days <= item.threshold && (
                                                            <span style={{ color: 'var(--severity-low)', marginLeft: 6 }}>✓ {item.threshold - item.days}d rem</span>
                                                        )}
                                                    </div>
                                                )}
                                                <OverdueBadge days={item.days} threshold={item.threshold} penalties={item.penalties} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginBottom: 'var(--sp-md)', marginTop: 'var(--sp-lg)' }}>
                                    <div className="section-label"><Wrench size={16} /> Engine Condition</div>
                                    <IconCardGroup cols={3} value={inputs.engineCondition || 'good'} onChange={v => updateInput('engineCondition', v as string)} options={[
                                        { val: 'good', icon: <CheckCircle2 size={24} />, label: 'Good', sub: 'Smooth' },
                                        { val: 'average', icon: <AlertTriangle size={24} />, label: 'Average', sub: 'Minor issues' },
                                        { val: 'poor', icon: <AlertOctagon size={24} />, label: 'Poor', sub: 'Visible wear' },
                                    ]} />
                                </div>

                                <div style={{ marginBottom: 'var(--sp-md)' }}>
                                    <div className="section-label"><Flame size={16} /> Exhaust Smoke</div>
                                    <IconCardGroup cols={3} value={inputs.smokeLevel || 'none'} onChange={v => updateInput('smokeLevel', v as string)} options={[
                                        { val: 'none', icon: <CheckCircle2 size={24} />, label: 'None', sub: 'Clean' },
                                        { val: 'low', icon: <Wind size={24} />, label: 'Low', sub: 'Light smoke' },
                                        { val: 'high', icon: <Flame size={24} />, label: 'High', sub: 'Visible black' },
                                    ]} />
                                </div>

                                <div style={{ marginBottom: 'var(--sp-md)' }}>
                                    <div className="section-label"><Gauge size={16} /> Mileage Efficiency Drop</div>
                                    <div className="mileage-drop-row">
                                        <div className="mileage-input-box">
                                            <label>Earlier (km/l)</label>
                                            <input type="number" min="0" max="80" step="0.5" value={inputs.originalKmpl || ''} onChange={e => updateInput('originalKmpl', parseFloat(e.target.value))} placeholder="e.g. 20" className="mileage-input" />
                                        </div>
                                        <div className="mileage-arrow">
                                            <TrendingDown size={24} color={mileageDrop > 0.15 ? 'var(--severity-critical)' : mileageDrop > 0.05 ? 'var(--severity-moderate)' : 'var(--text-muted)'} />
                                            {mileageDrop > 0 && (
                                                <span className="mileage-drop-pct" style={{ color: mileageDrop > 0.15 ? 'var(--severity-critical)' : mileageDrop > 0.05 ? 'var(--severity-moderate)' : 'var(--text-muted)' }}>
                                                    −{Math.round(mileageDrop * 100)}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="mileage-input-box">
                                            <label>Now (km/l)</label>
                                            <input type="number" min="0" max="80" step="0.5" value={inputs.currentKmpl || ''} onChange={e => updateInput('currentKmpl', parseFloat(e.target.value))} placeholder="e.g. 16" className="mileage-input" />
                                        </div>
                                    </div>
                                </div>

                                <div className="btn-row" style={{ marginTop: '24px' }}>
                                    <button type="button" className="action-btn btn-secondary" onClick={() => goStep(3)}>← Back</button>
                                    <button type="submit" className="action-btn" disabled={isSearching}>
                                        <Zap size={18} />
                                        Calculate Emissions
                                    </button>
                                </div>
                            </div>
                        );
                    })()}
                </form>
            </div>

            {/* ── RESULTS DASHBOARD ── */}
            {results && (() => {
                const rating = getRating(results);
                const maxVals = { CO2: 20, NOx: 50, PM25: 5, CO: 200, HC: 50 };
                const c_pct = results.total.CO2 === 0 ? 50 : (results.d_city / inputs.dTot) * 100;
                const h_pct = results.total.CO2 === 0 ? 50 : (results.d_hwy / inputs.dTot) * 100;
                const nat_avg = { CO2: 4.5, PM25: 0.8 };
                const co2_diff = ((results.total.CO2 - nat_avg.CO2) / nat_avg.CO2) * 100;
                const co2_color = co2_diff <= 0 ? 'var(--accent-green)' : 'var(--severity-critical)';
                const ev_ref = 0.5;
                const city_co2_kg = inputs.fType === 'ev'
                    ? (results.total.CO2 * (c_pct / 100)).toFixed(1)
                    : ((results.adjEF.city.CO2 * results.d_city) / 1000).toFixed(1);
                const hwy_co2_kg = inputs.fType === 'ev'
                    ? (results.total.CO2 * (h_pct / 100)).toFixed(1)
                    : ((results.adjEF.hwy.CO2 * results.d_hwy) / 1000).toFixed(1);
                const phones = Math.round(results.total.CO2 * 117);
                const evKm = Math.round(results.total.CO2 / 0.196);
                const trees = (results.total.CO2 * 365 / 21.7).toFixed(1);

                // Calculate Maintenance Score for the dashboard
                function serviceScore(days: number | null, threshold: number): number {
                    if (days === null) return 7;
                    const overdue = days - threshold;
                    if (overdue <= 0) return 10;
                    if (overdue <= 90) return 6;
                    if (overdue <= 180) return 3;
                    return 0;
                }
                const dService = daysSince(inputs.lastServiceDate);
                const dOil = daysSince(inputs.lastOilChangeDate);
                const dAirFilter = daysSince(inputs.lastAirFilterDate);
                const dPUC = daysSince(inputs.lastPucDate);
                
                const svcScore = serviceScore(dService, 180) + serviceScore(dOil, 120) + serviceScore(dAirFilter, 270) + serviceScore(dPUC, 180);
                const engineScore = inputs.engineCondition === 'good' ? 20 : inputs.engineCondition === 'average' ? 12 : 0;
                
                const mileageDrop = inputs.originalKmpl && inputs.currentKmpl && inputs.originalKmpl > 0 && inputs.currentKmpl > 0 && inputs.currentKmpl < inputs.originalKmpl ? (inputs.originalKmpl - inputs.currentKmpl) / inputs.originalKmpl : 0;
                const milageDrop_pct = mileageDrop * 100;
                const mileageScore = milageDrop_pct <= 5 ? 15 : milageDrop_pct <= 15 ? 9 : milageDrop_pct <= 30 ? 4 : 0;
                const mileageScoreFinal = (!inputs.originalKmpl || !inputs.currentKmpl) ? 10 : mileageScore;
                
                const smokeScore = inputs.smokeLevel === 'none' ? 15 : inputs.smokeLevel === 'low' ? 8 : 0;
                const noiseScore = inputs.engineNoise === 'normal' ? 10 : 5;
                const totalMaintScore = Math.min(100, svcScore + engineScore + mileageScoreFinal + smokeScore + noiseScore);

                // Service Impact %
                const sM = results.serviceMultipliers || { co_mult: 1, hc_mult: 1, co2_mult: 1, nox_mult: 1, pm25_mult: 1 };
                const overages = [
                    { name: 'CO₂', extra: Math.round((sM.co2_mult - 1) * 100) },
                    { name: 'PM2.5', extra: Math.round((sM.pm25_mult - 1) * 100) },
                    { name: 'CO', extra: Math.round((sM.co_mult - 1) * 100) },
                    { name: 'NOx', extra: Math.round((sM.nox_mult - 1) * 100) }
                ].filter(p => p.extra > 0);

                return (
                    <div id="resultsDashboard" className="results-dashboard" style={{ animation: 'fadeInUp 0.6s ease' }}>

                        {/* Hero Impact Card */}
                        <div className={`hero-impact-card ${rating.class}`}>
                            <div className="hero-eyebrow">🌍 Your Impact Today</div>
                            <div className="hero-co2-number">{results.total.CO2.toFixed(1)}</div>
                            <div className="hero-co2-unit">kg CO₂ emitted today</div>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                                <span className={`hero-rating-badge ${rating.class}`}>{rating.icon} {rating.label}</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>{rating.desc}</p>
                            <div className="equivalence-rows">
                                {phones > 0 && <div className="equivalence-row"><Smartphone size={14} /> = <strong>{phones.toLocaleString()}</strong> smartphone charges</div>}
                                {results.total.CO2 > 0.2 && <div className="equivalence-row"><Zap size={14} /> = <strong>{evKm} km</strong> you could travel in an EV on the same energy</div>}
                                <div className="equivalence-row"><Trees size={14} /> = <strong>{trees} trees</strong> needed to offset your yearly emissions</div>
                            </div>
                        </div>

                        {/* Vehicle name */}
                        {extractedVehicle && (
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Results for</p>
                                <h3 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.4rem', fontWeight: 700 }}>{extractedVehicle.name}</h3>
                            </div>
                        )}

                        {/* Pollutant Cards */}
                        <div className="pollutant-cards">
                            {[
                                { key: 'co2', name: 'CO₂ (Carbon Dioxide)', val: results.total.CO2, unit: 'kg/day', max: maxVals.CO2 },
                                { key: 'nox', name: 'NOx (Nitrogen Oxides)', val: results.total.NOx, unit: 'g/day', max: maxVals.NOx },
                                { key: 'pm25', name: 'PM2.5 (Fine Particles)', val: results.total.PM25, unit: 'g/day', max: maxVals.PM25 },
                                { key: 'co', name: 'CO (Carbon Monoxide)', val: results.total.CO, unit: 'g/day', max: maxVals.CO },
                                { key: 'hc', name: 'HC (Hydrocarbons)', val: results.total.HC, unit: 'g/day', max: maxVals.HC },
                            ].map(p => (
                                <div key={p.key} className={`pollutant-card ${p.key}`}>
                                    <div className="pollutant-name">{p.name}</div>
                                    <div className="pollutant-value">{p.val.toFixed(1)}</div>
                                    <div className="pollutant-unit">{p.unit}</div>
                                    <div className="pollutant-bar">
                                        <div className="pollutant-bar-fill" style={{ width: `${Math.min((p.val / p.max) * 100, 100)}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Breakdown */}
                        <div className="breakdown-section">
                            <div className="breakdown-card">
                                <div className="breakdown-title">🔧 Maintenance Health</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <ScoreGauge score={totalMaintScore} />
                                    <div style={{ flex: 1 }}>
                                        {overages.length > 0 ? (
                                            <>
                                                <p style={{ fontSize: '0.85rem', color: 'var(--severity-critical)', marginBottom: '8px', lineHeight: 1.4 }}>
                                                    <strong>High Penalty:</strong> Poor maintenance is directly increasing your emissions.
                                                </p>
                                                {overages.map(o => (
                                                    <div key={o.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.8rem' }}>
                                                        <span style={{ color: 'var(--text-secondary)' }}>{o.name} Excess</span>
                                                        <span style={{ color: 'var(--severity-high)', fontWeight: 700 }}>+{o.extra}%</span>
                                                    </div>
                                                ))}
                                                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    Based on CPCB &amp; SIAM India servicing data.
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ padding: '0 8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '6px' }}>
                                                    <CheckCircle2 size={16} /> Well Maintained
                                                </div>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                                    Your vehicle is running optimally. Keep up the regular service intervals to prevent emission penalties!
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="breakdown-card">
                                <div className="breakdown-title">📊 PM2.5 Source Breakdown</div>
                                {(() => {
                                    const ex = results.e_hot.PM25 + results.e_cold.PM25;
                                    const tyre = results.e_non_exhaust.tyrePM25 || 0;
                                    const brake = results.e_non_exhaust.brakePM25 || 0;
                                    const tot = ex + tyre + brake || 1;
                                    return (
                                        <>
                                            <div className="stacked-bar">
                                                <div className="bar-segment" style={{ width: `${(ex / tot) * 100}%`, background: 'var(--severity-critical)' }} />
                                                <div className="bar-segment" style={{ width: `${(tyre / tot) * 100}%`, background: '#3B82F6' }} />
                                                <div className="bar-segment" style={{ width: `${(brake / tot) * 100}%`, background: '#06B6D4' }} />
                                            </div>
                                            {[['var(--severity-critical)', 'Tailpipe Exhaust', ex.toFixed(2)], ['#3B82F6', 'Tyre Wear', tyre.toFixed(2)], ['#06B6D4', 'Brake Wear', brake.toFixed(2)]].map(([color, label, val]) => (
                                                <div className="breakdown-item" key={label as string}>
                                                    <span className="breakdown-label"><span className="breakdown-dot" style={{ background: color as string }} /> {label}</span>
                                                    <span className="breakdown-val">{val} g</span>
                                                </div>
                                            ))}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Comparison */}
                        <div className="comparison-section" style={{ background: co2_diff > 0 ? 'rgba(239,68,68,0.05)' : 'rgba(16,185,129,0.05)', border: `1px solid ${co2_diff > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}` }}>
                            <div className="comparison-title" style={{ color: co2_diff > 0 ? 'var(--severity-critical)' : 'var(--accent-green)' }}>
                                {co2_diff > 0 ? '⚠️ Above National Average' : '✅ Below National Average'} — CO₂ Comparison
                            </div>
                            {[
                                { label: 'You (Today)', val: results.total.CO2, max: 10, color: co2_color, display: `${results.total.CO2.toFixed(1)} kg` },
                                { label: "Nat'l Avg", val: nat_avg.CO2, max: 10, color: 'rgba(255,255,255,0.3)', display: `${nat_avg.CO2} kg` },
                                { label: '⚡ EV Ref.', val: ev_ref, max: 10, color: '#3B82F6', display: `${ev_ref} kg` },
                            ].map(row => (
                                <div className="comparison-row" key={row.label}>
                                    <div className="comparison-label">{row.label}</div>
                                    <div className="comparison-bar-track">
                                        <div className="comparison-bar-fill" style={{ width: `${Math.min(row.val * 10, 100)}%`, background: row.color }} />
                                    </div>
                                    <div className="comparison-value" style={{ color: row.color }}>{row.display}</div>
                                </div>
                            ))}
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', textAlign: 'right' }}>
                                Your emissions are <strong style={{ color: co2_color }}>{Math.abs(co2_diff).toFixed(0)}% {co2_diff > 0 ? 'higher' : 'lower'}</strong> than average.
                            </p>
                        </div>

                        {/* Recommendations */}
                        <div className="eco-tips">
                            <div className="eco-tips-title"><Info size={18} /> AI Personalized Recommendations</div>
                            {isLoadingRecommendations ? (
                                <>
                                    <div className="skeleton skeleton-tip" style={{ marginBottom: '10px' }} />
                                    <div className="skeleton skeleton-tip" style={{ marginBottom: '10px' }} />
                                    <div className="skeleton skeleton-tip" />
                                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '12px' }}>Analyzing your driving patterns…</p>
                                </>
                            ) : recommendations && recommendations.length > 0 ? (
                                <div style={{ animation: 'fadeIn 0.5s ease' }}>
                                    {recommendations.map((rec, i) => {
                                        const impacts = ['–12% CO₂', '–8% NOx', '–15% PM2.5'];
                                        const savings = ['~0.5 kg/day', '~0.3 kg/day', '~0.7 kg/day'];
                                        return (
                                            <div key={i} className="eco-tip">
                                                <span className="eco-tip-icon">{[<Milestone size={18} />, <Wrench size={18} />, <Globe size={18} />][i] || <Info size={18} />}</span>
                                                <div className="eco-tip-content">
                                                    <div className="eco-tip-title">{rec.title}</div>
                                                    <div className="eco-tip-desc">{rec.description}</div>
                                                    <div className="eco-tip-badges">
                                                        <span className="impact-badge">↓ {impacts[i] || '–10% CO₂'}</span>
                                                        <span className="impact-badge" style={{ background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.3)' }}>Save {savings[i] || '~0.4 kg/day'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div>
                                    {inputs.fType !== 'ev' && (inputs.dTot / 2.0 < 10) && (
                                        <div className="eco-tip">
                                            <span className="eco-tip-icon"><Footprints size={18} /></span>
                                            <div className="eco-tip-content">
                                                <div className="eco-tip-title">Walk or cycle for short trips</div>
                                                <div className="eco-tip-desc">Cold engine burns 40-60% more fuel in the first 3 km. Short trips are the least efficient.</div>
                                                <div className="eco-tip-badges"><span className="impact-badge">↓ –40% cold-start CO₂</span></div>
                                            </div>
                                        </div>
                                    )}
                                    {inputs.fType !== 'ev' && inputs.age > 10 && (
                                        <div className="eco-tip">
                                            <span className="eco-tip-icon"><Wrench size={18} /></span>
                                            <div className="eco-tip-content">
                                                <div className="eco-tip-title">Engine tune-up &amp; filter change</div>
                                                <div className="eco-tip-desc">Older engines add ~30% more emissions. A service can drastically reduce PM and CO.</div>
                                                <div className="eco-tip-badges"><span className="impact-badge">↓ –30% PM2.5</span></div>
                                            </div>
                                        </div>
                                    )}
                                    {inputs.fType !== 'ev' && (inputs.eStd === 'bs2' || inputs.eStd === 'bs3') && (
                                        <div className="eco-tip">
                                            <span className="eco-tip-icon"><RotateCcw size={18} /></span>
                                            <div className="eco-tip-content">
                                                <div className="eco-tip-title">Consider upgrading to BS-VI or EV</div>
                                                <div className="eco-tip-desc">BS2/BS3 engines lack modern catalysts. BS-VI is 80-90% cleaner on NOx and PM.</div>
                                                <div className="eco-tip-badges"><span className="impact-badge">↓ –80% NOx</span></div>
                                            </div>
                                        </div>
                                    )}
                                    {inputs.fType === 'ev' && (
                                        <div className="eco-tip">
                                            <span className="eco-tip-icon"><Zap size={18} /></span>
                                            <div className="eco-tip-content">
                                                <div className="eco-tip-title">Use regenerative braking</div>
                                                <div className="eco-tip-desc">Minimize hard stops to reduce tyre and brake wear PM2.5, and recover energy efficiently.</div>
                                                <div className="eco-tip-badges"><span className="impact-badge">↓ –10% PM2.5</span></div>
                                            </div>
                                        </div>
                                    )}
                                    {inputs.cityPct > 70 && (
                                        <div className="eco-tip">
                                            <span className="eco-tip-icon"><AlertTriangle size={18} /></span>
                                            <div className="eco-tip-content">
                                                <div className="eco-tip-title">Combine trips to avoid cold starts</div>
                                                <div className="eco-tip-desc">High city driving with many cold starts heavily inflates emissions. Batch your errands.</div>
                                                <div className="eco-tip-badges"><span className="impact-badge">↓ –15% CO₂</span></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Transparency */}
                        <div className="transparency-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowTransparency(!showTransparency)}>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Settings2 size={18} /> How we calculated this
                                </h3>
                                <span style={{ color: 'var(--text-muted)' }}>{showTransparency ? '▲' : '▼'}</span>
                            </div>
                            {showTransparency && (
                                <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, animation: 'fadeIn 0.3s ease' }}>
                                    <p style={{ marginBottom: '12px' }}>Powered by IPCC, COPERT and EMEP/EEA models calibrated for Indian driving conditions (BS standards, CEA grid factors).</p>
                                    {[
                                        ['1. Base Emission Factors (Hot)', `Based on ${inputs.eStd.toUpperCase()} ${inputs.fType} — City: ${results.adjEF?.city?.CO2?.toFixed(1) || 0} g/km | Hwy: ${results.adjEF?.hwy?.CO2?.toFixed(1) || 0} g/km`],
                                        ['2. Cold-Start Phase (COPERT)', `First 1.5 km per trip: CO ×6, HC ×5, PM ×2.5–3. Cold distance today: ${results.d_cold_total?.toFixed(1) || 0} km`],
                                        ['3. Real Driving Penalties', `Traffic (${inputs.trafficIntensity}): NOx +40%, CO +50%. AC (${inputs.acUsage}): +5–15% CO₂. Load: +10–15% per step.`],
                                        ['4. Non-Exhaust (EMEP/EEA)', `Tyre: ${results.e_non_exhaust?.tyrePM25?.toFixed(2) || 0} g PM2.5 | Brake: ${results.e_non_exhaust?.brakePM25?.toFixed(2) || 0} g PM2.5`],
                                    ].map(([title, body]) => (
                                        <div key={title} style={{ marginTop: '14px' }}>
                                            <h4 style={{ color: 'var(--text-primary)', marginBottom: '6px', fontSize: '0.9rem' }}>{title}</h4>
                                            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--glass-border)', fontSize: '0.85rem' }}>{body}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* History */}
                        <div className="history-section" style={{ marginTop: '24px' }}>
                            <div className="history-title"><RotateCcw size={18} /> Calculation History</div>
                            <ul className="history-list">
                                {history.length === 0 ? (
                                    <li className="history-empty">No previous calculations</li>
                                ) : history.map((h, i) => (
                                    <li className="history-item" key={i}>
                                        <span className="history-vehicle">{h.veh}</span>
                                        <span className="history-co2">{h.co2} kg CO₂</span>
                                        <span className="history-date">{h.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            })()}
        </section>
    );
}
