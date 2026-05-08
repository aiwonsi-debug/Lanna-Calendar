import React, { useState, useMemo, useEffect, useRef } from 'react';
import { loadMonthData } from './utils/lanna';
import { getLannaDate, getSongkranLabel, getDirections, getDailyKalaYoga, getWanPhiKin } from './utils/lannaCalc';
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
  sitthi: string | null;
  songkranLabel: string | null;
  yearZodiac: string;
  cs: number;
  raw: any;
  wanThai: string;
  phiKin: string;
}

function buildDescription(lanna: any, phiKin: string): string {
  if (!lanna) return "";
  const lines: string[] = [];

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

  // วันผีกิน
  if (phiKin) {
    lines.push(`${phiKin}`);
  }

  return lines.join("\n");
}

const getStatusLines = (day: Day) => [
  day.isSia ? { text: 'วันเสีย', className: 'text-[#d71920]' } : null,
  day.isUbat ? { text: 'วันอุบาทว์', className: 'text-[#0645c0]' } : null,
  day.isLokawinat ? { text: 'โลกาวินาศ', className: 'text-[#111111]' } : null,
  day.isThongChai ? { text: 'ธงชัย', className: 'text-[#0f8a2a]' } : null,
  day.isAthipadi ? { text: 'อธิบดี', className: 'text-[#0f8a2a]' } : null,
  day.sitthi ? { text: toArabicDigits(day.sitthi), className: 'text-[#0645c0]' } : null,
  day.songkranLabel ? { text: toArabicDigits(day.songkranLabel), className: 'text-[#0645c0]' } : null,
].filter(Boolean) as { text: string; className: string }[];

export default function App() {
  const [viewMonth, setViewMonth] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => new Date());
  const [monthData, setMonthData] = useState<Day[]>([]);
  const [rawMonthData, setRawMonthData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const dailyRef = useRef<HTMLDivElement>(null);

  // Load Lanna data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await loadMonthData(viewMonth);
        setRawMonthData(data);
        
        const enriched = data.map(d => {
          const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d.day);
          const lanna = getLannaDate(date);
          if (!lanna) return null;

          const phiKin = getWanPhiKin(lanna.lannaMonth, lanna.lunarDay, lanna.phase);

          return {
            ...lanna,
            day: d.day,
            isSin: lanna.isSin || (d.labels && d.labels.includes("วันศีล")),
            songkranLabel: getSongkranLabel(date),
            raw: d,
            wanThai: lanna.wanThai,
            phiKin: phiKin
          };
        }).filter(Boolean) as Day[];
        
        setMonthData(enriched);
      } catch (e) {
        console.error("fetchData error", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [viewMonth]);

  const blanks = useMemo(() => {
    if (monthData.length === 0) return [];
    const firstDay = monthData[0].date.getDay();
    return Array.from({ length: firstDay }, (_, i) => i);
  }, [monthData]);

  const headerInfo = useMemo(() => {
    const lanna = getLannaDate(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1));
    const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
    return {
      yearZodiac: lanna?.yearZodiac || "",
      cs: lanna?.cs || 0,
      monthTitle: `${months[viewMonth.getMonth()]} ${viewMonth.getFullYear() + 543}`
    };
  }, [viewMonth]);

  const selectedDayFullInfo = useMemo(() => {
    if (!selectedDate) return null;
    const lanna = getLannaDate(selectedDate);
    if (!lanna) return null;

    const raw = rawMonthData.find(d => d.day === selectedDate.getDate());
    const song = getSongkranLabel(selectedDate);
    const dir = getDirections(selectedDate.getDay());
    const rawLunarDay = lanna.phase === 'ออก' ? lanna.lunarDay : lanna.lunarDay + 15;
    const kalaYok = getDailyKalaYoga(rawLunarDay, selectedDate.getDay());
    const phiKin = getWanPhiKin(lanna.lannaMonth, lanna.lunarDay, lanna.phase);

    const description = buildDescription(lanna, phiKin);

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
        good: [lanna.isThongChai ? "วันธงชัย" : "", lanna.isAthipadi ? "วันอธิบดี" : "", lanna.sitthi || ""].filter(Boolean),
        bad: [lanna.isSia ? "วันเสีย" : "", lanna.isUbat ? "วันอุบาทว์" : "", lanna.isLokawinat ? "วันโลกาวินาศ" : ""].filter(Boolean),
        special: lanna.isSin ? ["วันศีล"] : []
      },
      description: description,
      warnings: Array.isArray(raw?.warnings) ? raw.warnings : [],
      rituals: Array.isArray(raw?.rituals) ? raw.rituals : [],
      festival: song || "",
      rawText: raw?.rawText || "",
      directions: { 
        sri: dir.sri, 
        ka: dir.ka 
      },
      kalaYok,
      phiKin
    };

    return { ...lanna, detailData };
  }, [selectedDate, rawMonthData]);

  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    setTimeout(() => dailyRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const stepMonth = (n: number) => {
    const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + n, 1);
    setViewMonth(next);
    setSelectedDate(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#b8d7ff] selection:text-black">
      
      {/* APP HEADER */}
      <header className="grid grid-cols-[32px_1fr_32px] items-center h-[35px] border-b border-black text-black bg-white">
        <button onClick={() => stepMonth(-1)} className="h-full text-[24px] leading-none text-left pl-1 font-bold">&lt;</button>
        <div className="text-center font-bold text-[18px] leading-none whitespace-nowrap">
          ปี{headerInfo.yearZodiac}<span className="mx-7">{headerInfo.monthTitle}</span>จ.ศ. {headerInfo.cs}
        </div>
        <button onClick={() => stepMonth(1)} className="h-full text-[24px] leading-none text-right pr-1 font-bold">&gt;</button>
      </header>

      {/* VIEWPORT */}
      <main className="bg-white">
        <div>
          {isLoading ? (
            <div className="py-20 text-center text-[13px] font-bold">กำลังโหลดข้อมูล...</div>
          ) : (
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
                {/* Blanks */}
                {blanks.map((_, i) => (
                  <div key={`blank-${i}`} className="min-h-[100px] border-r border-b border-black bg-white" />
                ))}

                {/* Days */}
                {monthData.map((day) => {
                  const dow = day.date.getDay();
                  const style = WEEKDAY_STYLES[dow];
                  const isSelected = selectedDate?.getDate() === day.day &&
                    selectedDate?.getMonth() === viewMonth.getMonth() &&
                    selectedDate?.getFullYear() === viewMonth.getFullYear();
                  const statusLines = getStatusLines(day);
                  const compactLines = [
                    { text: toArabicDigits(`เดือน ${day.lannaMonth}`), className: 'text-black' },
                    { text: toArabicDigits(`${day.phase}${day.lunarDay} ค่ำ`), className: 'text-black' },
                    ...statusLines,
                  ];
                  
                  return (
                    <div 
                      key={day.day}
                      onClick={() => handleSelect(day.date)}
                      className={`relative min-h-[100px] border-r border-b border-black cursor-pointer overflow-hidden ${
                        isSelected ? 'bg-[#fff1d8] outline outline-1 outline-[#0b62ff] outline-offset-[-1px]' : `${style.cell} hover:bg-[#f8f8f8]`
                      }`}
                    >
                      <span
                        className={`absolute right-1 bottom-1 text-[36px] font-black leading-[0.8] opacity-20 select-none pointer-events-none ${
                          dow === 0 ? 'text-red-600' : 'text-black'
                        }`}
                      >
                        {toArabicDigits(day.day)}
                      </span>

                      <div
                        className={`relative z-10 m-[3px] p-[4px] leading-[1.15] font-bold max-h-[calc(100%-10px)] overflow-y-auto no-scrollbar ${
                          isSelected ? 'text-[12px] bg-[#fff4df]/80' : 'text-[12px] bg-transparent'
                        }`}
                      >
                        {compactLines.map((line) => (
                          <div key={`${day.day}-${line.text}`} className={line.className}>
                            {line.text}
                          </div>
                        ))}
                        {(isSelected || day.isSin || day.isSia || day.isUbat || day.isLokawinat || day.isThongChai || day.isAthipadi || day.sitthi) && (
                          <div className="flex gap-[5px] mt-2">
                            {day.isSin && <span className="w-[10px] h-[10px] rounded-full bg-[#f2994a]" />}
                            {(day.isSia || day.isUbat || day.isLokawinat) && <span className="w-[10px] h-[10px] rounded-full bg-[#d71920]" />}
                            {(day.isThongChai || day.isAthipadi || day.sitthi) && <span className="w-[10px] h-[10px] rounded-full bg-[#138a2e]" />}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="h-[42px] flex items-center justify-center gap-3 text-[12px] border-b border-black">
                <span className="inline-flex items-center gap-1 text-[#f2994a]"><span className="w-[10px] h-[10px] rounded-full bg-[#f2994a]" />วันศีล</span>
                <span className="inline-flex items-center gap-1 text-[#d71920]"><span className="w-[10px] h-[10px] rounded-full bg-[#d71920]" />วันไม่ดี</span>
                <span className="inline-flex items-center gap-1 text-[#138a2e]"><span className="w-[10px] h-[10px] rounded-full bg-[#138a2e]" />วันดี</span>
              </div>
            </div>
          )}
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
