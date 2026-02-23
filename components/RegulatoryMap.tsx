/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef } from 'react';

const zones = [
    { name: "Delhi NCR Corridor", coords: [28.6139, 77.2090], aqi: 312, severity: 'critical', desc: "Severe tailpipe emissions + road dust.", type: 'Critical Zone' },
    { name: "Mumbai WEH", coords: [19.0760, 72.8777], aqi: 185, severity: 'high', desc: "Heavy commercial traffic, high NOx.", type: 'High Zone' },
    { name: "Bangalore ORR", coords: [12.9716, 77.5946], aqi: 155, severity: 'high', desc: "Extreme idling and congestion CO2.", type: 'High Zone' },
    { name: "Chennai Port Road", coords: [13.0827, 80.2707], aqi: 142, severity: 'moderate', desc: "Diesel truck PM2.5 emissions high.", type: 'Moderate Zone' },
    { name: "Chandigarh LEZ", coords: [30.7333, 76.7794], aqi: 85, severity: 'low', desc: "Strict BS-VI enforcement. Low NOx.", type: 'Low Emission Zone' },
    { name: "Indore City Center", coords: [22.7196, 75.8577], aqi: 95, severity: 'low', desc: "E-bus fleet operations active.", type: 'Low Emission Zone' }
];

export default function RegulatoryMap({ active }: { active: boolean }) {
    const mapRef = useRef<unknown>(null);

    useEffect(() => {
        // Only initialize map if tab is active and map hasn't been initialized yet
        if (active && !mapRef.current && typeof window !== 'undefined' && (window as Record<string, unknown>).L) {
            const L = (window as Record<string, unknown>).L as any;

            const map = L.map('complianceMap').setView([20.5937, 78.9629], 5);
            mapRef.current = map;

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);

            const getColor = (s: string) => {
                if (s === 'critical') return '#ff1744';
                if (s === 'high') return '#ff9100';
                if (s === 'moderate') return '#ffea00';
                return '#00e676';
            };

            zones.forEach(z => {
                const color = getColor(z.severity);
                const html = `<div style="width:20px;height:20px;background:${color};border-radius:50%;opacity:0.6;border:2px solid ${color};box-shadow: 0 0 10px ${color}"></div>`;
                const icon = L.divIcon({ html: html, className: '', iconSize: [20, 20], iconAnchor: [10, 10] });

                L.marker(z.coords as [number, number], { icon: icon }).addTo(map)
                    .bindPopup(`
            <h3>${z.name}</h3>
            <p><strong>Status:</strong> <span style="color:${color}">${z.type}</span></p>
            <p><strong>Est. AQI:</strong> ${z.aqi}</p>
            <p>${z.desc}</p>
          `);
            });

            const route: [number, number][] = [[28.61, 77.2], [27.17, 78.04], [26.85, 80.95]];
            L.polyline(route, { color: '#ff1744', weight: 3, dashArray: '5, 10' }).addTo(map)
                .bindPopup("Major Freight Corridor: High Diesel PM2.5");
        }
    }, [active]);

    return (
        <section className={`tab-content ${active ? 'active' : ''}`} style={{ display: active ? 'block' : 'none' }}>
            <div className="tab-header">
                <h2 className="tab-title">Regulatory Compliance Map</h2>
                <p className="tab-subtitle">Vehicle pollution hotspots across Indian cities — click any zone to see AQI, PM2.5 sources & policy</p>
            </div>
            <div className="glass-card map-wrapper">
                <div id="complianceMap" style={{ height: '500px', width: '100%', borderRadius: '12px' }}></div>
                <div className="map-legend">
                    <div className="legend-title">Vehicle Pollution Zones</div>
                    <div className="legend-item"><span className="dot" style={{ background: 'rgba(255,23,68,.5)', border: '2px solid #ff1744', boxShadow: '0 0 6px #ff1744' }}></span> Critical AQI 250+</div>
                    <div className="legend-item"><span className="dot" style={{ background: 'rgba(255,145,0,.5)', border: '2px solid #ff9100', boxShadow: '0 0 6px #ff9100' }}></span> High AQI 140–250</div>
                    <div className="legend-item"><span className="dot" style={{ background: 'rgba(255,234,0,.5)', border: '2px solid #ffea00', boxShadow: '0 0 6px #ffea00' }}></span> Moderate AQI 110–140</div>
                    <div className="legend-item"><span className="dot" style={{ background: 'rgba(0,230,118,.5)', border: '2px solid #00e676', boxShadow: '0 0 6px #00e676' }}></span> Low / LEZ</div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '6px 0' }}></div>
                    <div className="legend-item" style={{ fontSize: '0.75rem' }}>
                        <span style={{ display: 'inline-block', width: '18px', height: '3px', background: '#ff1744', borderRadius: '2px', verticalAlign: 'middle', marginRight: '6px' }}></span>
                        Traffic Corridor
                    </div>
                </div>
            </div>
        </section>
    );
}
