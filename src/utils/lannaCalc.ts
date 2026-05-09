import { lannaYearTransitionByGregorianYear, LannaZodiacThaiMap } from '../data/lannaYearTransitions';

// ============================================================
// DATA & CONSTANTS
// ============================================================

export const ZODIAC_EMOJI_MAP: Record<string, string> = {
  "ชวด": "🐭", "ฉลู": "🐮", "ขาล": "🐯", "เถาะ": "🐰", "มะโรง": "🐲",
  "มะเส็ง": "🐍", "มะเมีย": "🐴", "มะแม": "🐑", "วอก": "🐵", "ระกา": "🐔",
  "จอ": "🐶", "กุน": "🐷"
};

export const MAE_MUE = ["กาบ", "ดับ", "รวาย", "เมือง", "เปิก", "กัด", "กด", "ร้วง", "เต่า", "กา"];
export const LUK_MUE = ["ไจ้", "เป้า", "ยี่", "เหม้า", "สี", "ไส้", "สะง้า", "เม็ด", "สัน", "เร้า", "เส็ด", "ไค้"];

export const KAO_KONG_TYPES = [
  "วันรองพื้น", "วันพื้นดอก", "วันพื้นดาย", "วันสุพัก", "วันรับได้", "วันรับตาย",
  "วันขว้ำได้", "วันไสเจ้า", "วันไสเสีย", "วันท้ายป้าว", "วันยี่เพียง", "วันเก้ากอง"
];

export const KAO_KONG_DESC: Record<string, string> = {
  "วันรองพื้น": "อย่าเก็บเอาและเผาถ่าน ไม้ฟืนหลัว บ่ดี การทำไร่ใส่นาและทำสวนดี การปลูกบ้านแปลงเรือนจักอยู่เย็นเป็นสุข",
  "วันพื้นดอก": "กระทำการมงคลกรรมดีทุกอย่าง จักมีลูกหลานมากมาย ทำคอกวัว คอกควาย สร้างแปลงรั้วดี นำสัตว์เลี้ยงมาเลี้ยงดีจักแพร่หลาย",
  "วันพื้นดาย": "ซื้องัวควายและสัตว์เลี้ยงมาเลี้ยงจักตายจาก นำข้าทาสมาเรือนบ่วุฒิ",
  "วันสุพัก": "รับซื้อสัตว์เลี้ยงวัวควายช้างม้า เป็ดไก่ดี การจัดกินแขกแต่งงานวิวาห์มงคลดี มีลูกหญิงชายจักอยู่ในโอวาท",
  "วันรับได้": "อย่าได้รับฝากของไว้ การไปติดต่อผู้ใหญ่บ่ดี",
  "วันรับตาย": "งดการวิวาห์มงคล การกินแขกแต่งงานและห้ามนำสัตว์เลี้ยง 2 ตีน 4 ตีน มาเลี้ยง",
  "วันขว้ำได้": "อย่าเอาผัวเอาเมีย จัดกินแขกแต่งงาน จักเป็นร้างเป็นหม้ายในวันลูน บ่ดี เที่ยวทางไกล ออกเรือนไปค้าขาย จักได้ทรัพย์สมบัติดังปรารถนา",
  "วันไสเจ้า": "อย่าทำการวิวาห์มงคล อย่าซื้อสิ่งของและนำสัตว์ 2 ตีน และ 4 ตีนมาเลี้ยง บ่ดี",
  "วันไสเสีย": "อย่าออกจากเรือนไปค้าขายทางไกล จักประสบอุบัติเหตุกลางทาง",
  "วันท้ายป้าว": "อย่าเดินทางทางน้ำ อย่าไปค้าขายทางเรือ หากำไรยาก ขาดทุนเร็ว การไปค้าขายทางบกดี",
  "วันยี่เพียง": "การวิวาห์มงคลแต่งผัวแต่งเมีย การเอาคนเข้าบ้านเข้าเมือง การซื้อของ สัตว์ 2 ตีน 4 ตีนทุกสิ่งทุกอย่างดี จัดค้าขายมีกำไรดี จักทำกิจการทุกอย่างในวันนี้ดีมาก",
  "วันเก้ากอง": "เป็นวันที่กระทำการมงคลดี จะทำกิจการใด ๆ ดีทุกอย่าง จักมีเงินคำสัมปัตติพอหมื่นบ่ไร้ เอาข้าวใหม่ใส่ยุ้งฉางดี เทียวทางไกลจะกลับคืนมาโดยสวัสดี แต่ห้ามกระทำการฌาปนกิจศพในวันนี้เป็นอันขาด"
};

export const WAN_THAI_DETAILED: Record<string, string> = {
  "กาบไจ้": "แม่วันดี คันจักเยียะได้ หื้อหาวันปลอด (ดี เป็นสิริมงคล)",
  "ดับเป้า": "อย่าได้สานหับไปค้า จะถูกฆ่ากลางทาง (อย่าเดินทางค้าขาย)",
  "รวายยี": "อย่าเอาเหล้าสู่ขวัญ วันลูนเกิดเป็นหนี้ (อย่าให้เหล้าแก่ท้าวพระญา)",
  "เมืองเหม้า": "อย่ายอพลรบท่าน จะตายถูกปืน (อย่าสู้รบ)",
  "เปิกสี": "หื้อห่อหมากถามสาว พ่อแม่หากวางหื้อลูก (ควรหมั้นหมาย)",
  "กัดไส้": "อย่าสร้างดาบเถี่ยนกล้า จักพลันได้ฟันตน (อย่าประดิษฐ์หรือซื้ออาวุธ)",
  "กดสะง้า": "อย่าขี่ม้าเทียวเมือง จักตกม้าตายเผิดหน้า (อย่าออกเดินทาง)",
  "ร้วงเม็ด": "อย่าก่ายห้างยิงกวาง แม่นทำดายบ่ได้ (อย่าทำอาวุธธนูหน้าไม้ และอย่าออกล่าสัตว์)",
  "เต่าสัน": "หื้อห่อหมากขอสาวหุมมาสู่ (ควรผูกมิตร)",
  "กาเร้า": "หื้อหาขวัญลูกเต้า เอาขวัญข้าวแควนดี (ควรถักแห)",
  "กาบเส็ด": "อย่าม้วนหูกทอลาย จะตกตาย บ่ดี",
  "ดับไค้": "อย่าตัดผม ไปม่ายสาว สาวบ่ชมบ่สู้",
  "รวายไจ้": "อย่าได้ขี่ม้าแอ่วเที่ยวทาง จะเสียนางร่วมห้อง",
  "เมืองเป้า": "อย่าตัดผ้าไหมนุ่ง จะตายจากกัน",
  "เปิกยี่": "อย่าได้สานสาด (เสื่อ) ปูชานช่อง เยียวได้ร้อนเอ่าตัวเก่า",
  "กัดเหม้า": "ดีฟันเรือไว้หว้ายท่า ไปค้าได้แสนคำ",
  "กดสี": "หื้อแรกไม้แปล๋งเรือน วัวควายหลายเต๋มชูห้อง",
  "ร้วงไส้": "อย่ากระทำการเอาขวัญ เยียวเสียหลานเหลนกับลูกเต้า",
  "เต่าสะง้า": "ฝั้นเชือกวัวควาย เยียวตัวตายตมม้วย",
  "กาเม็ด": "อย่าฝนหลาวเถี่ยนกล้า เยียวหากฆ่าฟันตน",
  "กาบสัน": "หื้อล้อมวัวควาย มีหลายบ่น้อย",
  "ดับเร้า": "หื้อตัดผม ม่ายชู้สาวหากสู้มาหา",
  "รวายเส็ด": "อย่าปลูกครัวยังสวน เยียดหลือใจบ่ได้มาก",
  "เมืองไค้": "หื้อยอพลรบกับท่าน ได้ทั้งช้างกับนาง",
  "เปิกไจ้": "ดีใส่รัก ทาเกี๊ยะแป๋งกล่อง และกุบ ดี",
  "กัดเป้า": "อย่าได้สืบคำเมืองท่านบ่สู้",
  "กดยี": "หื้อสานก๋วยไปค้า จักได้คำมาเต็มชาน",
  "ร้วงเหม้า": "ดีเยียะสวน ปลูกยา หากเป็นดอกดีงาม",
  "เต่าสี": "หื้อกระทำการเรือหอม สวนผักก็ดาดี",
  "กาไส้": "อย่าเอากันกินแขก จักได้ถูกถ้อยเป็นคำ",
  "กาบสะง้า": "หื้อแรกน้ำใส่นา จักได้ข้าวมาเต๋มหลอง",
  "ดับเม็ด": "อย่าชวนกันไปค้า เยียวท่านฆ่าเอาครัว",
  "รวายสัน": "หื้อแรกไม้แปลงเวียง แม้พลแสนรบบ่แพ้",
  "เมืองเร้า": "หื้อยอพลรบท่าน ได้ทั้งช้างกับนาง",
  "เปิกเส็ด": "อย่าหื้อได้ตกนา เยียวตายโหงท่านฆ่า",
  "กัดไค้": "อย่าก่ายห้างยิงกวาง แม่นทำดายบ่ได้",
  "กดไจ้": "หื้อสานก๋วยไว้ (รอท่า) จะได้เวินคำเต็มก๋วย",
  "ร้วงเป้า": "อย่าแป๋งสวนปลูกอ้อย เป็นต้นงามบ่มีน้ำ",
  "เต่ายี่": "หื้อปลูกไว้ยังสวน ตกทลายขาวหม้า (มาก)",
  "กาเหม้า": "อย่าหื้อของแก่ท่าน จักเสียล้านภายลูน",
  "กาบสี": "แป๋งเครื่องย้อมไหมแดงดี",
  "ดับไส้": "เอาเมียมาใหม่ จักได้ลูกตายพราย",
  "รวายสะง้า": "หื้อแป๋งครกต๋ำเข้า ได้ข้าวมาต๋ำบ่ขาด",
  "เมืองเม็ด": "หื้อสานแห ทอดน้ำได้เต๋มข้องพอหมาน",
  "เปิกสัน": "หื้อใส่เหล้าบรรณาการ ขุนรักหื้อลาภมากนัก",
  "กัดเร้า": "หื้อก่ายห้างยิงนก ได้เต๋มพกเพื่อวันหมาน",
  "กดเส็ด": "อย่าฝั้นเชือกวัวควาย เสียตนตาย เพื่อบ่กัดหญ้า",
  "ร้วงไค้": "อย่าชวนกันกินเหล้า เทียรย่อมผิดกัน",
  "เต่าไจ้": "หื้อได้ล้อมคอกวัวควาย เป็นหลายตัวใหญ่หม้า (มาก)",
  "กาเป้า": "อย่าชวนกันลงเรือ",
  "กาบยี่": "หื่อสานก๋วยไปกาด ได้ของค้าหากพอหาม",
  "ดับเหม้า": "หื้อตัดเสื้อผ้า แหนชู้ ขุนนางรัก",
  "รวายสี": "หื้อหาครัวศึก พลแสนรบบ่แพ้",
  "เมืองไส้": "อย่าชวนกันรบท่าน เยียวตายถูกปืน",
  "เปิกสะง้า": "อย่าสร้างครัวศึก เยียวเสียตายบ่แพ้ท่านฆ่า",
  "กัดเม็ด": "หื้อเอาวัวควายมาคอก เป็นหลายตัว สุขมาก",
  "กดสัน": "หื่อห่อหมากถามสาวหุม บ่ร้าง",
  "ร้วงเร้า": "อย่าเย็บลายเข้านุ่ง (ผ้านุ่ง) เยียวจะได้ห่มเมื่อตาย",
  "เต่าเส็ด": "อย่าถมยังชีไฟ เตาไฟ ผีดั้งจักชังเนอ",
  "กาไค้": "อย่าซื้อวัวควายมาคอก ผีด้ำซ้ำบ่ดีสังแล"
};

const FAH_TEE_SANG_SEQ = [0, 5, 1, 6, 2, 7, 3, 8, 4];

// ============================================================
// LOGIC ENGINE
// ============================================================

export function getLunarYearInfo(yearBE: number) {
  const cs = yearBE - 1181;
  const harkun = Math.floor((cs * 292207 + 373) / 800);
  const isAthikamat = ((cs * 7 + 13) % 19) < 7;
  const isAthikawan = !isAthikamat && ((harkun * 11 + 650) % 692 <= 137);
  return { isAthikamat, isAthikawan };
}

export function getWanPhiKin(day: number, phase: 'ออก' | 'แรม') {
    if (phase === 'ออก') {
        const rules: Record<number, string> = {
            1: "ผีกิ๋นผี: บ่ดีเสียผี",
            2: "ผีกิ๋นหมา: บ่ดีเอาหมาเข้าบ้าน",
            3: "ผีกิ๋นควาย: บ่ดีซื้อควาย บ่ดีกิ๋นเนื้อควาย",
            4: "ผีกิ๋นจ๊าง: บ่ดีซื้อจ๊าง",
            5: "ผีกิ๋นม้า: บ่ดีซื้อม้ามาขี่มาเลี้ยง",
            6: "ผีกิ๋นคน: บ่ดีฮับเอาคนเข้าบ้าน",
            7: "ผีกิ๋นไก่: บ่ดีซื้อไก่ บ่ดีกิ๋นไก่",
            8: "ผีกิ๋นเป็ด: บ่ดีซื้อเป็ด บ่ดีกิ๋นเป็ด",
            9: "ผีกิ๋นม้า: บ่ดีซื้อม้ามาขี่มาเลี้ยง",
            10: "ผีกิ๋นคน: บ่ดีฮับเอาคนเข้าบ้าน",
            11: "ผีกิ๋นผี: บ่ดีเสียผี",
            12: "ผีกิ๋นไก่: บ่ดีซื้อไก่ บ่ดีกิ๋นไก่",
            13: "ผีกิ๋นเป็ด: บ่ดีซื้อเป็ด บ่ดีกิ๋นเป็ด",
            14: "ผีกิ๋นหมู: บ่ดีซื้อหมูมาเลี้ยง บ่ดีกิ๋นจิ๊นหมู",
            15: "ผีกิ๋นหมา: บ่ดีเอาหมาเข้าบ้าน"
        };
        return rules[day] || "";
    } else {
        const rules: Record<number, string> = {
            1: "ผีกิ๋นหมา: บ่ดีเอาหมาเข้าบ้าน",
            2: "ผีกิ๋นหมา: บ่ดีเอาหมาเข้าบ้าน",
            3: "ผีกิ๋นควาย: บ่ดีซื้อควายและกิ๋นจิ๊นควาย",
            4: "ผีกิ๋นจ๊าง: ผีกิ๋นจ๊างเข้าบ้าน",
            5: "ผีกิ๋นม้า: บ่ดีซื้อม้าเข้าบ้าน มาขี่",
            6: "ผีกิ๋นคน: บ่ดีฮับเอาคนเข้าบ้าน",
            7: "ผีกิ๋นไก่: บ่ดีซื้อไก่ กิ๋นจิ๊นไก่",
            8: "ผีกิ๋นเป็ด: บ่ดีซื้อเป็ด กิ๋นจิ๊นเป็ด",
            9: "ผีกิ๋นหมู: บ่ดีซื้อหมู กิ๋นจิ๊นหมู",
            10: "ผีกิ๋นหมา: บ่ดีเอาหมาเข้าบ้าน",
            11: "ผีกิ๋นงัว: บ่ดีซื้องัวมาเลี้ยง บ่ดีกิ๋นจิ๊นงัว",
            12: "ผีกิ๋นควาย: บ่ดีซื้อควายและกิ๋นจิ๊นควาย",
            13: "ผีกิ๋นจ๊าง: ผีกิ๋นจ๊างเข้าบ้าน",
            14: "ผีกิ๋นม้า: บ่ดีซื้อม้าเข้าบ้าน มาขี่",
            15: "ผีกิ๋นผี: บ่ดีเสียผี เอาศพไปเสีย"
        };
        return rules[day] || "";
    }
}

export function getLannaDate(date: Date) {
  if (!date || isNaN(date.getTime())) return null;

  // Reference Point: Dec 31, 2025 -> 4 ออก 13, กัดเม็ด (55), Transitions = 0, fahTeeSangIdx = 0
  const refDate = new Date(2025, 11, 31);
  const diffDays = Math.floor((date.getTime() - refDate.getTime()) / 86400000);
  
  let currentMonth = 4, currentKham = 13, currentPhase: 'ออก' | 'แรม' = 'ออก', currentYearBE = 2569;
  let isLeapMonthActive = false;
  let totalTransitions = 0;
  let fahTeeSangIdx = 0;
  
  const step = diffDays >= 0 ? 1 : -1;
  const absDiff = Math.abs(diffDays);
  
  for (let i = 0; i < absDiff; i++) {
    const yrInfo = getLunarYearInfo(currentYearBE);
    
    // Day counter for Fah Tee Sang
    if (step === 1) {
      fahTeeSangIdx = (fahTeeSangIdx + 1) % 9;
      currentKham++;
      let maxKham = (currentMonth % 2 === 0) ? 15 : 14;
      if (currentMonth === 9 && yrInfo.isAthikawan) maxKham = 15;
      
      if (currentPhase === 'ออก' && currentKham > 15) { 
        currentKham = 1; 
        currentPhase = 'แรม'; 
        // Special Lanna rule: Some traditions jump month number at Full Moon in leap years
        if (currentMonth === 9 && yrInfo.isAthikamat && !isLeapMonthActive) {
           // This handles the user's specific case where May 29 (Waning 1) becomes Month 10
           isLeapMonthActive = true;
           currentMonth = 10;
           totalTransitions++;
        }
      } else if (currentPhase === 'แรม' && currentKham > maxKham) {
        currentKham = 1; 
        currentPhase = 'ออก';
        if (currentMonth === 9 && yrInfo.isAthikamat && !isLeapMonthActive) {
          isLeapMonthActive = true; 
        } else { 
          // If we jumped to 10 at Full Moon, we don't jump again at New Moon
          if (currentMonth !== 10 || !isLeapMonthActive) {
            currentMonth++; 
            if (currentMonth > 12) { currentMonth = 1; currentYearBE++; } 
            totalTransitions++; 
          }
          isLeapMonthActive = false; 
        }
      }
    } else {
      fahTeeSangIdx = (fahTeeSangIdx - 1 + 9) % 9;
      currentKham--;
      if (currentPhase === 'ออก' && currentKham < 1) {
        totalTransitions--;
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
  // Align Tai Day cycle: 2025-12-31 was กัดเม็ด (idx 55)
  // Kab Chai is Idx 0.
  const diffWan = Math.floor((date.getTime() - refDate.getTime()) / 86400000);
  const wanThaiIdx = (55 + diffWan % 60 + 60) % 60;
  const wanThai = MAE_MUE[wanThaiIdx % 10] + LUK_MUE[wanThaiIdx % 12];
  
  // Day types
  const isSia = ((month, d, h) => {
    const rules: Record<number, number[]> = {
      1: [0, 1], 2: [2], 3: [4, 6], 4: [3, 5],
      5: [0, 1], 6: [2], 7: [4, 6], 8: [3, 5],
      9: [0, 1], 10: [2], 11: [4, 6], 12: [3, 5]
    };
    // Rahu (Wed night) for months 2, 6, 10
    if ([2, 6, 10].includes(month) && d === 3 && h >= 18) return true;
    return (rules[month] || []).includes(d);
  })(currentMonth, dow, date.getHours());

  const thongChaiRules = [10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1];
  const athipadiRules = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3];
  const ubatRules = [10, 11, 12, 13, 1, 2, 3, 4, 5, 6, 7, 8];
  const lokawinatRules = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];

  const isThongChai = (currentKham === thongChaiRules[currentMonth - 1]);
  const isAthipadi = (currentKham === athipadiRules[currentMonth - 1]);
  const isUbat = (currentKham === ubatRules[currentMonth - 1]);
  const isLokawinat = (currentKham === lokawinatRules[currentMonth - 1]);

  const sitthi = getSitthiChok(currentKham, dow);

  // Machu day logic
  // กฎวันมัจจุ: แรม 4/8/9/13 ค่ำ ตรงกับวัน อาทิตย์/อังคาร/พฤหัส/เสาร์ เป็นต้น (สมมติฐานตามตำราทั่วไป)
  // เพื่อความแม่นยำ จะใช้กฎที่มักพบในปั๊กกะตืนล้านนา
  const isMachu = (currentPhase === 'แรม' && (
    (currentKham === 4 && dow === 0) || 
    (currentKham === 8 && dow === 2) || 
    (currentKham === 9 && dow === 4) || 
    (currentKham === 13 && dow === 6)
  ));
  const isMahaMachu = (currentPhase === 'แรม' && currentKham === 14 && (dow === 2 || dow === 6));

  // CS and Zodiac logic
  const transition = lannaYearTransitionByGregorianYear.get(date.getFullYear());
  const payaWan = transition ? new Date(transition.payaWanDate) : new Date(date.getFullYear(), 3, 16);
  const isNewYear = (
    date.getMonth() > payaWan.getMonth() ||
    (date.getMonth() === payaWan.getMonth() && date.getDate() >= payaWan.getDate())
  );
  const cs = isNewYear
    ? transition?.newChulasakarat ?? (date.getFullYear() - 638)
    : transition?.oldChulasakarat ?? (date.getFullYear() - 639);
  const zodiacLannaRaw = isNewYear ? transition?.newZodiac ?? "" : transition?.oldZodiac ?? "";
  const zodiacThai = zodiacLannaRaw ? (LannaZodiacThaiMap[zodiacLannaRaw as keyof typeof LannaZodiacThaiMap] ?? "") : "";
  // Mae Mue for Zodiac: CS ending in 6 is "กาบ" (index 0)
  const zodiacMaeMueIdx = (cs + 4) % 10;
  const zodiacLanna = zodiacLannaRaw ? `${MAE_MUE[zodiacMaeMueIdx]}${zodiacLannaRaw}` : "";

  // Kao Kong logic
  const kaoKongIdx = (wanThaiIdx + totalTransitions + 7) % 12;
  const kaoKong = KAO_KONG_TYPES[kaoKongIdx];

  // Fah Tee Sang
  const fahTeeSang = FAH_TEE_SANG_SEQ[fahTeeSangIdx];

  // Panja Dithi
  const panjaDithiList = ["นันทาดิถี", "ภัทราดิถี", "ไชยาดิถี", "ปุณณาดิถี", "ริตตาดิถี"];
  const panjaDithi = panjaDithiList[(currentKham - 1) % 5];

  return {
    date,
    lannaMonth: currentMonth,
    lunarDay: currentKham,
    phase: currentPhase,
    wanThai,
    wanThaiDesc: WAN_THAI_DETAILED[wanThai] || "-",
    isSia,
    isUbat,
    isLokawinat,
    isSin: (currentKham === 8 || currentKham === 15 || (currentPhase === 'แรม' && currentKham === ((currentMonth % 2 === 0) ? 15 : 14))),
    isThongChai,
    isAthipadi,
    sitthi,
    cs,
    yearZodiac: zodiacLanna + (zodiacThai ? ` (${zodiacThai})` : ""),
    lannaYear: { zodiacLanna, zodiacThai, chulasakarat: cs },
    kaoKong,
    kaoKongDesc: KAO_KONG_DESC[kaoKong],
    fahTeeSang,
    isLomLuang: (currentMonth === currentKham),
    wanMuai: getWanMuai(currentKham, currentPhase),
    wanPhiKin: getWanPhiKin(currentKham, currentPhase),
    panjaDithi
  };
}

export function getSongkranLabel(date: Date) {
  const transition = lannaYearTransitionByGregorianYear.get(date.getFullYear());
  if (transition) {
    const formatDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dateStr = formatDate(date);
    if (dateStr === transition.sankranLongDate) return "วันสังขานต์ล่อง";
    if (dateStr === transition.naoDate) return "วันเนาว์";
    if (dateStr === transition.payaWanDate) return "วันพญาวัน";
    const payaWan = new Date(transition.payaWanDate);
    payaWan.setDate(payaWan.getDate() + 1);
    if (dateStr === formatDate(payaWan)) return "วันปากปี";
  }
  return null;
}

export function getDirections(dow: number) {
  const sri = ["ใต้", "ตะวันตกตกเฉียงเหนือ", "เหนือ", "ตะวันตกออกเฉียงเหนือ", "ตะวันตกออก", "ตะวันตกออกเฉียงใต้", "ตะวันตกตก"];
  const ka = ["เหนือ", "ใต้", "ตะวันตกออกเฉียงเหนือ", "ตะวันตกตกเฉียงเหนือ", "ตะวันตกตกเฉียงใต้", "ตะวันตกตก", "ตะวันตกออก"];
  return { sri: sri[dow], ka: ka[dow] };
}

export function getDailyKalaYoga(lunarDay: number, dow: number) {
  const names = ["ธงชัย", "อธิบดี", "อุบาทว์", "โลกาวินาศ"];
  const val = (lunarDay + dow) % 4;
  const meanings = ["เป็นวันดีเลิศ", "เป็นวันแห่งความสำเร็จ", "เป็นวันแห่งอุปสรรค", "เป็นวันแห่งความวิบัติ"];
  return { name: names[val], meaning: meanings[val], isGood: val < 2 };
}

export function getWanMuai(day: number, phase: 'ออก' | 'แรม') {
    const muaiRules: Record<string, Record<number, string>> = {
        'ออก': {
            1: "ม้วยบ้าน (ผีกินผี): สร้างบ้านไม่ดี ปลูกมะม่วง ขนุนดี",
            2: "ม้วยน้ำ: เอาน้ำเข้าบ้าน ทำเหมืองฝายไม่ดี",
            3: "ม้วยเรือน (ผีกินไก่): เรียกขวัญไม่มา ปลูกต้นไม้ไม่ดี",
            4: "ม้วยดิน (ผีกินหมู): ทำนา ซื้อที่ดินทำสวนไม่ดี ปลูกต้นไม้ดี",
            5: "ม้วยน้ำ: เลี้ยงหมาไม่ดี ปลูกต้นไม้ไม่ดี",
            6: "ม้วยข้าว (ผีกินวัว): ปลูกยุ้งข้าว เอาข้าวเข้าบ้านไม่ดี",
            7: "ม้วยท้าวพระยา: แต่งตั้งท้าวพระยาไม่ได้",
            8: "ม้วยเสนาอำมาตย์ (ผีกินช้าง): แต่งตั้งขุนนาง ผู้ใหญ่บ้าน กำนันไม่ดี",
            9: "ม้วยกล้วย อ้อย หมอ: แต่งตั้งหมอไม่ดี ปลูกต้นไม้ไม่ดี",
            10: "ม้วยคนเฒ่า (ผีกินคน): ให้คนเฒ่าเข้าบ้านไม่ดี",
            11: "ม้วยบ่าวสาว: แต่งงานไม่ดี",
            12: "ม้วยพ่อเรือน แม่เรือน: แต่งงานขึ้นบ้านใหม่ไม่ดี",
            13: "ม้วยไร่นา สวน: ปลูกต้นไม้ สร้างสวนไม่ได้",
            14: "ม้วยเจ้าสรม: บวชพระเณรทำพิธีสงฆ์ไม่ได้ พุทธาภิเษกไม่ได้",
            15: "ม้วยผีอารักษ์: ตั้งศาลพระภูมิไม่ได้ ปลูกครัว ปลูกไม้ดี"
        },
        'แรม': {
            1: "ม้วย (ผีกินหมา): ซื้อข้าว ปลูกข้าว ทำยุ้งข้าวไม่ดี",
            2: "ม้วยผู้เฒ่า: เอาผู้เฒ่าเข้าบ้านไม่ดี",
            3: "ม้วยขุนนาง (ผีกินควาย): ปลูกครัวดี ตั้งขุนนางไม่ดี",
            4: "ม้วยน้ำ (ผีกินช้าง): เอาน้ำเข้าบ้าน ทำเหมือนฝายไม่ดี ปลูกครัวดี",
            5: "ม้วยไม้: ปลูกไม่ดี",
            6: "ม้วยผู้หญิง: เอาผู้หญิงมาอยู่บ้านไม่ดี",
            7: "ม้วย: ติดตั้งไฟฟ้า กองไฟไม่ได้ ปลูกครัวไม่ดี",
            8: "ม้วยบ่าวสาว: แต่งงานไม่ดี ปลูกครัวดี",
            9: "ม้วยนักปราชญ์: แต่งตั้งนักปราชญ์ ตั้งอาจารย์ไม่ได้",
            10: "ม้วยน้ำ (ผีกินหมา): ปลูกครัวไม่ดี ใช้น้ำเอาน้ำเข้านาไม่ดี",
            11: "ม้วยข้าวของเงินคำ: ไปเอาทองเงินไม่ดี",
            12: "ม้วยสัตว์ต่างๆ: เอาสัตว์มาเลี้ยงไม่ได้ ปลูกครัวดี",
            13: "ม้วยพ่อค้า (ผีกินช้าง): ขวัญไม่มา ปลูกครัวดี ค้าขายไม่ดี",
            14: "ม้วยสรม: บวชพระเณร ประชุมสงฆ์ อบรมโภชน์ไม่ได้",
            15: "ม้วยคฤหัสถ์ (ผีกินผี): ขวัญไม่มา การแต่งตั้ง การประชุมไม่ดี ปลูกครัวดี"
        }
    };
    return muaiRules[phase]?.[day] || "";
}

export function getUbakong(dow: number, hour: number) {
    // Standard Ubakong rules: 4=Sii Soon, 1=Nueng Soon, 0=Plod Soon, -1=Kaka-bat
    const grid = [
        [4, 0, -1, 0, 1], // Sun
        [1, 4, 0, -1, 0], // Mon
        [0, 1, 4, 0, -1], // Tue
        [-1, 0, 1, 4, 0], // Wed
        [0, -1, 0, 1, 4], // Thu
        [4, 0, -1, 0, 1], // Fri
        [1, 4, 0, -1, 0]  // Sat
    ];
    const timeSlots = [6, 8.4, 10.8, 13.2, 15.6, 18]; 
    const slot = timeSlots.findIndex(t => hour < t + 2.4);
    const score = grid[dow][slot === -1 ? 4 : slot];
    
    if (score === 4) return "สี่ศูนย์: พูนผล แม้จรดลดีหนักหนา มีลาภล้นคณนา เร่งยาตราจะมีชัย";
    if (score === 1) return "หนึ่งศูนย์: อย่าพึงจร แม้ราญรอนจะอัปรา";
    if (score === 0) return "ปลอดศูนย์: พูลสวัสดิ์ ภัยพิบัติลาภบ่มี";
    if (score === -1) return "กากบาท: ตัวอัปรีย์ แม้จรลีจะอัปรา";
    return "";
}

export function getDailyRituals(dow: number) {
  const rituals: Record<number, { title: string; description: string }[]> = {
    0: [ // Sunday
      { title: "ตัดผม", description: "อายุยืน" },
      { title: "ตัดเล็บ", description: "มีศัตรูมาก (ไม่ดี)" },
      { title: "ทาน้ำมัน", description: "จะหายโฉม (ไม่ดี)" },
      { title: "นุ่งผ้าใหม่", description: "ชนะศัตรู" },
      { title: "ก่อนเดินทาง", description: "อ่านใส่หัวเสียก่อนจึงไป" }
    ],
    1: [ // Monday
      { title: "ตัดผม", description: "มีภัย (ไม่ดี)" },
      { title: "ตัดเล็บ", description: "คนจะรัก" },
      { title: "ทาน้ำมัน", description: "ชอบใจคน" },
      { title: "นุ่งผ้าใหม่", description: "ชอบใจคนรัก" },
      { title: "ก่อนเดินทาง", description: "แต่งตัวแล้วนอนเสียก่อนจึงไป" }
    ],
    2: [ // Tuesday
      { title: "ตัดผม", description: "มีศัตรูมาก (ไม่ดี)" },
      { title: "ตัดเล็บ", description: "จะฉิบหาย (ไม่ดี)" },
      { title: "ทาน้ำมัน", description: "จากกันมิดี (ไม่ดี)" },
      { title: "นุ่งผ้าใหม่", description: "จะมีทุกข์ (ไม่ดี)" },
      { title: "ก่อนเดินทาง", description: "กินน้ำเสียก่อนจึงไป" }
    ],
    3: [ // Wednesday
      { title: "ตัดผม", description: "จะมีความ (ไม่ดี)" },
      { title: "ตัดเล็บ", description: "จำเริญสวัสดิ์" },
      { title: "ทาน้ำมัน", description: "สุขสวัสดี" },
      { title: "นุ่งผ้าใหม่", description: "มีสุขสวัสดิ์" },
      { title: "ก่อนเดินทาง", description: "ให้คนทั้งหลายกินข้าวแล้วจึงไป" }
    ],
    4: [ // Thursday
      { title: "ตัดผม", description: "เทพยุดารักษา" },
      { title: "ตัดเล็บ", description: "จะมีลูกมาก" },
      { title: "ทาน้ำมัน", description: "เทพยุดารักษา" },
      { title: "นุ่งผ้าใหม่", description: "สวัสดิ์" },
      { title: "ก่อนเดินทาง", description: "หยิบเอาเถ้าขาวเจิมหน้าผากแล้วจึงไป" }
    ],
    5: [ // Friday
      { title: "ตัดผม", description: "อาหารมาก" },
      { title: "ตัดเล็บ", description: "อาหารมาก" },
      { title: "ทาน้ำมัน", description: "อาหารมาก" },
      { title: "นุ่งผ้าใหม่", description: "มีสุข" },
      { title: "ก่อนเดินทาง", description: "ทำเครื่องหอมแล้วจึงไป" }
    ],
    6: [ // Saturday
      { title: "ตัดผม", description: "สิทธิทุกวัน" },
      { title: "ตัดเล็บ", description: "จะเจ็บไข้มิดี (ไม่ดี)" },
      { title: "ทาน้ำมัน", description: "สาระพัดประสิทธิ" },
      { title: "นุ่งผ้าใหม่", description: "ตัวตาย (ไม่ดี)" },
      { title: "ก่อนเดินทาง", description: "ทำเป็นโกรธวิวาทก่อนจึงไป" }
    ]
  };
  return rituals[dow] || [];
}

export function getSitthiChok(kham: number, dow: number): string | null {
  // มาตรฐานดิถีโชค (อมฤตโชค, มหาสิทธิโชค, สิทธิโชค, ชัยโชค, ราชาโชค)
  // อ้างอิงความสัมพันธ์ระหว่าง วันในสัปดาห์ (DOW) และ ค่ำ (1-15)
  const rules: Record<number, Record<number, string>> = {
    0: { 8: "อมฤตโชค", 14: "มหาสิทธิโชค", 11: "สิทธิโชค", 13: "ชัยโชค", 3: "ราชาโชค" }, // Sun
    1: { 3: "อมฤตโชค", 12: "มหาสิทธิโชค", 5: "สิทธิโชค", 14: "ชัยโชค", 5: "ราชาโชค" }, // Mon (5 duplicated in some texts)
    2: { 9: "อมฤตโชค", 13: "มหาสิทธิโชค", 14: "สิทธิโชค", 10: "ชัยโชค", 11: "ราชาโชค" }, // Tue
    3: { 2: "อมฤตโชค", 4: "มหาสิทธิโชค", 10: "สิทธิโชค", 8: "ชัยโชค", 14: "ราชาโชค" }, // Wed
    4: { 4: "อมฤตโชค", 7: "มหาสิทธิโชค", 9: "สิทธิโชค", 5: "ชัยโชค", 10: "ราชาโชค" }, // Thu
    5: { 1: "อมฤตโชค", 10: "มหาสิทธิโชค", 11: "สิทธิโชค", 11: "ชัยโชค", 1: "ราชาโชค" }, // Fri
    6: { 5: "อมฤตโชค", 15: "มหาสิทธิโชค", 4: "สิทธิโชค", 4: "ชัยโชค", 2: "ราชาโชค" }, // Sat
  };

  return rules[dow]?.[kham] || null;
}
