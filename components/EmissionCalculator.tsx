/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { calculateEmissions, CalculationInput } from '../lib/calculation';

export default function EmissionCalculator({ active }: { active: boolean }) {
    const [step, setStep] = useState(1);
    const [inputs, setInputs] = useState<CalculationInput>({
        vType: 'car',
        fType: 'petrol',
        eStd: 'bs4',
        eSize: 'medium',
        dTot: 40,
        trips: 4,
        cityPct: 70,
        age: 5,
        maint: 'average',
        tripLen: 'short',
        climate: 'moderate'
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [isEditingSpecs, setIsEditingSpecs] = useState(false);
    const [extractedVehicle, setExtractedVehicle] = useState<{
        name: string, vType: any, fType: any, eStd: any, eSize: any, imageKeyword: string, imageUrl?: string, confidence: number
    } | null>(null);

    const [results, setResults] = useState<Record<string, any> | null>(null);
    const [history, setHistory] = useState<Record<string, string>[]>([]);

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
                throw new Error('Failed to find vehicle. Please try again.');
            }

            const data = await res.json();
            setExtractedVehicle(data);

            setInputs(prev => ({
                ...prev,
                vType: data.vType,
                fType: data.fType,
                eStd: data.eStd,
                eSize: data.eSize
            }));
        } catch (err: any) {
            setSearchError(err.message || 'An error occurred while searching.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputs.dTot <= 0) return;

        const res = calculateEmissions(inputs);
        setResults(res);

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
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
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
                                                color: 'white',
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
                                            disabled={isSearching || !searchQuery.trim()}
                                            style={{
                                                background: 'var(--accent-green)',
                                                color: '#000',
                                                border: 'none',
                                                padding: '12px 24px',
                                                borderRadius: '8px',
                                                fontWeight: 600,
                                                cursor: (isSearching || !searchQuery.trim()) ? 'not-allowed' : 'pointer',
                                                opacity: (isSearching || !searchQuery.trim()) ? 0.7 : 1,
                                                transition: 'all 0.2s',
                                                marginLeft: '8px'
                                            }}
                                        >
                                            {isSearching ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span className="spinner" style={{
                                                        width: '16px', height: '16px', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite'
                                                    }}></span>
                                                    Searching
                                                </div>
                                            ) : 'Search'}
                                        </button>
                                    </div>
                                    {searchError && (
                                        <div style={{ color: '#ff1744', marginTop: '16px', fontSize: '0.9rem' }}>{searchError}</div>
                                    )}
                                </div>
                            ) : (
                                <div className="vehicle-preview-card" style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
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
                                            background: 'rgba(255,255,255,0.02)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
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
                                            background: 'rgba(255,255,255,0.05)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
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
                                                <span className="spec-badge" style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.95rem', textTransform: 'capitalize' }}>
                                                    {extractedVehicle.vType === '2wheeler' ? '2-Wheeler' : extractedVehicle.vType.toUpperCase()}
                                                </span>
                                                <span className="spec-badge" style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.95rem', textTransform: 'capitalize' }}>
                                                    {extractedVehicle.fType === 'ev' ? 'Electric' : extractedVehicle.fType.toUpperCase()}
                                                </span>
                                                <span className="spec-badge" style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.95rem', textTransform: 'uppercase' }}>
                                                    {extractedVehicle.eStd.replace('bs', 'BS-')}
                                                </span>
                                                <span className="spec-badge" style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 16px', borderRadius: '30px', fontSize: '0.95rem', textTransform: 'capitalize' }}>
                                                    {extractedVehicle.eSize} Engine
                                                </span>
                                            </div>

                                            {extractedVehicle.confidence < 75 && (
                                                <div style={{
                                                    background: 'rgba(255, 171, 0, 0.1)',
                                                    border: '1px solid rgba(255, 171, 0, 0.3)',
                                                    borderRadius: '8px',
                                                    padding: '12px 16px',
                                                    marginBottom: '24px',
                                                    color: '#ffab00',
                                                    fontSize: '0.9rem',
                                                    textAlign: 'left',
                                                    display: 'flex',
                                                    gap: '12px',
                                                    alignItems: 'flex-start'
                                                }}>
                                                    <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                                                    <p style={{ margin: 0, lineHeight: 1.4 }}>
                                                        We had to guess some details like the year or fuel type. For a more accurate calculation, edit your search (e.g., 'Honda City 2018 Petrol').
                                                    </p>
                                                </div>
                                            )}

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
                                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '12px', textAlign: 'left', animation: 'fadeInUp 0.3s ease' }}>
                                            <h4 style={{ marginBottom: '16px', color: 'var(--text-primary)', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Manual Correction</h4>
                                            <div className="form-row" style={{ marginBottom: '16px' }}>
                                                <div className="form-group">
                                                    <label>Vehicle Type</label>
                                                    <select value={inputs.vType} onChange={e => updateInput('vType', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <option value="2wheeler">2-Wheeler</option>
                                                        <option value="car">Car (Hatchback/Sedan)</option>
                                                        <option value="suv">SUV / MUV</option>
                                                        <option value="bus">Bus</option>
                                                        <option value="truck">Truck</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Fuel Type</label>
                                                    <select value={inputs.fType} onChange={e => updateInput('fType', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
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
                                                    <select value={inputs.eStd} onChange={e => updateInput('eStd', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <option value="bs2">BS-II (Pre 2005)</option>
                                                        <option value="bs3">BS-III (2005–2010)</option>
                                                        <option value="bs4">BS-IV (2010–2020)</option>
                                                        <option value="bs6">BS-VI (&gt;2020)</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Engine Size</label>
                                                    <select value={inputs.eSize} onChange={e => updateInput('eSize', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <option value="small">Small (&lt;1.2L)</option>
                                                        <option value="medium">Medium (1.2–2.0L)</option>
                                                        <option value="large">Large (&gt;2.0L)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                                                <button type="button" className="action-btn btn-secondary" onClick={() => setIsEditingSpecs(false)} style={{ padding: '10px 20px' }}>Cancel</button>
                                                <button type="button" className="action-btn" onClick={() => setStep(2)} style={{ padding: '10px 20px', background: 'var(--accent-green)', color: '#000' }}>Confirm Fix & Continue</button>
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
                                <div className="form-group">
                                    <label>Trips per Day</label>
                                    <input type="number" min="1" max="50" value={inputs.trips} onChange={e => updateInput('trips', parseInt(e.target.value))} />
                                </div>
                            </div>

                            <div className="slider-group">
                                <div className="slider-header">
                                    <label>City vs Highway Split</label>
                                    <span className="slider-value">{inputs.cityPct}% City</span>
                                </div>
                                <input type="range" className="range-slider" min="0" max="100" value={inputs.cityPct}
                                    onChange={e => updateInput('cityPct', parseInt(e.target.value))}
                                    style={{ background: `linear-gradient(to right, #00e676 ${inputs.cityPct}%, rgba(255,255,255,0.1) ${inputs.cityPct}%)` }}
                                />
                                <div className="slider-labels">
                                    <span>100% Highway</span>
                                    <span>100% City</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Typical Trip Length</label>
                                <div className="radio-group">
                                    <div className="radio-option">
                                        <input type="radio" id="tripShort" checked={inputs.tripLen === 'short'} readOnly />
                                        <label htmlFor="tripShort" onClick={() => updateInput('tripLen', 'short')}>Short &lt;10 km</label>
                                    </div>
                                    <div className="radio-option">
                                        <input type="radio" id="tripMedium" checked={inputs.tripLen === 'medium'} readOnly />
                                        <label htmlFor="tripMedium" onClick={() => updateInput('tripLen', 'medium')}>Medium 10–30 km</label>
                                    </div>
                                    <div className="radio-option">
                                        <input type="radio" id="tripLong" checked={inputs.tripLen === 'long'} readOnly />
                                        <label htmlFor="tripLong" onClick={() => updateInput('tripLen', 'long')}>Long &gt;30 km</label>
                                    </div>
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
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Vehicle Age (years)</label>
                                    <input type="number" min="0" max="30" value={inputs.age} onChange={e => updateInput('age', parseInt(e.target.value))} />
                                </div>
                                <div className="form-group">
                                    <label>Maintenance Level</label>
                                    <select value={inputs.maint} onChange={e => updateInput('maint', e.target.value)}>
                                        <option value="good">Well Maintained</option>
                                        <option value="average">Average</option>
                                        <option value="poor">Poorly Maintained</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Climate Zone</label>
                                <div className="radio-group">
                                    <div className="radio-option">
                                        <input type="radio" id="climateCool" checked={inputs.climate === 'cool'} readOnly />
                                        <label htmlFor="climateCool" onClick={() => updateInput('climate', 'cool')}>❄️ Cool</label>
                                    </div>
                                    <div className="radio-option">
                                        <input type="radio" id="climateMod" checked={inputs.climate === 'moderate'} readOnly />
                                        <label htmlFor="climateMod" onClick={() => updateInput('climate', 'moderate')}>🌤️ Moderate</label>
                                    </div>
                                    <div className="radio-option">
                                        <input type="radio" id="climateHot" checked={inputs.climate === 'hot'} readOnly />
                                        <label htmlFor="climateHot" onClick={() => updateInput('climate', 'hot')}>🔥 Hot</label>
                                    </div>
                                </div>
                            </div>

                            <div className="btn-row">
                                <button type="button" className="action-btn btn-secondary" onClick={() => setStep(2)}>&larr; Back</button>
                                <button type="submit" className="action-btn">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                    </svg>
                                    Calculate Emissions
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            {results && (() => {
                const rating = getRating(results);
                const maxVals = { CO2: 20, NOx: 50, PM25: 5, CO: 200, HC: 50 };
                const ex_pct = results.total.PM25 === 0 ? 0 : ((results.e_hot.PM25 + results.e_cold.PM25) / results.total.PM25) * 100;
                const nex_pct = results.total.PM25 === 0 ? 0 : (results.e_non_exhaust.PM25 / results.total.PM25) * 100;

                // For EVs, since CO2 is grid based and not split by city/hwy in the same way, we rely on total distance
                const c_pct = results.total.CO2 === 0 ? 50 : (results.d_city / inputs.dTot) * 100;
                const h_pct = results.total.CO2 === 0 ? 50 : (results.d_hwy / inputs.dTot) * 100;

                const nat_avg = { CO2: 4.5, PM25: 0.8 };
                const co2_diff = ((results.total.CO2 - nat_avg.CO2) / nat_avg.CO2) * 100;
                const co2_color = co2_diff <= 0 ? '#00e676' : '#ff1744';

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
                                <div className="breakdown-title">📊 Emission Source Breakdown</div>
                                <div className="stacked-bar">
                                    <div className="bar-segment" style={{ width: `${ex_pct}%`, background: '#ff1744' }} title="Exhaust"></div>
                                    <div className="bar-segment" style={{ width: `${nex_pct}%`, background: '#7c4dff' }} title="Non-Exhaust"></div>
                                </div>
                                <div>
                                    <div className="breakdown-item">
                                        <span className="breakdown-label"><span className="breakdown-dot" style={{ background: '#ff1744' }}></span> Tailpipe Exhaust</span>
                                        <span className="breakdown-val">{(results.e_hot.PM25 + results.e_cold.PM25).toFixed(2)} g</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <span className="breakdown-label"><span className="breakdown-dot" style={{ background: '#7c4dff' }}></span> Tyre/Brake Wear</span>
                                        <span className="breakdown-val">{results.e_non_exhaust.PM25.toFixed(2)} g</span>
                                    </div>
                                </div>
                            </div>
                            <div className="breakdown-card">
                                <div className="breakdown-title">🛣️ City vs Highway</div>
                                <div className="stacked-bar">
                                    <div className="bar-segment" style={{ width: `${c_pct}%`, background: '#00e676' }} title="City"></div>
                                    <div className="bar-segment" style={{ width: `${h_pct}%`, background: '#00b0ff' }} title="Highway"></div>
                                </div>
                                <div>
                                    <div className="breakdown-item">
                                        <span className="breakdown-label"><span className="breakdown-dot" style={{ background: '#00e676' }}></span> City Driving</span>
                                        <span className="breakdown-val">{city_co2_kg} kg</span>
                                    </div>
                                    <div className="breakdown-item">
                                        <span className="breakdown-label"><span className="breakdown-dot" style={{ background: '#00b0ff' }}></span> Highway Driving</span>
                                        <span className="breakdown-val">{hwy_co2_kg} kg</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="comparison-section">
                            <div className="comparison-title">📈 Comparison with National Average</div>
                            <div>
                                <div className="comparison-row" style={{ display: 'flex', alignItems: 'center', margin: '8px 0', gap: '12px' }}>
                                    <div className="comparison-label" style={{ width: '80px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>You (CO₂)</div>
                                    <div className="comparison-bar-track" style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
                                        <div className="comparison-bar-fill" style={{ height: '100%', borderRadius: '4px', width: `${Math.min(results.total.CO2 * 10, 100)}%`, background: co2_color }}></div>
                                    </div>
                                    <div className="comparison-value" style={{ width: '60px', textAlign: 'right', fontWeight: 700, fontSize: '0.9rem' }}>{results.total.CO2.toFixed(1)} kg</div>
                                </div>
                                <div className="comparison-row" style={{ display: 'flex', alignItems: 'center', margin: '8px 0', gap: '12px' }}>
                                    <div className="comparison-label" style={{ width: '80px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nat'l Avg</div>
                                    <div className="comparison-bar-track" style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
                                        <div className="comparison-bar-fill" style={{ height: '100%', borderRadius: '4px', width: `${nat_avg.CO2 * 10}%`, background: 'rgba(255,255,255,0.3)' }}></div>
                                    </div>
                                    <div className="comparison-value" style={{ width: '60px', textAlign: 'right', fontWeight: 700, fontSize: '0.9rem' }}>{nat_avg.CO2} kg</div>
                                </div>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'right' }}>
                                    {Math.abs(co2_diff).toFixed(0)}% {co2_diff > 0 ? 'higher' : 'lower'} than average
                                </p>
                            </div>
                        </div>

                        <div className="eco-tips">
                            <div className="eco-tips-title">💡 Recommendations to Reduce Emissions</div>
                            <div>
                                {inputs.fType !== 'ev' && inputs.tripLen === 'short' && <div className="eco-tip" style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}><span className="eco-tip-icon">🚶</span><span style={{ fontSize: '0.9rem' }}>Your trips are short. A cold engine burns more fuel. Consider walking or cycling for trips under 3km.</span></div>}
                                {inputs.fType !== 'ev' && (inputs.maint === 'poor' || inputs.age > 10) && <div className="eco-tip" style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}><span className="eco-tip-icon">🔧</span><span style={{ fontSize: '0.9rem' }}>Your vehicle&apos;s age/condition is adding ~30% more emissions. An engine tune-up and filter change can drastically lower PM and CO.</span></div>}
                                {inputs.fType !== 'ev' && (inputs.eStd === 'bs2' || inputs.eStd === 'bs3') && <div className="eco-tip" style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}><span className="eco-tip-icon">♻️</span><span style={{ fontSize: '0.9rem' }}>Older BS2/BS3 engines lack modern catalysts. Consider the Government Scrappage Policy for incentives on a new BS6/EV.</span></div>}
                                {inputs.fType === 'ev' && <div className="eco-tip" style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}><span className="eco-tip-icon">⚡</span><span style={{ fontSize: '0.9rem' }}>Great job driving an EV! To reduce non-exhaust PM2.5 (tyre wear), ensure tyres are properly inflated and utilize regenerative braking instead of hard stops.</span></div>}
                                {inputs.cityPct > 70 && <div className="eco-tip" style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}><span className="eco-tip-icon">🚦</span><span style={{ fontSize: '0.9rem' }}>High city driving means more idling. Turn off your engine at signals longer than 30 seconds to save fuel and cut local NOx.</span></div>}
                            </div>
                        </div>

                        <div className="history-section">
                            <div className="history-title">🕐 Calculation History</div>
                            <ul className="history-list">
                                {history.length === 0 ? <li className="history-empty">No previous calculations</li> : history.map((h, i) => (
                                    <li className="history-item" key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span className="history-vehicle" style={{ fontWeight: 600 }}>{h.veh}</span>
                                        <span className="history-co2" style={{ color: 'var(--accent-green)', fontWeight: 700 }}>{h.co2} kg CO₂</span>
                                        <span className="history-date" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{h.date}</span>
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
