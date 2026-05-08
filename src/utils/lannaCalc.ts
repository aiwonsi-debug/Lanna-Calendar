import { lannaYearTransitionByGregorianYear, LannaZodiacThaiMap } from '../data/lannaYearTransitions';
import { getLannaYearTransition, resolveLannaZodiacForDate } from "./getLannaZodiac";

// ============================================================
// DATA & CONSTANTS
// ============================================================
export const ZODIAC_EMOJI_MAP: Record<string, string> = {
  "ชวด": "🐭", "ฉลู": "🐮", "ขาล": "🐯", "เถาะ": "🐰", "มะโรง": "🐲",
  "มะเส็ง": "🐍", "มะเมีย": "🐴", "มะแม": "🐑", "วอก": "🐵", "ระกา": "🐔",
  "จอ": "🐶", "กุน": "🐷"
};

export const DATA = {
  wanThaiDetailed: {
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
  }
};

// ============================================================
// LOGIC ENGINE
// ============================================================

/**
 * Calculates Athikamat and Athikawan status for a Gregorian year.
 */
export function getLunarYearInfo(yearBE: number) {
  const cs = yearBE - 1181;
  const harkun = Math.floor((cs * 292207 + 373) / 800);
  const isAthikamat = ((cs * 7 + 13) % 19) < 7;
  const isAthikawan = !isAthikamat && ((harkun * 11 + 650) % 692 <= 137);
  return { isAthikamat, isAthikawan };
}

/**
 * Main Lanna Date Engine
 */
export function getLannaDate(date: Date) {
  if (!date || isNaN(date.getTime())) return null;

  // Use the same reference point as the generator for consistency
  const refDate = new Date(2026, 3, 30); // 2026-04-30
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

  const isUbat = (currentMonth === 1 && currentKham === 10) || (currentMonth === 5 && currentKham === 1);
  const isLokawinat = (currentMonth === 3 && currentKham === 3) || (currentMonth === 7 && currentKham === 5);
  
  const thongChaiRules = [10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1];
  const athipadiRules = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
  const isThongChai = (currentKham === thongChaiRules[currentMonth - 1]);
  const isAthipadi = (currentKham === athipadiRules[currentMonth - 1]);

  const sitthiRules = ["มหาสิทธิโชค", "สิทธิโชค", "ชัยโชค", "ราชาโชค"];
  const sitthi = (sitthiRules[(currentKham + dow) % 4]);

  // Refactored CS and Zodiac logic using transitions
  const transition = lannaYearTransitionByGregorianYear.get(date.getFullYear());
  const payaWan = transition ? new Date(transition.payaWanDate) : new Date(date.getFullYear(), 3, 16);
  
  const isNewYear = (
    date.getMonth() > payaWan.getMonth() ||
    (date.getMonth() === payaWan.getMonth() && date.getDate() >= payaWan.getDate())
  );
  
  const cs = isNewYear
    ? (transition?.newChulasakarat ?? (date.getFullYear() - 638))
    : (transition?.oldChulasakarat ?? (date.getFullYear() - 639));
    
  const zodiacLanna = isNewYear
    ? (transition?.newZodiac ?? "")
    : (transition?.oldZodiac ?? "");
    
  const zodiacThai = zodiacLanna ? (LannaZodiacThaiMap as any)[zodiacLanna] : "";

  return {
    date,
    lannaMonth: currentMonth,
    lunarDay: currentKham,
    phase: currentPhase,
    wanThai,
    wanThaiDesc: DATA.wanThaiDetailed[wanThai] || "-",
    isSia: isSiaRaw,
    isUbat,
    isLokawinat,
    isSin,
    isThongChai,
    isAthipadi,
    sitthi,
    cs,
    yearZodiac: zodiacLanna + (zodiacThai ? ` (${zodiacThai})` : ""),
    lannaYear: {
      zodiacLanna,
      zodiacThai,
      chulasakarat: cs,
    },
    kaoKong: "", 
    kaoKongDesc: "",
    fahTeeSang: 0
  };
}

/**
 * Supplemental Lanna Helpers
 */
export function getSongkranLabel(date: Date) {
  const m = date.getMonth();
  const d = date.getDate();
  if (m === 3) {
    if (d === 13) return "วันสังขานต์ล่อง";
    if (d === 14) return "วันเนาว์";
    if (d === 15) return "วันพญาวัน";
    if (d === 16) return "วันปากปี";
  }
  return null;
}

export function getDirections(dow: number) {
  const sri = ["ใต้", "ตะวันตกเฉียงเหนือ", "เหนือ", "ตะวันออกเฉียงเหนือ", "ตะวันออก", "ตะวันออกเฉียงใต้", "ตะวันตก"];
  const ka = ["เหนือ", "ใต้", "ตะวันออกเฉียงเหนือ", "ตะวันตกเฉียงเหนือ", "ตะวันตกเฉียงใต้", "ตะวันตก", "ตะวันออก"];
  return { sri: sri[dow], ka: ka[dow] };
}

export function getDailyKalaYoga(lunarDay: number, dow: number) {
  const names = ["ธงชัย", "อธิบดี", "อุบาทว์", "โลกาวินาศ"];
  const val = (lunarDay + dow) % 4;
  const meanings = ["เป็นวันดีเลิศ", "เป็นวันแห่งความสำเร็จ", "เป็นวันแห่งอุปสรรค", "เป็นวันแห่งความวิบัติ"];
  return { name: names[val], meaning: meanings[val], isGood: val < 2 };
}

export function getWanPhiKin(month: number, day: number, phase: 'ออก' | 'แรม') {
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
