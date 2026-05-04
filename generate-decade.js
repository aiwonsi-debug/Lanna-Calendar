import fs from 'fs';
import path from 'path';

// ============================================================
// LOGIC ENGINE (Restored from previous research)
// ============================================================
function getLunarYearInfo(yearBE) {
  const cs = yearBE - 1181;
  const harkun = Math.floor((cs * 292207 + 373) / 800);
  return { 
    isAthikamat: ((cs * 7 + 13) % 19) < 7, 
    isAthikawan: !(((cs * 7 + 13) % 19) < 7) && ((harkun * 11 + 650) % 692 <= 137) 
  };
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
  const isSia = ((month, dow) => {
    const rules = { 1:[0,1], 5:[0,1], 9:[0,1], 2:[2], 6:[2], 10:[2], 3:[4,6], 7:[4,6], 11:[4,6], 4:[3,5], 8:[3,5], 12:[3,5] };
    return (rules[month] || []).includes(dow);
  })(currentMonth, dow);

  return {
    d: date.getDate(),
    l: `${currentPhase === 'ออก' ? 'W' : 'R'}-${currentKham}-${currentMonth}`,
    w: wanThai,
    s: (isSin ? 4 : 0) | (isSia ? 2 : 0) | (dow === 0 ? 1 : 0) // Sunday = Good in this simplified model
  };
}

// ============================================================
// BATCH GENERATOR
// ============================================================
const START_YEAR = 2025;
const END_YEAR = 2035;
const OUTPUT_DIR = './public/data/v2';

function run() {
  console.log(`Running Generator for ${START_YEAR}-${END_YEAR}...`);
  const availableYears = [];

  for (let y = START_YEAR; y <= END_YEAR; y++) {
    availableYears.push(y);
    const yearPath = path.join(OUTPUT_DIR, y.toString());
    if (!fs.existsSync(yearPath)) fs.mkdirSync(yearPath, { recursive: true });

    for (let m = 0; m < 12; m++) {
      const days = [];
      const date = new Date(y, m, 1);
      while (date.getMonth() === m) {
        days.push(getLannaDate(new Date(date)));
        date.setDate(date.getDate() + 1);
      }

      const payload = {
        v: "2.0.0",
        y: y + 543,
        m: m + 1,
        days: days
      };

      const monthStr = (m + 1).toString().padStart(2, '0');
      fs.writeFileSync(path.join(yearPath, `${monthStr}.json`), JSON.stringify(payload));
    }
    console.log(`Year ${y} generated.`);
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'manifest.json'), JSON.stringify({
    version: "2.0.0",
    years: availableYears,
    generatedAt: new Date().toISOString()
  }, null, 2));

  console.log("Done.");
}

run();
