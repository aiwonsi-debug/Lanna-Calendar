import fs from 'fs';
import path from 'path';
import { getLannaDate } from './src/utils/lannaCalc';

const OUTPUT_DIR = './src/data/v2'; 

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Process year by year to save memory
  for (let y = 2025; y <= 2035; y++) {
    console.log(`Processing Year ${y}...`);
    for (let m = 0; m < 12; m++) {
      const records = [];
      const date = new Date(Date.UTC(y, m, 1));
      
      while (date.getUTCMonth() === m) {
        const lanna = getLannaDate(new Date(date));
        if (lanna) {
            records.push({
                ...lanna,
                dateISO: date.toISOString().split('T')[0],
                day: date.getUTCDate(),
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
        date.setUTCDate(date.getUTCDate() + 1);
      }

      const monthStr = (m + 1).toString().padStart(2, '0');
      const monthKey = `${y}-${monthStr}`;

      const payload = { v: "2.2.0", y: y + 543, m: m + 1, days: records };
      fs.writeFileSync(path.join(OUTPUT_DIR, `${monthKey}.json`), JSON.stringify(payload, null, 2));

      const resolvedPayload = {
        metadata: { resolvedAt: new Date().toISOString(), strategy: "GENERATED_V2_2" },
        month: monthKey,
        records: records
      };
      fs.writeFileSync(path.join(OUTPUT_DIR, `resolved-${monthKey}.json`), JSON.stringify(resolvedPayload, null, 2));
    }
  }
  console.log("Generation Complete.");
}

run();
