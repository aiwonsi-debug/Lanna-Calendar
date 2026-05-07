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
    "กาบไจ้": "แม่วันดี หาวันปลอด (ดีมาก) เหมาะแก่การมงคลทุกประการ",
    "ดับเป้า": "วันเสียใหญ่ อย่าเดินทางค้าขายจะถูกฆ่าหรือประสบอุบัติเหตุ ห้ามทำการมงคล",
    "รวายยี่": "อย่าให้เหล้า/เงินแก่ท่าน จะเป็นหนี้และเสียทรัพย์ภายหลัง (ห้ามให้เงินท่าน)",
    "เมืองเหม้า": "วันกาลกิณี อย่าออกศึก อย่าสู้คดี จะแพ้ภัยตนเอง",
    "เปิกสี": "ควรหมั้นหมาย พ่อแม่วางหื้อลูก มงคลด้านความรักและครอบครัว",
    "กัดไส้": "อย่าสร้างดาบ อย่าซื้ออาวุธ จะเกิดอันตรายจากของมีคม",
    "กดสะง้า": "อย่าขี่ม้าเทียวเมือง จะตกม้าตาย (ห้ามใช้ยานพาหนะใหม่)",
    "ร้วงเม็ด": "อย่าทำหน้าไม้/ปืน จะถูกอาวุธตนเอง",
    "เต่าสัน": "ควรผูกมิตร เจรจาขอสาว หรือติดต่อประสานงานจะสำเร็จ",
    "กาเร้า": "หาสิริมงคล เรียกขวัญข้าว/ลูกเต้าดีมาก (วันเรียกขวัญ)",
    "กาบเส็ด": "อย่าม้วนหูกทอลาย จะตกตาย (ห้ามเริ่มงานฝีมือประณีต)",
    "ดับไค้": "อย่าตัดผม สาวบ่ชมบ่สู้ จะเสียเสน่ห์และอาภัพรัก",
    "รวายไจ้": "อย่าขี่ม้าแอ่วทาง จะเสียนางร่วมห้อง (ห้ามพาคนรักเดินทางไกล)",
    "เมืองเป้า": "อย่าตัดผ้าไหมนุ่ง จะตายจากกัน (ห้ามตัดเย็บเสื้อผ้าใหม่)",
    "เปิกยี่": "อย่าสานเสื่อปูชาน จะร้อนรุ่ม (ห้ามทำเครื่องเรือนหรือของใช้ในบ้าน)",
    "กัดเหม้า": "ดีฟันเรือไว้หว้ายท่า ค้าขายได้แสนคำ (มงคลด้านการค้าทางน้ำ)",
    "กดสี": "หื้อแรกไม้แปล๋งเรือน วัวควายเต๋มคอก (วันปลูกพืชและสร้างบ้าน)",
    "ร้วงไส้": "อย่าเอาขวัญ เยียวเสียหลานเหลน (ห้ามทำพิธีรับขวัญเด็ก)",
    "เต่าสะง้า": "อย่าฝั้นเชือกวัวควาย เยียวตัวตายตมม้วย (ห้ามทำอุปกรณ์เลี้ยงสัตว์)",
    "กาเม็ด": "อย่าฝนหลาวเถี่ยนกล้า จักฆ่าฟันตน (ห้ามลับอาวุธหรือของมีคม)",
    "กาบสัน": "หื้อล้อมวัวควาย ปลูกพืชดีนัก (วันปลูกพืชและทำคอกสัตว์)",
    "ดับเร้า": "หื้อตัดผม ม่ายชู้สาวหากสู้มาหา (ตัดผมแล้วจะมีเสน่ห์)",
    "รวายเส็ด": "อย่าปลูกครัวยังสวน บ่ได้มาก (ห้ามเริ่มสวนใหม่ ผลผลิตจะน้อย)",
    "เมืองไค้": "หื้อยอพลรบท่าน ได้ทั้งช้างและนาง (วันมีชัยชนะเหนือศัตรู)",
    "เปิกไจ้": "ดีใส่รัก ทาเกี๊ยะแป๋งกล่องและกุบ (มงคลด้านงานช่าง and ศิลปะ)",
    "กัดเป้า": "อย่าได้สืบคำเมืองท่านบ่สู้ (ห้ามเจรจาความเมืองหรือเรื่องสำคัญ)",
    "กดยี่": "หื้อสานก๋วยไปค้า ได้คำเต๋มชาน (มงคลด้านการค้าขายและการจักสาน)",
    "ร้วงเหม้า": "ดีเยียะสวน ปลูกยา เป็นดอกดีงาม (วันปลูกพืชสมุนไพร)",
    "เต่าสี": "หื้อกระทำการเรือหอม สวนผักดาดี (วันเริ่มสวนครัว)",
    "กาไส้": "อย่าเอากันกินแขก จักถูกถ้อยคำ (ห้ามจัดงานเลี้ยงใหญ่ จะเกิดเรื่อง)",
    "กาบสะง้า": "หื้อแรกน้ำใส่นา ข้าวเต๋มหลอง (วันเริ่มทำนาหรือเหมืองฝาย)",
    "ดับเม็ด": "อย่าชวนกันค้าขาย เยียวท่านฆ่าเอาครัว (ห้ามทำธุรกิจร่วมทุน)",
    "รวายสัน": "แรกไม้แปล๋งเวียง รบก็จักบ่แพ้ (วันเริ่มสร้างกำแพงหรือที่อยู่อาศัย)",
    "เมืองเร้า": "หื้อยอพลรบท่าน ได้ทั้งช้างและนาง (วันมงคลในการแข่งขัน)",
    "เปิกเส็ด": "อย่าหื้อตกนา เยียวตายโหงท่านฆ่า (ห้ามไปทุ่งนาหรือที่เปลี่ยว)",
    "กัดไค้": "อย่าก่ายห้างยิงกวาง บ่ดี (ห้ามล่าสัตว์)",
    "กดไจ้": "หื้อสานก๋วยไว้ เงินคำเต๋มก๋วย (มงคลด้านการเก็บออม)",
    "ร้วงเป้า": "อย่าแป๋งสวนปลูกอ้อย ต้นงามบ่มีน้ำ (ห้ามปลูกอ้อยหรือไม้รสหวาน)",
    "เต่ายี่": "หื้อปลูกไว้สวน ตกทลายขาวหม้า (วันปลูกพืชที่ให้ผลเป็นทลาย)",
    "กาเหม้า": "อย่าหื้อของแก่ท่าน จักเสียล้านภายลูน (ห้ามบริจาคของใหญ่)",
    "กาบสี": "แป๋งเครื่องย้อมไหมแดง ดีสิริมงคล (มงคลด้านงานย้อมผ้า)",
    "ดับไส้": "เอาเมียมาใหม่ จักได้ลูกตายพราย (ห้ามแต่งงานหรือรับคนเข้าบ้าน)",
    "รวายสะง้า": "แป๋งครกต๋ำข้าว ข้าวบ่ขาดหลอง (มงคลด้านเกษตรกรรม)",
    "เมืองเม็ด": "สานแหทอดน้ำ เต๋มข้องพอหมาน (มงคลด้านการประมง)",
    "เปิกสัน": "หื้อใส่เหล้าบรรณาการ ขุนรักหื้อลาภ (วันเข้าหาผู้ใหญ่)",
    "กัดเร้า": "ก่ายห้างยิงนก หมานนัก (เหมาะแก่การทำการค้าเชิงรุก)",
    "กดเส็ด": "อย่าฝั้นเชือกวัวควาย เสียตนตาย (ห้ามทำพันธะสัญญาผูกมัด)",
    "ร้วงไค้": "อย่าชวนกันกินเหล้า เทียรย่อมผิดกัน (ห้ามดื่มสุราเมรัยจะทะเลาะวิวาท)",
    "เต่าไจ้": "หื้อได้ล้อมคอกวัวควาย วัวตัวใหญ่หม้า (มงคลด้านปศุสัตว์)",
    "กาเป้า": "อย่าชวนกันลงเรือ (ห้ามเดินทางทางน้ำ)",
    "กาบยี่": "สานก๋วยไปกาด ได้ของค้าพอหาม (มงคลด้านการตลาด)",
    "ดับเหม้า": "ตัดเสื้อผ้า นุ่งผ้าใหม่ ขุนนางรัก (วันนุ่งผ้าใหม่จะมีอำนาจบารมี)",
    "รวายสี": "หื้อหาครัวศึก รบก็จักบ่แพ้ (วันเตรียมพร้อมการงาน)",
    "เมืองไส้": "อย่าชวนกันรบท่าน เยียวตายถูกปืน (ห้ามใช้ความรุนแรง)",
    "เปิกสะง้า": "อย่าสร้างครัวศึก เยียวเสียตายบ่แพ้ (ห้ามสะสมอาวุธ)",
    "กัดเม็ด": "หื้อเอาวัวควายมาคอก สุขมาก (มงคลด้านความมั่งคั่ง)",
    "กดสัน": "ห่อหมากถามสาวหุม บ่ร้าง (มงคลด้านการเจรจาความรัก)",
    "ร้วงสัน": "อย่าเย็บลายเข้านุ่ง จะได้ห่มเมื่อตาย (ห้ามปักผ้าลายประณีต)",
    "เต่าเส็ด": "อย่าถมชีไฟ เตาไฟ ผีดั้งจักชัง (ห้ามย้ายหรือซ่อมเตาไฟ)",
    "กาไค้": "อย่าทำการมงคล จะเสียทรัพย์สินเงินทอง (วันเสียโชคลาภ)",
    "ร้วงเร้า": "อย่าตีฆ้องกลอง ผีจะกินตน (ห้ามทำการมงคลหรือส่งเสียงดัง)",
    "กาบไค้": "อย่าดื่มเหล้าในงานเลี้ยง (ห้ามจัดเลี้ยงสุรา)",
  },
  kaoKongInfo: {
    เก้ากอง: "มงคลสูงสุดทุกประการ ได้ทรัพย์มาก ห้ามทำการฌาปนกิจศพเด็ดขาด",
    รองพื้น: "เหมาะทำไร่สวน ปลูกบ้าน ห้ามเก็บฟืนเข้าบ้าน",
    พื้นดอก: "มงคลทุกอย่าง สัตว์เลี้ยงแพร่พันธุ์ดี ทำคอกสัตว์ดี",
    พื้นดาย: "ห้ามซื้อสัตว์มาเลี้ยง ห้ามรับคนงานใหม่ จะไม่เจริญ",
    สุพัก: "แต่งงานมงคลยิ่ง ได้บุตรดี ซื้อสัตว์เลี้ยงดี",
    รับได้: "ติดต่อผู้ใหญ่ดี ห้ามรับฝากของ",
    รับตาย: "ห้ามแต่งงาน ห้ามนำสัตว์ทุกชนิดเข้าบ้าน",
    ขว้ำได้: "ค้าขายดี ห้ามแต่งงานจะร้างรา",
    ไสเจ้า: "ห้ามแต่งงาน ห้ามซื้อของแพง ห้ามนำสัตว์เข้าบ้าน",
    ไสเสีย: "ห้ามค้าขายทางไกล จะประสบอุบัติเหตุระหว่างทาง",
    ท้ายป้าว: "ค้าขายทางบกกำไรดี ห้ามเดินทางทางน้ำ",
    ยี่เพียง: "แต่งงานมงคล ซื้อของมีค่าและสัตว์ดี ค้าขายกำไรมาก",
  },
  monthNames: ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"],
  maeMue: ["เปิก", "กัด", "กด", "ร้วง", "เต่า", "กา", "กาบ", "ดับ", "รวาย", "เมือง"],
  lukMue: ["ไจ้","เป้า","ยี่","เหม้า","สี","ไส้","สะง้า","เม็ด","สัน","เร้า","เส็ด","ไค้"],
  yamData: [
    ["ปลอด","รุ่ง","เสีย","คาบ","ห้าม","สิทธิ","โชค","ชัย"],
    ["รุ่ง","เสีย","คาบ","ห้าม","สิทธิ","โชค","ชัย","ปลอด"],
    ["เสีย","คาบ","ห้าม","สิทธิ","โชค","ชัย","ปลอด","รุ่ง"],
    ["คาบ","ห้าม","สิทธิ","โชค","ชัย","ปลอด","รุ่ง","เสีย"],
    ["ห้าม","สิทธิ","โชค","ชัย","ปลอด","รุ่ง","เสีย","คาบ"],
    ["สิทธิ","โชค","ชัย","ปลอด","รุ่ง","เสีย","คาบ","ห้าม"],
    ["โชค","ชัย","ปลอด","รุ่ง","เสีย","คาบ","ห้าม","สิทธิ"],
  ],
};

const SIA_CHECK: Record<number, number[]> = {
  1: [0, 1], 2: [2], 3: [4, 6], 4: [3, 5],
  5: [0, 1], 6: [2], 7: [4, 6], 8: [3, 5],
  9: [0, 1], 10: [2], 11: [4, 6], 12: [3, 5]
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
  
  const transition = getLannaYearTransition(date.getFullYear());
  const lannaYear = resolveLannaZodiacForDate(date, transition);
  const cs = lannaYear.chulasakarat;
  const kalaYok = getKalaYok(cs);
  const fromIsoDate = (isoDate: string) => {
    const [year, month, day] = isoDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  };
  const sangKhanLongDate = fromIsoDate(transition.sankranLongDate);
  const wanNaoDate = fromIsoDate(transition.naoDate);
  const phayaWanDate = fromIsoDate(transition.payaWanDate);
  const thaloengSokDate = fromIsoDate(transition.thaloengSokDate);

  const yrInfoNow = getLunarYearInfo(currentYearBE);
  const maxWaning = (currentMonth % 2 === 0 || (currentMonth === 9 && yrInfoNow.isAthikawan)) ? 15 : 14;
  const isSin = (currentKham === 8 || currentKham === 15 || (currentPhase === 'แรม' && currentKham === maxWaning));

  const monthMap: Record<number, number> = {1:7,2:6,3:5,4:4,5:3,6:2,7:1,8:0,9:11,10:10,11:9,12:8};
  const kaoKongIndex = (wanThaiIdx % 12 - (monthMap[currentMonth] || 0) + 12) % 12;
  const kaoKongName = Object.keys(DATA.kaoKongInfo)[kaoKongIndex];

  // Fix: lannaMonth rule logic
  const finalLannaMonth = currentMonth;
  const isSiaRaw = (SIA_CHECK[finalLannaMonth] || []).includes(dow);

  const sitthi = ((d, l) => {
    if ((d===0&&l===12)||(d===1&&l===11)||(d===2&&(l===7||l===12))||(d===3&&(l===3||l===13))||(d===4&&l===6)||(d===5&&l===12)||(d===6&&(l===12||l===15))) return "วันมหาสิทธิโชค";
    if ((d===0&&l===11)||(d===1&&l===5)||(d===2&&l===3)||(d===3&&l===6)||(d===4&&l===12)||(d===5&&l===11)||(d===6&&l===15)) return "วันสิทธิโชค";
    return null;
  })(dow, currentKham);

  const isWanMai = currentKham === 1 && currentPhase === 'ออก';

  // Dynamic Kalayok
  const isThongChai = dow === kalaYok.thongChai;
  const isAthipadi = dow === 1; // Unchanged per instruction
  const isUbat = dow === kalaYok.ubat;
  const isLokawinat = dow === kalaYok.lokawinat;

  const isSia = isSiaRaw;

  const fahTeeSang = ((cs % 108) + finalLannaMonth + currentKham) * 5 % 9;

  return {
    date, lannaMonth: finalLannaMonth, lunarDay: currentKham, phase: currentPhase, dow, wanThai,
    fahTeeSang,
    wanThaiDesc: DATA.wanThaiDetailed[wanThai as keyof typeof DATA.wanThaiDetailed] || "",
    isSin,
    cs,
    yearZodiac: lannaYear.zodiacLanna,
    zodiacThai: lannaYear.zodiacThai,
    lannaYear: {
      zodiacLanna: lannaYear.zodiacLanna,
      zodiacThai: lannaYear.zodiacThai,
      chulasakarat: lannaYear.chulasakarat,
    },
    kaoKong: kaoKongName, kaoKongDesc: DATA.kaoKongInfo[kaoKongName as keyof typeof DATA.kaoKongInfo],
    isThongChai, isAthipadi, isUbat, isLokawinat, isWanMai,
    isSia,
    sitthi,
    isFoo: { 1:[1],2:[2],3:[3],4:[4],5:[1],6:[2],7:[3],8:[4],9:[1],10:[2],11:[3],12:[4] }[currentMonth as keyof typeof monthMap]?.includes(dow),
    yam: DATA.yamData[dow],
    sangKhanLong: sangKhanLongDate,
    wanNao: wanNaoDate,
    phayaWan: phayaWanDate,
    thaloengSok: thaloengSokDate,
    lannaYearTransition: transition,
    wanLohk: (["กาลโชค","มหาวัน","มรณะ","นันทะ","วุฒิ","ลาภะ","วินาศ"] as const)[dow]
  };
  }

  export const isWanSia = (month: number, dow: number) => {
  return (SIA_CHECK[month] || []).includes(dow);
  };

  export function getSongkranLabel(date: Date) {
  const info = getLannaDate(date); if (!info) return null;
  const toLoc = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  const dStr = toLoc(date);
  if (dStr === toLoc(info.sangKhanLong)) return "สังขานต์ล่อง";
  if (dStr === toLoc(info.wanNao)) return "วันเนาว์";
  if (dStr === toLoc(info.phayaWan)) return "พญาวัน";
  return null;
  }

  export const getDirections = (dow: number) => {
  const mapping: Record<number, { sri: string, ka: string }> = {
    0: { sri: "ใต้", ka: "เหนือ" },
    1: { sri: "ตะวันตกแจ่งใต้", ka: "ตะวันตกแจ่งเหนือ" },
    2: { sri: "ตะวันออก", ka: "ตะวันออกแจ่งใต้" },
    3: { sri: "ตะวันตกแจ่งเหนือ", ka: "ตะวันตก" },
    4: { sri: "ตะวันออกแจ่งเหนือ", ka: "ตะวันตกแจ่งใต้" },
    5: { sri: "ตะวันตก", ka: "ตะวันออกแจ่งเหนือ" },
    6: { sri: "เหนือ", ka: "ตะวันออก" }
  };
  return mapping[dow] || { sri: "-", ka: "-" };
  };

  export function getKalaYok(cs: number): {
  thongChai: number;   // dow (0=Sun..6=Sat) 
  ubat: number;
  lokawinat: number;
  } {
  // เศษ 1=อาทิตย์, 2=จันทร์, 3=อังคาร, 4=พุธ, 5=พฤหัส, 6=ศุกร์, 0=เสาร์
  // Convert: เศษ→dow_js: เศษ 1→0, 2→1, 3→2, 4→3, 5→4, 6→5, 0→6
  const modToDow = (r: number) => r === 0 ? 6 : r - 1;

  const thaiRaw = (cs * 10 + 3) % 7;
  const ubatRaw  = (cs * 10 + 2) % 7;
  const lokaRaw  = (cs + 1120)   % 7;

  return {
    thongChai:  modToDow(thaiRaw),
    ubat:       modToDow(ubatRaw),
    lokawinat:  modToDow(lokaRaw),
  };
  }

  export function getDailyKalaYoga(rawLunarDay: number, dow: number): { name: string; meaning: string; isGood: boolean } {
  const remainder = (rawLunarDay + dow) % 9;
  const table: Record<number, { name: string; meaning: string; isGood: boolean }> = {
    0: { name: "วิษกัมภ์", meaning: "มีอุปสรรคขัดขวาง ไม่เป็นมงคล ควรหลีกเลี่ยงงานสำคัญ", isGood: false },
    1: { name: "ปรีดิ", meaning: "สำเร็จสมปรารถนา เหมาะแก่การเริ่มงานมงคลทุกประการ", isGood: true },
    2: { name: "อายุษมัน", meaning: "มีอายุยืน สุขภาพดี เหมาะแก่การรักษาพยาบาลและดูแลสุขภาพ", isGood: true },
    3: { name: "เสาภาค", meaning: "มีโชคลาภ เหมาะแก่การค้าขายและหาทรัพย์", isGood: true },
    4: { name: "โศภณ", meaning: "งดงามเป็นสิริมงคล เหมาะแก่งานแต่งงานและพิธีมงคล", isGood: true },
    5: { name: "อติคัณฑ์", meaning: "อันตราย ควรระวังอุบัติเหตุและโรคภัย ไม่เหมาะแก่การเริ่มงาน", isGood: false },
    6: { name: "สุกรรม", meaning: "มีกรรมดีหนุนนำ เหมาะแก่การทำบุญและกุศลกรรม", isGood: true },
    7: { name: "ธฤดิ", meaning: "มั่นคงยั่งยืน เหมาะแก่การลงทุนและวางรากฐาน", isGood: true },
    8: { name: "ศูล", meaning: "เจ็บปวดและสูญเสีย ไม่เป็นมงคล ควรหลีกเลี่ยงงานสำคัญ", isGood: false },
  };
  return table[remainder] || table[0];
  }

  export function getWanPhiKin(lannaMonth: number, lunarDay: number, phase: 'ออก' | 'แรม'): string {
    // ภูมิปัญญาพื้นบ้านล้านนา: วันผีกิ๋น (กฎตายตัวตามค่ำ ครบถ้วน 30 วัน)
    
    if (phase === 'ออก') {
      switch (lunarDay) {
        case 1: case 11: return "ผีกิ๋นผี: บ่ดีเสียผี";
        case 2: case 15: return "ผีกิ๋นหมา: บ่ดีเอาหมาเข้าบ้าน";
        case 3: return "ผีกิ๋นควาย: บ่ดีซื้อควาย บ่ดีกิ๋นเนื้อควาย";
        case 4: return "ผีกิ๋นจ๊าง(ช้าง): บ่ดีซื้อจ๊าง";
        case 5: case 9: return "ผีกิ๋นม้า: บ่ดีซื้อม้ามาขี่มาเลี้ยง";
        case 6: case 10: return "ผีกิ๋นคน: บ่ดีรับเอาคนเข้าบ้าน";
        case 7: case 12: return "ผีกิ๋นไก่: บ่ดีซื้อไก่ บ่ดีกิ๋นไก่";
        case 8: case 13: return "ผีกิ๋นเป็ด: บ่ดีซื้อเป็ด บ่ดีกิ๋นเป็ด";
        case 14: return "ผีกิ๋นหมู: บ่ดีซื้อหมูมาเลี้ยง บ่ดีกิ๋นจิ๊นหมู";
      }
    } else { // แรม (แฮม)
      // เดือนคี่ (1,3,5,7,9,11) มี 29 วัน ดับที่ 14 ค่ำ
      // เดือนคู่ (2,4,6,8,10,12) มี 30 วัน ดับที่ 15 ค่ำ
      const isOddMonth = lannaMonth % 2 !== 0;
      const isDarkMoon = (isOddMonth && lunarDay === 14) || lunarDay === 15;

      if (isDarkMoon) {
        return "ผีกิ๋นผี: บ่ดีเสียผี เอาศพไปเสีย";
      }

      switch (lunarDay) {
        case 1: case 2: case 10: return "ผีกิ๋นหมา: บ่ดีเอาหมาเข้าบ้าน";
        case 3: case 12: return "ผีกิ๋นควาย: บ่ดีซื้อควายและกิ๋นจิ๊นควาย";
        case 4: case 13: return "ผีกิ๋นจ๊าง: ผีกิ๋นจ๊างเข้าบ้าน";
        case 5: return "ผีกิ๋นม้า: บ่ดีซื้อม้าเข้าบ้าน มาขี่";
        case 6: return "ผีกิ๋นคน: บ่ดีฮับ(รับ)เอาคนเข้าบ้าน";
        case 7: return "ผีกิ๋นไก่: บ่ดีซื้อไก่ กิ๋นจิ๊นไก่";
        case 8: return "ผีกิ๋นเป็ด: บ่ดีซื้อเป็ด กิ๋นจิ๊นเป็ด";
        case 9: return "ผีกิ๋นหมู: บ่ดีซื้อหมู กิ๋นจิ๊นหมู";
        case 11: return "ผีกิ๋นงัว(วัว): บ่ดีซื้องัวมาเลี้ยง บ่ดีกิ๋นจิ๊นงัว";
        case 14: return "ผีกิ๋นม้า: บ่ดีซื้อม้าเข้าบ้าน มาขี่"; // จะเข้าเงื่อนไขนี้เฉพาะเดือนคู่
      }
    }
    return "";
  }

  // Remove getPhiKinMonthlyOmen as it's not consistent with the new rules provided
