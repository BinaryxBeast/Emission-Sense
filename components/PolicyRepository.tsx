'use client';

import { useState } from 'react';

const policies_db = [
    { title: 'FAME II — Electric Vehicle Subsidy', desc: 'Up to ₹1.5 Lakh subsidy on purchase of 4-W EVs to promote zero-tailpipe emission mobility.', tags: ['EV', 'Incentive'], ministry: 'Heavy Industries', year: '2019–24' },
    { title: 'Vehicle Scrappage Policy', desc: 'Mandatory fitness tests. Commercial vehicles over 15 yrs and passenger over 20 yrs scrapped if unfit. High incentives for scrapping old polluting cars.', tags: ['Scrappage', 'Emission'], ministry: 'MoRTH', year: '2021 onwards' },
    { title: 'BS-VI Emission Norms Ramp-Up', desc: 'Mandatory DPF and SCR for diesels. Slashes NOx by 68% and PM by 82% compared to BS-IV.', tags: ['BS6', 'Regulation'], ministry: 'MoEFCC', year: '2020/2023' },
    { title: 'Green Tax', desc: 'Additional tax (10-25% of road tax) on older vehicles at renewal of registration to deter use of highly polluting legacy vehicles.', tags: ['Tax', 'Regulation'], ministry: 'MoRTH', year: 'Ongoing' },
    { title: 'Delhi EV Policy', desc: 'Road tax exemptions, waiver of registration fees, and up to ₹30,000 extra incentive for 2W/3W to hit 25% EV adoption.', tags: ['EV', 'State Policy'], ministry: 'Govt NCT Delhi', year: '2020–24' },
    { title: 'CBG / CNG Network Expansion', desc: 'Investment in 5,000 CBG plants and expanding CNG highway networks to substitute diesel in heavy transport.', tags: ['CNG', 'Infrastructure'], ministry: 'MoPNG', year: '2023–25' }
];

export default function PolicyRepository({ active }: { active: boolean }) {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('');

    if (!active) return null;

    const term = search.toLowerCase();
    const filtered = policies_db.filter(p => {
        const matchText = p.title.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term);
        const matchFilter = activeFilter === '' || p.tags.includes(activeFilter) || p.year.includes(activeFilter);
        return matchText && matchFilter;
    });

    return (
        <section className="tab-content active">
            <div className="tab-header">
                <h2 className="tab-title">Indian Motor Vehicle Policies</h2>
                <p className="tab-subtitle">Explore government schemes, incentives and regulations for cleaner transportation in India</p>
            </div>

            <div className="policy-search-bar glass-card">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                    <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search policies (e.g., EV, FAME, BS6...)"
                />
            </div>

            <div className="policy-filter-tags">
                <button className={`filter-tag ${activeFilter === '' ? 'active' : ''}`} onClick={() => setActiveFilter('')}>All</button>
                <button className={`filter-tag ${activeFilter === 'EV' ? 'active' : ''}`} onClick={() => setActiveFilter('EV')}>Electric Vehicles</button>
                <button className={`filter-tag ${activeFilter === 'Incentive' ? 'active' : ''}`} onClick={() => setActiveFilter('Incentive')}>Incentives</button>
                <button className={`filter-tag ${activeFilter === 'CNG' ? 'active' : ''}`} onClick={() => setActiveFilter('CNG')}>CNG</button>
                <button className={`filter-tag ${activeFilter === 'BS6' ? 'active' : ''}`} onClick={() => setActiveFilter('BS6')}>BS6 Emission</button>
                <button className={`filter-tag ${activeFilter === 'Scrappage' ? 'active' : ''}`} onClick={() => setActiveFilter('Scrappage')}>Scrappage</button>
                <button className={`filter-tag ${activeFilter === 'Tax' ? 'active' : ''}`} onClick={() => setActiveFilter('Tax')}>Tax</button>
            </div>

            <div className="policies-grid">
                {filtered.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center' }}>No policies found matching your criteria.</p>
                ) : (
                    filtered.map((p, i) => (
                        <div className="policy-card" key={i}>
                            <h3>{p.title}</h3>
                            <p>{p.desc}</p>
                            <div className="policy-meta">
                                {p.tags.map(t => <span className="policy-tag" key={t}>{t}</span>)}
                            </div>
                            <div className="policy-info">
                                <strong>Ministry:</strong> {p.ministry} &bull; <strong>Year:</strong> {p.year}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
