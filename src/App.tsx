import React, { useState, useMemo, useRef } from 'react';
import { getLannaDate, getDirections, getDailyKalaYoga, getSongkranLabel, getDailyRituals, LannaCalcResult } from './utils/lannaCalc';
import { DetailSection, DayData, labelKindOf, chipClass, LabelKind } from './components/DetailSection';

const toArabicDigits = (value: string | number) =>
  value
    .toString()
    .replace(/[๐-๙]/g, (char) => String('๐๑๒๓๔๕๖๗๘๙'.indexOf(char)));

const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const THAI_DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const THAI_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const WEEKDAY_HEADER_BG = ['bg-[#E24B4A]', 'bg-[#F2C94C]', 'bg-[#D4537E]', 'bg-[#219653]', 'bg-[#F2994A]', 'bg-[#2D9CDB]', 'bg-[#9B51E0]'];

const sameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const startOfWeek = (d: Date) => {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - x.getDay());
  return x;
};

interface Chip { text: string; kind: LabelKind }

/** ป้ายคำเต็มของวันนั้น ประกอบจากแฟล็กจริงของตัวคำนวณ เรียงลำดับคงที่ ป้ายละบรรทัดเสมอ */
function dayChips(r: LannaCalcResult, date: Date): Chip[] {
  const chips: Chip[] = [];
  if (r.isSin) chips.push({ text: 'วันศีล', kind: 'sin' });
  if (r.isSia) chips.push({ text: 'วันเสีย', kind: 'bad' });
  if (r.isUbat) chips.push({ text: 'วันอุบาทว์', kind: 'bad' });
  if (r.isLokawinat) chips.push({ text: 'วันโลกาวินาศ', kind: 'bad' });
  if (r.isMai) chips.push({ text: 'วันไหม้', kind: 'bad' });
  if (r.isWodwai) chips.push({ text: 'วันวอดวาย', kind: 'bad' });
  if (r.isMahaMachu) chips.push({ text: 'วันมหามัจจุ', kind: 'bad' });
  else if (r.isMachu) chips.push({ text: 'วันมัจจุ', kind: 'bad' });
  if (r.isLomLuang) chips.push({ text: 'วันหล่มหลวง', kind: 'bad' });
  if (r.isHuaRiangMon) chips.push({ text: 'หัวเรียงหมอน', kind: 'neutral' });
  for (const s of r.sitthiList) chips.push({ text: s, kind: 'good' });
  const song = getSongkranLabel(date);
  if (song) chips.push({ text: song, kind: 'neutral' });
  return chips;
}

const isBadResult = (r: LannaCalcResult) =>
  r.isSia || r.isUbat || r.isLokawinat || r.isMai || r.isWodwai || r.isMachu || r.isMahaMachu;
/** วันดีในชั้นคำตัดสินและป้ายย่อ ยึดจากชุดสิทธิโชค (โชค) ตามชั้นข้อมูลที่พิสูจน์เทียบฉบับ มช. แล้ว ส่วนธงชัย/อธิบดีเป็นเกณฑ์โบราณที่แสดงเฉพาะในรายละเอียดวันตามพฤติกรรมเดิม */
const isGoodResult = (r: LannaCalcResult) => r.sitthiList.length > 0;

/** ป้ายหลักสำหรับมุมมองเดือน: วันศีล วันเสีย วันดี และป้ายร้าย/พิเศษที่จำเป็น ใช้คำเต็ม ป้ายละบรรทัด */
function monthChips(r: LannaCalcResult): Chip[] {
  const chips: Chip[] = [];
  if (r.isSin) chips.push({ text: 'วันศีล', kind: 'sin' });
  if (r.isSia) chips.push({ text: 'วันเสีย', kind: 'bad' });
  if (r.isUbat) chips.push({ text: 'วันอุบาทว์', kind: 'bad' });
  if (r.isLokawinat) chips.push({ text: 'วันโลกาวินาศ', kind: 'bad' });
  if (r.isMai) chips.push({ text: 'วันไหม้', kind: 'bad' });
  if (r.isWodwai) chips.push({ text: 'วันวอดวาย', kind: 'bad' });
  if (r.isMahaMachu) chips.push({ text: 'วันมหามัจจุ', kind: 'bad' });
  else if (r.isMachu) chips.push({ text: 'วันมัจจุ', kind: 'bad' });
  if (r.isLomLuang) chips.push({ text: 'วันหล่มหลวง', kind: 'bad' });
  if (r.isHuaRiangMon) chips.push({ text: 'หัวเรียงหมอน', kind: 'neutral' });
  if (isGoodResult(r)) chips.push({ text: 'วันดี', kind: 'good' });
  return chips;
}

/** คำตัดสินของวัน ประกอบจากป้ายจริง: วันศีล วันเสีย วันดี หรือวันปกติ */
function verdictWords(r: LannaCalcResult): { text: string; kind: LabelKind }[] {
  const words: { text: string; kind: LabelKind }[] = [];
  if (r.isSin) words.push({ text: 'วันศีล', kind: 'sin' });
  if (isBadResult(r)) words.push({ text: 'วันเสีย', kind: 'bad' });
  if (isGoodResult(r)) words.push({ text: 'วันดี', kind: 'good' });
  if (words.length === 0) words.push({ text: 'วันปกติ', kind: 'neutral' });
  return words;
}

function buildDescription(lanna: LannaCalcResult): string {
  const lines: string[] = [];

  if (lanna.panjaDithi) {
    const dithiDesc: Record<string, string> = {
      "นันทาดิถี": "ควรสร้างบ้านเรือนวิหาร ศาลา ขุดสระน้ำ หล่อพระพุทธรูปสร้างพระธาตุ ออกเดินทางไปค้าขายยกยอมหาเถระสังฆราช ราชาภิเษกพระมหากษัตริย์ ตัดช่อและตุงไชยดีมาก",
      "ภัทราดิถี": "คนส่งศุภสารการทูตส่งบ่าวสาวแต่งงาน ดำหัว ล้างทำความสะอาดเครื่องประดับ ย้ายที่อยู่ แกะสลักเขียนภาพ ตัดไม้ทำเรือนเข้าอยู่บ้าน ตั้งชื่อยศนามศักดิ์ ดีมาก",
      "ภัททราดิถี": "คนส่งศุภสารการทูตส่งบ่าวสาวแต่งงาน ดำหัว ล้างทำความสะอาดเครื่องประดับ ย้ายที่อยู่ แกะสลักเขียนภาพ ตัดไม้ทำเรือนเข้าอยู่บ้าน ตั้งชื่อยศนามศักดิ์ ดีมาก",
      "ไชยาดิถี": "ควรเริ่มสร้างอาวุธยกทัพ เจรจาความเมือง เลี้ยงหมู่ทหาร เรียนศิลปศาสตร์วิชาคุณก่อสร้างเมืองใหม่ ทำความสะอาดอาวุธ ทำรั้ว",
      "ปุณณาดิถี": "ควรนำเข้าใหม่ขึ้นสู่ยุ้งฉาง นำคนใช้มาอยู่บ้าน พระสงฆ์เริ่มเรียนพระธรรมคัมภีร์ต่าง ๆ สร้างเวียงวัง เพิ่มนาม แต่งตั้งอำมาตย์ข้าราชการ เริ่มเรียนเวทมนต์คาถา",
      "ริตตาดิถี": "ควรสร้างสวนทำไร่นา ปลูกต้นไม้ สร้างถนนหนทาง ทำแก้วแหวนมิ่งมงคล ตัดเสื้อผ้าทำขวัญสู่ขวัญตัดผมเข้าเฝ้าเจ้านาย",
      "ริทธาดิถี": "ควรสร้างสวนทำไร่นา ปลูกต้นไม้ สร้างถนนหนทาง ทำแก้วแหวนมิ่งมงคล ตัดเสื้อผ้าทำขวัญสู่ขวัญตัดผมเข้าเฝ้าเจ้านาย"
    };
    lines.push(`ดิถี (${lanna.panjaDithi}): ${dithiDesc[lanna.panjaDithi] || ""}`);
  }

  if (lanna.sitthi) {
    const sitthiDesc: Record<string, string> = {
      "อมฤตโชค": "ให้ผลดีมหาศาล มีความอุดมสมบูรณ์ และอายุยืนยาว เหมาะสำหรับงานมงคลทุกชนิด โดยเฉพาะการทำพิธีเพื่อความยั่งยืน",
      "อมริสสโชค": "ให้ผลดีมหาศาล มีความอุดมสมบูรณ์ และอายุยืนยาว เหมาะสำหรับงานมงคลทุกชนิด โดยเฉพาะการทำพิธีเพื่อความยั่งยืน",
      "มหาสิทธิโชค": "ให้ผลดีมหาศาล เหมาะสำหรับงานมงคลทุกประการ การเริ่มต้นใหม่ การเปิดกิจการ หรือการทำพิธีใหญ่",
      "สิทธิโชค": "ให้ผลสำเร็จสมปรารถนา เหมาะสำหรับงานมงคลทั่วไป การติดต่อเจรจา และการทำงานที่ต้องการความราบรื่น",
      "ชัยโชค": "ให้ผลทางชัยชนะ การแข่งขัน การเอาชนะอุปสรรค เหมาะสำหรับงานที่ต้องใช้ความกล้าหาญหรือการชิงชัย",
      "ไชยโชค": "ให้ผลทางชัยชนะ การแข่งขัน การเอาชนะอุปสรรค เหมาะสำหรับงานที่ต้องใช้ความกล้าหาญหรือการชิงชัย",
      "ราชาโชค": "ให้ผลทางบารมี เกียรติยศ การได้รับการอุปถัมภ์จากผู้ใหญ่ เหมาะสำหรับงานที่เกี่ยวกับยศถาบรรดาศักดิ์"
    };
    lines.push(`วัน${lanna.sitthi}: ${sitthiDesc[lanna.sitthi] || ""}`);
  }

  if (lanna.isUbat) lines.push("วันอุบาทว์: เป็นวันแห่งอุปสรรค เคราะห์ร้าย และความไม่สงบสุข ห้ามทำการมงคล");
  if (lanna.isLokawinat) lines.push("วันโลกาวินาศ: เป็นวันแห่งความวิบัติ ฉิบหาย และอันตรายร้ายแรงที่สุด ห้ามกระทำการมงคลเด็ดขาด");
  if (lanna.isMachu) lines.push("วันมัจจุ: วันแห่งความตายและการสูญเสีย ห้ามทำการมงคลหรือเริ่มต้นสิ่งใหม่");
  if (lanna.isMahaMachu) lines.push("วันมหามัจจุ: วันแห่งมหาเคราะห์ร้ายแรง ห้ามกระทำการมงคลทุกชนิด");

  if (lanna.wanThaiDesc) lines.push(`วันไท (${lanna.wanThai}): ${lanna.wanThaiDesc}`);
  if (lanna.kaoKong && lanna.kaoKongDesc) lines.push(`วันเก้ากอง (${lanna.kaoKong}): ${lanna.kaoKongDesc}`);

  if (lanna.fahTeeSang !== undefined && lanna.fahTeeSang !== null) {
    const good = [2, 4, 5, 6].includes(lanna.fahTeeSang);
    const meaning = good
      ? "ทำการสิ่งใดจักได้ดี อยู่ดีมีสุข พรั่งพร้อมด้วยยศสมบัติ"
      : lanna.fahTeeSang === 3 || lanna.fahTeeSang === 7
        ? "ระวัง ไฟจักไหม้หรือประสบอุบัติเหตุ เสียทรัพย์สิน"
        : "ไม่เป็นมงคล อย่าทำพิธีหรือกิจกรรมสำคัญ";
    lines.push(`ฟ้าตีแส่งเศษ ${lanna.fahTeeSang}: ${meaning}`);
  }

  if (lanna.wanMuai) lines.push(`วัน${lanna.wanMuai}`);
  if (lanna.wanPhiKin) lines.push(`${lanna.wanPhiKin}`);
  if (lanna.isLomLuang) lines.push("วันหล่มหลวง: ห้ามกระทำการมงคลอื่น เว้นแต่แต่งงานและบวช");

  return lines.join("\n");
}

export default function App() {
  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const detailRef = useRef<HTMLDivElement>(null);

  const todayInfo = useMemo(() => getLannaDate(today), [today]);
  const selectedInfo = useMemo(() => getLannaDate(selectedDate), [selectedDate]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      return { date, info: getLannaDate(date) };
    });
  }, [selectedDate]);

  const monthDays = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDow = new Date(y, m, 1).getDay();
    const cells: ({ date: Date; info: LannaCalcResult | null } | null)[] = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d);
      cells.push({ date, info: getLannaDate(date) });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [selectedDate]);

  const detailData: DayData | null = useMemo(() => {
    if (!selectedInfo) return null;
    const lanna = selectedInfo;
    const dir = getDirections(selectedDate.getDay());
    const rawLunarDay = lanna.phase === 'ออก' ? lanna.lunarDay : lanna.lunarDay + 15;
    const kalaYok = getDailyKalaYoga(rawLunarDay, selectedDate.getDay());
    return {
      y: selectedDate.getFullYear() + 543,
      m: selectedDate.getMonth() + 1,
      d: selectedDate.getDate(),
      lannaMonth: lanna.lannaMonth,
      lannaYear: lanna.lannaYear,
      wanThai: lanna.wanThai,
      wanThaiDesc: lanna.wanThaiDesc,
      kaoKong: lanna.kaoKong,
      kaoKongDesc: lanna.kaoKongDesc,
      fahTeeSang: lanna.fahTeeSang,
      lunar: { phase: lanna.phase === 'ออก' ? "waxing" : "waning", day: lanna.lunarDay },
      labels: {
        good: [lanna.isThongChai ? "วันธงชัย" : "", lanna.isAthipadi ? "วันอธิบดี" : "", lanna.sitthi || ""].filter(Boolean),
        bad: [lanna.isSia ? "วันเสีย" : "", lanna.isUbat ? "วันอุบาทว์" : "", lanna.isLokawinat ? "วันโลกาวินาศ" : "", lanna.isLomLuang ? "วันหล่มหลวง" : ""].filter(Boolean),
        special: lanna.isSin ? ["วันศีล"] : []
      },
      description: buildDescription(lanna),
      warnings: [],
      rituals: getDailyRituals(selectedDate.getDay()),
      festival: getSongkranLabel(selectedDate) || "",
      rawText: "",
      directions: { sri: dir.sri, ka: dir.ka },
      kalaYok,
      wanMuai: lanna.wanMuai,
      wanPhiKin: lanna.wanPhiKin,
      panjaDithi: lanna.panjaDithi,
      sitthi: lanna.sitthi,
      isUbat: lanna.isUbat,
      isLokawinat: lanna.isLokawinat,
      isMachu: lanna.isMachu,
      isMahaMachu: lanna.isMahaMachu
    };
  }, [selectedDate, selectedInfo]);

  const stepMonth = (n: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + n, 1));
  };

  const goToday = () => {
    setSelectedDate(today);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectAndScroll = (date: Date) => {
    setSelectedDate(date);
    requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const monthTitle = `${THAI_MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
  const headerYear = selectedInfo
    ? toArabicDigits(`ปี${selectedInfo.lannaYear.zodiacLanna} (ปี${selectedInfo.lannaYear.zodiacThai}) จ.ศ. ${selectedInfo.cs}`)
    : '';

  const todayVerdict = todayInfo ? verdictWords(todayInfo) : [];
  const todayChips = todayInfo ? dayChips(todayInfo, today) : [];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <div className="max-w-[560px] mx-auto">
        {/* 1. แถบหัว */}
        <header className="border-b-2 border-slate-800 bg-white sticky top-0 z-40">
          <div className="grid grid-cols-[48px_minmax(0,1fr)_48px] items-center px-1 pt-1">
            <button onClick={() => stepMonth(-1)} aria-label="เดือนก่อนหน้า" className="min-w-[48px] min-h-[48px] text-[26px] font-black leading-none">&lt;</button>
            <div className="min-w-0 text-center">
              <div className="text-[20px] leading-[1.4] font-black whitespace-nowrap overflow-hidden text-ellipsis">{monthTitle}</div>
              <div className="text-[15px] leading-[1.4] font-bold text-slate-600 whitespace-nowrap overflow-hidden text-ellipsis">{headerYear}</div>
            </div>
            <button onClick={() => stepMonth(1)} aria-label="เดือนถัดไป" className="min-w-[48px] min-h-[48px] text-[26px] font-black leading-none">&gt;</button>
          </div>
          <div className="flex justify-center pb-2">
            <button onClick={goToday} className="min-h-[48px] px-8 rounded-full bg-[#7a1f1f] text-white text-[18px] leading-[1.6] font-black">
              วันนี้
            </button>
          </div>
        </header>

        <main>
          {/* 2. การ์ดวันนี้ */}
          {todayInfo && (
            <section className="px-3 pt-4" aria-label="วันนี้">
              <div className="border-2 border-[#7a1f1f] rounded-2xl bg-[#fdf6ec] p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-[#b3001b] text-white rounded-full px-3 py-1 text-[16px] leading-[1.5] font-black">วันนี้</span>
                  <span className="text-[20px] leading-[1.4] font-black">
                    {toArabicDigits(`วัน${THAI_DAYS[today.getDay()]}ที่ ${today.getDate()} ${THAI_MONTHS[today.getMonth()]} พ.ศ. ${today.getFullYear() + 543}`)}
                  </span>
                </div>
                <div className="mt-2 text-[18px] leading-[1.6] font-bold">
                  <span className="whitespace-nowrap">{toArabicDigits(`${todayInfo.phase} ${todayInfo.lunarDay} ค่ำ`)}</span>{' '}
                  <span className="whitespace-nowrap">{toArabicDigits(`เดือน${todayInfo.lannaMonthName}`)}</span>{' '}
                  <span className="text-slate-600">{toArabicDigits(`ปี${todayInfo.lannaYear.zodiacLanna} จ.ศ. ${todayInfo.cs}`)}</span>
                </div>

                {/* กล่องคำตัดสิน */}
                <div className="mt-3 bg-white border-2 border-slate-300 rounded-2xl p-3">
                  <div className="text-[16px] leading-[1.5] font-black text-slate-500">คำตัดสินวันนี้</div>
                  <div className="flex flex-col items-start gap-2 mt-1">
                    {todayVerdict.map((v, i) => (
                      <span key={i} className={`inline-block px-4 py-1 rounded-xl text-[24px] leading-[1.4] font-black ${chipClass(v.kind)}`}>
                        {v.text}
                      </span>
                    ))}
                  </div>
                  {todayChips.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {todayChips.map((c, i) => (
                        <span key={i} className={`px-3 py-1 rounded-lg text-[16px] leading-[1.5] font-bold ${chipClass(c.kind)}`}>
                          {c.text}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 space-y-1 text-[18px] leading-[1.6]">
                    <div><b>วันไท:</b> <span className="whitespace-nowrap">{toArabicDigits(`วัน${todayInfo.wanThai}`)}</span></div>
                    <div><b>เก้ากอง:</b> <span className="whitespace-nowrap">{toArabicDigits(todayInfo.kaoKong)}</span></div>
                    <div><b>ดิถี:</b> <span className="whitespace-nowrap">{toArabicDigits(todayInfo.panjaDithi)}</span></div>
                    <div><b>ฟ้าตีแส่ง:</b> <span className="whitespace-nowrap">{toArabicDigits(`เศษ ${todayInfo.fahTeeSang}`)}</span></div>
                  </div>
                </div>

                <button
                  onClick={() => selectAndScroll(today)}
                  className="mt-3 w-full min-h-[48px] rounded-xl bg-[#7a1f1f] text-white text-[18px] leading-[1.6] font-black py-2"
                >
                  ดูรายละเอียดวันนี้ทั้งหมด
                </button>
              </div>
            </section>
          )}

          {/* 3. แถบสัปดาห์ */}
          <section className="px-3 pt-5" aria-label="แถบสัปดาห์">
            <h2 className="text-[20px] leading-[1.4] font-black text-slate-700">สัปดาห์นี้</h2>
            <div className="grid grid-cols-7 gap-1 mt-2 text-center">
              {THAI_DAYS_SHORT.map((label, i) => (
                <div key={i} className={`text-[15px] leading-[1.5] font-black text-white rounded-md py-1 ${WEEKDAY_HEADER_BG[i]}`}>{label}</div>
              ))}
              {weekDays.map(({ date, info }) => {
                const isToday = sameDay(date, today);
                const isSelected = sameDay(date, selectedDate);
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    aria-label={toArabicDigits(`${date.getDate()} ${THAI_MONTHS[date.getMonth()]}`)}
                    className={`relative min-h-[56px] rounded-xl flex flex-col items-center justify-center gap-0 bg-white ${isSelected ? 'border-[3px] border-[#0b62ff]' : 'border border-slate-300'}`}
                  >
                    {isToday ? (
                      <span className="w-[38px] h-[38px] rounded-full bg-[#b3001b] text-white flex items-center justify-center text-[18px] font-black leading-none">
                        {toArabicDigits(date.getDate())}
                      </span>
                    ) : (
                      <span className="text-[18px] leading-[1.4] font-bold">{toArabicDigits(date.getDate())}</span>
                    )}
                    {isToday && <span className="text-[12px] leading-[1.3] font-black text-[#b3001b]">วันนี้</span>}
                    {!isToday && info && isBadResult(info) && <span className="text-[12px] leading-[1.3] font-black text-[#b3001b]">วันเสีย</span>}
                    {!isToday && info && !isBadResult(info) && info.isSin && <span className="text-[12px] leading-[1.3] font-black text-[#8a5a00]">วันศีล</span>}
                    {!isToday && info && !isBadResult(info) && !info.isSin && isGoodResult(info) && <span className="text-[12px] leading-[1.3] font-black text-[#0f7a28]">วันดี</span>}
                  </button>
                );
              })}
            </div>
            <p className="text-[15px] leading-[1.5] text-slate-600 text-center mt-1">วงกลมแดงทึบคือวันนี้ กรอบน้ำเงินหนาคือวันที่เลือก</p>
          </section>

          {/* 4. รายการ 7 วันแบบแถวแนวตั้ง */}
          <section className="px-3 pt-4" aria-label="รายการ 7 วัน">
            <h2 className="text-[20px] leading-[1.4] font-black text-slate-700">รายการ 7 วัน</h2>
            <div className="mt-2 border-t-2 border-slate-200">
              {weekDays.map(({ date, info }) => {
                if (!info) return null;
                const isToday = sameDay(date, today);
                const isSelected = sameDay(date, selectedDate);
                const chips = dayChips(info, date);
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`w-full min-h-[56px] flex items-center gap-3 px-2 py-2 border-b-2 border-slate-200 text-left ${isSelected ? 'bg-[#fff4df] outline outline-[3px] outline-[#0b62ff] outline-offset-[-3px]' : 'bg-white'}`}
                  >
                    <span className={`w-[44px] shrink-0 text-center text-[24px] leading-[1.3] font-black ${isToday ? 'text-[#b3001b]' : ''}`}>
                      {toArabicDigits(date.getDate())}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[18px] leading-[1.5] font-bold">
                        {isToday && <span className="text-[#b3001b] font-black">วันนี้ </span>}
                        {toArabicDigits(`วัน${THAI_DAYS[date.getDay()]}`)}
                      </span>
                      <span className="block text-[17px] leading-[1.5] text-slate-700">
                        <span className="whitespace-nowrap">{toArabicDigits(`${info.phase} ${info.lunarDay} ค่ำ`)}</span>{' '}
                        <span className="whitespace-nowrap">{toArabicDigits(`เดือน${info.lannaMonthName}`)}</span>
                      </span>
                    </span>
                    {chips.length > 0 && (
                      <span className="flex flex-col items-end gap-1 shrink-0">
                        {chips.map((c, i) => (
                          <span key={i} className={`px-2 py-[2px] rounded-md text-[14px] leading-[1.4] font-bold whitespace-nowrap ${chipClass(c.kind)}`}>
                            {c.text}
                          </span>
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 5. รายละเอียดของวันที่เลือก */}
          <div ref={detailRef} className="scroll-mt-[120px]">
            {selectedDate && detailData ? (
              <DetailSection date={selectedDate} data={detailData} />
            ) : (
              <div className="py-8 text-center text-[18px] leading-[1.6]">เลือกวันที่เพื่อดูรายละเอียด</div>
            )}
          </div>

          {/* 6. มุมมองเดือน: นำทางเท่านั้น */}
          <section className="px-3 pt-2 pb-10" aria-label="ตารางเดือน">
            <h2 className="text-[20px] leading-[1.4] font-black text-slate-700">ตารางเดือน</h2>
            <p className="text-[15px] leading-[1.5] text-slate-600">ใช้เลือกวันเท่านั้น แตะช่องวันเพื่อดูรายละเอียดด้านบน</p>
            <div className="grid grid-cols-7 gap-1 mt-2 text-center">
              {THAI_DAYS_SHORT.map((label, i) => (
                <div key={i} className={`text-[15px] leading-[1.5] font-black text-white rounded-md py-1 ${WEEKDAY_HEADER_BG[i]}`}>{label}</div>
              ))}
              {monthDays.map((cell, idx) => {
                if (!cell || !cell.info) return <div key={idx} className="min-h-[78px]" />;
                const { date, info } = cell;
                const isToday = sameDay(date, today);
                const isSelected = sameDay(date, selectedDate);
                const chips = monthChips(info);
                return (
                  <button
                    key={idx}
                    onClick={() => selectAndScroll(date)}
                    className={`relative min-h-[78px] rounded-lg bg-white px-[1px] pt-1 pb-1 flex flex-col items-center ${isSelected ? 'border-[3px] border-[#0b62ff]' : 'border border-slate-300'}`}
                  >
                    {isToday ? (
                      <span className="w-[30px] h-[30px] rounded-full bg-[#b3001b] text-white flex items-center justify-center text-[16px] font-black leading-none">
                        {toArabicDigits(date.getDate())}
                      </span>
                    ) : (
                      <span className="text-[17px] leading-[1.4] font-bold">{toArabicDigits(date.getDate())}</span>
                    )}
                    {isToday && <span className="text-[11px] leading-[1.3] font-black text-[#b3001b]">วันนี้</span>}
                    {chips.map((c, i) => (
                      <span key={i} className={`block w-full text-center text-[12.5px] leading-[1.3] font-black ${c.kind === 'sin' ? 'text-[#8a5a00]' : c.kind === 'bad' ? 'text-[#b3001b]' : c.kind === 'good' ? 'text-[#0f7a28]' : 'text-slate-600'}`}>
                        {c.text}
                      </span>
                    ))}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-3 text-[15px] leading-[1.5] font-bold">
              <span className="inline-flex items-center gap-1 text-[#8a5a00]"><span className="w-[10px] h-[10px] rounded-full bg-[#8a5a00]" />วันศีล</span>
              <span className="inline-flex items-center gap-1 text-[#b3001b]"><span className="w-[10px] h-[10px] rounded-full bg-[#b3001b]" />วันเสีย</span>
              <span className="inline-flex items-center gap-1 text-[#0f7a28]"><span className="w-[10px] h-[10px] rounded-full bg-[#0f7a28]" />วันดี</span>
            </div>
            <p className="text-center text-[14px] leading-[1.5] text-slate-500 mt-3 px-2">
              ข้อมูลทุกปีคำนวณจากสูตรที่ผ่านการทดสอบเทียบกับปฏิทินล้านนา 2569 ฉบับมหาวิทยาลัยเชียงใหม่ ครบ 365 วันแล้ว
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
