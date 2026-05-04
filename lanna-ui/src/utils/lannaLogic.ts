// ============================================================
// DATA & CONSTANTS
// ============================================================
export const DATA = {
  monthNames: ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"],
  maeMue: ["เปิก", "กัด", "กด", "ร้วง", "เต่า", "กา", "กาบ", "ดับ", "รวาย", "เมือง"],
  lukMue: ["ไจ้","เป้า","ยี่","เหม้า","สี","ไส้","สะง้า","เม็ด","สัน","เร้า","เส็ด","ไค้"],
};

// ============================================================
// CALCULATIONS
// ============================================================
export function getLunarYearInfo(yearBE: number) {
  const cs = yearBE - 1181;
  const harkun = Math.floor((cs * 292207 + 373) / 800);
  return { 
    isAthikamat: ((cs * 7 + 13) % 19) < 7, 
    isAthikawan: !(((cs * 7 + 13) % 19) < 7) && ((harkun * 11 + 650) % 692 <= 137) 
  };
}

export function getLannaDate(date: Date) {
  if (!date || isNaN(date.getTime())) return null;
  // Reference anchor: 2026-04-30 is 14 Kham Waxing, Month 8 Lanna
  const refDate = new Date(2026, 3, 30); 
  const diffDays = Math.floor((date.getTime() - refDate.getTime()) / 86400000);
  
  let currentMonth = 8, currentKham = 14, currentPhase = 'ออก' as 'ออก' | 'แรม', currentYearBE = 2569;
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
  const wanThai = DATA.maeMue[wanThaiIdx % 10] + DATA.lukMue[wanThaiIdx % 12];
  
  const yrInfoNow = getLunarYearInfo(currentYearBE);
  const maxWaning = (currentMonth % 2 === 0 || (currentMonth === 9 && yrInfoNow.isAthikawan)) ? 15 : 14;
  const isSin = (currentKham === 8 || currentKham === 15 || (currentPhase === 'แรม' && currentKham === maxWaning));
  
  const rules: Record<number, number[]> = { 1:[0,1], 5:[0,1], 9:[0,1], 2:[2], 6:[2], 10:[2], 3:[4,6], 7:[4,6], 11:[4,6], 4:[3,5], 8:[3,5], 12:[3,5] };
  const siaCheck = (rules[currentMonth] || []).includes(dow);

  const sitthi = ((d, l) => {
    if ((d===0&&l===12)||(d===1&&l===11)||(d===2&&(l===7||l===12))||(d===3&&(l===3||l===13))||(d===4&&l===6)||(d===5&&l===12)||(d===6&&(l===12||l===15))) return "วันมหาสิทธิโชค";
    if ((d===0&&l===11)||(d===1&&l===5)||(d===2&&l===3)||(d===3&&l===6)||(d===4&&l===12)||(d===5&&l===11)||(d===6&&l===15)) return "วันสิทธิโชค";
    return null;
  })(dow, currentKham);

  const isSitthi = !!sitthi;
  const isWanMai = currentKham === 1 && currentPhase === 'ออก';
  const isUbat = dow === 6;
  const isLokawinat = dow === 3;
  let isSiaFinal = siaCheck;

  if (isSitthi || isWanMai || isUbat || isLokawinat) {
    isSiaFinal = false;
  }

  return {
    lannaMonth: currentMonth,
    lunarDay: currentKham,
    phase: currentPhase,
    wanThai,
    isSin,
    isSia: isSiaFinal,
    isUbat,
    isLokawinat,
    isWanMai,
    isThongChai: dow === 0,
    isAthipadi: dow === 1,
    sitthi,
  };
}

export const getDirections = (dow: number) => {
  const mapping: Record<number, { sri: string, ka: string }> = {
    0: { sri: "ใต้", ka: "เหนือ" },
    1: { sri: "ตะวันตกเฉียงใต้", ka: "ตะวันตกเฉียงเหนือ" },
    2: { sri: "ตะวันออก", ka: "ตะวันออกเฉียงใต้" },
    3: { sri: "ตะวันตกเฉียงเหนือ", ka: "ตะวันตก" },
    4: { sri: "ตะวันออกเฉียงเหนือ", ka: "ตะวันตกเฉียงใต้" },
    5: { sri: "ตะวันตก", ka: "ตะวันออกเฉียงเหนือ" },
    6: { sri: "เหนือ", ka: "ตะวันออก" }
  };
  return mapping[dow] || { sri: "-", ka: "-" };
};
