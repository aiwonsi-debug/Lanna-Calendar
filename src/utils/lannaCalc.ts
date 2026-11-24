// ============================================================
// ตัวคำนวณปฏิทินล้านนา (สูตรล้วน ไม่ใช้ตารางรายวัน)
// พอร์ตตรงจากตัวคำนวณ Python ที่พิสูจน์แล้ว: calc/lanna_calc.py
// แหล่งสูตรและจุดยึด: audit/formula-report.md และ audit/sitthi-labels-report.md
// - อัตตาสุริยยาตร์ (หรคุณ/อวมาน/มาสเกณฑ์/ดิถี) จากคัมภีร์สุริยยาตร์ (มานัตต์)
// - โครงสร้างเดือนจันทรคติราชการ: ออก 15 ค่ำเสมอ, แรม 14 (เดือนคี่) / 15 (เดือนคู่)
//   อธิกมาส = เดือน 8 ภาคกลาง (เดือน 10 ล้านนา) สองหน
// - เดือนล้านนา = เดือนภาคกลาง + 2 (เกี๋ยง..สิบสอง = 1..12)
// - การสะกดตามฉบับมหาวิทยาลัยเชียงใหม่: ดับใส้, ริทธาดิถี, ภัททราดิถี,
//   อมริสสโชค, ไชยโชค, ยีเพียง, พืน, ท้ายป้าว
// ============================================================

// ---------- ตัวช่วยวันที่ (ทำงานบนเลขวัน UTC กันปัญหาเขตเวลา) ----------
const DAY_MS = 86400000;
const dayNumOf = (y: number, m0: number, d: number) => Math.floor(Date.UTC(y, m0, d) / DAY_MS);
const dayNumFromDate = (date: Date) => dayNumOf(date.getFullYear(), date.getMonth(), date.getDate());
const dateFromDayNum = (n: number) => new Date(n * DAY_MS);
const fmtISO = (n: number) => {
  const d = dateFromDayNum(n);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
};
const mod = (a: number, n: number) => ((a % n) + n) % n;
// อาทิตย์ = 0 (dayNum 0 = 1970-01-01 = วันพฤหัสบดี)
const weekday0 = (dayNum: number) => mod(dayNum + 4, 7);

// ---------- สุริยยาตร์: อัตตาเถลิงศกของจุลศักราช ----------
export function atta(cs: number) {
  const x = cs * 292207 + 373;
  const horakhun = Math.floor(x / 800) + 1;
  const kammachapon = 800 - (x % 800);
  const a = 11 * horakhun + 650;
  const avoman = a % 692;
  const q = Math.floor(a / 692);
  const masaken = Math.floor((q + horakhun) / 30);
  const dithi = (q + horakhun) % 30;
  return { horakhun, kammachapon, avoman, masaken, dithi };
}

// จุดยึด: วันพญาวัน (เถลิงศก) จ.ศ. 1388 = 16 เม.ย. 2026 (ฉบับ มช. 2569)
const PHAYAWAN_1388 = dayNumOf(2026, 3, 16);

export function phayawanDay(cs: number): number {
  return PHAYAWAN_1388 + (atta(cs).horakhun - atta(1388).horakhun);
}

export function isAdhikamasaCS(cs: number): boolean {
  return atta(cs + 1).masaken - atta(cs).masaken === 13;
}

// ---------- โครงสร้างปีจันทรคติ ----------
// จุดยึด: ออก 1 ค่ำ เดือนเกี๋ยง ของปีจันทรคติที่สงกรานต์ 1388 ตกอยู่ = 23 ก.ย. 2025
const LUNAR_YEAR0_START = dayNumOf(2025, 8, 23);
const LUNAR_YEAR0_CS = 1388;

export const LANNA_MONTH_NAMES = ["", "เกี๋ยง", "ยี่", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ", "สิบเอ็ด", "สิบสอง"];

function lunarYearMonths(csInside: number): [number, number][] {
  const months: [number, number][] = [];
  for (let m = 1; m <= 12; m++) {
    months.push([m, m % 2 === 1 ? 29 : 30]);
    if (m === 10 && isAdhikamasaCS(csInside)) months.push([10, 30]); // เดือนสิบสองหน (อธิกมาส)
  }
  return months;
}
function lunarYearLength(csInside: number): number {
  return lunarYearMonths(csInside).reduce((s, [, L]) => s + L, 0);
}

export function lunarFromGregorian(dayNum: number): { lannaMonth: number; phase: 'ออก' | 'แรม'; kham: number } {
  let start = LUNAR_YEAR0_START;
  let cs = LUNAR_YEAR0_CS;
  if (dayNum >= start) {
    while (dayNum >= start + lunarYearLength(cs)) { start += lunarYearLength(cs); cs += 1; }
  } else {
    while (dayNum < start) { cs -= 1; start -= lunarYearLength(cs); }
  }
  let offset = dayNum - start;
  for (const [m, L] of lunarYearMonths(cs)) {
    if (offset < L) {
      if (offset < 15) return { lannaMonth: m, phase: 'ออก', kham: offset + 1 };
      return { lannaMonth: m, phase: 'แรม', kham: offset - 14 };
    }
    offset -= L;
  }
  throw new Error("lunarFromGregorian: unreachable");
}

// ---------- ปีล้านนา / จุลศักราช ----------
export const MAE_MUE = ["กาบ", "ดับ", "รวาย", "เมือง", "เปิก", "กัด", "กด", "ร้วง", "เต่า", "ก่า"];
export const LUK_MUE = ["ใจ้", "เป้า", "ยี", "เหม้า", "สี", "ใส้", "สะง้า", "เม็ด", "สัน", "เร้า", "เส็ด", "ใค้"];
export const LUK_THAI = ["ชวด", "ฉลู", "ขาล", "เถาะ", "มะโรง", "มะเส็ง", "มะเมีย", "มะแม", "วอก", "ระกา", "จอ", "กุน"];

export function lannaYearOf(dayNum: number, gregYear: number): { yearName: string; cs: number; lukThai: string } {
  let cs = gregYear - 638;
  if (dayNum < phayawanDay(cs)) cs -= 1;
  const mae = MAE_MUE[mod(cs + 4, 10)];
  const lukIdx = mod(cs + 10, 12);
  return { yearName: mae + LUK_MUE[lukIdx], cs, lukThai: LUK_THAI[lukIdx] };
}

// ---------- วันไท (รอบ 60) ----------
const MAE_DAY = MAE_MUE;
const LUK_DAY = ["ใค้", "ใจ้", "เป้า", "ยี", "เหม้า", "สี", "ใส้", "สะง้า", "เม็ด", "สัน", "เร้า", "เส็ด"];
const WANTHAI_ANCHOR = dayNumOf(2026, 0, 1); // = ดับใค้ (ฉบับ มช.)

export function wanThaiOf(dayNum: number): string {
  const n = dayNum - WANTHAI_ANCHOR;
  return MAE_DAY[mod(1 + n, 10)] + LUK_DAY[mod(n, 12)];
}

// ---------- วันเก้ากอง (รอบ 12) ----------
export const KAO_KONG_TYPES = [
  "วันเก้ากอง", "วันรองพืน", "วันพืนดอก", "วันพืนดาย", "วันสุพัก", "วันรับได้",
  "วันรับตาย", "วันขว้ำได้", "วันไสเจ้า", "วันไสเสีย", "วันท้ายป้าว", "วันยีเพียง"
];
const KAO_ANCHOR_DATE = dayNumOf(2025, 11, 20); // ออก 1 ค่ำ เดือน 4 = ขว้ำได้ (ดัชนี 7)
const KAO_ANCHOR_IDX = 7;

function monthStartsBetween(a: number, b: number): number[] {
  const out: number[] = [];
  let start = LUNAR_YEAR0_START;
  let cs = LUNAR_YEAR0_CS;
  while (start > a) { cs -= 1; start -= lunarYearLength(cs); }
  while (start <= b) {
    let cur = start;
    const seen = new Set<number>();
    for (const [m, L] of lunarYearMonths(cs)) {
      if (!seen.has(m) && a <= cur && cur <= b) out.push(cur);
      seen.add(m);
      cur += L;
    }
    start = cur;
    cs += 1;
  }
  return out;
}

export function kaoKongOf(dayNum: number): string {
  const days = dayNum - KAO_ANCHOR_DATE;
  const starts = monthStartsBetween(Math.min(KAO_ANCHOR_DATE, dayNum), Math.max(KAO_ANCHOR_DATE, dayNum));
  let monthsCrossed: number;
  if (dayNum >= KAO_ANCHOR_DATE) {
    monthsCrossed = starts.filter(s => KAO_ANCHOR_DATE < s && s <= dayNum).length;
  } else {
    monthsCrossed = -starts.filter(s => dayNum < s && s <= KAO_ANCHOR_DATE).length;
  }
  return KAO_KONG_TYPES[mod(KAO_ANCHOR_IDX + days + monthsCrossed, 12)];
}

// ---------- ฟ้าตีแส่งเศษ (รอบ 9) ----------
const FAH_BASE: Record<number, number> = { 1: 2, 2: 7, 3: 3, 4: 3, 5: 8, 6: 4, 7: 0, 8: 4, 9: 0, 10: 5, 11: 1, 12: 6 };
export function fahTeeSangOf(lannaMonth: number, tithi: number): number {
  return mod(5 * (tithi - 1) + FAH_BASE[lannaMonth], 9);
}

// ---------- ปัญจดิถี (สะกดตามฉบับ มช.) ----------
export const DITHI_NAMES = ["นันทาดิถี", "ภัททราดิถี", "ไชยาดิถี", "ริทธาดิถี", "ปุณณาดิถี"];
export function panjaDithiOf(tithi: number): string {
  return DITHI_NAMES[mod(tithi - 1, 5)];
}

// ---------- วันเสียประจำเดือน (ตำราล้านนา/วัดธาตุคำ) ----------
const SIA_WEEKDAYS: Record<number, number[]> = {
  1: [0, 1], 5: [0, 1], 9: [0, 1],
  2: [2], 6: [2], 10: [2],
  3: [4, 6], 7: [4, 6], 11: [4, 6],
  4: [3, 5], 8: [3, 5], 12: [3, 5]
};
export function isWanSiaOf(dayNum: number, gregYear: number, lannaMonth: number): boolean {
  if (dayNum === phayawanDay(gregYear - 638)) return false; // วันพญาวันไม่นับเป็นวันเสีย
  return (SIA_WEEKDAYS[lannaMonth] || []).includes(weekday0(dayNum));
}

// ---------- วันไหม้ / วันมัจจุ / วันวอดวาย / วันหัวเรียงหมอน ----------
const MAI_KHAM: Record<number, number> = { 0: 1, 1: 4, 2: 6, 3: 9, 4: 5, 5: 3, 6: 7 };
const MACHU_KHAM: Record<number, number> = { 0: 12, 1: 11, 2: 10, 3: 9, 4: 8, 5: 7, 6: 6 };
const WODWAI_KHAM: Record<number, number> = { 1: 9, 2: 9, 3: 9, 4: 10, 5: 10, 6: 10, 7: 7, 8: 7, 9: 7, 10: 8, 11: 8, 12: 8 };
const HUA_WAXING = new Set([2, 7, 10, 11, 12, 13]);
const HUA_WANING = new Set([4, 7, 10, 13, 14]);

// ---------- สิทธิโชค (ตำราวัดธาตุคำ บทที่ 17) ----------
// ค่าเป็น [ค่ำ, ข้างที่จำกัดหรือ null] ต่อวันในสัปดาห์ (อาทิตย์ = 0)
type SitthiEntry = [number, ('ออก' | 'แรม' | null)];
const SITTHI_TABLE: Record<string, Record<number, SitthiEntry>> = {
  "อมริสสโชค": { 0: [8, null], 1: [3, null], 2: [9, null], 3: [2, null], 4: [4, null], 5: [1, 'แรม'], 6: [5, null] },
  "ไชยโชค": { 0: [8, null], 1: [3, null], 2: [11, null], 3: [7, 'แรม'], 4: [4, null], 5: [1, null], 6: [11, null] },
  "สิทธิโชค": { 0: [11, null], 1: [5, null], 2: [14, null], 3: [10, null], 4: [9, 'แรม'], 5: [11, 'แรม'], 6: [4, null] },
  "มหาสิทธิโชค": { 0: [14, null], 1: [12, null], 2: [13, null], 3: [4, null], 4: [7, null], 5: [10, null], 6: [15, null] },
  "ราชาโชค": { 0: [6, null], 1: [3, null], 2: [9, null], 3: [6, null], 4: [10, null], 5: [1, 'ออก'], 6: [5, null] }
};
export const CHOK_NAMES = ["มหาสิทธิโชค", "อมริสสโชค", "ไชยโชค", "ราชาโชค", "สิทธิโชค"];

export const ZODIAC_EMOJI_MAP: Record<string, string> = {
  "ชวด": "🐭", "ฉลู": "🐮", "ขาล": "🐯", "เถาะ": "🐰", "มะโรง": "🐲",
  "มะเส็ง": "🐍", "มะเมีย": "🐴", "มะแม": "🐑", "วอก": "🐵", "ระกา": "🐔",
  "จอ": "🐶", "กุน": "🐷"
};


export const KAO_KONG_DESC: Record<string, string> = {
  "วันรองพืน": "อย่าเก็บเอาและเผาถ่าน ไม้ฟืนหลัว บ่ดี การทำไร่ใส่นาและทำสวนดี การปลูกบ้านแปลงเรือนจักอยู่เย็นเป็นสุข",
  "วันพืนดอก": "กระทำการมงคลกรรมดีทุกอย่าง จักมีลูกหลานมากมาย ทำคอกวัว คอกควาย สร้างแปลงรั้วดี นำสัตว์เลี้ยงมาเลี้ยงดีจักแพร่หลาย",
  "วันพืนดาย": "ซื้องัวควายและสัตว์เลี้ยงมาเลี้ยงจักตายจาก นำข้าทาสมาเรือนบ่วุฒิ",
  "วันสุพัก": "รับซื้อสัตว์เลี้ยงวัวควายช้างม้า เป็ดไก่ดี การจัดกินแขกแต่งงานวิวาห์มงคลดี มีลูกหญิงชายจักอยู่ในโอวาท",
  "วันรับได้": "อย่าได้รับฝากของไว้ การไปติดต่อผู้ใหญ่บ่ดี",
  "วันรับตาย": "งดการวิวาห์มงคล การกินแขกแต่งงานและห้ามนำสัตว์เลี้ยง 2 ตีน 4 ตีน มาเลี้ยง",
  "วันขว้ำได้": "อย่าเอาผัวเอาเมีย จัดกินแขกแต่งงาน จักเป็นร้างเป็นหม้ายในวันลูน บ่ดี เที่ยวทางไกล ออกเรือนไปค้าขาย จักได้ทรัพย์สมบัติดังปรารถนา",
  "วันไสเจ้า": "อย่าทำการวิวาห์มงคล อย่าซื้อสิ่งของและนำสัตว์ 2 ตีน และ 4 ตีนมาเลี้ยง บ่ดี",
  "วันไสเสีย": "อย่าออกจากเรือนไปค้าขายทางไกล จักประสบอุบัติเหตุกลางทาง",
  "วันท้ายป้าว": "อย่าเดินทางทางน้ำ อย่าไปค้าขายทางเรือ หากำไรยาก ขาดทุนเร็ว การไปค้าขายทางบกดี",
  "วันยีเพียง": "การวิวาห์มงคลแต่งผัวแต่งเมีย การเอาคนเข้าบ้านเข้าเมือง การซื้อของ สัตว์ 2 ตีน 4 ตีนทุกสิ่งทุกอย่างดี จัดค้าขายมีกำไรดี จักทำกิจการทุกอย่างในวันนี้ดีมาก",
  "วันเก้ากอง": "เป็นวันที่กระทำการมงคลดี จะทำกิจการใด ๆ ดีทุกอย่าง จักมีเงินคำสัมปัตติพอหมื่นบ่ไร้ เอาข้าวใหม่ใส่ยุ้งฉางดี เทียวทางไกลจะกลับคืนมาโดยสวัสดี แต่ห้ามกระทำการฌาปนกิจศพในวันนี้เป็นอันขาด"
};

const WAN_THAI_DETAILED_RAW: Record<string, string> = {
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


// ชื่อวันไทในตำราเดิมสะกดหลายแบบ (ไจ้/ใจ้, ไค้/ใค้, ยี่/ยี, ไส้/ใส้) จับคู่ด้วยรูปมาตรฐานเดียวกัน
const canonWanThai = (s: string) => s.replace(/ไจ้/g, "ใจ้").replace(/ไค้/g, "ใค้").replace(/ยี่/g, "ยี").replace(/ไส้/g, "ใส้");
const WAN_THAI_BY_CANON: Record<string, string> = {};
for (const [k, v] of Object.entries(WAN_THAI_DETAILED_RAW)) WAN_THAI_BY_CANON[canonWanThai(k)] = v;
export const WAN_THAI_DETAILED: Record<string, string> = WAN_THAI_DETAILED_RAW;
export function wanThaiDescOf(wanThai: string): string {
  return WAN_THAI_DETAILED_RAW[wanThai] || WAN_THAI_BY_CANON[canonWanThai(wanThai)] || "-";
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


// ============================================================
// ฟังก์ชันหลัก
// ============================================================

export interface LannaCalcResult {
  date: Date;
  dateISO: string;
  lannaMonth: number;
  lannaMonthName: string;
  lunarDay: number;
  phase: 'ออก' | 'แรม';
  tithi: number;
  wanThai: string;
  wanThaiDesc: string;
  isSia: boolean;
  isSin: boolean;
  isMai: boolean;
  isWodwai: boolean;
  isMachu: boolean;
  isMahaMachu: boolean;
  isHuaRiangMon: boolean;
  isUbat: boolean;
  isLokawinat: boolean;
  isThongChai: boolean;
  isAthipadi: boolean;
  isLomLuang: boolean;
  sitthi: string | null;
  sitthiList: string[];
  cs: number;
  yearZodiac: string;
  lannaYear: { zodiacLanna: string; zodiacThai: string; chulasakarat: number };
  kaoKong: string;
  kaoKongDesc: string;
  fahTeeSang: number;
  wanMuai: string;
  wanPhiKin: string;
  panjaDithi: string;
  isPhayaWan: boolean;
}

export function getLannaDate(date: Date): LannaCalcResult | null {
  if (!date || isNaN(date.getTime())) return null;
  const dayNum = dayNumFromDate(date);
  const gregYear = date.getFullYear();
  const dow = date.getDay();

  const { lannaMonth, phase, kham } = lunarFromGregorian(dayNum);
  const tithi = phase === 'ออก' ? kham : kham + 15;

  // วันพระ: ออก 8, ออก 15, แรม 8, แรมวันสุดท้ายของเดือน
  const next = lunarFromGregorian(dayNum + 1);
  const isLastWaning = phase === 'แรม' && next.phase === 'ออก' && next.kham === 1;
  const isSin = (phase === 'ออก' && (kham === 8 || kham === 15)) || (phase === 'แรม' && (kham === 8 || isLastWaning));

  const { yearName, cs, lukThai } = lannaYearOf(dayNum, gregYear);
  const wd = weekday0(dayNum);

  const isSia = isWanSiaOf(dayNum, gregYear, lannaMonth);
  const isMai = kham === MAI_KHAM[wd];
  const isMachu = kham === MACHU_KHAM[wd];
  const isWodwai = kham === WODWAI_KHAM[lannaMonth];
  const isBad = isSia || isMai || isMachu || isWodwai;

  const huaSet = phase === 'ออก' ? HUA_WAXING : HUA_WANING;
  const isHuaRiangMon = huaSet.has(kham) && !isBad;

  // สิทธิโชคเป็นชุด: ฉบับ มช. ไม่พิมพ์โชคในวันร้าย
  const sitthiList: string[] = [];
  if (!isBad) {
    for (const name of CHOK_NAMES) {
      const [k, onlyPhase] = SITTHI_TABLE[name][wd];
      if (kham === k && (onlyPhase === null || onlyPhase === phase)) sitthiList.push(name);
    }
  }

  // ฟิลด์ตำราทั่วไปที่ตัวคำนวณหลักไม่มี: คงพฤติกรรมเดิมของแอพ (คำนวณจากเดือน/ค่ำที่แก้แล้ว)
  const group = (lannaMonth - 1) % 4;
  const isThongChai = kham === [10, 1, 2, 3][group];
  const isAthipadi = kham === [4, 5, 6, 7][group];
  const isUbat = kham === [10, 1, 5, 9][group];
  const isLokawinat = kham === [3, 7, 15, 11][group];
  const isMahaMachu = phase === 'แรม' && kham === 14 && (dow === 2 || dow === 6);
  const isLomLuang = lannaMonth === kham;

  const wanThai = wanThaiOf(dayNum);
  const kaoKong = kaoKongOf(dayNum);

  return {
    date,
    dateISO: fmtISO(dayNum),
    lannaMonth,
    lannaMonthName: LANNA_MONTH_NAMES[lannaMonth],
    lunarDay: kham,
    phase,
    tithi,
    wanThai,
    wanThaiDesc: wanThaiDescOf(wanThai),
    isSia,
    isSin,
    isMai,
    isWodwai,
    isMachu,
    isMahaMachu,
    isHuaRiangMon,
    isUbat,
    isLokawinat,
    isThongChai,
    isAthipadi,
    isLomLuang,
    sitthi: sitthiList[0] ?? null,
    sitthiList,
    cs,
    yearZodiac: `${yearName} (${lukThai})`,
    lannaYear: { zodiacLanna: yearName, zodiacThai: lukThai, chulasakarat: cs },
    kaoKong,
    kaoKongDesc: KAO_KONG_DESC[kaoKong] || "",
    fahTeeSang: fahTeeSangOf(lannaMonth, tithi),
    wanMuai: getWanMuai(kham, phase),
    wanPhiKin: getWanPhiKin(kham, phase),
    panjaDithi: panjaDithiOf(tithi),
    isPhayaWan: dayNum === phayawanDay(gregYear - 638)
  };
}

// วันสำคัญตามเทศกาล (คำนวณจากเดือน/ค่ำและวันพญาวัน ไม่ใช้ตารางข้อมูล)
export function getSongkranLabel(date: Date): string | null {
  if (!date || isNaN(date.getTime())) return null;
  const dayNum = dayNumFromDate(date);
  const pw = phayawanDay(date.getFullYear() - 638);
  if (dayNum === pw - 2) return "วันสังขานต์ล่อง";
  if (dayNum === pw - 1) return "วันเน่า";
  if (dayNum === pw) return "วันพญาวัน";
  if (dayNum === pw + 1) return "วันปากปี";
  const { lannaMonth, phase, kham } = lunarFromGregorian(dayNum);
  if (phase === 'ออก' && kham === 15 && lannaMonth === 2) return "วันยี่เป็ง";
  if (phase === 'ออก' && kham === 15 && lannaMonth === 12) return "วันสิบสองเป็ง";
  return null;
}

export function getLunarYearInfo(yearBE: number) {
  // เกณฑ์อธิกมาสจากมาสเกณฑ์อัตตา (แทนสูตรรอบ 19 ปีเดิม) อธิกวารยังไม่มีเกณฑ์ที่พิสูจน์ด้วยกรณีบวก
  const cs = yearBE - 1181;
  return { isAthikamat: isAdhikamasaCS(cs), isAthikawan: false };
}

// ค่าเดี่ยวแบบเดิม (เลิกใช้ในแอพหลัก แอพใช้ sitthiList จาก getLannaDate)
export function getSitthiChok(kham: number, dow: number): string | null {
  const wd = mod(dow, 7);
  for (const name of CHOK_NAMES) {
    if (SITTHI_TABLE[name][wd][0] === kham) return name;
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

