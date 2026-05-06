export const MONTH_NAMES = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

export interface NormalizedRecord {
  dateISO: string;
  day: number;
  lunar: string;
  labels: string[];
  description: string[];
  score: 'good' | 'bad' | 'neutral';
}

const dataset = import.meta.glob('../data/v2/*.json');

/**
 * Loads Lanna data for a specific year and month from the RESOLVED dataset.
 * UI reads ONLY from this materialized view to avoid handling conflicts.
 */
export async function loadMonthData(viewMonth: Date): Promise<NormalizedRecord[]> {
  const year = viewMonth.getFullYear();
  const month = (viewMonth.getMonth() + 1).toString().padStart(2, '0');
  // Use resolved files for final rendering
  const key = `../data/v2/resolved-${year}-${month}.json`;

  if (dataset[key]) {
    try {
      const mod = (await dataset[key]()) as { default?: { records: NormalizedRecord[] }, records?: NormalizedRecord[] };
      // Resolved schema has 'records' as a flat array of DayRecord[]
      const records = mod.default?.records || mod.records || [];
      return Array.isArray(records) ? records : [];
    } catch (e) {
      console.error("Failed to load Lanna data for", key, e);
      return [];
    }
  } else {
    console.warn("Resolved data file not found:", key);
    return [];
  }
}
