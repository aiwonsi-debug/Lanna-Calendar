import React from 'react';
import { 
  Sparkles, 
  Compass, 
  Clock, 
  AlertTriangle, 
  Scissors, 
  Droplet, 
  Shirt, 
  MapPin, 
  Calendar,
  Info,
  ChevronRight
} from 'lucide-react';

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
  wanMuai?: string;
  wanPhiKin?: string;
  panjaDithi?: string;
  sitthi?: string | null;
  isUbat?: boolean;
  isLokawinat?: boolean;
  isMachu?: boolean;
  isMahaMachu?: boolean;
}

interface DetailSectionProps {
  date: Date;
  data: DayData;
}

const toArabicDigits = (value: string | number) =>
  value
    .toString()
    .replace(/[๐-๙]/g, (char) => String('๐๑๒๓๔๕๖๗๘๙'.indexOf(char)));

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ title, icon: Icon, color = "text-gray-400" }: { title: string; icon: any; color?: string }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon size={16} className={color} />
    <div className="text-[11px] font-black uppercase tracking-wider text-gray-500">
      {title}
    </div>
  </div>
);

const RitualIcon = ({ title }: { title: string }) => {
  if (title.includes('ตัดผม')) return <Scissors size={16} />;
  if (title.includes('ตัดเล็บ')) return <Scissors size={16} className="rotate-90" />;
  if (title.includes('ทาน้ำมัน')) return <Droplet size={16} />;
  if (title.includes('นุ่งผ้าใหม่')) return <Shirt size={16} />;
  if (title.includes('เดินทาง')) return <MapPin size={16} />;
  return <ChevronRight size={14} />;
};

export const DetailSection: React.FC<DetailSectionProps> = ({ date, data }) => {
  const thaiDayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const monthNames = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  
  const formatDate = (d: Date) => {
    return toArabicDigits(`วัน${thaiDayNames[d.getDay()]}ที่ ${d.getDate()} ${monthNames[d.getMonth()]} พ.ศ.${d.getFullYear() + 543}`);
  };

  const lunarText = toArabicDigits(`${data.lunar.phase === 'waxing' ? 'ออก' : 'แรม'} ${data.lunar.day} ค่ำ`);
  
  const cs = data.lannaYear?.chulasakarat;
  const zodiacLanna = data.lannaYear?.zodiacLanna ?? "-";
  const zodiacThai = data.lannaYear?.zodiacThai ?? "-";

  const allLabels = [
    ...data.labels.special, 
    ...data.labels.good, 
    ...data.labels.bad, 
    data.isMachu ? "วันมัจจุ" : "",
    data.isMahaMachu ? "วันมหามัจจุ" : "",
    data.festival
  ].filter(Boolean).map(toArabicDigits);

  const badLabels = ["วันเสีย", "วันอุบาทว์", "วันโลกาวินาศ", "วันหล่มหลวง", "วันมัจจุ", "วันมหามัจจุ"];
  const goodLabels = ["วันธงชัย", "วันอธิบดี", "มหาสิทธิโชค", "สิทธิโชค", "ชัยโชค", "ราชาโชค", "อมฤตโชค"];

  return (
    <div className="bg-[#f8fafc] px-4 pt-12 pb-16 text-[28px] leading-[1.6]">
      
      {/* HEADER CARD */}
      <Card className="text-center p-8">
        <div className="flex justify-center mb-4">
          <div className="bg-green-50 text-[#168019] px-6 py-2 rounded-full text-[24px] font-black flex items-center gap-3">
            <Calendar size={28} />
            {formatDate(date)}
          </div>
        </div>
        <div className="text-[36px] font-black text-slate-800 mb-2">
          {toArabicDigits(`ปี${zodiacLanna}`)} <span className="text-slate-300 mx-2">/</span> <span className="text-slate-500 font-bold text-[28px]">ปี{zodiacThai}</span>
        </div>
        <div className="text-[28px] font-bold text-slate-500">
          {toArabicDigits(`${lunarText} เดือน ${data.lannaMonth} จ.ศ.${cs ?? '-'}`)}
        </div>

        {/* LABELS PILLS */}
        {allLabels.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {allLabels.map((label) => {
              const isBad = badLabels.some(b => label.includes(b));
              const isGood = goodLabels.some(g => label.includes(g));
              return (
                <span
                  key={label}
                  className={`px-5 py-2 rounded-2xl text-[22px] font-black border-2 ${
                    isBad 
                      ? 'bg-red-50 text-[#d71920] border-red-100' 
                      : isGood 
                        ? 'bg-green-50 text-[#168019] border-green-100' 
                        : 'bg-orange-50 text-[#f2994a] border-orange-100'
                  }`}
                >
                  {label}
                </span>
              );
            })}
          </div>
        )}
      </Card>

      {/* PREDICTIONS CARD */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles size={32} className="text-amber-400" />
          <div className="text-[22px] font-black uppercase tracking-wider text-gray-500">คำทำนาย & ข้อห้าม</div>
        </div>
        <div className="space-y-5">
          {data.description && toArabicDigits(data.description).split('\n').map((line, idx) => {
            let className = "text-slate-700";
            let dotColor = "bg-slate-300";
            
            if (line.startsWith("ฟ้าตีแส่ง")) {
              const isBad = line.includes("ระวัง") || line.includes("ไม่เป็นมงคล");
              className = isBad ? "text-[#d71920]" : "text-[#168019]";
              dotColor = isBad ? "bg-red-400" : "bg-green-400";
            } else if (line.includes("ผีกิ๋น") || line.includes("วันผีกิ๋น") || line.includes("มัจจุ") || line.includes("ม้วย") || line.includes("เสีย") || line.includes("อุบาทว์") || line.includes("โลกาวินาศ")) {
              className = "text-[#d71920]";
              dotColor = "bg-red-400";
            } else if (line.includes("โชค") || line.includes("ธงชัย") || line.includes("อธิบดี")) {
              className = "text-[#168019]";
              dotColor = "bg-green-400";
            }

            return (
              <div key={idx} className="flex gap-4">
                <div className={`w-3 h-3 rounded-full mt-4 shrink-0 ${dotColor}`} />
                <div className={`${className} font-bold text-[26px] leading-tight`}>
                  {line}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ANCIENT CRITERIA & DIRECTIONS */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Compass size={32} className="text-blue-400" />
          <div className="text-[22px] font-black uppercase tracking-wider text-gray-500">เกณฑ์โบราณ & ทิศ</div>
        </div>
        {data.kalaYok && (
          <div className={`p-6 rounded-2xl mb-8 ${data.kalaYok.isGood ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`font-black text-[28px] mb-2 ${data.kalaYok.isGood ? 'text-[#168019]' : 'text-[#d71920]'}`}>
              {toArabicDigits(data.kalaYok.name)}
            </div>
            <div className="text-[24px] text-slate-600 font-bold leading-snug">
              {toArabicDigits(data.kalaYok.meaning)}
            </div>
          </div>
        )}

        {data.directions && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
              <div className="text-[20px] text-slate-400 font-black uppercase mb-2">ทิศศรี (มงคล)</div>
              <div className="text-[#168019] font-black text-[26px]">{toArabicDigits(data.directions.sri)}</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
              <div className="text-[20px] text-slate-400 font-black uppercase mb-2">กาลกิณี (ห้าม)</div>
              <div className="text-[#d71920] font-black text-[26px]">{toArabicDigits(data.directions.ka)}</div>
            </div>
          </div>
        )}
      </Card>

      {/* RITUALS CARD */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Info size={32} className="text-indigo-400" />
          <div className="text-[22px] font-black uppercase tracking-wider text-gray-500">กิจวัตรประจำวัน</div>
        </div>
        <div className="space-y-6">
          {data.rituals && data.rituals.length > 0 ? (
            data.rituals.map((r, i) => {
              const isBad = r.description.includes('ไม่') || r.description.includes('ห้าม') || r.description.includes('เสีย') || r.description.includes('ภัย') || r.description.includes('ศัตรู') || r.description.includes('ฉิบหาย') || r.description.includes('ทุกข์') || r.description.includes('ตาย');
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${isBad ? 'bg-red-50 text-red-400' : 'bg-green-50 text-green-500'}`}>
                    <RitualIcon title={r.title} />
                  </div>
                  <div>
                    <div className="text-[26px] font-black text-slate-700">{toArabicDigits(r.title)}</div>
                    <div className={`text-[24px] font-bold ${isBad ? 'text-[#d71920]' : 'text-[#168019]'}`}>
                      {toArabicDigits(r.description)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-slate-400 italic text-[24px] py-4 text-center">ไม่มีข้อมูลกิจวัตร</div>
          )}
          
          {data.warnings && data.warnings.length > 0 && (
            <div className="mt-4 space-y-4">
              {data.warnings.map((w, i) => (
                <div key={i} className="flex items-center gap-4 text-[#d71920] font-black bg-red-50 p-6 rounded-2xl border-2 border-red-100 text-[24px]">
                  <AlertTriangle size={32} className="shrink-0" />
                  {toArabicDigits(w)}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* UBAKONG CARD */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Clock size={32} className="text-slate-400" />
          <div className="text-[22px] font-black uppercase tracking-wider text-gray-500">ฤกษ์เดินทาง (อุบากอง)</div>
        </div>
        <div className="grid grid-cols-5 gap-3 mt-4">
          {['เช้า', 'สาย', 'เที่ยง', 'บ่าย', 'เย็น'].map((label, i) => {
            const ubakongGrid = [
              [4, 0, -1, 0, 1], // Sun
              [1, 4, 0, -1, 0], // Mon
              [0, 1, 4, 0, -1], // Tue
              [-1, 0, 1, 4, 0], // Wed
              [0, -1, 0, 1, 4], // Thu
              [4, 0, -1, 0, 1], // Fri
              [1, 4, 0, -1, 0]  // Sat
            ];
            const score = ubakongGrid[date.getDay()][i];
            const color = score === 4 ? 'text-[#168019]' : (score === 1 || score === -1) ? 'text-[#d71920]' : 'text-slate-400';
            const bg = score === 4 ? 'bg-green-50 border-2 border-green-100' : (score === 1 || score === -1) ? 'bg-red-50 border-2 border-red-100' : 'bg-slate-50 border-2 border-slate-100';
            const symbols = score === 4 ? '••••' : score === 1 ? '•' : score === -1 ? '×' : '๐';
            
            return (
              <div key={i} className={`flex flex-col items-center py-4 rounded-2xl border transition-all ${bg}`}>
                <div className="text-[18px] font-black text-slate-400 uppercase mb-2">{label}</div>
                <div className={`text-[28px] font-black leading-none ${color}`}>{symbols}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 text-[18px] text-slate-400 font-bold text-center italic">
          * ••••=ดีมาก, •=ดี/รีบไป, ๐=ปกติ, ×=ห้ามไป
        </div>
      </Card>

    </div>
  );
};
