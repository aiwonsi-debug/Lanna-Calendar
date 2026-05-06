import { DayRecord } from "../types";

export type GridCell = DayRecord | null;

/**
 * Generates a 42-cell calendar grid for a specific month.
 * Uses exact deterministic logic for leading/trailing empty cells.
 */
export function createCalendarGrid(
  year: number,
  month: number,
  data: DayRecord[]
): GridCell[] {
  // JavaScript Date uses 0-based month (0 = Jan, 11 = Dec)
  const firstDay = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();
  
  const grid: GridCell[] = [];
  
  // 1. Insert leading empty cells
  for (let i = 0; i < firstDay; i++) {
    grid.push(null);
  }
  
  // 2. Map actual DayRecord data into correct positions
  for (let d = 1; d <= totalDays; d++) {
    const found = data.find(x => x.day === d);
    grid.push(found || null);
  }
  
  // 3. Insert trailing empty cells until exactly 42 cells (6 rows x 7 cols)
  while (grid.length < 42) {
    grid.push(null);
  }
  
  return grid;
}
