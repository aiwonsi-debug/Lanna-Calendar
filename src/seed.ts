import { db } from "./db"
import { MonthData } from "./types"

function buildApril2569(): MonthData {
  const year = 2026
  const month = 4
  const mm = "2026-04"

  const days = Array.from({ length: 30 }, (_, i) => i + 1)

  const data = days.map((d) => {
    const dateISO = `${mm}-${String(d).padStart(2, "0")}`

    // mock structure consistent with schema
    return {
      dateISO,
      day: d,
      month,
      year,
      lunar: d === 16 ? "เดือน 8 แรม 14 ค่ำ" : "เดือน 8",
      labels:
        d === 16
          ? ["วันพญาวัน", "วันพฤหัส", "วันเม็ง"]
          : d % 6 === 0
          ? ["วันดี"]
          : d % 5 === 0
          ? ["วันไม่ดี"]
          : ["วันทั่วไป"],
      description:
        d === 16
          ? [
              "วันดี เหมาะทำบุญสร้างกุศล",
              "ควรหลีกเลี่ยงงานสำคัญ",
              "มีโชคลาภจากผู้ใหญ่"
            ]
          : ["ข้อมูลตัวอย่าง"],
      score: d === 16 ? "good" : d % 5 === 0 ? "bad" : "neutral"
    }
  })

  return {
    month: mm,
    data,
    version: 1,
    updatedAt: Date.now()
  }
}

export async function seedIfEmpty() {
  const count = await db.months.count()
  if (count === 0) {
    const april = buildApril2569()
    await db.months.put(april)
  }
}