'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type PollutionLevel = 'none' | 'low' | 'moderate' | 'high' | 'critical';

interface PollutionContextType {
    pollutionLevel: PollutionLevel;
    setPollutionLevel: (level: PollutionLevel) => void;
}

const PollutionContext = createContext<PollutionContextType>({
    pollutionLevel: 'none',
    setPollutionLevel: () => {},
});

export function PollutionProvider({ children }: { children: ReactNode }) {
    const [pollutionLevel, setPollutionLevel] = useState<PollutionLevel>('none');

    useEffect(() => {
        const html = document.documentElement;
        // Remove all theme classes first
        html.classList.remove('theme-none', 'theme-low', 'theme-moderate', 'theme-high', 'theme-critical');
        html.classList.add(`theme-${pollutionLevel}`);
    }, [pollutionLevel]);

    return (
        <PollutionContext.Provider value={{ pollutionLevel, setPollutionLevel }}>
            {children}
        </PollutionContext.Provider>
    );
}

export function usePollution() {
    return useContext(PollutionContext);
}
