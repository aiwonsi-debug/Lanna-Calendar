import { db } from "./db";
import fs from 'fs';
import path from 'path';

// ============================================================
// DATA & MAPPING
// ============================================================

const WAN_THAI_DESCRIPTIONS: Record<string, string> = {
  "กาบไจ้": "ดี เป็นสิริมงคล",
  "ดับเป้า": "อย่าเดินทางค้าขาย",
  "รวายยี่": "อย่าให้เหล้าแก่ท้าวพญา",
  "เมืองเหม้า": "อย่าออกศึก อย่าต่อสู้คดีความ อย่าพนันขันต่อ",
  "เปิกสี": "ควรหมั้นหมาย",
  "กัดไส้": "อย่าซื้ออาวุธ",
  "กดสะง้า": "อย่าเดินทางค้าขาย",
  "ร้วงเม็ด": "อย่าทำหน้าไม้",
  "เต่าสัน": "ควรผูกมิตร",
  "กาเร้า": "ควรถักแห ทำตาข่ายดักสัตว์",
  "กาบเส็ด": "อย่าสร้างเครื่องทอผ้า",
  "ดับไค้": "อย่าตัดเสื้อผ้า",
  "รวายไจ้": "อย่าออกตรวจราชการ อย่าออกตรวจงาน",
  "เมืองเป้า": "อย่าทำที่นอน",
  "เปิกยี่": "อย่าสานเสื่อ",
  "กัดเหม้า": "ไปค้าขาย ดีนัก",
  "กดสี": "ควรตัดไม้มาสร้างบ้าน",
  "ร้วงไส้": "อย่าฟั่นเชือกล่ามสัตว์",
  "เต่าสะง้า": "อย่าเดินทางค้าขาย",
  "กาเม็ด": "อย่าซื้ออาวุธ",
  "กาบสัน": "อย่าสร้างที่กักกันสัตว์",
  "ดับเร้า": "ควรตัดผม หวีผม",
  "รวายเส็ด": "อย่าปลูกต้นหมาก",
  "เมืองไค้": "ควรแก่การออกศึก ควรเกี้ยวสาว",
  "เปิกไจ้": "ควรสักหมึก ลงยันต์",
  "กัดเป้า": "อย่าสู้คดีความ",
  "กดหยี่": "ควรไปค้าขาย",
  "ร้วงเหม้า": "ทำการใดๆ ดีทั้งปวง",
  "เต่าสี": "ควรปลูกพืช",
  "กาไส้": "อย่าไปงานเลี้ยง",
  "กาบสะง้า": "ควรสร้างยุ้งข้าว",
  "ดับเม็ด": "อย่าเดินทาง",
  "รวายสัน": "ควรสร้างรั้ว สร้างกำแพง",
  "เมืองเร้า": "อย่าไปงานเลี้ยง",
  "เปิกเส็ด": "อย่าออกศึก",
  "กัดไค้": "อย่าทำหน้าไม้",
  "กดไจ้": "ไปค้าขาย ดีนัก",
  "ร้วงเป้า": "อย่าปลูกอ้อย",
  "เต่ายี่": "อย่าปลูกหมาก",
  "กาเหม้า": "อย่าขายของมีค่า",
  "กาบสี": "ย้อมผ้าหรือสิ่งของด้วยสีแดง จะเกิดความเป็นสิริมงคล",
  "ดับไส้": "อย่าแต่งงาน ภริยาจะตายทั้งกลม",
  "รวายสะง้า": "ทำครก ทำสาก ดี",
  "เมืองเม็ด": "ถักแห ทำตาข่ายดักสัตว์ ดีนัก",
  "เปิกสัน": "อย่าให้เหล้าแก่ท้าวพญา",
  "กัดเร้า": "ทำเครื่องดักนก ดีนัก",
  "กดเส็ด": "อย่าฟั่นเชือกล่ามสัตว์",
  "ร้วงไค้": "อย่าดื่มเหล้าในงานเลี้ยง",
  "เต่าไจ้": "อย่าสร้างเตาไฟ",
  "กาเป้า": "อย่าลงเรือ",
  "กาบยี่": "อย่าเข้าป่า",
  "ดับเหม้า": "นุ่งผ้าใหม่ ตัดผมใหม่ ดี",
  "รวายสี": "ทำที่นอน ดีนัก",
  "เมืองไส้": "อย่าออกศึก",
  "เปิกสะง้า": "อย่าออกตรวจราชการ อย่าออกตรวจงาน",
  "กัดเม็ด": "ซื้อสัตว์ ดี",
  "กดสัน": "เจรจาขอสาว ดีนัก",
  "ร้วงเร้า": "อย่าทำผ้าห่ม",
  "เต่าเส็ด": "อย่าสร้างเตาไฟ",
  "กาไค้": "อย่าซื้อสัตว์เลี้ยง"
};

// ============================================================
// LOGIC ENGINE
// ============================================================
function getLunarYearInfo(yearBE: number) {
  const cs = yearBE - 1181;
  const harkun = Math.floor((cs * 292207 + 373) / 800);
  return { 
    isAthikamat: ((cs * 7 + 13) % 19) < 7, 
    isAthikawan: !(((cs * 7 + 13) % 19) < 7) && ((harkun * 11 + 650) % 692 <= 137) 
  };
}

function getWanPhiKin(month: number, day: number, phase: 'ออก' | 'แรม') {
    const monthGroup = ((month - 1) % 4); 
    const offset = monthGroup;

    if (phase === 'ออก') {
      const baseDays = [1, 4, 6, 9, 11];
      const targetDays = baseDays.map(d => d + offset);
      if (day === targetDays[0]) return "ผีกิ๋นคน: บ่ดีเดินทางไกล";
      if (day === targetDays[1]) return "ผีกิ๋นเครื่อง: บ่ดีนุ่งผ้าใหม่";
      if (day === targetDays[2]) return "ผีกิ๋นตัว: บ่ดีทำการมงคล";
      if (day === targetDays[3]) return "ผีกิ๋นตีน: บ่ดีซื้อเกือกใหม่";
      if (day === targetDays[4]) return "ผีกิ๋นมือ: บ่ดีหยิบเครื่องของ";
    } else {
      const baseDays = [2, 7, 12, 14];
      const targetDays = baseDays.map(d => {
          let res = d + offset;
          if (res > 15) res -= 15;
          return res;
      });
      if (day === targetDays[0]) return "ผีกิ๋นไก่: บ่ดีกิ๋นจิ๊นไก่";
      if (day === targetDays[1]) return "ผีกิ๋นหมู: บ่ดีกิ๋นจิ๊นหมู";
      if (day === targetDays[2]) return "ผีกิ๋นงัว: บ่ดีกิ๋นจิ๊นงัว";
      if (day === targetDays[3]) return "ผีกิ๋นม้า: บ่ดีซื้อม้าเข้าบ้าน";
    }
    return "";
}

function extractDetails(isSia: boolean, isSin: boolean, isGood: boolean, wanThai: string) {
    let description = "";
    
    if (isSia) {
        description = "เป็นวันไม่เป็นมงคล ควรหลีกเลี่ยงการมงคล";
    } else if (isGood) {
        description = "เป็นวันดีมงคล เหมาะแก่การประกอบพิธีมงคล";
    } else if (isSin) {
        description = "วันพระ ควรทำบุญรักษาศีล";
    }
    
    if (!description && WAN_THAI_DESCRIPTIONS[wanThai]) {
        description = WAN_THAI_DESCRIPTIONS[wanThai];
    }
    
    if (!description) {
        description = "วันทั่วไป";
    }

    const warnings = isSia ? ["ไม่ควรประกอบพิธีมงคล"] : [];
    const rituals = [
        {
            title: "การตัดผม",
            description: isSia ? "ไม่ควรตัดผมในวันนี้" : "ตัดผมวันนี้ดีมีโชคลาภ"
        },
        {
            title: "การตัดเล็บ",
            description: isSia ? "ไม่ควรตัดเล็บในวันนี้" : "ตัดเล็บวันนี้ดีนักจะมีโชค"
        }
    ];

    return { description: [description], warnings, rituals };
}

function getLannaDateForSeed(date: Date) {
  if (!date || isNaN(date.getTime())) return null;
  const refDate = new Date(2026, 3, 30); 
  const diffDays = Math.floor((date.getTime() - refDate.getTime()) / 86400000);
  
  let currentMonth = 8, currentKham = 14, currentPhase: 'ออก' | 'แรม' = 'ออก', currentYearBE = 2569;
  let isLeapMonthActive = false;
  
  const step = diffDays >= 0 ? 1 : -1;
  const absDiff = Math.abs(diffDays);
  
  for (let i = 0; i < absDiff; i++) {
    const yrInfo = getLunarYearInfo(currentYearBE);
    if (step === 1) {
      currentKham++;
      let maxKham = (currentMonth % 2 === 0) ? 15 : 14;
      if (currentMonth === 9 && yrInfo.isAthikawan) maxKham = 15;
      
      if (currentPhase === 'ออก' && currentKham > 15) { 
        currentKham = 1; 
        currentPhase = 'แรม'; 
      } else if (currentPhase === 'แรม' && currentKham > maxKham) {
        currentKham = 1; 
        currentPhase = 'ออก';
        if (currentMonth === 9 && yrInfo.isAthikamat && !isLeapMonthActive) {
          isLeapMonthActive = true; 
        } else { 
          isLeapMonthActive = false; 
          currentMonth++; 
          if (currentMonth > 12) { currentMonth = 1; currentYearBE++; } 
        }
      }
    } else {
      currentKham--;
      if (currentPhase === 'ออก' && currentKham < 1) {
        const prevMonth = (currentMonth === 1) ? 12 : currentMonth - 1;
        const prevYear = (currentMonth === 1) ? currentYearBE - 1 : currentYearBE;
        if (currentMonth === 9 && isLeapMonthActive) { isLeapMonthActive = false; currentMonth = 9; }
        else if (currentMonth === 10 && getLunarYearInfo(currentYearBE).isAthikamat) { isLeapMonthActive = true; currentMonth = 9; }
        else { isLeapMonthActive = false; currentMonth = prevMonth; currentYearBE = prevYear; }
        currentPhase = 'แรม'; 
        const yrInfoNow = getLunarYearInfo(currentYearBE);
        currentKham = (currentMonth % 2 === 0 || (currentMonth === 9 && yrInfoNow.isAthikawan)) ? 15 : 14;
      } else if (currentPhase === 'แรม' && currentKham < 1) { 
        currentKham = 15; 
        currentPhase = 'ออก'; 
      }
    }
  }

  const dow = date.getDay();
  const baseDateWan = new Date(2024, 1, 10);
  const diffWan = Math.floor((date.getTime() - baseDateWan.getTime()) / 86400000);
  const wanThaiIdx = (diffWan % 60 + 60) % 60;
  const maeMue = ["เปิก", "กัด", "กด", "ร้วง", "เต่า", "กา", "กาบ", "ดับ", "รวาย", "เมือง"];
  const lukMue = ["ไจ้","เป้า","ยี่","เหม้า","สี","ไส้","สะง้า","เม็ด","สัน","เร้า","เส็ด","ไค้"];
  const wanThai = maeMue[wanThaiIdx % 10] + lukMue[wanThaiIdx % 12];
  
  const yrInfoNow = getLunarYearInfo(currentYearBE);
  const maxWaning = (currentMonth % 2 === 0 || (currentMonth === 9 && yrInfoNow.isAthikawan)) ? 15 : 14;
  const isSin = (currentKham === 8 || currentKham === 15 || (currentPhase === 'แรม' && currentKham === maxWaning));
  
  const isSiaRaw = ((month, dow) => {
    const rules: Record<number, number[]> = {
      1: [0, 1], 2: [2], 3: [4, 6], 4: [3, 5],
      5: [0, 1], 6: [2], 7: [4, 6], 8: [3, 5],
      9: [0, 1], 10: [2], 11: [4, 6], 12: [3, 5]
    };
    return (rules[month] || []).includes(dow);
  })(currentMonth, dow);

  const isGood = dow === 0;
  const extra = extractDetails(isSiaRaw, isSin, isGood, wanThai);
  const phiKin = getWanPhiKin(currentMonth, currentKham, currentPhase);

  return {
    day: date.getDate(),
    lunarText: `${currentPhase === 'ออก' ? 'ขึ้น' : 'แรม'} ${currentKham} ค่ำ`,
    wanThai,
    lunar: {
        phase: currentPhase === 'ออก' ? "waxing" : "waning",
        day: currentKham
    },
    labels: {
        good: isGood ? ["วันดี"] : [],
        bad: isSiaRaw ? ["วันเสีย"] : [],
        special: isSin ? ["วันศีล"] : []
    },
    description: extra.description,
    warnings: extra.warnings,
    rituals: extra.rituals,
    score: isGood ? "good" : (isSiaRaw ? "bad" : "neutral"),
    dateISO: date.toISOString().split('T')[0],
    phiKin: phiKin
  };
}

// ============================================================
// BATCH GENERATOR / SEEDER
// ============================================================

export async function regenerateFiles() {
    const START_YEAR = 2025;
    const END_YEAR = 2035;
    const OUTPUT_DIR = path.join(process.cwd(), 'src/data/v2');
    
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    for (let y = START_YEAR; y <= END_YEAR; y++) {
        for (let m = 0; m < 12; m++) {
            const days = [];
            const date = new Date(y, m, 1);
            while (date.getMonth() === m) {
                const lanna = getLannaDateForSeed(new Date(date));
                if (lanna) days.push(lanna);
                date.setDate(date.getDate() + 1);
            }

            const monthStr = (m + 1).toString().padStart(2, '0');
            const monthKey = `${y}-${monthStr}`;

            const payload = {
                v: "2.1.1",
                y: y + 543,
                m: m + 1,
                days: days
            };

            fs.writeFileSync(path.join(OUTPUT_DIR, `${monthKey}.json`), JSON.stringify(payload, null, 2));

            const resolvedPayload = {
                metadata: {
                    resolvedAt: new Date().toISOString(),
                    strategy: "GENERATED_REPLACEMENT_V2"
                },
                month: monthKey,
                records: days
            };
            fs.writeFileSync(path.join(OUTPUT_DIR, `resolved-${monthKey}.json`), JSON.stringify(resolvedPayload, null, 2));
        }
    }
    console.log("Regeneration Complete.");
}

export async function seedIfEmpty() {
  const count = await db.months.count()
  if (count === 0) {
    const START_YEAR = 2025;
    const END_YEAR = 2035;
    
    for (let y = START_YEAR; y <= END_YEAR; y++) {
        for (let m = 0; m < 12; m++) {
            const days = [];
            const date = new Date(y, m, 1);
            const mm = `${y}-${String(m + 1).padStart(2, "0")}`;
            
            while (date.getMonth() === m) {
                const lanna = getLannaDateForSeed(new Date(date));
                if (lanna) {
                    days.push({
                        ...lanna,
                        day: date.getDate(),
                        month: m + 1,
                        year: y,
                        lunar: lanna.lunarText,
                        labels: [...lanna.labels.good, ...lanna.labels.bad, ...lanna.labels.special]
                    });
                }
                date.setDate(date.getDate() + 1);
            }

            const monthData: any = {
                month: mm,
                data: days,
                version: 1,
                updatedAt: Date.now()
            };
            await db.months.put(monthData);
        }
    }
  }
}

// Execution block if run directly
import { fileURLToPath } from 'url';
const isMain = process.argv[1] && (fileURLToPath(import.meta.url) === path.resolve(process.argv[1]) || process.argv[1].endsWith('seed.ts'));

if (isMain) {
    regenerateFiles().catch(console.error);
}
