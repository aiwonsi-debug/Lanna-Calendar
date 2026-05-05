import fs from 'fs';
import path from 'path';

// ============================================================
// LOGIC ENGINE
// ============================================================
function getLunarYearInfo(yearBE) {
  const cs = yearBE - 1181;
  const harkun = Math.floor((cs * 292207 + 373) / 800);
  return { 
    isAthikamat: ((cs * 7 + 13) % 19) < 7, 
    isAthikawan: !(((cs * 7 + 13) % 19) < 7) && ((harkun * 11 + 650) % 692 <= 137) 
  };
}

/**
 * Extracts specific Lanna details from a generated day
 */
function extractDetails(isSia, isSin, isGood, lunarText, wanThai, date) {
    const description = isSia 
        ? "วันเสียใหญ่ ตามตำราปั๊กขะทืนล้านนาระบุว่าเป็นวันไม่เป็นมงคล ห้ามทำการมงคลทุกประการ\nหากประกอบพิธีมงคลในวันนี้อาจเกิดอุปสรรค ความขัดแย้ง หรืออันตรายตามมาภายหลัง" 
        : "วันดีมงคล เหมาะแก่การเริ่มต้นกิจการงานใหม่ การประกอบพิธีมงคล หรือการติดต่อประสานงาน\nเป็นวันที่เกื้อหนุนดวงชะตาและสร้างความเป็นสิริมงคลให้แก่ผู้ปฏิบัติ";

    const warnings = isSia 
        ? ["ห้ามทำการมงคลทุกประการ", "ไม่ควรเดินทางไกล", "อย่าเริ่มงานใหญ่"] 
        : [];

    const rituals = [
        {
            title: "การตัดผม",
            description: isSia ? "ห้ามตัดผมในวันนี้ จะเสียเสน่ห์และอาภัพรัก" : "ตัดผมวันนี้ดีนัก จะมีเสน่ห์เป็นที่รักแก่คนทั้งหลาย"
        },
        {
            title: "การตัดเล็บ",
            description: isSia ? "ไม่ควรตัดเล็บ จะทำให้มีเรื่องเดือดร้อนใจ" : "ตัดเล็บวันนี้เป็นมงคล จะมีโชคลาภวาสนา"
        }
    ];

    const rawText = `วันที่ ${date.getDate()} ${lunarText} วัน${wanThai} ${isSia ? 'วันเสีย' : 'วันดี'} ${isSin ? 'วันศีล' : ''}\nรายละเอียด: ${description}`;

    return { description, warnings, rituals, rawText };
}

function getLannaDate(date) {
  if (!date || isNaN(date.getTime())) return null;
  const refDate = new Date(2026, 3, 30); 
  const diffDays = Math.floor((date.getTime() - refDate.getTime()) / 86400000);
  
  let currentMonth = 8, currentKham = 14, currentPhase = 'ออก', currentYearBE = 2569;
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
    const rules = {
      1: [0, 1], 2: [2], 3: [4, 6], 4: [3, 5],
      5: [0, 1], 6: [2], 7: [4, 6], 8: [3, 5],
      9: [0, 1], 10: [2], 11: [4, 6], 12: [3, 5]
    };
    return (rules[month] || []).includes(dow);
  })(currentMonth, dow);

  const sitthi = ((d, l) => {
    if ((d===0&&l===12)||(d===1&&l===11)||(d===2&&(l===7||l===12))||(d===3&&(l===3||l===13))||(d===4&&l===6)||(d===5&&l===12)||(d===6&&(l===12||l===15))) return "วันมหาสิทธิโชค";
    if ((d===0&&l===11)||(d===1&&l===5)||(d===2&&l===3)||(d===3&&l===6)||(d===4&&l===12)||(d===5&&l===11)||(d===6&&l===15)) return "วันสิทธิโชค";
    return null;
  })(dow, currentKham);

  const isSitthi = !!sitthi;
  const isWanMai = currentKham === 1 && currentPhase === 'ออก';
  const isUbat = dow === 6;
  const isLokawinat = dow === 3;
  let isSiaFinal = isSiaRaw;

  const isGood = dow === 0;

  const lunarText = `${currentPhase === 'ออก' ? 'ขึ้น' : 'แรม'} ${currentKham} ค่ำ`;
  const extra = extractDetails(isSiaFinal, isSin, isGood, lunarText, wanThai, date);

  return {
    d: date.getDate(),
    s: (isSin ? 4 : 0) | (isSiaFinal ? 2 : 0) | (isGood ? 1 : 0),
    l: lunarText,
    wt: wanThai,
    lunar: {
        phase: currentPhase === 'ออก' ? "waxing" : "waning",
        day: currentKham
    },
    labels: {
        good: isGood ? ["วันดี"] : [],
        bad: isSiaFinal ? ["วันเสีย"] : [],
        special: isSin ? ["วันศีล"] : []
    },
    description: extra.description,
    warnings: extra.warnings,
    rituals: extra.rituals,
    rawText: extra.rawText
  };
}

// ============================================================
// BATCH GENERATOR
// ============================================================
const START_YEAR = 2025;
const END_YEAR = 2035;
const OUTPUT_DIR = './src/data/v2'; // Direct to src/data/v2

function run() {
  console.log(`Running Generator for ${START_YEAR}-${END_YEAR} -> ${OUTPUT_DIR}`);
  
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (let y = START_YEAR; y <= END_YEAR; y++) {
    for (let m = 0; m < 12; m++) {
      const days = [];
      const date = new Date(y, m, 1);
      while (date.getMonth() === m) {
        days.push(getLannaDate(new Date(date)));
        date.setDate(date.getDate() + 1);
      }

      const payload = {
        v: "2.1.0",
        y: y + 543,
        m: m + 1,
        days: days
      };

      const monthStr = (m + 1).toString().padStart(2, '0');
      fs.writeFileSync(path.join(OUTPUT_DIR, `${y}-${monthStr}.json`), JSON.stringify(payload));
    }
  }

  console.log("Generation Complete.");
}

run();
