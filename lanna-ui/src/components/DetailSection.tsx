import React from 'react';

// --- DATA INTERFACE ---
// Aligned with the generated JSON schema
export interface DayData {
  d: number;      // Day of month
  s: number;      // Status bitmask (1: Good, 2: Bad, 4: Holy)
  l: string;      // Lunar string (e.g. "ขึ้น 15 ค่ำ")
  wt: string;     // Wan Thai name
  desc: string;   // Wisdom description
  f?: boolean;    // Festival flag
}

interface DetailSectionProps {
  date: Date;
  data: DayData;
}

export const DetailSection: React.FC<DetailSectionProps> = ({ date, data }) => {
  const isBad = !!(data.s & 2);
  const isHoly = !!(data.s & 4);
  const isGood = !!(data.s & 1);
  const monthTitle = new Intl.DateTimeFormat('th-TH', { month: 'long', year: 'numeric' }).format(date);

  // Derive simple ritual logic (mocking based on day of week for the UI prototype)
  // In production, this would be computed by the Lanna Engine and passed in data
  const dow = date.getDay();
  const haircutBad = [0, 3, 6].includes(dow);
  const nailcutBad = [0, 3, 4, 6].includes(dow);

  return (
    <div className="w-full flex flex-col animate-none bg-white">
      {/* 1. Header: Temporal Anchor */}
      <div className="px-6 py-8 bg-[#FDFCFB] border-b border-gray-50">
        <span className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">
          ปั๊กขะทืนล้านนา • {data.l}
        </span>
        <h2 className="text-[44px] font-black text-[#6B4231] leading-none tracking-tighter">
          {data.d} {new Intl.DateTimeFormat('th-TH', { month: 'long' }).format(date)}
        </h2>
        <div className="mt-4 flex items-center gap-3">
          <span className="px-4 py-1.5 bg-[#6B4231] text-white text-[12px] font-black rounded-full uppercase tracking-wider shadow-sm">
            วัน{data.wt}
          </span>
          {isHoly && <span className="text-[14px] font-black text-[#F59E0B]">● วันศีล</span>}
          {isBad && <span className="text-[14px] font-black text-[#DC2626]">⚠️ วันเสีย</span>}
          {isGood && !isHoly && <span className="text-[14px] font-black text-[#10B981]">✨ วันมงคล</span>}
        </div>
      </div>

      {/* 2. Content: Wisdom & Rituals */}
      <div className="p-6 space-y-8">
        
        {/* Wisdom Card */}
        <section>
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
            คำทำนายโบราณ
          </h3>
          <div className="p-6 bg-[#FDFBF7] rounded-[28px] border-l-4 border-[#6B4231] shadow-sm">
            <p className="text-[18px] text-[#6B4231] leading-relaxed italic font-medium">
              "{data.desc}"
            </p>
          </div>
        </section>

        {/* Ritual Grid */}
        <section>
          <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
            กิจวัตรประจำวัน
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm flex flex-col gap-1">
              <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-xl mb-2">💇‍♂️</div>
              <span className="text-[13px] font-bold text-gray-400">การตัดผม</span>
              <span className={`text-[17px] font-black ${haircutBad ? 'text-[#991B1B]' : 'text-[#166534]'}`}>
                {haircutBad ? 'ห้ามตัดผม' : 'ตัดผมแล้วดี'}
              </span>
            </div>
            <div className="p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm flex flex-col gap-1">
              <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-xl mb-2">💅</div>
              <span className="text-[13px] font-bold text-gray-400">การตัดเล็บ</span>
              <span className={`text-[17px] font-black ${nailcutBad ? 'text-[#991B1B]' : 'text-[#166534]'}`}>
                {nailcutBad ? 'ห้ามตัดเล็บ' : 'ตัดเล็บดี'}
              </span>
            </div>
          </div>
        </section>

        {/* Festival Block (Optional) */}
        {data.f && (
           <section className="p-5 bg-cyan-50 rounded-[24px] border border-cyan-100 flex gap-4 items-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">✨</div>
              <div>
                <h4 className="text-[15px] font-black text-cyan-900 leading-tight">เทศกาลสำคัญ</h4>
                <p className="text-[13px] text-cyan-700 font-medium">วันสำคัญทางประเพณี</p>
              </div>
            </section>
        )}

        {/* 3. Metadata Footer */}
        <footer className="pt-8 border-t border-gray-100 flex flex-col gap-1">
          <div className="flex justify-between items-center text-[11px] font-bold text-gray-300 uppercase tracking-widest">
            {/* The year calculation is an approximation for UI completeness */}
            <span>จุลศักราช {date.getFullYear() - 638} • ปั๊กขะทืนล้านนา</span>
            <span>v2.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
