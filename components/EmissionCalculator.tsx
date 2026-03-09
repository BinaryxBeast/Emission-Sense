/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { calculateEmissions, CalculationInput } from '../lib/calculation';
import { usePollution } from './PollutionContext';

export default function EmissionCalculator({ active }: { active: boolean }) {
    const { setPollutionLevel } = usePollution();
    const [step, setStep] = useState(1);
    const [inputs, setInputs] = useState<CalculationInput>({
        vType: 'car',
        fType: 'petrol',
        eStd: 'bs4',
        eSize: 'medium',
        dTot: 40,
        cityPct: 70,
        age: 5,
        maint: 'average',
        acUsage: 'Moderate',
        trafficIntensity: 'Medium',
        loadFactor: 1
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [isEditingSpecs, setIsEditingSpecs] = useState(false);
    const [extractedVehicle, setExtractedVehicle] = useState<{
        name: string, year: number | null, vType: any, fType: any, eStd: any, eSize: any, imageKeyword: string, imageUrl?: string, confidence: number,
        engineCC?: number, cylinders?: number, turbocharged?: boolean, fuelInjection?: string, transmission?: string, fuelEfficiencyKmpl?: number, kerbWeightKg?: number, variant?: string
    } | null>(null);

    const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null);
    const [showTransparency, setShowTransparency] = useState(false);

    const [results, setResults] = useState<Record<string, any> | null>(null);
    const [history, setHistory] = useState<Record<string, string>[]>([]);
    const [recommendations, setRecommendations] = useState<{ title: string, description: string }[] | null>(null);
    const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('emiHistory');
        if (saved) {
            setHistory(JSON.parse(saved));
        }
    }, []);

    if (!active) return null;

    const updateInput = (key: keyof CalculationInput, value: string | number) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    const handleSearch = async (e: React.FormEvent | React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchError('');
        setExtractedVehicle(null);
        setIsEditingSpecs(false);

        try {
            const res = await fetch('/api/extract-vehicle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                if (res.status === 429 && errorData?.errorType === 'rate_limit') {
                    setRateLimitCountdown(errorData.retryAfter || 60);

                    const interval = setInterval(() => {
                        setRateLimitCountdown((prev) => {
                            if (prev === null || prev <= 1) {
                                clearInterval(interval);
                                return null;
                            }
                            return prev - 1;
                        });
                    }, 1000);

                    throw new Error(errorData.error || 'Too many requests. Please wait.');
                }
                throw new Error(errorData?.error || 'Failed to find vehicle. Please try again.');
            }

            const data = await res.json();
            setExtractedVehicle(data);

            setInputs(prev => {
                const calculatedAge = data.year ? (new Date().getFullYear() - data.year) : prev.age;
                return {
                    ...prev,
                    vType: data.vType,
                    fType: data.fType,
                    eStd: data.eStd,
                    eSize: data.eSize,
                    age: calculatedAge >= 0 ? calculatedAge : 0,
                    engineCC: data.engineCC,
                    cylinders: data.cylinders,
                    turbocharged: data.turbocharged,
                    fuelInjection: data.fuelInjection,
                    transmission: data.transmission,
                    fuelEfficiencyKmpl: data.fuelEfficiencyKmpl,
                    kerbWeightKg: data.kerbWeightKg,
                    variant: data.variant
                };
            });
        } catch (err: any) {
            setSearchError(err.message || 'An error occurred while searching.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleCalculate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputs.dTot <= 0) return;

        const res = calculateEmissions(inputs);
        setResults(res);

        // Determine rating and broadcast to global pollution theme
        const rating = getRating(res);
        setPollutionLevel(rating.class as 'low' | 'moderate' | 'high' | 'critical');

        // Update History
        const vehName = `${inputs.vType.toUpperCase()} (${inputs.fType})`;
        const co2Val = res.total.CO2.toFixed(1);

        const newHist = [{ veh: vehName, co2: co2Val, date: new Date().toLocaleDateString() }, ...history].slice(0, 5);
        setHistory(newHist);
        localStorage.setItem('emiHistory', JSON.stringify(newHist));

        // Scroll to results automatically
        setTimeout(() => {
            document.getElementById('resultsDashboard')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

        // Fetch AI Recommendations
        if (extractedVehicle) {
            setIsLoadingRecommendations(true);
            setRecommendations(null);
            try {
                const recRes = await fetch('/api/generate-recommendations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: extractedVehicle.name,
                        fuel_type: inputs.fType,
                        emission_standard: inputs.eStd,
                        engine_size: inputs.eSize,
                        city_highway_split: inputs.cityPct,
                        ac_usage: inputs.acUsage,
                        vehicle_load: inputs.loadFactor
                    })
                });
                if (recRes.ok) {
                    const recData = await recRes.json();
                    setRecommendations(recData);
                }
            } catch (err) {
                console.error("Failed to fetch recommendations:", err);
            } finally {
                setIsLoadingRecommendations(false);
            }
        }
    };

    const getRating = (res: Record<string, any>) => {
        const score = (res.total.CO2 / 5) + (res.total.PM25 / 0.5);
        if (inputs.fType === 'ev') return { class: 'low', icon: '🌿', label: 'Zero Tailpipe Emissions', desc: 'Excellent! Your vehicle produces no tailpipe emissions. (CO₂ shown is from the Grid)' };
        if (score < 2) return { class: 'low', icon: '✅', label: 'Low Emission Vehicle', desc: 'Your vehicle produces below-average daily emissions.' };
        if (score < 4) return { class: 'moderate', icon: '⚠️', label: 'Moderate Emissions', desc: 'Consider reducing short trips or checking tire pressure.' };
        if (score < 7) return { class: 'high', icon: '🏭', label: 'High Emissions', desc: 'Your footprint is significant. Regular maintenance helps.' };
        return { class: 'critical', icon: '🚨', label: 'Critical Emissions', desc: 'Highly polluting profile. Consider public transit or an EV/BS-VI upgrade.' };
    };

    return (
        <section className="tab-content active">
            <div className="tab-header">
                <h2 className="tab-title">Vehicle Emission Estimator</h2>
                <p className="tab-subtitle">Calculate your vehicle&apos;s daily emission footprint — CO₂, NOx, PM2.5, CO & HC — using IPCC/COPERT methods</p>
            </div>

            <div className="step-progress">
                <div className={`step-indicator ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`} data-step="1">
                    <div className="step-circle">1</div>
                    <span className="step-label">Vehicle</span>
                    <div className="step-line"></div>
                </div>
                <div className={`step-indicator ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`} data-step="2">
                    <div className="step-circle">2</div>
                    <span className="step-label">Driving</span>
                    <div className="step-line"></div>
                </div>
                <div className={`step-indicator ${step >= 3 ? 'active' : ''}`} data-step="3">
                    <div className="step-circle">3</div>
                    <span className="step-label">Condition</span>
                </div>
            </div>

            <div className="glass-card form-card">
                <form onSubmit={handleCalculate}>
                    {step === 1 && (
                        <div className="form-step active">
                            {!extractedVehicle ? (
                                <div className="search-container" style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <h3 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: 600 }}>What do you drive?</h3>
                                    <div className="search-box" style={{
                                        position: 'relative',
                                        maxWidth: '600px',
                                        margin: '0 auto',
                                        background: 'var(--glass-bg)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        padding: '8px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" style={{ margin: '0 12px', flexShrink: 0 }}>
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="e.g., 2021 Maruti Swift Petrol or Ola S1 Pro"
                                            style={{
                                                flex: 1,
                                                background: 'transparent',
                                                border: 'none',
                                                color: 'var(--text-primary)',
                                                fontSize: '1.1rem',
                                                padding: '12px 0',
                                                outline: 'none',
                                                width: '100%'
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleSearch(e);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleSearch}
                                            disabled={isSearching || !searchQuery.trim() || rateLimitCountdown !== null}
                                            style={{
                                                background: 'var(--accent-green)',
                                                color: 'var(--bg-dark)',
                                                border: 'none',
                                                padding: '12px 24px',
                                                borderRadius: '8px',
                                                fontWeight: 600,
                                                cursor: (isSearching || !searchQuery.trim() || rateLimitCountdown !== null) ? 'not-allowed' : 'pointer',
                                                opacity: (isSearching || !searchQuery.trim() || rateLimitCountdown !== null) ? 0.7 : 1,
                                                transition: 'all 0.2s',
                                                marginLeft: '8px'
                                            }}
                                        >
                                            {isSearching ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span className="spinner" style={{
                                                        width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--text-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite'
                                                    }}></span>
                                                    Searching
                                                </div>
                                            ) : 'Search'}
                                        </button>
                                    </div>
                                    {searchError && rateLimitCountdown === null && (
                                        <div style={{ color: 'var(--severity-critical)', marginTop: '16px', fontSize: '0.9rem' }}>{searchError}</div>
                                    )}
                                    {rateLimitCountdown !== null && (
                                        <div style={{
                                            background: 'rgba(249, 115, 22, 0.1)',
                                            border: '1px solid rgba(249, 115, 22, 0.3)',
                                            borderRadius: '8px',
                                            padding: '12px 16px',
                                            marginTop: '16px',
                                            color: 'var(--severity-high)',
                                            fontSize: '0.9rem',
                                            textAlign: 'center',
                                            display: 'flex',
                                            gap: '12px',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            animation: 'fadeIn 0.3s ease'
                                        }}>
                                            <span style={{ fontSize: '1.2rem' }}>⏳</span>
                                            <p style={{ margin: 0, lineHeight: 1.4 }}>
                                                Free API Rate Limit Exceeded. Please wait <strong style={{ color: 'var(--text-primary)', fontSize: '1.05rem', background: 'var(--glass-border)', padding: '2px 6px', borderRadius: '4px' }}>{rateLimitCountdown}</strong> seconds to try again.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="vehicle-preview-card" style={{
                                    background: 'rgba(0, 0, 0, 0.02)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '16px',
                                    padding: '32px 24px',
                                    textAlign: 'center',
                                    animation: 'fadeInUp 0.4s ease'
                                }}>
                                    <h3 style={{ marginBottom: '24px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                        Vehicle Found
                                    </h3>

                                    {(extractedVehicle.imageUrl || extractedVehicle.imageKeyword) ? (
                                        <div style={{
                                            maxWidth: '300px',
                                            height: '200px',
                                            margin: '0 auto 24px',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: 'rgba(0,0,0,0.02)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                                        }}>
                                            <img
                                                src={extractedVehicle.imageUrl || `https://loremflickr.com/400/300/car,${encodeURIComponent(extractedVehicle.imageKeyword.replace(/ /g, ','))}`}
                                                alt={extractedVehicle.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    if (extractedVehicle.imageUrl && target.src === extractedVehicle.imageUrl) {
                                                        target.src = `https://loremflickr.com/400/300/car,${encodeURIComponent(extractedVehicle.imageKeyword.replace(/ /g, ','))}`;
                                                    } else {
                                                        target.style.display = 'none';
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{
                                            width: '120px',
                                            height: '120px',
                                            margin: '0 auto 24px',
                                            background: 'var(--glass-bg)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                                        }}>
                                            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M5 17h2m10 0h2M5 17a2 2 0 1 0 4 0M5 17a2 2 0 0 1 4 0m-4 0h4m6 0a2 2 0 1 0 4 0m-4 0a2 2 0 0 1 4 0m-4 0h4M3 11l1.5-5A2 2 0 0 1 6.4 4.5h11.2a2 2 0 0 1 1.9 1.5L21 11" />
                                                <path d="M3 11h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4z" />
                                            </svg>
                                        </div>
                                    )}

                                    <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', fontWeight: 600, letterSpacing: '-0.5px' }}>{extractedVehicle.name}</h2>

                                    {!isEditingSpecs ? (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                                                <span className="spec-badge" style={{ background: 'rgba(0,0,0,0.04)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.95rem', textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                                                    {extractedVehicle.vType === '2wheeler' ? '2-Wheeler' : extractedVehicle.vType.toUpperCase()}
                                                </span>
                                                <span className="spec-badge" style={{ background: 'rgba(0,0,0,0.04)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.95rem', textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                                                    {extractedVehicle.fType === 'ev' ? 'Electric' : extractedVehicle.fType.toUpperCase()}
                                                </span>
                                                <span className="spec-badge" style={{ background: 'rgba(0,0,0,0.04)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.95rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                                                    {extractedVehicle.eStd.replace('bs', 'BS-')}
                                                </span>
                                                <span className="spec-badge" style={{ background: 'rgba(0,0,0,0.04)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.95rem', textTransform: 'capitalize', color: 'var(--text-primary)' }}>
                                                    {extractedVehicle.eSize} Engine
                                                </span>
                                                {extractedVehicle.variant && (
                                                    <span className="spec-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-blue)' }}>
                                                        Variant: {extractedVehicle.variant}
                                                    </span>
                                                )}
                                                {extractedVehicle.transmission && (
                                                    <span className="spec-badge" style={{ background: 'rgba(0,0,0,0.04)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                                        {extractedVehicle.transmission}
                                                    </span>
                                                )}
                                                {extractedVehicle.engineCC && (
                                                    <span className="spec-badge" style={{ background: 'rgba(0,0,0,0.04)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                                        {extractedVehicle.engineCC}cc {extractedVehicle.turbocharged ? 'Turbo' : ''}
                                                    </span>
                                                )}
                                                {extractedVehicle.fuelEfficiencyKmpl && (
                                                    <span className="spec-badge" style={{ background: 'var(--accent-green-dim)', border: '1px solid var(--accent-green)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.95rem', color: 'var(--accent-green)' }}>
                                                        {extractedVehicle.fuelEfficiencyKmpl} km/l
                                                    </span>
                                                )}
                                            </div>

                                            <div style={{
                                                background: 'rgba(0, 0, 0, 0.02)',
                                                border: `1px solid ${extractedVehicle.confidence < 75 ? 'rgba(255, 159, 10, 0.4)' : 'var(--glass-border)'}`,
                                                borderRadius: '12px',
                                                padding: '20px',
                                                marginBottom: '24px',
                                                textAlign: 'left'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span>🔍</span> Confirm Vehicle Details
                                                    </h4>
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: extractedVehicle.confidence > 85 ? 'var(--accent-green)' : extractedVehicle.confidence > 60 ? 'var(--severity-high)' : 'var(--severity-critical)', background: 'var(--bg-surface)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                                                        {extractedVehicle.confidence}% Auto-Match
                                                    </span>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                                                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px' }}><strong style={{ color: 'var(--text-primary)' }}>Engine:</strong> {extractedVehicle.engineCC ? `${extractedVehicle.engineCC} cc` : 'N/A'}</div>
                                                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px' }}><strong style={{ color: 'var(--text-primary)' }}>Fuel:</strong> {extractedVehicle.fType.toUpperCase()}</div>
                                                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px' }}><strong style={{ color: 'var(--text-primary)' }}>Class:</strong> {extractedVehicle.vType.toUpperCase()}</div>
                                                    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px' }}><strong style={{ color: 'var(--text-primary)' }}>Standard:</strong> {extractedVehicle.eStd.toUpperCase().replace('BS', 'BS-')}</div>
                                                </div>

                                                {extractedVehicle.confidence < 75 && (
                                                    <div style={{ marginTop: '16px', color: 'var(--severity-high)', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'flex-start', background: 'rgba(249, 115, 22, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(249, 115, 22, 0.2)' }}>
                                                        <span>⚠️</span> <span style={{ lineHeight: 1.4 }}>We had to guess some details. If this looks off, try adding the year and fuel type to your search (e.g., 'Honda City 2018 Petrol') or fix it manually below.</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                                <button
                                                    type="button"
                                                    className="action-btn btn-secondary"
                                                    onClick={() => setIsEditingSpecs(true)}
                                                    style={{ flex: '1 1 200px', maxWidth: '240px' }}
                                                >
                                                    No, let me fix it
                                                </button>
                                                <button
                                                    type="button"
                                                    className="action-btn"
                                                    onClick={() => setStep(2)}
                                                    style={{ flex: '1 1 200px', maxWidth: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                                >
                                                    Yes, that's mine
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                                        <polyline points="12 5 19 12 12 19"></polyline>
                                                    </svg>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', padding: '24px', borderRadius: '12px', textAlign: 'left', animation: 'fadeInUp 0.3s ease' }}>
                                            <h4 style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Manual Correction</h4>
                                            <div className="form-row" style={{ marginBottom: '16px' }}>
                                                <div className="form-group">
                                                    <label>Vehicle Type</label>
                                                    <select value={inputs.vType} onChange={e => updateInput('vType', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
                                                        <option value="2wheeler">2-Wheeler</option>
                                                        <option value="car">Car (Hatchback/Sedan)</option>
                                                        <option value="suv">SUV / MUV</option>
                                                        <option value="bus">Bus</option>
                                                        <option value="truck">Truck</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Fuel Type</label>
                                                    <select value={inputs.fType} onChange={e => updateInput('fType', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
                                                        <option value="petrol">Petrol</option>
                                                        <option value="diesel">Diesel</option>
                                                        <option value="cng">CNG/LPG</option>
                                                        <option value="hybrid">Hybrid</option>
                                                        <option value="ev">Electric (EV)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-row" style={{ marginBottom: '24px' }}>
                                                <div className="form-group">
                                                    <label>Emission Standard</label>
                                                    <select value={inputs.eStd} onChange={e => updateInput('eStd', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
                                                        <option value="bs2">BS-II (Pre 2005)</option>
                                                        <option value="bs3">BS-III (2005–2010)</option>
                                                        <option value="bs4">BS-IV (2010–2020)</option>
                                                        <option value="bs6">BS-VI (&gt;2020)</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Engine Size</label>
                                                    <select value={inputs.eSize} onChange={e => updateInput('eSize', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}>
                                                        <option value="small">Small (&lt;1.2L)</option>
                                                        <option value="medium">Medium (1.2–2.0L)</option>
                                                        <option value="large">Large (&gt;2.0L)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                                                <button type="button" className="action-btn btn-secondary" onClick={() => setIsEditingSpecs(false)} style={{ padding: '10px 20px' }}>Cancel</button>
                                                <button type="button" className="action-btn" onClick={() => setStep(2)} style={{ padding: '10px 20px', background: 'var(--accent-green)', color: 'var(--bg-dark)' }}>Confirm Fix & Continue</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="form-step active">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Current Daily Distance (km)</label>
                                    <input type="number" min="1" max="1000" value={inputs.dTot} onChange={e => updateInput('dTot', parseFloat(e.target.value))} />
                                </div>
                            </div>

                             <div className="slider-group">
                                <div className="slider-header">
                                    <label>City vs Highway Split</label>
                                    <span className="slider-value">{inputs.cityPct}% City</span>
                                </div>
                                <input type="range" className="range-slider" min="0" max="100" value={inputs.cityPct}
                                    onChange={e => updateInput('cityPct', parseInt(e.target.value))}
                                    style={{ background: `linear-gradient(to right, var(--accent-green) ${inputs.cityPct}%, var(--glass-border) ${inputs.cityPct}%)` }}
                                />
                                <div className="slider-labels">
                                    <span>100% Highway</span>
                                    <span>100% City</span>
                                </div>
                            </div>

                            <div className="form-row" style={{ marginTop: '16px' }}>
                                <div className="form-group">
                                    <label>AC Usage</label>
                                    <select value={inputs.acUsage} onChange={e => updateInput('acUsage', e.target.value)} style={{ padding: '10px', borderRadius: '6px', background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', width: '100%' }}>
                                        <option value="None">None (0%)</option>
                                        <option value="Moderate">Moderate (50%)</option>
                                        <option value="Heavy">Heavy (100%)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Traffic Intensity</label>
                                    <select value={inputs.trafficIntensity} onChange={e => updateInput('trafficIntensity', e.target.value)} style={{ padding: '10px', borderRadius: '6px', background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', width: '100%' }}>
                                        <option value="Low">Low (Free Flow)</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High (Stop & Go)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="btn-row">
                                <button type="button" className="action-btn btn-secondary" onClick={() => setStep(1)}>&larr; Back</button>
                                <button type="button" className="action-btn" onClick={() => setStep(3)}>Next: Condition &rarr;</button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="form-step active">
                            <div className="form-row" style={{ marginBottom: '16px' }}>
                                <div className="form-group">
                                    <label>Vehicle Age (years)</label>
                                    <input type="number" min="0" max="30" value={inputs.age} onChange={e => updateInput('age', parseInt(e.target.value))} />
                                </div>
                                <div className="form-group">
                                    <label>Maintenance Level</label>
                                    <select value={inputs.maint} onChange={e => updateInput('maint', e.target.value)} style={{ padding: '10px', borderRadius: '6px', background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', width: '100%' }}>
                                        <option value="good">Good (Regularly Serviced)</option>
                                        <option value="average">Average</option>
                                        <option value="poor">Poor (Visible Smoke/Rough Idle)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="form-row" style={{ marginBottom: '24px' }}>
                                <div className="form-group">
                                    <label>Passenger / Cargo Load</label>
                                    <select value={inputs.loadFactor} onChange={e => updateInput('loadFactor', parseFloat(e.target.value))} style={{ padding: '10px', borderRadius: '6px', background: 'var(--glass-bg)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', width: '100%' }}>
                                        <option value="1">Light (1-2 People / Empty)</option>
                                        <option value="1.5">Moderate (Family / Half Load)</option>
                                        <option value="2">Heavy (Full Capacity / Towing)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="btn-row">
                                <button type="button" className="action-btn btn-secondary" onClick={() => setStep(2)}>&larr; Back</button>
                                <button type="submit" className="action-btn" disabled={isSearching}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                    Calculate Emissions
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div >

            {results && (() => {
                const rating = getRating(results);
                const maxVals = { CO2: 20, NOx: 50, PM25: 5, CO: 200, HC: 50 };

                // For EVs, since CO2 is grid based and not split by city/hwy in the same way, we rely on total distance
                const c_pct = results.total.CO2 === 0 ? 50 : (results.d_city / inputs.dTot) * 100;
                const h_pct = results.total.CO2 === 0 ? 50 : (results.d_hwy / inputs.dTot) * 100;

                const nat_avg = { CO2: 4.5, PM25: 0.8 };
                const co2_diff = ((results.total.CO2 - nat_avg.CO2) / nat_avg.CO2) * 100;
                const co2_color = co2_diff <= 0 ? 'var(--accent-green)' : 'var(--severity-critical)';

                // Display formatting for City vs Hwy
                const city_co2_kg = inputs.fType === 'ev' ? (results.total.CO2 * (c_pct / 100)).toFixed(1) : ((results.adjEF.city.CO2 * results.d_city) / 1000).toFixed(1);
                const hwy_co2_kg = inputs.fType === 'ev' ? (results.total.CO2 * (h_pct / 100)).toFixed(1) : ((results.adjEF.hwy.CO2 * results.d_hwy) / 1000).toFixed(1);

                return (
                    <div id="resultsDashboard" className="results-dashboard active" style={{ animation: 'fadeInUp 0.6s ease' }}>
                        <div className={`rating-banner ${rating.class}`}>
                            <div className="rating-icon">{rating.icon}</div>
                            <div className="rating-text">
                                <h3>{rating.label}</h3>
                                <p>{rating.desc}</p>
                            </div>
                        </div>

                        {extractedVehicle && (
                            <div style={{ textAlign: 'center', margin: '32px 0' }}>
                                {(extractedVehicle.imageUrl || extractedVehicle.imageKeyword) ? (
                                    <div style={{
                                        maxWidth: '300px',
                                        height: '200px',
                                        margin: '0 auto 16px',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        background: 'rgba(0,0,0,0.02)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                                    }}>
                                        <img
                                            src={extractedVehicle.imageUrl || `https://loremflickr.com/400/300/car,${encodeURIComponent(extractedVehicle.imageKeyword.replace(/ /g, ','))}`}
                                            alt={extractedVehicle.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                if (extractedVehicle.imageUrl && target.src === extractedVehicle.imageUrl) {
                                                    target.src = `https://loremflickr.com/400/300/car,${encodeURIComponent(extractedVehicle.imageKeyword.replace(/ /g, ','))}`;
                                                } else {
                                                    target.style.display = 'none';
                                                }
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        margin: '0 auto 16px',
                                        background: 'var(--glass-bg)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                                    }}>
                                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M5 17h2m10 0h2M5 17a2 2 0 1 0 4 0M5 17a2 2 0 0 1 4 0m-4 0h4m6 0a2 2 0 1 0 4 0m-4 0a2 2 0 0 1 4 0m-4 0h4M3 11l1.5-5A2 2 0 0 1 6.4 4.5h11.2a2 2 0 0 1 1.9 1.5L21 11" />
                                            <path d="M3 11h18v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4z" />
                                        </svg>
                                    </div>
                                )}
                                <h2 style={{ fontSize: '1.8rem', fontWeight: 600, letterSpacing: '-0.5px', margin: 0 }}>{extractedVehicle.name}</h2>
                            </div>
                        )}

                        <div className="pollutant-cards">
                            <div className="pollutant-card co2">
                                <div className="pollutant-name">CO₂ (Carbon Dioxide)</div>
                                <div className="pollutant-value">{results.total.CO2.toFixed(1)}</div>
                                <div className="pollutant-unit">kg/day</div>
                                <div className="pollutant-bar">
                                    <div className="pollutant-bar-fill" style={{ width: `${Math.min((results.total.CO2 / maxVals.CO2) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                            <div className="pollutant-card nox">
                                <div className="pollutant-name">NOx (Nitrogen Oxides)</div>
                                <div className="pollutant-value">{results.total.NOx.toFixed(1)}</div>
                                <div className="pollutant-unit">g/day</div>
                                <div className="pollutant-bar">
                                    <div className="pollutant-bar-fill" style={{ width: `${Math.min((results.total.NOx / maxVals.NOx) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                            <div className="pollutant-card pm25">
                                <div className="pollutant-name">PM2.5 (Fine Particles)</div>
                                <div className="pollutant-value">{results.total.PM25.toFixed(1)}</div>
                                <div className="pollutant-unit">g/day</div>
                                <div className="pollutant-bar">
                                    <div className="pollutant-bar-fill" style={{ width: `${Math.min((results.total.PM25 / maxVals.PM25) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                            <div className="pollutant-card co">
                                <div className="pollutant-name">CO (Carbon Monoxide)</div>
                                <div className="pollutant-value">{results.total.CO.toFixed(1)}</div>
                                <div className="pollutant-unit">g/day</div>
                                <div className="pollutant-bar">
                                    <div className="pollutant-bar-fill" style={{ width: `${Math.min((results.total.CO / maxVals.CO) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                            <div className="pollutant-card hc">
                                <div className="pollutant-name">HC (Hydrocarbons)</div>
                                <div className="pollutant-value">{results.total.HC.toFixed(1)}</div>
                                <div className="pollutant-unit">g/day</div>
                                <div className="pollutant-bar">
                                    <div className="pollutant-bar-fill" style={{ width: `${Math.min((results.total.HC / maxVals.HC) * 100, 100)}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="breakdown-section">
                            <div className="breakdown-card">
                                <div className="breakdown-title">📊 PM2.5 Source Breakdown</div>
                                {(() => {
                                    const exhaust_pm = results.e_hot.PM25 + results.e_cold.PM25;
                                    const tyre_pm = results.e_non_exhaust.tyrePM25 || 0;
                                    const brake_pm = results.e_non_exhaust.brakePM25 || 0;
                                    const total_pm = exhaust_pm + tyre_pm + brake_pm;
                                    const ex_bar = total_pm === 0 ? 0 : (exhaust_pm / total_pm) * 100;
                                    const tyre_bar = total_pm === 0 ? 0 : (tyre_pm / total_pm) * 100;
                                    const brake_bar = total_pm === 0 ? 0 : (brake_pm / total_pm) * 100;
                                    return (
                                        <>
                                            <div className="stacked-bar">
                                                <div className="bar-segment" style={{ width: `${ex_bar}%`, background: 'var(--severity-critical)' }} title="Exhaust"></div>
                                                <div className="bar-segment" style={{ width: `${tyre_bar}%`, background: 'var(--accent-blue)' }} title="Tyre Wear"></div>
                                                <div className="bar-segment" style={{ width: `${brake_bar}%`, background: 'var(--accent-cyan)' }} title="Brake Wear"></div>
                                            </div>
                                            <div>
                                                <div className="breakdown-item">
                                                    <span className="breakdown-label"><span className="breakdown-dot" style={{ background: 'var(--severity-critical)' }}></span> Tailpipe Exhaust</span>
                                                    <span className="breakdown-val">{exhaust_pm.toFixed(2)} g</span>
                                                </div>
                                                <div className="breakdown-item">
                                                    <span className="breakdown-label"><span className="breakdown-dot" style={{ background: 'var(--accent-blue)' }}></span> Tyre Wear</span>
                                                    <span className="breakdown-val">{tyre_pm.toFixed(2)} g</span>
                                                </div>
                                                <div className="breakdown-item">
                                                    <span className="breakdown-label"><span className="breakdown-dot" style={{ background: 'var(--accent-cyan)' }}></span> Brake Wear</span>
                                                    <span className="breakdown-val">{brake_pm.toFixed(2)} g</span>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                            <div className="breakdown-card">
                                <div className="breakdown-title">🛣️ City vs Highway</div>
                                <div className="stacked-bar">
                                    <div className="bar-segment" style={{ width: `${c_pct}%`, background: 'var(--accent-green)' }} title="City"></div>
                                    <div className="bar-segment" style={{ width: `${h_pct}%`, background: 'var(--accent-cyan)' }} title="Highway"></div>
                                </div>
                                <div>
                                    <div className="breakdown-item">
                                        <span className="breakdown-label"><span className="breakdown-dot" style={{ background: 'var(--accent-green)' }}></span> City Driving</span>
                                        <span className="breakdown-val">{city_co2_kg} kg</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <span className="breakdown-label"><span className="breakdown-dot" style={{ background: 'var(--accent-cyan)' }}></span> Highway Driving</span>
                                        <span className="breakdown-val">{hwy_co2_kg} kg</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="comparison-section" style={{ background: co2_diff > 0 ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '12px', border: `1px solid ${co2_diff > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}` }}>
                            <div className="comparison-title" style={{ color: co2_diff > 0 ? 'var(--severity-critical)' : 'var(--accent-green)' }}>
                                {co2_diff > 0 ? '⚠️ High Emission Profile' : '✅ Better than National Average'}
                            </div>
                            <div>
                                <div className="comparison-row" style={{ display: 'flex', alignItems: 'center', margin: '8px 0', gap: '12px' }}>
                                    <div className="comparison-label" style={{ width: '80px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>You (CO₂)</div>
                                    <div className="comparison-bar-track" style={{ flex: 1, height: '10px', background: 'rgba(0,0,0,0.06)', borderRadius: '6px' }}>
                                        <div className="comparison-bar-fill" style={{ height: '100%', borderRadius: '6px', width: `${Math.min(results.total.CO2 * 10, 100)}%`, background: co2_color, transition: 'width 1s ease-in-out' }}></div>
                                    </div>
                                    <div className="comparison-value" style={{ width: '60px', textAlign: 'right', fontWeight: 700, fontSize: '0.95rem', color: co2_color }}>{results.total.CO2.toFixed(1)} kg</div>
                                </div>
                                <div className="comparison-row" style={{ display: 'flex', alignItems: 'center', margin: '12px 0 8px 0', gap: '12px' }}>
                                    <div className="comparison-label" style={{ width: '80px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nat'l Avg</div>
                                    <div className="comparison-bar-track" style={{ flex: 1, height: '6px', background: 'rgba(0,0,0,0.06)', borderRadius: '4px' }}>
                                        <div className="comparison-bar-fill" style={{ height: '100%', borderRadius: '4px', width: `${nat_avg.CO2 * 10}%`, background: 'rgba(0,0,0,0.2)' }}></div>
                                    </div>
                                    <div className="comparison-value" style={{ width: '60px', textAlign: 'right', fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{nat_avg.CO2} kg</div>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'right' }}>
                                    Your emissions are <strong style={{ color: co2_color }}>{Math.abs(co2_diff).toFixed(0)}% {co2_diff > 0 ? 'higher' : 'lower'}</strong> than average.
                                </p>
                            </div>
                        </div>

                        <div className="eco-tips" style={{ position: 'relative', overflow: 'hidden' }}>
                            <div className="eco-tips-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                ✨ AI Personalized Recommendations
                            </div>

                            {isLoadingRecommendations ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 0', alignItems: 'center' }}>
                                    <div className="spinner" style={{ width: '24px', height: '24px', border: '2px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--accent-green)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Emission-Sense Advisor is analyzing your driving patterns...</div>
                                </div>
                            ) : recommendations && recommendations.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.5s ease' }}>
                                    {recommendations.map((rec, i) => (
                                        <div key={i} className="eco-tip" style={{ marginBottom: '8px', display: 'flex', gap: '12px', padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)' }}>
                                            <span className="eco-tip-icon" style={{ fontSize: '1.4rem' }}>{['🎯', '🔧', '🌍'][i] || '💡'}</span>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{rec.title}</div>
                                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rec.description}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    {inputs.fType !== 'ev' && (inputs.dTot / 2.0 < 10) && <div className="eco-tip" style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}><span className="eco-tip-icon">🚶</span><span style={{ fontSize: '0.9rem' }}>Your trips are short. A cold engine burns more fuel. Consider walking or cycling for trips under 3km.</span></div>}
                                    {inputs.fType !== 'ev' && (inputs.age > 10) && <div className="eco-tip" style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}><span className="eco-tip-icon">🔧</span><span style={{ fontSize: '0.9rem' }}>Your vehicle&apos;s age is adding ~30% more emissions. An engine tune-up and filter change can drastically lower PM and CO.</span></div>}
                                    {inputs.fType !== 'ev' && (inputs.eStd === 'bs2' || inputs.eStd === 'bs3') && <div className="eco-tip" style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}><span className="eco-tip-icon">♻️</span><span style={{ fontSize: '0.9rem' }}>Older BS2/BS3 engines lack modern catalysts. Consider upgrading to a new BS6/EV.</span></div>}
                                    {inputs.fType === 'ev' && <div className="eco-tip" style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}><span className="eco-tip-icon">⚡</span><span style={{ fontSize: '0.9rem' }}>Great job driving an EV! To reduce non-exhaust PM2.5 (tyre wear), ensure tyres are properly inflated and utilize regenerative braking instead of hard stops.</span></div>}
                                    {inputs.cityPct > 70 && <div className="eco-tip" style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}><span className="eco-tip-icon">🚦</span><span style={{ fontSize: '0.9rem' }}>High city driving heavily increases your emissions. Try combining trips to reduce cold starts and traffic penalties.</span></div>}
                                </div>
                            )}
                        </div>

                        <div className="glass-card" style={{ marginTop: '24px', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.8)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setShowTransparency(!showTransparency)}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '1.4rem' }}>🧮</span> See how we calculated this
                                </h3>
                                <span>{showTransparency ? '▲' : '▼'}</span>
                            </div>
                            {showTransparency && (
                                <div style={{ marginTop: '20px', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, animation: 'fadeIn 0.3s ease' }}>
                                    <p style={{ marginBottom: '12px' }}>This estimation is powered by IPCC, COPERT, and EMEP/EEA methodological models calibrated for Indian driving conditions (BS emission standards, CEA grid factors).</p>

                                    <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>1. Base Emission Factors (Hot Emissions)</h4>
                                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                                        Based on your <strong>{inputs.eStd.toUpperCase()} {inputs.fType}</strong> vehicle ({results.adjEF?.city?.CO2?.toFixed(1) || 0} g/km City | {results.adjEF?.hwy?.CO2?.toFixed(1) || 0} g/km Hwy).
                                        <br />CO₂ age factor capped at 5% (fuel efficiency loss only). Toxic pollutants use full COPERT deterioration curve (up to 2.2×).
                                    </div>

                                    <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>2. Cold-Start Phase Split (COPERT)</h4>
                                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                                        First <strong>1.5 km</strong> of each trip calculated with cold-start excess multipliers (CO up to 6×, HC up to 5×, PM 2.5–3×).
                                        {results.d_cold_total ? ` Cold-phase distance today: ${results.d_cold_total.toFixed(1)} km out of ${inputs.dTot} km total.` : ''}
                                    </div>

                                    <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>3. Real Driving Penalties</h4>
                                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                                        <strong>Traffic ({inputs.trafficIntensity}):</strong> NOx +40%, CO +50%, PM +30% for stop-and-go.<br />
                                        <strong>AC ({inputs.acUsage}):</strong> Engine load penalty +5–15% CO₂.<br />
                                        <strong>Load ({inputs.loadFactor === 1 ? 'Light' : inputs.loadFactor === 1.5 ? 'Moderate' : 'Heavy'}):</strong> +10–15% CO₂ per excess load step.
                                        {extractedVehicle?.kerbWeightKg ? <><br /><strong>Weight ({extractedVehicle.kerbWeightKg} kg):</strong> {extractedVehicle.kerbWeightKg > 1500 ? `+${(((extractedVehicle.kerbWeightKg - 1500) / 100) * 4).toFixed(0)}% CO₂ penalty (4% per 100kg over 1500kg)` : 'No penalty (under 1500kg threshold)'}</> : ''}
                                    </div>

                                    <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>4. Gemini Micro-Specification Boost</h4>
                                    <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                                        Vehicle-specific overrides when available:
                                        {extractedVehicle?.turbocharged ? ` Turbo (CO₂ −5%, NOx +10%, PM +15%),` : ''}
                                        {extractedVehicle?.fuelInjection?.toUpperCase().includes('GDI') ? ' GDI injection (PM +50%),' : ''}
                                        {extractedVehicle?.fuelEfficiencyKmpl ? ` ARAI efficiency override (${extractedVehicle.fuelEfficiencyKmpl} km/L → stoichiometric CO₂).` : ' Default efficiency estimation.'}
                                    </div>

                                    <h4 style={{ color: 'var(--text-primary)', marginTop: '16px', marginBottom: '8px' }}>5. Non-Exhaust Emissions (EMEP/EEA)</h4>
                                    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '8px' }}>
                                        Tyre wear: {results.e_non_exhaust?.tyrePM25?.toFixed(2) || 0} g PM2.5 | Brake wear: {results.e_non_exhaust?.brakePM25?.toFixed(2) || 0} g PM2.5.
                                        {inputs.fType === 'ev' ? ' EV regenerative braking reduces brake wear by 10%.' : ''}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="history-section">
                            <div className="history-title">🕐 Calculation History</div>
                            <ul className="history-list">
                                {history.length === 0 ? <li className="history-empty">No previous calculations</li> : history.map((h, i) => (
                                    <li className="history-item" key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--glass-bg)' }}>
                                        <span className="history-vehicle" style={{ fontWeight: 600 }}>{h.veh}</span>
                                        <span className="history-co2" style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{h.co2} kg CO₂</span>
                                        <span className="history-date" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{h.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            })()
            }
        </section >
    );
}
