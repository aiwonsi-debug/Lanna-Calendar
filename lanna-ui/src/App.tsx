import React, { useState, useMemo, useEffect } from 'react';

// --- 1. DATA CONTRACT & TYPES ---
interface LannaDay {
  d: number;      // Day of month
  s: number;      // Status bitmask (1: Good/Sunday, 2: Bad, 4: Holy)
  l: string;      // Lunar string (e.g. "ขึ้น 15 ค่ำ")
  wt: string;     // Wan Thai name
  desc: string;   // Wisdom text
  f?: boolean;    // Festival flag
}

// --- 2. LOGIC CONSTANTS ---
const MONTH_NAMES = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

// --- 3. UTILITY COMPONENTS ---

const Badge = ({ text, variant }: { text: string; variant: 'good' | 'bad' | 'holy' | 'fest' | 'neutral' }) => {
  const styles = {
    good: "bg-green-50 text-green-700 border-green-200",
    bad: "bg-red-50 text-red-700 border-red-200",
    holy: "bg-amber-50 text-amber-700 border-amber-200",
    fest: "bg-sky-50 text-sky-700 border-sky-200",
    neutral: "bg-gray-50 text-gray-700 border-gray-200"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[12px] font-bold border ${styles[variant]}`}>
      {text}
    </span>
  );
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm ${className}`}>
    {children}
  </div>
);

// --- 4. DATA LOADER ---
const dataset = import.meta.glob('./data/v2/*.json');

// --- 5. MAIN APPLICATION ---

export default function App() {
  const [viewMonth, setViewMonth] = useState(new Date(2026, 4, 1)); // May 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 4, 14));
  const [filter, setFilter] = useState('all');
  const [monthData, setMonthData] = useState<LannaDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hydration
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const year = viewMonth.getFullYear();
      const month = (viewMonth.getMonth() + 1).toString().padStart(2, '0');
      const key = `./data/v2/${year}-${month}.json`;

      if (dataset[key]) {
        try {
          const mod = (await dataset[key]()) as any;
          setMonthData(mod.default?.days || mod.days || []);
        } catch (e) {
          console.error("Failed to load Lanna data", e);
          setMonthData([]);
        }
      } else {
        setMonthData([]);
      }
      setIsLoading(false);
    };
    loadData();
  }, [viewMonth]);

  // Derived Grid Logic
  const { firstDayOffset, monthTitle } = useMemo(() => {
    return {
      firstDayOffset: new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay(),
      monthTitle: `${MONTH_NAMES[viewMonth.getMonth()]} ${viewMonth.getFullYear() + 543}`
    };
  }, [viewMonth]);

  const selectedDayData = useMemo(() => {
    if (!selectedDate || selectedDate.getMonth() !== viewMonth.getMonth()) return null;
    return monthData.find(d => d.d === selectedDate.getDate());
  }, [selectedDate, monthData, viewMonth]);

  // Handlers
  const handleSelect = (d: number) => {
    const newDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d);
    setSelectedDate(newDate);
    // Deterministic scroll to detail anchor
    setTimeout(() => {
      document.getElementById('detail-anchor')?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 10);
  };

  const stepMonth = (n: number) => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + n, 1));
    setSelectedDate(null);
  };

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto bg-[#FDFCFB] font-sans selection:bg-[#6B4231] selection:text-white border-x border-gray-100 relative overflow-hidden">
      
      {/* HEADER */}
      <header className="shrink-0 bg-white border-b border-gray-100 px-4 py-4 z-40">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => stepMonth(-1)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl font-black text-[#6B4231] active:bg-gray-200 transition-colors">‹</button>
          <h1 className="text-[18px] font-black text-[#6B4231] tracking-tight text-center">{monthTitle}</h1>
          <button onClick={() => stepMonth(1)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl font-black text-[#6B4231] active:bg-gray-200 transition-colors">›</button>
        </div>

        {/* FILTER */}
        <div className="flex p-1 bg-gray-100 rounded-xl">
          {['all', 'good', 'bad'].map(m => (
            <button
              key={m}
              onClick={() => setFilter(m)}
              className={`flex-1 py-2 text-[11px] font-black rounded-lg transition-colors ${filter === m ? "bg-white text-[#6B4231] shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
            >
              {m === 'all' ? 'ทั้งหมด' : m === 'good' ? 'วันมงคล' : 'วันเสีย'}
            </button>
          ))}
        </div>
      </header>

      {/* VIEWPORT: Scrollable content */}
      <main className="flex-1 overflow-y-auto no-scrollbar bg-white">
        {/* CALENDAR GRID */}
        <div className="p-4 bg-white border-b border-gray-50">
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d, i) => (
              <div key={d} className={`text-center text-[10px] font-black mb-2 ${i === 0 ? 'text-red-500' : 'text-gray-400'}`}>{d}</div>
            ))}
            
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`p-${i}`} className="aspect-square" />
            ))}

            {isLoading ? (
               <div className="col-span-7 py-20 text-center text-gray-300 font-bold animate-pulse">กำลังโหลดข้อมูล...</div>
            ) : monthData.length > 0 ? (
              monthData.map((day) => {
                const isSelected = selectedDate?.getDate() === day.d;
                const isToday = new Date().toDateString() === new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day.d).toDateString();
                
                const isGood = !!(day.s & 1);
                const isBad = !!(day.s & 2);
                const isHoly = !!(day.s & 4);
                
                const isActive = filter === 'all' || (filter === 'good' && (isGood || isHoly)) || (filter === 'bad' && isBad);
                
                const styles = {
                  holy: "bg-[#FFFBEB] text-[#92400E] border-[#FEF3C7]",
                  bad: "bg-[#FEF2F2] text-[#991B1B] border-[#FEE2E2]",
                  good: "bg-[#F0FDF4] text-[#166534] border-[#DCFCE7]",
                  neutral: "bg-white text-[#6B4231] border-gray-100"
                };

                const type = isHoly ? 'holy' : isBad ? 'bad' : isGood ? 'good' : 'neutral';

                return (
                  <button
                    key={day.d}
                    onClick={() => handleSelect(day.d)}
                    disabled={!isActive}
                    className={`
                      relative aspect-square w-full rounded-xl border flex items-center justify-center transition-all duration-75
                      ${isActive ? styles[type] : "bg-white opacity-20 grayscale cursor-not-allowed"}
                      ${isSelected ? 'border-2 !border-[#6B4231] z-10 scale-105 shadow-md' : 'active:scale-95 hover:border-gray-300'}
                      ${isToday && !isSelected && isActive ? 'ring-2 ring-amber-400 ring-offset-1' : ''}
                    `}
                  >
                    <span className="text-[17px] font-black leading-none">{day.d}</span>
                    {day.f && <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#0891B2]" />}
                  </button>
                );
              })
            ) : (
              <div className="col-span-7 py-20 text-center text-red-300 font-bold italic">ไม่พบข้อมูลปั๊กขะทืน</div>
            )}
          </div>
        </div>

        {/* ANCHOR */}
        <div id="detail-anchor" className="h-4 bg-gray-50/50" />

        {/* DETAIL SECTION */}
        <section className="bg-white min-h-[400px] pb-20">
          {selectedDayData ? (
            <div className="flex flex-col">
              {/* Detail Header */}
              <div className="px-6 py-8 bg-[#FDFCFB] border-b border-gray-50">
                <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2 opacity-50">
                  {selectedDayData.l} • วัน{selectedDayData.wt}
                </span>
                <h2 className="text-[44px] font-black text-[#6B4231] leading-none tracking-tighter">
                  {selectedDayData.d} {MONTH_NAMES[viewMonth.getMonth()]}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge text={`${viewMonth.getFullYear() + 543}`} variant="neutral" />
                  {!!(selectedDayData.s & 4) && <Badge text="วันศีล (วันพระ)" variant="holy" />}
                  {!!(selectedDayData.s & 1) && <Badge text="วันมงคล" variant="good" />}
                  {!!(selectedDayData.s & 2) && <Badge text="วันเสีย" variant="bad" />}
                  {selectedDayData.f && <Badge text="วันสำคัญ/เทศกาล" variant="fest" />}
                </div>
              </div>

              {/* Detail Content */}
              <div className="p-6 space-y-8">
                {/* Wisdom Card */}
                <section>
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">คำทำนายโบราณ</h3>
                  <div className="p-6 bg-[#FDFBF7] rounded-[28px] border-l-4 border-[#6B4231] shadow-sm">
                    <p className="text-[18px] text-[#6B4231] leading-relaxed italic font-medium">
                      "{selectedDayData.desc}"
                    </p>
                  </div>
                </section>

                {/* Ritual Matrix */}
                <section>
                  <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">กิจวัตรล้านนา</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-xl mb-2">💇‍♂️</div>
                      <span className="text-[13px] font-bold text-gray-400 block">การตัดผม</span>
                      <span className={`text-[17px] font-black ${!!(selectedDayData.s & 2) ? 'text-red-600' : 'text-green-700'}`}>
                        {!!(selectedDayData.s & 2) ? 'ห้ามตัด' : 'ตัดดี'}
                      </span>
                    </Card>
                    <Card>
                      <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-xl mb-2">💅</div>
                      <span className="text-[13px] font-bold text-gray-400 block">การตัดเล็บ</span>
                      <span className={`text-[17px] font-black ${!!(selectedDayData.s & 2) ? 'text-red-600' : 'text-green-700'}`}>
                        {!!(selectedDayData.s & 2) ? 'ห้ามตัด' : 'ตัดดี'}
                      </span>
                    </Card>
                  </div>
                </section>

                <footer className="pt-8 border-t border-gray-100 text-center">
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">อ้างอิง: ปั๊กขะทืนล้านนา มช. & วัดธาตุคำ</p>
                </footer>
              </div>
            </div>
          ) : (
             <div className="py-24 text-center opacity-30 flex flex-col items-center">
               <div className="text-4xl mb-4">☝️</div>
               <p className="text-[14px] font-black text-[#6B4231] tracking-widest uppercase">เลือกวันที่เพื่ออ่านคำทำนาย</p>
             </div>
          )}
        </section>
      </main>

      {/* LEGEND FOOTER */}
      <footer className="shrink-0 bg-white border-t border-gray-100 px-4 py-3 flex justify-between z-30">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#F0FDF4] border border-[#DCFCE7]" /><span className="text-[9px] font-bold text-gray-400">มงคล</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#FEF2F2] border border-[#FEE2E2]" /><span className="text-[9px] font-bold text-gray-400">วันเสีย</span></div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#FFFBEB] border border-[#FEF3C7]" /><span className="text-[9px] font-bold text-gray-400">วันศีล</span></div>
        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#0891B2]" /><span className="text-[9px] font-bold text-gray-400">เทศกาล</span></div>
      </footer>

    </div>
  );
}
