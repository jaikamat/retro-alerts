/**
 * Yields the difference in days from past date to now
 * @param {string} ISOstring - an ISO string to convert to a date
 */
export default function subtractDate(ISOstring) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const past = new Date(ISOstring);
    const now = new Date();

    const utcPast = Date.UTC(past.getFullYear(), past.getMonth(), past.getDate());
    const utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());

    return Math.floor((utcNow - utcPast) / MS_PER_DAY);
}