
/**
 * Utility functions for date and time, specifically targeting Indian Standard Time (IST).
 */

export const getISTTodayString = () => {
    // Reliably get YYYY-MM-DD in Asia/Kolkata
    const d = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const parts = formatter.formatToParts(d);
    const year = parts.find(p => p.type === 'year')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    return `${year}-${month}-${day}`;
};

export const parseDate = (s: string | undefined | null): Date | null => {
    if (!s || typeof s !== 'string' || !s.trim()) return null;
    const parts = s.split(/[-/]/).map(p => parseInt(p, 10));
    if (parts.length !== 3 || parts.some(isNaN)) return null;

    let y, m, d;
    if (parts[0] > 1900) { // YYYY-MM-DD
        [y, m, d] = parts;
    } else if (parts[2] > 1900) { // DD-MM-YYYY or MM-DD-YYYY
        [d, m, y] = parts;
        if (m > 12 && d <= 12) { [m, d] = [d, m]; }
    } else {
        return null;
    }
    return new Date(Date.UTC(y, m - 1, d));
};

export const calculateDaysSince = (dateStr: string | undefined | null): number | null => {
    const today = parseDate(getISTTodayString());
    const inputDate = parseDate(dateStr);
    if (!today || !inputDate) return null;
    return Math.round((today.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24));
};

export const formatIndianDate = (dateStr: string | undefined | null): string => {
    const d = parseDate(dateStr);
    if (!d) return '';
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC' // Since we parsed as UTC
    }).format(d);
};
