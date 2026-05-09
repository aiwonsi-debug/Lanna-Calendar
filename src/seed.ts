import { db } from "./db";
import { getLannaDate } from "./utils/lannaCalc";

export async function seedIfEmpty() {
  const count = await db.months.count()
  if (count === 0) {
    const START_YEAR = 2025;
    const END_YEAR = 2035;
    
    for (let y = START_YEAR; y <= END_YEAR; y++) {
        for (let m = 0; m < 12; m++) {
            const days: {
                day: number;
                month: number;
                year: number;
                lunar: string;
                labels: string[];
                [key: string]: unknown;
            }[] = [];
            const date = new Date(y, m, 1);
            const mm = `${y}-${String(m + 1).padStart(2, "0")}`;
            
            while (date.getMonth() === m) {
                const lanna = getLannaDate(new Date(date));
                if (lanna) {
                    days.push({
                        ...lanna,
                        day: date.getDate(),
                        month: m + 1,
                        year: y,
                        lunar: `${lanna.phase === 'ออก' ? 'ขึ้น' : 'แรม'} ${lanna.lunarDay} ค่ำ`,
                        labels: [
                            lanna.isThongChai ? "วันธงชัย" : "",
                            lanna.isAthipadi ? "วันอธิบดี" : "",
                            lanna.sitthi || "",
                            lanna.isSia ? "วันเสีย" : "",
                            lanna.isUbat ? "วันอุบาทว์" : "",
                            lanna.isLokawinat ? "วันโลกาวินาศ" : "",
                            lanna.isSin ? "วันศีล" : "",
                            lanna.isLomLuang ? "วันหล่มหลวง" : ""
                        ].filter(Boolean)
                    });
                }
                date.setDate(date.getDate() + 1);
            }

            const monthData = {
                month: mm,
                data: days,
                version: 2,
                updatedAt: Date.now()
            };
            await db.months.put(monthData);
        }
    }
  }
}
