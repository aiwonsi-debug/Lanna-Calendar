import React from 'react';

// --- DATA INTERFACES ---
export interface LunarData {
  phase: "waxing" | "waning";
  day: number;
}

export interface Ritual {
  title: string;
  description: string;
}

export interface DayData {
  y: number;
  m: number;
  d: number;
  lannaMonth: number;
  lunar: LunarData;
  labels: {
    good: string[];
    bad: string[];
    special: string[];
  };
  description: string;
  warnings: string[];
  rituals: Ritual[];
  festival: string;
  rawText: string;
  directions?: {
    sri: string;
    ka: string;
  };
  kalaYok?: {
    name: string;
    meaning: string;
    isGood: boolean;
  };
}

interface DetailSectionProps {
  date: Date;
  data: DayData;
}

/**
 * DetailSection Component
 * Original stylized version with Kala Yoga integrated.
 */
export const DetailSection: React.FC<DetailSectionProps> = ({ date, data }) => {
  const monthTitle = date instanceof Date && !isNaN(date.getTime())
    ? new Intl.DateTimeFormat('th-TH', { month: 'long' }).format(date)
    : "";
    
  const lunarText = `${data.lunar.phase === 'waxing' ? 'ขึ้น' : 'แรม'} ${data.lunar.day} ค่ำ`;

  return (
    <div className="w-full flex flex-col bg-white animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Header: Temporal Anchor & Labels */}
      <div className="px-6 py-8 bg-[#FDFCFB] border-b border-gray-100/50">
        <div className="flex flex-col gap-1 mb-4">
          <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">
            ปั๊กขะทืนล้านนา • {lunarText}
          </span>
          <h2 className="text-[42px] font-black text-[#6B4231] leading-[1.1] tracking-tighter">
            {data.d} {monthTitle}
          </h2>
          <span className="text-[16px] font-bold text-gray-300 -mt-1">
            พุทธศักราช {data.y}
          </span>
          <span className="text-[14px] font-bold text-[#5A3520] mt-1">
            เดือน {data.lannaMonth}
          </span>
        </div>
        
        {/* Badges Container */}
        <div className="flex flex-wrap gap-2 mt-4">
          {data.labels.special.map((tag, i) => (
            <span key={`spec-${i}`} className="px-3 py-1.5 bg-[#6B4231] text-white text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm border border-[#5A3829]">
              {tag}
            </span>
          ))}
          {data.labels.good.map((tag, i) => (
            <span key={`good-${i}`} className="px-3 py-1.5 bg-[#F0FDF4] text-[#166534] text-[11px] font-bold rounded-full uppercase tracking-wider border border-[#DCFCE7]">
              {tag}
            </span>
          ))}
          {data.labels.bad.map((tag, i) => (
            <span key={`bad-${i}`} className="px-3 py-1.5 bg-[#FEF2F2] text-[#991B1B] text-[11px] font-bold rounded-full uppercase tracking-wider border border-[#FEE2E2]">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Primary Content: Wisdom & Warnings */}
      <div className="p-6 space-y-10">
        
        {/* Full Description / Ancient Wisdom */}
        {data.description && (
          <section className="relative">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-gray-200" /> คำทำนายและสิริมงคล
            </h3>
            <div className="p-7 bg-[#FDFBF7] rounded-[32px] border-l-[6px] border-[#6B4231] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <span className="text-6xl font-serif">“</span>
              </div>
              <p className="text-[19px] text-[#6B4231] leading-relaxed font-medium whitespace-pre-wrap italic">
                {data.description}
              </p>
            </div>
          </section>
        )}

        {/* Kala Yoga Section */}
        {data.kalaYok && (
          <section>
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-gray-200" /> กาลโยค
            </h3>
            <div className={`p-6 rounded-[28px] border ${data.kalaYok.isGood ? 'bg-emerald-50/30 border-emerald-100' : 'bg-red-50/30 border-red-100'}`}>
              <h4 className={`text-[18px] font-black mb-1 ${data.kalaYok.isGood ? 'text-emerald-700' : 'text-red-700'}`}>
                {data.kalaYok.name}
              </h4>
              <p className={`text-[15px] font-medium leading-relaxed ${data.kalaYok.isGood ? 'text-emerald-900/70' : 'text-red-900/70'}`}>
                {data.kalaYok.meaning}
              </p>
            </div>
          </section>
        )}

        {/* Warnings / Prohibitions */}
        {data.warnings && data.warnings.length > 0 && (
          <section>
            <h3 className="text-[11px] font-black text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-red-100" /> ข้อควรระวังและข้อห้าม
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {data.warnings.map((warning, i) => (
                <div key={`warn-${i}`} className="flex gap-4 items-start p-5 bg-white border border-red-50 rounded-2xl shadow-[0_2px_10px_-4px_rgba(220,38,38,0.1)]">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-sm shrink-0">⚠️</div>
                  <p className="text-[16px] font-bold text-red-900/80 leading-snug">{warning}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rituals Grid */}
        {data.rituals && data.rituals.length > 0 && (
          <section>
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-gray-200" /> กิจวัตรและขนบธรรมเนียม
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {data.rituals.map((ritual, i) => (
                <div key={`rit-${i}`} className="group p-6 bg-white border border-gray-100 rounded-[28px] hover:border-[#6B4231]/20 transition-all duration-300">
                  <h4 className="text-[13px] font-black text-[#6B4231] uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6B4231]" />
                    {ritual.title}
                  </h4>
                  <p className="text-[16px] font-medium text-gray-600 leading-relaxed">
                    {ritual.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Directional Beliefs (Optional) */}
        {data.directions && (
          <section>
             <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-4 h-px bg-gray-200" /> ทิศทางมงคล
            </h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-1">ทิศเดช (ศรี)</span>
                  <span className="text-[17px] font-black text-emerald-900">{data.directions.sri}</span>
               </div>
               <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl text-center">
                  <span className="text-[10px] font-bold text-orange-600 uppercase block mb-1">ทิศกาลกิณี</span>
                  <span className="text-[17px] font-black text-orange-900">{data.directions.ka}</span>
               </div>
            </div>
          </section>
        )}

        {/* Festival Highlight */}
        {data.festival && (
           <section className="relative p-7 bg-cyan-900 rounded-[36px] overflow-hidden shadow-xl shadow-cyan-900/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-10 -mt-10 rounded-full blur-2xl" />
              <div className="relative flex gap-6 items-center">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-[24px] flex items-center justify-center text-3xl shadow-inner border border-white/20">✨</div>
                <div>
                  <h4 className="text-[11px] font-black text-cyan-300 uppercase tracking-[0.25em] mb-1 opacity-80">วาระสำคัญ</h4>
                  <p className="text-[20px] text-white font-black leading-tight tracking-tight">{data.festival}</p>
                </div>
              </div>
            </section>
        )}

        {/* 3. Bottom Meta & Raw Text */}
        <footer className="pt-10 border-t border-gray-100 flex flex-col gap-6 pb-16">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
            <span>จุลศักราช {date.getFullYear() - 638} • ปั๊กขะทืนล้านนา</span>
            <span>V2.1.0-EXTRACTION</span>
          </div>

          <details className="group border border-gray-50 rounded-2xl overflow-hidden transition-all duration-300">
            <summary className="px-4 py-3 text-[10px] font-bold text-gray-200 uppercase cursor-pointer list-none flex justify-between items-center bg-gray-50/30 hover:bg-gray-50 hover:text-gray-400 transition-colors">
              <span>แหล่งข้อมูลต้นฉบับ (Raw Analysis)</span>
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <div className="p-5 bg-gray-50/50">
              <pre className="text-[11px] leading-relaxed text-gray-400 overflow-x-auto whitespace-pre-wrap font-mono">
                {data.rawText}
              </pre>
            </div>
          </details>

          <p className="text-center text-[9px] font-medium text-gray-300 leading-relaxed max-w-[80%] mx-auto italic">
            "รวบรวมและเรียบเรียงตามระบบปั๊กขะทืนล้านนาจากตำราโบราณ<br/>เพื่อให้คนรุ่นหลังได้สืบสานและเรียนรู้"
          </p>
        </footer>
      </div>
    </div>
  );
};
