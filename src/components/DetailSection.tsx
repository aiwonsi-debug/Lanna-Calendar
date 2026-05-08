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
  lannaYear?: {
    zodiacLanna: string;
    zodiacThai: string;
    chulasakarat: number;
  };
  wanThai?: string;
  wanThaiDesc?: string;
  kaoKong?: string;
  kaoKongDesc?: string;
  fahTeeSang?: number;
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
  phiKin?: string;
  phiKinMonthly?: string;
}

interface DetailSectionProps {
  date: Date;
  data: DayData;
}

const toArabicDigits = (value: string | number) =>
  value
    .toString()
    .replace(/[๐-๙]/g, (char) => String('๐๑๒๓๔๕๖๗๘๙'.indexOf(char)));

const SectionHeader = ({ title }: { title: string }) => (
  <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-bold">
    {title}
  </div>
);

const Divider = () => <div className="border-b border-[#e5e5e5]" />;

export const DetailSection: React.FC<DetailSectionProps> = ({ date, data }) => {
  const thaiDayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const monthNames = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  
  const formatDate = (d: Date) => {
    return toArabicDigits(`วัน${thaiDayNames[d.getDay()]} ที่ ${d.getDate()} ${monthNames[d.getMonth()]} พ.ศ.${d.getFullYear() + 543}`);
  };

  const lunarText = toArabicDigits(`${data.lunar.phase === 'waxing' ? 'ออก' : 'แรม'} ${data.lunar.day} ค่ำ`);
  
  const cs = data.lannaYear?.chulasakarat;
  const zodiacLanna = data.lannaYear?.zodiacLanna ?? "-";
  const zodiacThai = data.lannaYear?.zodiacThai ?? "-";

  const allLabels = [...data.labels.special, ...data.labels.good, ...data.labels.bad, data.festival].filter(Boolean).map(toArabicDigits);

  return (
    <div className="bg-white text-[14px] leading-[1.5] px-4 pb-10">
      <div className="h-[20px]" />
      
      {/* DATE HEADER & INTRO */}
      <div className="text-center font-bold text-[#168019] py-[6px]">
        {formatDate(date)}
      </div>
      <div className="text-center font-bold py-[3px]">
        <span className="mr-2">{toArabicDigits(`ปี${zodiacLanna}`)} / ปี{zodiacThai}</span>
      </div>
      <div className="text-center font-bold py-[3px]">
        {toArabicDigits(`${lunarText} เดือน ${data.lannaMonth} จ.ศ.${cs ?? '-'} ปี${zodiacLanna}`)}
      </div>

      {/* LABELS PILLS */}
      {allLabels.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 py-4">
          {allLabels.map((label) => (
            <span
              key={label}
              className={`px-2 py-0.5 rounded-full text-[12px] font-bold ${
                data.labels.bad.includes(label) 
                  ? 'bg-red-50 text-[#d71920] border border-red-100' 
                  : data.labels.good.includes(label) 
                    ? 'bg-green-50 text-[#168019] border border-green-100' 
                    : 'bg-orange-50 text-[#f2994a] border border-orange-100'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <Divider />

      {/* SECTION 1: คำทำนาย (Prediction) */}
      <div className="pt-[10px] pb-[6px] space-y-1">
        {data.description && toArabicDigits(data.description).split('\n').map((line, idx) => {
          let className = "text-black";
          if (line.startsWith("ฟ้าตีแส่ง")) {
            className = (line.includes("ระวัง") || line.includes("ไม่เป็นมงคล")) ? "text-[#d71920]" : "text-[#168019]";
          } else if (line.startsWith("ผีกิ๋น") || line.startsWith("วันผีกิ๋น")) {
            className = "text-[#d71920]";
          }
          return (
            <div key={idx} className={`${className} font-bold`}>
              {line}
            </div>
          );
        })}
      </div>

      <Divider />

      {/* SECTION 2: เกณฑ์โบราณ (Ancient Criteria) */}
      <div className="pt-[10px] pb-[6px]">
        <SectionHeader title="เกณฑ์โบราณ" />
        <div className="space-y-1">
          {data.kalaYok && (
            <div className={data.kalaYok.isGood ? 'text-[#168019]' : 'text-[#d71920]'}>
              <span className="font-bold">{toArabicDigits(`${data.kalaYok.name}:`)}</span> {toArabicDigits(data.kalaYok.meaning)}
            </div>
          )}
        </div>

        {/* DIRECTIONS GRID (2-column) */}
        {data.directions && (
          <div className="grid grid-cols-2 gap-2 mt-4 pt-2 border-t border-gray-50">
            <div className="text-center border-r border-gray-100">
              <div className="text-[10px] text-gray-400 uppercase">ทิศศรี</div>
              <div className="text-[#168019] font-bold">{toArabicDigits(data.directions.sri)}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-gray-400 uppercase">กาลกิณี</div>
              <div className="text-[#d71920] font-bold">{toArabicDigits(data.directions.ka)}</div>
            </div>
          </div>
        )}
      </div>

      <Divider />

      {/* SECTION 3: กิจวัตร (Routine) */}
      <div className="pt-[10px] pb-[6px]">
        <SectionHeader title="กิจวัตร" />
        <div className="space-y-2">
          {data.rituals && data.rituals.length > 0 ? (
            data.rituals.map((r, i) => {
              const isBad = r.description.includes('ไม่') || r.description.includes('ห้าม') || r.description.includes('เสีย');
              return (
                <div key={i} className={isBad ? 'text-[#d71920]' : 'text-[#168019]'}>
                  <span className="font-bold">{toArabicDigits(r.title)}:</span> {toArabicDigits(r.description)}
                </div>
              );
            })
          ) : (
            <div className="text-gray-400 italic">ไม่มีข้อมูลกิจวัตร</div>
          )}
          
          {data.warnings && data.warnings.length > 0 && (
            <div className="mt-4 space-y-1">
              {data.warnings.map((w, i) => (
                <div key={i} className="text-[#d71920] font-bold bg-red-50 p-2 rounded">
                  ⚠️ {toArabicDigits(w)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
