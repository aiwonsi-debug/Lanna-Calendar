import { DayData } from '../components/DetailSection';

export const MONTH_NAMES = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

// Data loader for the new structure
export const dataset = import.meta.glob('../data/v2/*.json');

/**
 * Loads Lanna data for a specific year and month.
 */
export async function loadMonthData(viewMonth: Date): Promise<DayData[]> {
  const year = viewMonth.getFullYear();
  const month = (viewMonth.getMonth() + 1).toString().padStart(2, '0');
  const key = `../data/v2/${year}-${month}.json`;

  if (dataset[key]) {
    try {
      const mod = (await dataset[key]()) as any;
      const days = mod.default?.days || mod.days || mod.default || mod;
      return Array.isArray(days) ? days : [];
    } catch (e) {
      console.error("Failed to load Lanna data for", key, e);
      return [];
    }
  } else {
    console.warn("Data file not found:", key, "Available keys:", Object.keys(dataset));
    return [];
  }
}
