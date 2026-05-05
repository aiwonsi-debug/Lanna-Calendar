import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MonthlyGrid, LannaDayData } from './components/MonthlyGrid';
import { MONTH_NAMES, loadMonthData } from './utils/lanna';
import { getLannaDate, getSongkranLabel, getDirections, getDailyKalaYoga } from './utils/lannaCalc';
import { DetailSection, DayData } from './components/DetailSection';

export default function App() {
  const [viewMonth, setViewMonth] = useState(new Date(2026, 4, 1)); // May 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [monthData, setMonthData] = useState<LannaDayData[]>([]);
  const [rawMonthData, setRawMonthData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const dailyRef = useRef<HTMLDivElement>(null);

  // Load Lanna data for the current viewMonth
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await loadMonthData(viewMonth);
      setRawMonthData(data);
      
      const enriched = data.map(d => {
        const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d.d);
        const lanna = getLannaDate(date);
        
        if (!lanna) return { d: d.d, date, lannaMonth: 0, lunarDay: 0, phase: '', wanThai: '' } as LannaDayData;

        // Mock/Derive extra UI flags
        const fahTeeSang = (date.getDate() % 7) + 1;
        const isFahTeeSangGood = [2, 4, 5, 6].includes(fahTeeSang);
        const isRahuTok = date.getDate() % 10 === 0;

        const dithiNames = ["นัท", "ภัทร", "ไชย", "ริตต", "ปุณณ"];
        const dithiName = dithiNames[(lanna.lunarDay - 1) % 5];

        return {
          d: d.d,
          date,
          lannaMonth: lanna.lannaMonth,
          lunarDay: lanna.lunarDay,
          phase: lanna.phase,
          wanThai: lanna.wanThai,
          isSin: lanna.isSin || d.labels?.special?.includes("วันศีล"),
          isSia: lanna.isSia || d.labels?.bad?.includes("วันเสีย"),
          isUbat: lanna.isUbat || d.labels?.bad?.includes("วันอุบาทว์"),
          isLokawinat: lanna.isLokawinat || d.labels?.bad?.includes("วันโลกาวินาศ"),
          isWanMutju: lanna.isWanMutju,
          isThongChai: lanna.isThongChai || d.labels?.good?.includes("วันธงชัย"),
          isAthipadi: lanna.isAthipadi || d.labels?.good?.includes("วันอธิบดี"),
          sitthi: lanna.sitthi,
          songkranLabel: getSongkranLabel(date),
          isRahuTok,
          isFahTeeSangGood,
          dithiName
        } as LannaDayData;
      });
      
      setMonthData(enriched);
      setIsLoading(false);
    };
    fetchData();
  }, [viewMonth]);

  const headerInfo = useMemo(() => {
    const lanna = getLannaDate(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1));
    return {
      yearZodiac: lanna?.yearZodiac || "",
      cs: lanna?.cs || 0,
      monthTitle: `${MONTH_NAMES[viewMonth.getMonth()]} ${viewMonth.getFullYear() + 543}`
    };
  }, [viewMonth]);

  const selectedDayFullInfo = useMemo(() => {
    if (!selectedDate) return null;
    const lanna = getLannaDate(selectedDate);
    if (!lanna) return null;

    const raw = rawMonthData.find(d => d.d === selectedDate.getDate());
    const song = getSongkranLabel(selectedDate);
    const dir = getDirections(selectedDate.getDay());
    
    // Kala Yoga
    const rawLunarDay = lanna.phase === 'ออก' ? lanna.lunarDay : lanna.lunarDay + 15;
    const kalaYok = getDailyKalaYoga(rawLunarDay, selectedDate.getDay());

    const detailData: DayData = {
      y: selectedDate.getFullYear() + 543,
      m: selectedDate.getMonth() + 1,
      d: selectedDate.getDate(),
      lannaMonth: lanna.lannaMonth,
      lunar: {
        phase: lanna.phase === 'ออก' ? "waxing" : "waning",
        day: lanna.lunarDay
      },
      labels: {
        good: [
          lanna.isThongChai ? "วันธงชัย" : "",
          lanna.isAthipadi ? "วันอธิบดี" : "",
          lanna.sitthi || ""
        ].filter(Boolean),
        bad: [
          lanna.isSia ? "วันเสีย" : "",
          lanna.isUbat ? "วันอุบาทว์" : "",
          lanna.isLokawinat ? "วันโลกาวินาศ" : ""
        ].filter(Boolean),
        special: lanna.isSin ? ["วันศีล"] : []
      },
      description: raw?.description || "วันดีมงคล เหมาะแก่การเริ่มต้นกิจการงานใหม่ การประกอบพิธีมงคล หรือการติดต่อประสานงาน",
      warnings: raw?.warnings || [],
      rituals: raw?.rituals || [],
      festival: song || "",
      rawText: raw?.rawText || "",
      directions: {
        sri: dir.sri,
        ka: dir.ka
      },
      kalaYok
    };

    return {
      ...lanna,
      detailData
    };
  }, [selectedDate, rawMonthData]);

  // Handlers
  const handleSelect = (date: Date) => {
    setSelectedDate(date);
    setTimeout(() => dailyRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const stepMonth = (n: number) => {
    const next = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + n, 1);
    setViewMonth(next);
    setSelectedDate(null);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-[100%] mx-auto bg-white font-sans selection:bg-[#5A3520] selection:text-[#FEF3C7] relative overflow-x-hidden">
      
      {/* HEADER */}
      <header className="shrink-0 bg-[#5A3520] text-[#FEF3C7] py-3 px-4 flex justify-between items-center z-40">
        <button onClick={() => stepMonth(-1)} className="text-xl font-bold px-2">‹</button>
        <div className="flex-1 text-center font-bold text-[14px]">
          ปี{headerInfo.yearZodiac} {headerInfo.monthTitle} · จ.ศ. {headerInfo.cs}
        </div>
        <button onClick={() => stepMonth(1)} className="text-xl font-bold px-2">›</button>
      </header>

      {/* VIEWPORT */}
      <main className="flex-1 bg-white">
        <div className="animate-in fade-in duration-300">
          {isLoading ? (
            <div className="py-20 text-center text-gray-300 font-bold animate-pulse">กำลังโหลดข้อมูล...</div>
          ) : monthData.length > 0 ? (
            <MonthlyGrid 
              viewMonth={viewMonth} 
              days={monthData} 
              selectedDate={selectedDate} 
              onSelect={handleSelect} 
            />
          ) : (
            <div className="py-20 text-center text-red-300 font-bold italic">ไม่พบข้อมูลปั๊กขะทืน</div>
          )}

          <footer className="py-4 text-center text-[10px] flex justify-center gap-4 text-[#5A3520]">
            <div className="flex items-center gap-1">
              <span className="text-orange-400 text-[12px]">●</span> วันศีล
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-600 text-[12px]">●</span> วันดี
            </div>
            <div className="flex items-center gap-1">
              <span className="text-red-500 text-[12px]">●</span> วันไม่ดี
            </div>
          </footer>
        </div>

        <div className="h-[3px] bg-[#5A3520] w-full" />

        {/* DAILY DETAIL SECTION */}
        <div ref={dailyRef} className="bg-white min-h-[500px]">
          {selectedDate && selectedDayFullInfo ? (
            <DetailSection date={selectedDate} data={selectedDayFullInfo.detailData} />
          ) : (
            <div className="flex flex-col items-center justify-center py-32 opacity-20">
              <div className="text-6xl mb-4">☝️</div>
              <p className="text-[14px] font-bold text-[#5A3520] uppercase tracking-widest">เลือกวันที่เพื่อดูรายละเอียด</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
