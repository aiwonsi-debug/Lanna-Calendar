import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MonthlyGrid, LannaDayData } from './components/MonthlyGrid';
import { MONTH_NAMES, loadMonthData } from './utils/lanna';
import { getLannaDate, getSongkranLabel, getDirections } from './utils/lannaCalc';

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

  useEffect(() => {
    const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
                    'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']
    const days = ['อา','จ','อ','พ','พฤ','ศ','ส']
    console.group('=== lannaMonth + isSia 2026 ===')
    for (let m = 0; m < 12; m++) {
      for (let d = 1; d <= 7; d++) {
        const date = new Date(2026, m, d)
        const info = getLannaDate(date)
        if (info) {
          console.log(
            `${d} ${months[m]}`,
            `lannaM:${info.lannaMonth}`,
            `${days[date.getDay()]}(${date.getDay()})`,
            `isSia:${info.isSia}`
          )
        }
      }
      console.log('---')
    }
    console.groupEnd()
  }, [])

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
    const raw = rawMonthData.find(d => d.d === selectedDate.getDate());
    const song = getSongkranLabel(selectedDate);
    const dir = getDirections(selectedDate.getDay());
    
    // Helper for dithi
    const dithiNames = ["นัท", "ภัทร", "ไชย", "ริตต", "ปุณณ"];
    const dithiIdx = (lanna.lunarDay - 1) % 5;
    const dithiName = dithiNames[dithiIdx];
    
    // Helper for mahaChalong
    const chalongNames = ["ขุมทรัพย์", "บารมี", "ลาภะ", "มนตรี", "อุตสาหะ", "บริวาร", "กาลกิณี"];
    const mahaChalong = chalongNames[(lanna.cs + selectedDate.getDay()) % 7];
    
    // Helper for fahTeeSang
    const fahTeeSang = (selectedDate.getDate() % 7) + 1;
    const isFahGood = [2, 4, 5, 6].includes(fahTeeSang);

    // Extract rituals
    const getRitual = (title: string) => raw?.rituals?.find((r: any) => r.title === title)?.description || "-";

    return {
      ...lanna,
      raw,
      song,
      sri: dir.sri,
      kala: dir.ka,
      dithiName,
      dithiDesc: `วัน${dithiName}ดิถี ${dithiName === "ริตต" ? "ไม่ควรประกอบการมงคล" : "เป็นมงคลดีแล"}`,
      mahaChalong,
      mahaChalongDesc: `ตกโฉลก${mahaChalong} ${mahaChalong === "กาลกิณี" ? "ควรระวัง" : "ให้คุณดีนัก"}`,
      fahTeeSang,
      isFahGood,
      cutHair: getRitual("การตัดผม"),
      cutNail: getRitual("การตัดเล็บ"),
      washHair: "สระผมวันนี้จะโชคดี", // Placeholder
      newClothes: "นุ่งผ้าใหม่จะมีเสน่ห์", // Placeholder
      wanLohk: lanna.wanLohk,
      wanLohkDesc: `เป็นวัน${lanna.wanLohk} ตามตำราวันโลกถือเป็น${lanna.wanLohk === "มรณะ" || lanna.wanLohk === "วินาศ" ? "วันเสีย" : "วันดี"}`
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

  const formatDate = (date: Date) => {
    const thaiDayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    return `วัน${thaiDayNames[date.getDay()]} ที่ ${date.getDate()} ${MONTH_NAMES[date.getMonth()]} พ.ศ.${date.getFullYear() + 543}`;
  };

  return (
    <div className="flex flex-col min-h-screen max-w-[100%] mx-auto bg-white font-sans selection:bg-[#5A3520] selection:text-[#FEF3C7] relative overflow-x-hidden">
      
      {/* HEADER: single row, brown bg #5A3520, color #FEF3C7 */}
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

          {/* LEGEND FOOTER: below grid, centered, font 10px, no bg */}
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

        {/* DIVIDER: height 3px, background #5A3520, width 100% */}
        <div className="h-[3px] bg-[#5A3520] w-full" />

        {/* DAILY DETAIL SECTION */}
        <div ref={dailyRef} className="bg-white min-h-[500px]">
          {selectedDate && selectedDayFullInfo ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Daily Header: centered, no bg */}
              <div className="text-center py-6">
                <h2 className="text-[16px] font-bold text-[#1A0A00]">
                  {formatDate(selectedDate)}
                </h2>
                <div className="text-[11px] text-[#777] mt-0.5">
                  จ.ศ. {selectedDayFullInfo.cs} · ปี{selectedDayFullInfo.yearZodiac}
                </div>
                <div className="text-[13px] font-bold text-[#5A3520] mt-1">
                  {selectedDayFullInfo.phase} {selectedDayFullInfo.lunarDay} ค่ำ เดือน {selectedDayFullInfo.lannaMonth}
                </div>
              </div>
              
              {/* 1px separator line below header */}
              <div className="mx-4 h-px bg-[#F0EDE8]" />

              {/* Tag Pills Row: flex-wrap, gap 5px */}
              <div className="px-4 py-4 flex flex-wrap gap-[5px]">
                {selectedDayFullInfo.isSin && (
                  <span className="text-[10px] font-semibold bg-[#FFF7ED] text-[#C2410C] px-[7px] py-[2px] rounded-[10px]">วันศีล</span>
                )}
                {selectedDayFullInfo.isThongChai && (
                  <span className="text-[10px] font-semibold bg-[#F0FDF4] text-[#166534] px-[7px] py-[2px] rounded-[10px]">วันธงชัย</span>
                )}
                {selectedDayFullInfo.isAthipadi && (
                  <span className="text-[10px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] px-[7px] py-[2px] rounded-[10px]">วันอธิบดี</span>
                )}
                {selectedDayFullInfo.sitthi && (
                  <span className="text-[10px] font-semibold bg-[#F0FDFA] text-[#0F766E] px-[7px] py-[2px] rounded-[10px]">{selectedDayFullInfo.sitthi}</span>
                )}
                {selectedDayFullInfo.isSia && (
                  <span className="text-[10px] font-semibold bg-[#FEF2F2] text-[#B91C1C] px-[7px] py-[2px] rounded-[10px]">วันเสีย</span>
                )}
                {selectedDayFullInfo.isUbat && (
                  <span className="text-[10px] font-semibold bg-[#FEF2F2] text-[#B91C1C] px-[7px] py-[2px] rounded-[10px]">วันอุบาทว์</span>
                )}
                {selectedDayFullInfo.isLokawinat && (
                  <span className="text-[10px] font-semibold bg-[#FEF2F2] text-[#B91C1C] px-[7px] py-[2px] rounded-[10px]">วันโลกาวินาศ</span>
                )}
                <span className="text-[10px] font-semibold bg-[#F5EDE4] text-[#7A4A2A] px-[7px] py-[2px] rounded-[10px]">{selectedDayFullInfo.wanThai}</span>
                <span className="text-[10px] font-semibold bg-[#F0EFEE] text-[#555] px-[7px] py-[2px] rounded-[10px]">{selectedDayFullInfo.wanLohk}</span>
                <span className="text-[10px] font-semibold bg-[#F0EFEE] text-[#555] px-[7px] py-[2px] rounded-[10px]">{selectedDayFullInfo.dithiName}ดิถี</span>
                <span className="text-[10px] font-semibold bg-[#F0EFEE] text-[#555] px-[7px] py-[2px] rounded-[10px]">{selectedDayFullInfo.mahaChalong}</span>
                {selectedDayFullInfo.isFahGood ? (
                  <span className="text-[10px] font-semibold bg-[#F0FDF4] text-[#166534] px-[7px] py-[2px] rounded-[10px]">ฟ้าตีแส่งดี</span>
                ) : (
                  <span className="text-[10px] font-semibold bg-[#FEF2F2] text-[#B91C1C] px-[7px] py-[2px] rounded-[10px]">ฟ้าตีแส่งเศษ {selectedDayFullInfo.fahTeeSang}</span>
                )}
              </div>

              {/* 1px separator below pills */}
              <div className="mx-4 h-px bg-[#F0EDE8] mb-[6px]" />

              {/* Direction Grid: 2 columns, gap 6px, margin 6px 0 10px */}
              <div className="px-4 grid grid-cols-2 gap-[6px] mb-[10px]">
                {[
                  { label: "ทิศศรี", val: selectedDayFullInfo.sri, color: "text-[#059669]" },
                  { label: "ทิศกาลกิณี", val: selectedDayFullInfo.kala, color: "text-[#DC2626]" }
                ].map((dir, i) => (
                  <div key={i} className="bg-[#F9F6F1] rounded-[6px] py-[6px] text-center">
                    <div className="text-[9px] text-[#8B6E57] mb-[2px]">{dir.label}</div>
                    <div className={`text-[13px] font-bold ${dir.color}`}>{dir.val}</div>
                  </div>
                ))}
              </div>

              {/* Info Rows: padding 7px 0, border-bottom 1px #F0EDE8 */}
              <div className="px-4 flex flex-col">
                {[
                  { label: "วันไท", val: `${selectedDayFullInfo.wanThai} — ${selectedDayFullInfo.wanThaiDesc}` },
                  { label: "วันโลก", val: `${selectedDayFullInfo.wanLohk} — ${selectedDayFullInfo.wanLohkDesc}` },
                  { label: "มหาโฉลก", val: `${selectedDayFullInfo.mahaChalong} — ${selectedDayFullInfo.mahaChalongDesc}` },
                  { label: "ดิถี", val: selectedDayFullInfo.dithiDesc },
                  { label: "วันเก้ากอง", val: `${selectedDayFullInfo.kaoKong} — ${selectedDayFullInfo.kaoKongDesc}` },
                  { 
                    label: "ฟ้าตีแส่ง", 
                    val: `เศษ ${selectedDayFullInfo.fahTeeSang} — ${
                      [2, 4, 5, 6].includes(selectedDayFullInfo.fahTeeSang) 
                        ? "ทำการสิ่งใดจักได้ดี อยู่ดีมีสุข พรั่งพร้อม" 
                        : [0, 1, 8].includes(selectedDayFullInfo.fahTeeSang)
                          ? "พินาศฉิบหาย อย่าทำพิธีหรือกิจกรรมใด"
                          : "ไฟจักไหม้หรือประสบอุบัติเหตุ เสียทรัพย์สิน"
                    }`,
                    color: [2, 4, 5, 6].includes(selectedDayFullInfo.fahTeeSang) ? 'text-[#166534]' : 'text-[#B91C1C]'
                  },
                  { label: "ตัดผม", val: selectedDayFullInfo.cutHair },
                  { label: "ตัดเล็บ", val: selectedDayFullInfo.cutNail },
                  { label: "สระผม", val: selectedDayFullInfo.washHair },
                  { label: "นุ่งผ้าใหม่", val: selectedDayFullInfo.newClothes }
                ].map((row, i) => (
                  <div key={i} className="flex py-[7px] border-b border-[#F0EDE8] last:border-0">
                    <div className="w-16 shrink-0 text-[11px] text-[#8B6E57] pt-0.5">{row.label}</div>
                    <div className={`text-[12px] leading-relaxed ${row.color ? row.color : (row.val.startsWith('ห้าม') || row.val.includes('ไม่ควร') || row.val.includes('ควรระวัง') || row.val.includes('ฉิบหาย') ? 'text-[#B91C1C]' : 'text-[#1A0A00]')}`}>
                      {row.val}
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-20" /> {/* Bottom spacer */}
            </div>
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
