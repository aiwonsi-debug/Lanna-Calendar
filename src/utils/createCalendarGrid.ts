export type DayRecord = {
  dateISO: string
  day: number
  month: number
  year: number
  lunar: string
  labels: string[]
  description: string[]
  score: "good" | "bad" | "neutral"
}

export type GridCell = DayRecord | null

/**
 * Creates a standard 42-cell calendar grid (6 rows x 7 columns)
 * for a specific year and month.
 * 
 * @param year - The full year (e.g., 2026)
 * @param month - The month (1-12)
 * @param data - Array of DayRecord objects for the month
 * @returns Array of 42 cells containing DayRecord or null
 */
export function createCalendarGrid(
  year: number,
  month: number,
  data: DayRecord[]
): GridCell[] {
  // JS Date uses 0-based month (0 = Jan, 11 = Dec)
  const firstDay = new Date(year, month - 1, 1).getDay()
  const totalDays = new Date(year, month, 0).getDate()
  
  const grid: GridCell[] = []
  
  // 1. Leading empty cells (days from previous month)
  for (let i = 0; i < firstDay; i++) {
    grid.push(null)
  }
  
  // 2. Actual days of the month
  for (let d = 1; d <= totalDays; d++) {
    const found = data.find(x => x.day === d)
    // If data for specific day is missing, we still represent the cell
    grid.push(found || {
        dateISO: `${year}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`,
        day: d,
        month,
        year,
        lunar: "",
        labels: [],
        description: [],
        score: "neutral"
    } as DayRecord);
  }
  
  // 3. Trailing cells → complete 6 rows (42 cells total)
  while (grid.length < 42) {
    grid.push(null)
  }
  
  return grid
}
