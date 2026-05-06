import { db } from "./db"
import { DayRecord } from "./types"

export type DatasetMap = Record<string, DayRecord[]>

export async function preloadAllMonths(): Promise<DatasetMap> {
  const all = await db.months.toArray()
  const map: DatasetMap = {}
  for (const m of all) {
    map[m.month] = m.data
  }
  return map
}