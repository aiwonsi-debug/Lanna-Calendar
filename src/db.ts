import Dexie, { Table } from "dexie"
import { MonthData } from "./types"

class CalendarDB extends Dexie {
  months!: Table<MonthData, string>

  constructor() {
    super("CalendarDB")
    this.version(1).stores({
      months: "month"
    })
  }
}

export const db = new CalendarDB()