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

export const DetailSection: React.FC<DetailSectionProps> = ({ date, data }) => {
  const toArabicDigits = (value: string | number) =>
    value
      .toString()
      .replace(/[๐-๙]/g, (char) => String('๐๑๒๓๔๕๖๗๘๙'.indexOf(char)));

  const thaiDayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const monthNames = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  
  const formatDate = (d: Date) => {
    return toArabicDigits(`วัน${thaiDayNames[d.getDay()]} ที่ ${d.getDate()} ${monthNames[d.getMonth()]} พ.ศ.${d.getFullYear() + 543}`);
  };

  const lunarText = toArabicDigits(`${data.lunar.phase === 'waxing' ? 'ออก' : 'แรม'} ${data.lunar.day} ค่ำ`);
  const getFahTeeSangMeaning = (value?: number) => {
    if (value === undefined || value === null) return "-";
    const badSet = new Set([0, 1, 3, 7, 8]);
    if (badSet.has(value)) {
      return "ไม่เป็นมงคล ควรหลีกเลี่ยงงานสำคัญ";
    }
    return "เป็นมงคล เหมาะสำหรับเริ่มงานหรือทำพิธีมงคล";
  };
  const cs = data.lannaYear?.chulasakarat;
  const zodiacLanna = data.lannaYear?.zodiacLanna ?? "-";
  const zodiacThai = data.lannaYear?.zodiacThai ?? "-";

  // Helper to extract specific rituals from the list
  const getRitualDesc = (title: string) => toArabicDigits(data.rituals?.find(r => r.title === title)?.description || "-");
  const allLabels = [...data.labels.special, ...data.labels.good, ...data.labels.bad, data.festival].filter(Boolean).map(toArabicDigits);
  const rows = [
    data.phiKin ? { val: toArabicDigits(`วันผีกิ๋น: ${data.phiKin}`), color: 'text-[#d71920] font-bold' } : null,
    data.phiKinMonthly ? { val: toArabicDigits(`เดือนนี้${data.phiKinMonthly}`), color: 'text-black font-bold' } : null,
    { val: toArabicDigits(data.description), color: 'text-[#168019]' },
    {
      val: toArabicDigits(`วันไท ${data.wanThai || '-'}: ${data.wanThaiDesc || '-'}`),
      color: 'text-black'
    },
    {
      val: toArabicDigits(`วันเก้ากอง ${data.kaoKong || '-'}: ${data.kaoKongDesc || '-'}`),
      color: 'text-black'
    },
    {
      val: toArabicDigits(`ฟ้าตีแส่งเศษ ${data.fahTeeSang ?? '-'}: ${getFahTeeSangMeaning(data.fahTeeSang)}`),
      color: data.fahTeeSang !== undefined && data.fahTeeSang !== null && [0, 1, 3, 7, 8].includes(data.fahTeeSang) ? 'text-[#d71920]' : 'text-[#168019]'
    },
    data.labels.good.length ? { val: toArabicDigits(data.labels.good.join(' ') + ' เหมาะแก่การปลูกสร้าง หรือเริ่มงานที่เน้นความมั่นคง'), color: 'text-[#168019]' } : null,
    data.labels.bad.length ? { val: toArabicDigits(data.labels.bad.join(' ') + ' ควรหลีกเลี่ยงงานมงคลสำคัญ'), color: 'text-[#d71920]' } : null,
    data.kalaYok ? { val: toArabicDigits(`${data.kalaYok.name} ${data.kalaYok.meaning}`), color: data.kalaYok.isGood ? 'text-[#168019]' : 'text-[#d71920]' } : null,
    getRitualDesc("การตัดผม") !== "-" ? { val: getRitualDesc("การตัดผม"), color: getRitualDesc("การตัดผม").includes('ไม่') || getRitualDesc("การตัดผม").includes('เสีย') ? 'text-[#d71920]' : 'text-black' } : null,
    getRitualDesc("การตัดเล็บ") !== "-" ? { val: getRitualDesc("การตัดเล็บ"), color: getRitualDesc("การตัดเล็บ").includes('ไม่') || getRitualDesc("การตัดเล็บ").includes('เสีย') ? 'text-[#d71920]' : 'text-black' } : null,
    data.warnings.length ? { val: toArabicDigits(data.warnings.join(' ')), color: 'text-[#d71920]' } : null,
    data.directions ? { val: toArabicDigits(`ทิศศรี ${data.directions.sri}`), color: 'text-[#168019]' } : null,
    data.directions ? { val: toArabicDigits(`ทิศกาลกิณี ${data.directions.ka}`), color: 'text-[#d71920]' } : null,
    { val: toArabicDigits('ตัดผมแล้วดี จะมีลาภ'), color: 'text-[#168019]' },
    { val: toArabicDigits('ตัดเล็บดี มีโชค'), color: 'text-[#168019]' },
  ].filter(Boolean) as { val: string; color: string }[];

  return (
    <div className="bg-white text-[12px] leading-[1.35]">
      <div className="h-[14px]" />
      <div className="text-center font-bold text-[#168019] py-[3px]">
        {formatDate(date)}
      </div>
      <div className="text-center font-bold py-[3px]">
        {formatDate(date)}
        <span className="ml-2">{toArabicDigits(`ปี${zodiacLanna}`)}</span>
        <span className="ml-2">{toArabicDigits(`ปี${zodiacThai}`)}</span>
      </div>
      <div className="text-center font-bold py-[3px]">
        {toArabicDigits(`${lunarText} เดือน ${data.lannaMonth} จ.ศ.${cs ?? '-'} ปีรวาย${zodiacLanna}`)}
      </div>
      {allLabels.length > 0 && (
        <div className="text-center py-[3px]">
          {allLabels.map((label) => (
            <span
              key={label}
              className={data.labels.bad.includes(label) ? 'text-[#d71920] mx-1' : data.labels.good.includes(label) ? 'text-[#168019] mx-1' : 'text-[#f2994a] mx-1'}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div>
        {rows.map((row, i) => (
          <div key={`${row.val}-${i}`} className={`min-h-[30px] px-1 py-[5px] ${row.color}`}>
            {row.val}
          </div>
        ))}
      </div>
    </div>
  );
};
