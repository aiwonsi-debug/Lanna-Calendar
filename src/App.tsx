import React, { useState, useMemo, useRef } from 'react';
import { getLannaDate, getDirections, getDailyKalaYoga, getSongkranLabel, getDailyRituals } from './utils/lannaCalc';
import { DetailSection, DayData } from './components/DetailSection';

const toArabicDigits = (value: string | number) =>
  value
    .toString()
    .replace(/[๐-๙]/g, (char) => String('๐๑๒๓๔๕๖๗๘๙'.indexOf(char)));

const WEEKDAY_STYLES = [
  { label: 'อา', header: 'bg-[#E24B4A] text-white', cell: 'bg-[#FEF5F5]' }, // Red
  { label: 'จ',  header: 'bg-[#F2C94C] text-black', cell: 'bg-[#FFFBEB]' }, // Yellow
  { label: 'อ',  header: 'bg-[#D4537E] text-white', cell: 'bg-[#FDF0F5]' }, // Pink
  { label: 'พ',  header: 'bg-[#219653] text-white', cell: 'bg-[#F0FDF4]' }, // Green
  { label: 'พฤ', header: 'bg-[#F2994A] text-white', cell: 'bg-[#FFF7ED]' }, // Orange
  { label: 'ศ',  header: 'bg-[#2D9CDB] text-white', cell: 'bg-[#F0F9FF]' }, // Light Blue
  { label: 'ส',  header: 'bg-[#9B51E0] text-white', cell: 'bg-[#FAF5FF]' }, // Purple
];

interface Day {
  date: Date;
  day: number;
  lannaMonth: number;
  lunarDay: number;
  phase: 'ออก' | 'แรม';
  isSin: boolean;
  isSia: boolean;
  isUbat: boolean;
  isLokawinat: boolean;
  isThongChai: boolean;
  isAthipadi: boolean;
  isLomLuang: boolean;
  isMai: boolean;
  isWodwai: boolean;
  isMachu: boolean;
  isMahaMachu: boolean;
  isHuaRiangMon: boolean;
  isPhayaWan: boolean;
  lannaMonthName: string;
  tithi: number;
  sitthi: string | null;
  sitthiList: string[];
  songkranLabel: string | null;
  yearZodiac: string;
  cs: number;
  raw: {
    day: number;
    labels?: string[];
    warnings?: string[];
    rituals?: { title: string; description: string }[];
    rawText?: string;
  };
  wanThai: string;
  wanMuai: string;
  wanPhiKin: string;
  wanThaiDesc: string;
  panjaDithi?: string;
  kaoKong: string;
  kaoKongDesc: string;
  fahTeeSang: number;
  lannaYear: {
    zodiacLanna: string;
    zodiacThai: string;
    chulasakarat: number;
  };
}

function buildDescription(lanna: {
  wanThaiDesc?: string;
  wanThai?: string;
  kaoKong?: string;
  kaoKongDesc?: string;
  fahTeeSang?: number | null;
  wanMuai?: string;
  wanPhiKin?: string;
  isLomLuang?: boolean;
  panjaDithi?: string;
  sitthi?: string | null;
  sitthiList?: string[];
  isUbat?: boolean;
  isLokawinat?: boolean;
  isMachu?: boolean;
  isMahaMachu?: boolean;
  isMai?: boolean;
  isWodwai?: boolean;
  isHuaRiangMon?: boolean;
}): string {
  if (!lanna) return "";
  const lines: string[] = [];

  // ปัญจดิถี
  if (lanna.panjaDithi) {
    const dithiDesc: Record<string, string> = {
      "นันทาดิถี": "ควรสร้างบ้านเรือนวิหาร ศาลา ขุดสระน้ำ หล่อพระพุทธรูปสร้างพระธาตุ ออกเดินทางไปค้าขายยกยอมหาเถระสังฆราช ราชาภิเษกพระมหากษัตริย์ ตัดช่อและตุงไชยดีมาก",
      "ภัททราดิถี": "คนส่งศุภสารการทูตส่งบ่าวสาวแต่งงาน ดำหัว ล้างทำความสะอาดเครื่องประดับ ย้ายที่อยู่ แกะสลักเขียนภาพ ตัดไม้ทำเรือนเข้าอยู่บ้าน ตั้งชื่อยศนามศักดิ์ ดีมาก",
      "ภัทราดิถี": "คนส่งศุภสารการทูตส่งบ่าวสาวแต่งงาน ดำหัว ล้างทำความสะอาดเครื่องประดับ ย้ายที่อยู่ แกะสลักเขียนภาพ ตัดไม้ทำเรือนเข้าอยู่บ้าน ตั้งชื่อยศนามศักดิ์ ดีมาก",
      "ไชยาดิถี": "ควรเริ่มสร้างอาวุธยกทัพ เจรจาความเมือง เลี้ยงหมู่ทหาร เรียนศิลปศาสตร์วิชาคุณก่อสร้างเมืองใหม่ ทำความสะอาดอาวุธ ทำรั้ว",
      "ปุณณาดิถี": "ควรนำเข้าใหม่ขึ้นสู่ยุ้งฉาง นำคนใช้มาอยู่บ้าน พระสงฆ์เริ่มเรียนพระธรรมคัมภีร์ต่าง ๆ สร้างเวียงวัง เพิ่มนาม แต่งตั้งอำมาตย์ข้าราชการ เริ่มเรียนเวทมนต์คาถา",
      "ริตตาดิถี": "ควรสร้างสวนทำไร่นา ปลูกต้นไม้ สร้างถนนหนทาง ทำแก้วแหวนมิ่งมงคล ตัดเสื้อผ้าทำขวัญสู่ขวัญตัดผมเข้าเฝ้าเจ้านาย",
      "ริทธาดิถี": "ควรสร้างสวนทำไร่นา ปลูกต้นไม้ สร้างถนนหนทาง ทำแก้วแหวนมิ่งมงคล ตัดเสื้อผ้าทำขวัญสู่ขวัญตัดผมเข้าเฝ้าเจ้านาย"
    };
    lines.push(`ดิถี (${lanna.panjaDithi}): ${dithiDesc[lanna.panjaDithi] || ""}`);
  }

  // วันโชค (สิทธิโชค) เป็นชุด: หนึ่งวันมีได้หลายโชค
  const sitthiList = lanna.sitthiList && lanna.sitthiList.length > 0
    ? lanna.sitthiList
    : (lanna.sitthi ? [lanna.sitthi] : []);
  if (sitthiList.length > 0) {
    const sitthiDesc: Record<string, string> = {
      "อมริสสโชค": "ให้ผลดีมหาศาล มีความอุดมสมบูรณ์ และอายุยืนยาว เหมาะสำหรับงานมงคลทุกชนิด โดยเฉพาะการทำพิธีเพื่อความยั่งยืน",
      "มหาสิทธิโชค": "ให้ผลดีมหาศาล เหมาะสำหรับงานมงคลทุกประการ การเริ่มต้นใหม่ การเปิดกิจการ หรือการทำพิธีใหญ่",
      "สิทธิโชค": "ให้ผลสำเร็จสมปรารถนา เหมาะสำหรับงานมงคลทั่วไป การติดต่อเจรจา และการทำงานที่ต้องการความราบรื่น",
      "ไชยโชค": "ให้ผลทางชัยชนะ การแข่งขัน การเอาชนะอุปสรรค เหมาะสำหรับงานที่ต้องใช้ความกล้าหาญหรือการชิงชัย",
      "ราชาโชค": "ให้ผลทางบารมี เกียรติยศ การได้รับการอุปถัมภ์จากผู้ใหญ่ เหมาะสำหรับงานที่เกี่ยวกับยศถาบรรดาศักดิ์"
    };
    for (const s of sitthiList) {
      lines.push(`วัน${s}: ${sitthiDesc[s] || ""}`);
    }
  }

  // ป้ายกฎตำรา (คำนวณจากสูตร)
  if (lanna.isMai) {
    lines.push("วันไหม้: ห้ามทำการมงคลหรือเริ่มต้นสิ่งใหม่");
  }
  if (lanna.isWodwai) {
    lines.push("วันวอดวาย: ห้ามทำการมงคลทุกอย่าง");
  }
  if (lanna.isHuaRiangMon) {
    lines.push("วันหัวเรียงหมอน: เหมาะแก่การแต่งงานสมรสดีนักแล");
  }

  // วันเสียต่างๆ
  if (lanna.isUbat) {
    lines.push("วันอุบาทว์: เป็นวันแห่งอุปสรรค เคราะห์ร้าย และความไม่สงบสุข ห้ามทำการมงคล");
  }
  if (lanna.isLokawinat) {
    lines.push("วันโลกาวินาศ: เป็นวันแห่งความวิบัติ ฉิบหาย และอันตรายร้ายแรงที่สุด ห้ามกระทำการมงคลเด็ดขาด");
  }
  if (lanna.isMachu) {
    lines.push("วันมัจจุ: วันแห่งความตายและการสูญเสีย ห้ามทำการมงคลหรือเริ่มต้นสิ่งใหม่");
  }
  if (lanna.isMahaMachu) {
    lines.push("วันมหามัจจุ: วันแห่งมหาเคราะห์ร้ายแรง ห้ามกระทำการมงคลทุกชนิด");
  }

  // วันไท
  if (lanna.wanThaiDesc) {
    lines.push(`วันไท (${lanna.wanThai}): ${lanna.wanThaiDesc}`);
  }

  // เก้ากอง
  if (lanna.kaoKong && lanna.kaoKongDesc) {
    lines.push(`วันเก้ากอง (${lanna.kaoKong}): ${lanna.kaoKongDesc}`);
  }

  // ฟ้าตีแส่ง
  if (lanna.fahTeeSang !== undefined && lanna.fahTeeSang !== null) {
    const good = [2,4,5,6].includes(lanna.fahTeeSang);
    const meaning = good
      ? "ทำการสิ่งใดจักได้ดี อยู่ดีมีสุข พรั่งพร้อมด้วยยศสมบัติ"
      : lanna.fahTeeSang === 3 || lanna.fahTeeSang === 7
        ? "ระวัง ไฟจักไหม้หรือประสบอุบัติเหตุ เสียทรัพย์สิน"
        : "ไม่เป็นมงคล อย่าทำพิธีหรือกิจกรรมสำคัญ";
    lines.push(`ฟ้าตีแส่งเศษ ${lanna.fahTeeSang}: ${meaning}`);
  }

  // วันม้วย
  if (lanna.wanMuai) {
    lines.push(`วัน${lanna.wanMuai}`);
  }

  // วันผีกิน
  if (lanna.wanPhiKin) {
    lines.push(`${lanna.wanPhiKin}`);
  }

  // วันหล่มหลวง
  if (lanna.isLomLuang) {
    lines.push("วันหล่มหลวง: ห้ามกระทำการมงคลอื่น เว้นแต่แต่งงานและบวช");
  }

  return lines.join("\n");
}

const getStatusLines = (day: Day) => {
  const badLines = [];
  const goodLines = [];
  const raw = day.raw || {};
  const labels = Array.isArray(raw.labels) ? raw.labels : [];
  const warnings = Array.isArray(raw.warnings) ? raw.warnings : [];
  const allText = [...labels, ...warnings, raw.rawText || ""].join("|");
  
  const has = (term: string) => allText.includes(term);

  // ป้ายในช่องวัน: ขนาดเล็กบนจอมือถือ ไม่ล้นช่อง ตัดบรรทัดตามพยางค์ไทยเท่านั้น
  const badgeClass = 'text-white bg-[#d71920] px-[3px] sm:px-1 rounded mb-[2px] block w-fit max-w-full text-[9px] sm:text-[12px] leading-[1.3] font-black';
  const goodClass = 'text-[#0f8a2a] font-black block max-w-full text-[9px] sm:text-[12px] leading-[1.3]';
  const goodBlueClass = 'text-[#0645c0] font-black block max-w-full text-[9px] sm:text-[12px] leading-[1.3]';

  // High priority bad days (ค่าจากตัวคำนวณสูตรล้วน)
  if (day.isSia || has("วันเสีย"))
    badLines.push({ text: 'วันเสีย', className: badgeClass });

  if (day.isUbat || has("อุบาทว์"))
    badLines.push({ text: 'วันอุบาทว์', className: badgeClass });

  if (day.isLokawinat || has("โลกาวินาศ"))
    badLines.push({ text: 'โลกาวินาศ', className: badgeClass });

  if (day.isLomLuang || has("หล่มหลวง"))
    badLines.push({ text: 'หล่มหลวง', className: badgeClass });

  if (day.isMai)
    badLines.push({ text: 'วันไหม้', className: badgeClass });

  if (day.isWodwai)
    badLines.push({ text: 'วันวอดวาย', className: badgeClass });

  if (day.isMachu)
    badLines.push({ text: 'วันมัจจุ', className: badgeClass });

  // Good days
  if (day.isThongChai || has("ธงชัย"))
    goodLines.push({ text: 'ธงชัย', className: goodClass });

  if (day.isAthipadi || has("อธิบดี"))
    goodLines.push({ text: 'อธิบดี', className: goodClass });

  // สิทธิโชคเป็นชุด แสดงทุกโชคของวันนั้น
  const sitthiLabels = day.sitthiList && day.sitthiList.length > 0
    ? day.sitthiList
    : (day.sitthi ? [day.sitthi] : []);
  for (const s of sitthiLabels)
    goodLines.push({ text: toArabicDigits(s), className: goodBlueClass });

  if (day.isHuaRiangMon)
    goodLines.push({ text: 'หัวเรียงหมอน', className: goodBlueClass });

  if (day.songkranLabel)
    goodLines.push({ text: toArabicDigits(day.songkranLabel), className: goodBlueClass });

  return [...badLines, ...goodLines];
};

// ค่าทุกฟิลด์หลักมาจากตัวคำนวณสูตรล้วน (src/utils/lannaCalc.ts) ทุกปี
// ไม่โหลดไฟล์ข้อมูลรายปีมาแทนค่าอีก

export default function App() {
  const [viewMonth, setViewMonth] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const dailyRef = useRef<HTMLDivElement>(null);

  // สร้างข้อมูลเดือนจากตัวคำนวณโดยตรง
  const monthData = useMemo<Day[]>(() => {
    const y = viewMonth.getFullYear();
    const m = viewMonth.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const out: Day[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d);
      const lanna = getLannaDate(date);
      if (!lanna) continue;
      out.push({
        ...lanna,
        date,
        day: d,
        songkranLabel: getSongkranLabel(date),
        raw: { day: d, labels: [] }
      });
    }
    return out;
  }, [viewMonth]);

  const blanks = useMemo(() => {
    if (monthData.length === 0) return [];
    const firstDay = monthData[0].date.getDay();
    return Array.from({ length: firstDay }, (_, i) => i);
  }, [monthData]);

  // จัดช่องเป็นแถวสัปดาห์: ช่องว่างต้นเดือน + วันในเดือน + ช่องว่างท้ายแถวให้ครบ 7 ช่อง
  const weeks = useMemo<(Day | null)[][]>(() => {
    const cells: (Day | null)[] = [...blanks.map(() => null), ...monthData];
    while (cells.length % 7 !== 0) cells.push(null);
    const rows: (Day | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [blanks, monthData]);

  // โหมดสัปดาห์: แสดงเฉพาะแถวของวันที่เลือก (ถ้าวันที่เลือกไม่อยู่ในเดือนที่ดู ใช้สัปดาห์ของวันนี้หรือสัปดาห์แรก)
  const visibleCells = useMemo<(Day | null)[]>(() => {
    if (viewMode === 'month' || weeks.length === 0) return weeks.flat();
    const inViewMonth = (d: Date | null) =>
      !!d && d.getMonth() === viewMonth.getMonth() && d.getFullYear() === viewMonth.getFullYear();
    let target: Date | null = inViewMonth(selectedDate) ? selectedDate : null;
    if (!target) {
      const today = new Date();
      if (inViewMonth(today)) target = today;
    }
    const targetDay = target ? target.getDate() : 1;
    const row = weeks.find((r) => r.some((c) => c !== null && c.day === targetDay));
    return row ? [...row] : [...(weeks[0] || [])];
  }, [viewMode, weeks, selectedDate, viewMonth]);

  const headerInfo = useMemo(() => {
    const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
    const monthTitle = `${months[viewMonth.getMonth()]} ${viewMonth.getFullYear() + 543}`;
    const lanna = getLannaDate(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1));
    return {
      yearZodiac: lanna?.yearZodiac || "",
      cs: lanna?.cs || 0,
      monthTitle
    };
  }, [viewMonth]);

  const selectedDayFullInfo = useMemo(() => {
    if (!selectedDate) return null;
    const lanna = getLannaDate(selectedDate);
    if (!lanna) return null;

    const song = getSongkranLabel(selectedDate);
    const dir = getDirections(selectedDate.getDay());
    const rawLunarDay = lanna.phase === 'ออก' ? lanna.lunarDay : lanna.lunarDay + 15;
    const kalaYok = getDailyKalaYoga(rawLunarDay, selectedDate.getDay());

    const description = buildDescription(lanna);
    const dailyRituals = getDailyRituals(selectedDate.getDay());

    const detailData: DayData = {
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
        good: [lanna.isThongChai ? "วันธงชัย" : "", lanna.isAthipadi ? "วันอธิบดี" : "", ...lanna.sitthiList, lanna.isHuaRiangMon ? "วันหัวเรียงหมอน" : ""].filter(Boolean),
        bad: [lanna.isSia ? "วันเสีย" : "", lanna.isUbat ? "วันอุบาทว์" : "", lanna.isLokawinat ? "วันโลกาวินาศ" : "", lanna.isLomLuang ? "วันหล่มหลวง" : "", lanna.isMai ? "วันไหม้" : "", lanna.isWodwai ? "วันวอดวาย" : ""].filter(Boolean),
        special: lanna.isSin ? ["วันศีล"] : []
      },
      description: description,
      warnings: [],
      rituals: dailyRituals,
      festival: song || "",
      rawText: "",
      directions: {
        sri: dir.sri,
        ka: dir.ka
      },
      kalaYok,
      wanMuai: lanna.wanMuai,
      wanPhiKin: lanna.wanPhiKin,
      panjaDithi: lanna.panjaDithi,
      sitthi: lanna.sitthi,
      sitthiList: lanna.sitthiList,
      isUbat: lanna.isUbat,
      isLokawinat: lanna.isLokawinat,
      isMachu: lanna.isMachu,
      isMahaMachu: lanna.isMahaMachu,
      isMai: lanna.isMai,
      isWodwai: lanna.isWodwai,
      isHuaRiangMon: lanna.isHuaRiangMon
    };

    return { ...lanna, detailData };
  }, [selectedDate]);

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const stepMonth = (n: number) => {
    const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + n, 1);
    setViewMonth(next);
    setSelectedDate(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#b8d7ff] selection:text-black overflow-x-hidden">

      {/* APP HEADER */}
      <header className="grid grid-cols-[32px_minmax(0,1fr)_32px] items-center min-h-[35px] border-b border-black text-black bg-white">
        <button onClick={() => stepMonth(-1)} className="h-full text-[24px] leading-none text-left pl-1 font-bold">&lt;</button>
        <div className="min-w-0 text-center font-bold leading-tight py-1">
          <div className="text-[15px] sm:text-[18px] whitespace-nowrap overflow-hidden text-ellipsis">ปี{headerInfo.yearZodiac}<span className="mx-2 sm:mx-7">{headerInfo.monthTitle}</span></div>
          <div className="text-[12px] sm:text-[13px] font-semibold text-gray-600">จ.ศ. {headerInfo.cs}</div>
        </div>
        <button onClick={() => stepMonth(1)} className="h-full text-[24px] leading-none text-right pr-1 font-bold">&gt;</button>
      </header>

      {/* VIEW MODE TOGGLE */}
      <div className="flex items-center justify-center gap-2 py-2 border-b border-black bg-white">
        <button
          onClick={() => setViewMode('week')}
          className={`px-4 py-1 rounded-full border border-black text-[13px] font-bold leading-tight ${viewMode === 'week' ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          สัปดาห์
        </button>
        <button
          onClick={() => setViewMode('month')}
          className={`px-4 py-1 rounded-full border border-black text-[13px] font-bold leading-tight ${viewMode === 'month' ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          ทั้งเดือน
        </button>
      </div>

      {/* VIEWPORT */}
      <main className="bg-white">
        <div>
            <div className="flex flex-col">
              {/* Day Labels Header Row */}
              <div className="grid grid-cols-7 border-t border-l border-black">
                {WEEKDAY_STYLES.map((style) => (
                  <div 
                    key={style.label}
                    className={`h-[36px] border-r border-b border-black flex items-center justify-center text-[13px] font-bold ${style.header}`}
                  >
                    {style.label}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 border-l border-black">
                {visibleCells.map((cell, cellIdx) => {
                  if (cell === null) {
                    return (
                      <div key={`blank-${cellIdx}`} className={`${viewMode === 'week' ? 'min-h-[150px]' : 'min-h-[110px] sm:min-h-[125px]'} border-r border-b border-black bg-white`} />
                    );
                  }
                  const day = cell;
                  const dow = day.date.getDay();
                  const style = WEEKDAY_STYLES[dow];
                  const isSelected = selectedDate?.getDate() === day.day &&
                    selectedDate?.getMonth() === viewMonth.getMonth() &&
                    selectedDate?.getFullYear() === viewMonth.getFullYear();
                  const now = new Date();
                  const isToday = day.date.getDate() === now.getDate() &&
                    day.date.getMonth() === now.getMonth() &&
                    day.date.getFullYear() === now.getFullYear();
                  const statusLines = getStatusLines(day);
                  const compactLines = [
                    { text: toArabicDigits(`เดือน ${day.lannaMonth}`), className: 'text-black font-bold' },
                    { text: toArabicDigits(`${day.phase}${day.lunarDay} ค่ำ`), className: 'text-black font-bold' },
                  ];
                  
                  return (
                    <div 
                      key={day.day}
                      onClick={() => handleSelect(day.date)}
                      className={`relative ${viewMode === 'week' ? 'min-h-[150px]' : 'min-h-[110px] sm:min-h-[125px]'} border-r border-b border-black cursor-pointer overflow-hidden ${
                        isToday ? 'shadow-[inset_0_0_0_3px_#d71920]' : ''
                      } ${
                        isSelected ? 'bg-[#fff1d8] outline outline-1 outline-[#0b62ff] outline-offset-[-1px]' : `${style.cell} hover:bg-[#f8f8f8]`
                      }`}
                    >
                      {isToday ? (
                        <span className="absolute right-1 bottom-1 z-20 w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] rounded-full bg-[#d71920] text-white text-[15px] sm:text-[17px] font-black leading-none flex items-center justify-center select-none pointer-events-none">
                          {toArabicDigits(day.day)}
                        </span>
                      ) : (
                        <span
                          className={`absolute right-1 bottom-1 text-[36px] font-black leading-[0.8] opacity-20 select-none pointer-events-none ${
                            dow === 0 ? 'text-red-600' : 'text-black'
                          }`}
                        >
                          {toArabicDigits(day.day)}
                        </span>
                      )}

                      {isToday && (
                        <span className="absolute left-[2px] bottom-[2px] z-20 bg-[#d71920] text-white text-[8px] sm:text-[9px] font-black px-[3px] rounded leading-[1.4] select-none pointer-events-none">
                          วันนี้
                        </span>
                      )}

                      <div
                        className={`relative z-10 m-[1px] sm:m-[2px] p-[2px] sm:p-[4px] leading-[1.3] max-h-[calc(100%-10px)] overflow-y-auto no-scrollbar text-[10px] sm:text-[12px] ${
                          isSelected ? 'bg-[#fff4df]/80' : 'bg-transparent'
                        }`}
                      >
                        {/* Status lines at the VERY TOP */}
                        {statusLines.map((line, idx) => (
                          <div key={`${day.day}-status-${idx}`} className={line.className}>
                            {line.text}
                          </div>
                        ))}
                        
                        {/* Lunar info below status */}
                        {compactLines.map((line, idx) => (
                          <div key={`${day.day}-lunar-${idx}`} className={line.className}>
                            {line.text}
                          </div>
                        ))}
                        
                        {(isSelected || day.isSin || day.isSia || day.isUbat || day.isLokawinat || day.isMai || day.isWodwai || day.isMachu || day.isThongChai || day.isAthipadi || day.sitthiList.length > 0) && (
                          <div className="flex gap-[5px] mt-2">
                            {day.isSin && <span className="w-[10px] h-[10px] rounded-full bg-[#f2994a]" />}
                            {(day.isSia || day.isUbat || day.isLokawinat || day.isMai || day.isWodwai || day.isMachu) && <span className="w-[10px] h-[10px] rounded-full bg-[#d71920]" />}
                            {(day.isThongChai || day.isAthipadi || day.sitthiList.length > 0) && <span className="w-[10px] h-[10px] rounded-full bg-[#138a2e]" />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="min-h-[42px] flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-1 text-[12px] border-b border-black">
                <span className="inline-flex items-center gap-1 text-[#f2994a]"><span className="w-[10px] h-[10px] rounded-full bg-[#f2994a]" />วันศีล</span>
                <span className="inline-flex items-center gap-1 text-[#d71920]"><span className="w-[10px] h-[10px] rounded-full bg-[#d71920]" />วันไม่ดี</span>
                <span className="inline-flex items-center gap-1 text-[#138a2e]"><span className="w-[10px] h-[10px] rounded-full bg-[#138a2e]" />วันดี</span>
              </div>

              <div className="py-2 px-3 text-center text-[11px] text-gray-500 border-b border-black">
                ข้อมูลทุกปีคำนวณจากสูตรที่ผ่านการทดสอบเทียบกับปฏิทินล้านนา 2569 มื้อจั๋นวันดี ฉบับมหาวิทยาลัยเชียงใหม่ ครบ 365 วันแล้ว
              </div>
            </div>
        </div>

        {/* DAILY DETAIL SECTION */}
        <div ref={dailyRef} className="bg-white">
          {selectedDate && selectedDayFullInfo ? (
            <DetailSection date={selectedDate} data={selectedDayFullInfo.detailData} />
          ) : (
            <div className="py-8 text-center text-[13px] border-b border-black">
              เลือกวันที่เพื่อดูรายละเอียด
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
