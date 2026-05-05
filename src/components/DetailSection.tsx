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
 * Reverted to the compact list style while keeping features like Kala Yoga.
 */
export const DetailSection: React.FC<DetailSectionProps> = ({ date, data }) => {
  const thaiDayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const monthNames = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  
  const formatDate = (d: Date) => {
    return `วัน${thaiDayNames[d.getDay()]} ที่ ${d.getDate()} ${monthNames[d.getMonth()]} พ.ศ.${d.getFullYear() + 543}`;
  };

  const lunarText = `${data.lunar.phase === 'waxing' ? 'ขึ้น' : 'แรม'} ${data.lunar.day} ค่ำ`;
  // Chulasakarat (CS) calculation for header
  const cs = date.getFullYear() - (date.getMonth() < 3 || (date.getMonth() === 3 && date.getDate() < 16) ? 639 : 638);

  // Helper to extract specific rituals from the list
  const getRitualDesc = (title: string) => data.rituals?.find(r => r.title === title)?.description || "-";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white">
      {/* 1. Centered Header */}
      <div className="text-center py-6">
        <h2 className="text-[16px] font-bold text-[#1A0A00]">
          {formatDate(date)}
        </h2>
        <div className="text-[11px] text-[#777] mt-0.5">
          จุลศักราช {cs}
        </div>
        <div className="text-[13px] font-bold text-[#5A3520] mt-1">
          {lunarText} เดือน {data.lannaMonth}
        </div>
      </div>

      <div className="mx-4 h-px bg-[#F0EDE8]" />

      {/* 2. Tag Pills Row */}
      <div className="px-4 py-4 flex flex-wrap gap-[5px]">
        {data.labels.special.map((tag, i) => (
          <span key={`spec-${i}`} className="text-[10px] font-semibold bg-[#FFF7ED] text-[#C2410C] px-[7px] py-[2px] rounded-[10px]">{tag}</span>
        ))}
        {data.labels.good.map((tag, i) => (
          <span key={`good-${i}`} className="text-[10px] font-semibold bg-[#F0FDF4] text-[#166534] px-[7px] py-[2px] rounded-[10px]">{tag}</span>
        ))}
        {data.labels.bad.map((tag, i) => (
          <span key={`bad-${i}`} className="text-[10px] font-semibold bg-[#FEF2F2] text-[#B91C1C] px-[7px] py-[2px] rounded-[10px]">{tag}</span>
        ))}
        {data.festival && (
          <span className="text-[10px] font-semibold bg-[#ECFEFF] text-[#0891B2] px-[7px] py-[2px] rounded-[10px]">{data.festival}</span>
        )}
      </div>

      <div className="mx-4 h-px bg-[#F0EDE8] mb-[6px]" />

      {/* 3. Direction Grid (2 columns) */}
      {data.directions && (
        <div className="px-4 grid grid-cols-2 gap-[6px] mb-[10px]">
          <div className="bg-[#F9F6F1] rounded-[6px] py-[6px] text-center">
            <div className="text-[9px] text-[#8B6E57] mb-[2px]">ทิศศรี</div>
            <div className="text-[13px] font-bold text-[#059669]">{data.directions.sri}</div>
          </div>
          <div className="bg-[#F9F6F1] rounded-[6px] py-[6px] text-center">
            <div className="text-[9px] text-[#8B6E57] mb-[2px]">ทิศกาลกิณี</div>
            <div className="text-[13px] font-bold text-[#DC2626]">{data.directions.ka}</div>
          </div>
        </div>
      )}

      {/* 4. Info Rows List */}
      <div className="px-4 flex flex-col">
        {[
          { label: "คำทำนาย", val: data.description },
          data.kalaYok ? { 
            label: "กาลโยค", 
            val: `${data.kalaYok.name} — ${data.kalaYok.meaning}`,
            color: data.kalaYok.isGood ? "text-[#166534]" : "text-[#B91C1C]"
          } : null,
          { label: "ข้อควรระวัง", val: data.warnings.join(", ") || "ไม่มีข้อควรระวังพิเศษ" },
          { label: "การตัดผม", val: getRitualDesc("การตัดผม") },
          { label: "การตัดเล็บ", val: getRitualDesc("การตัดเล็บ") }
        ].filter(Boolean).map((row: any, i) => (
          <div key={i} className="flex py-[7px] border-b border-[#F0EDE8] last:border-0">
            <div className="w-16 shrink-0 text-[11px] text-[#8B6E57] pt-0.5">{row.label}</div>
            <div className={`text-[12px] leading-relaxed ${row.color ? row.color : (row.val.startsWith('ห้าม') || row.val.includes('ไม่ควร') || row.val.includes('ควรระวัง') ? 'text-[#B91C1C]' : 'text-[#1A0A00]')}`}>
              {row.val}
            </div>
          </div>
        ))}
      </div>

      <div className="h-20" />
    </div>
  );
};
