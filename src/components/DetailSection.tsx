import React from 'react';
import {
  Sparkles,
  Clock,
  AlertTriangle,
  Scissors,
  Droplet,
  Shirt,
  MapPin,
  Info,
  ChevronRight,
  Gavel,
  BookOpen
} from 'lucide-react';

// --- DATA INTERFACES (คงเดิม ไม่เปลี่ยนสัญญาข้อมูล) ---
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
  <section className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 mb-4 ${className}`}>
    {children}
  </section>
);

const CardTitle = ({ title, icon: Icon, color = "text-slate-500" }: { title: string; icon: any; color?: string }) => (
  <div className="flex items-center gap-2 mb-3">
    <Icon size={22} className={color} />
    <h3 className="text-[20px] leading-[1.4] font-black text-slate-700">{title}</h3>
  </div>
);

const RitualIcon = ({ title }: { title: string }) => {
  if (title.includes('ตัดผม')) return <Scissors size={20} />;
  if (title.includes('ตัดเล็บ')) return <Scissors size={20} className="rotate-90" />;
  if (title.includes('ทาน้ำมัน')) return <Droplet size={20} />;
  if (title.includes('นุ่งผ้าใหม่')) return <Shirt size={20} />;
  if (title.includes('เดินทาง')) return <MapPin size={20} />;
  return <ChevronRight size={18} />;
};

// ชนิดของป้ายสำหรับลงสี: ใช้สีเข้มที่คอนทราสต์ผ่าน 4.5:1 บนพื้นขาว/พื้นอ่อน
export type LabelKind = 'sin' | 'bad' | 'good' | 'neutral';
export const labelKindOf = (label: string): LabelKind => {
  if (label.includes('ศีล')) return 'sin';
  if (['เสีย', 'อุบาทว์', 'โลกาวินาศ', 'หล่มหลวง', 'ไหม้', 'วอดวาย', 'มัจจุ'].some(t => label.includes(t))) return 'bad';
  if (['โชค', 'ธงชัย', 'อธิบดี', 'วันดี'].some(t => label.includes(t))) return 'good';
  return 'neutral';
};

export const chipClass = (kind: LabelKind): string => {
  switch (kind) {
    case 'sin': return 'bg-[#8a5a00] text-white';
    case 'bad': return 'bg-[#b3001b] text-white';
    case 'good': return 'bg-[#0f7a28] text-white';
    default: return 'bg-slate-600 text-white';
  }
};

const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const THAI_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const LANNA_MONTH_NAMES = ["", "เกี๋ยง", "ยี่", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า", "สิบ", "สิบเอ็ด", "สิบสอง"];

export const DetailSection: React.FC<DetailSectionProps> = ({ date, data }) => {
  const cs = data.lannaYear?.chulasakarat;
  const zodiacLanna = data.lannaYear?.zodiacLanna ?? "-";
  const zodiacThai = data.lannaYear?.zodiacThai ?? "-";

  const fullDateText = toArabicDigits(`วัน${THAI_DAYS[date.getDay()]}ที่ ${date.getDate()} ${THAI_MONTHS[date.getMonth()]} พ.ศ. ${date.getFullYear() + 543}`);
  const lunarPhrase = toArabicDigits(`${data.lunar.phase === 'waxing' ? 'ออก' : 'แรม'} ${data.lunar.day} ค่ำ`);
  const lannaMonthText = toArabicDigits(`เดือน${LANNA_MONTH_NAMES[data.lannaMonth] || data.lannaMonth} (เดือน ${data.lannaMonth})`);

  // --- กลุ่ม 1: คำตัดสิน ประกอบจากป้ายจริงของวันนั้น ---
  const verdictWords: { text: string; kind: LabelKind }[] = [];
  if (data.labels.special.some(l => l.includes('ศีล'))) verdictWords.push({ text: 'วันศีล', kind: 'sin' });
  if (data.labels.bad.length > 0 || data.isMachu || data.isMahaMachu) verdictWords.push({ text: 'วันเสีย', kind: 'bad' });
  if (data.sitthi) verdictWords.push({ text: 'วันดี', kind: 'good' });
  if (verdictWords.length === 0) verdictWords.push({ text: 'วันปกติ', kind: 'neutral' });

  const allLabels = [
    ...data.labels.special,
    ...data.labels.good,
    ...data.labels.bad,
    data.isMachu ? "วันมัจจุ" : "",
    data.isMahaMachu ? "วันมหามัจจุ" : "",
    data.festival
  ].filter(Boolean).map(toArabicDigits);

  // --- แยกบรรทัดคำอธิบายเดิมออกเป็นกลุ่มตามลำดับคงที่ ---
  const lines = (data.description ? toArabicDigits(data.description) : '').split('\n').map(s => s.trim()).filter(Boolean);
  const reasonLines: string[] = [];   // เหตุผลของคำตัดสิน: วันร้ายต่าง ๆ
  const identityLines: string[] = []; // ระบุวัน: ดิถี วันไท เก้ากอง ฟ้าตีแส่ง
  const chokLines: string[] = [];     // โชค
  const fortuneLines: string[] = [];  // คำทำนายที่เหลือ
  for (const line of lines) {
    if (/^(วันอุบาทว์|วันโลกาวินาศ|วันมัจจุ|วันมหามัจจุ|วันหล่มหลวง)/.test(line)) reasonLines.push(line);
    else if (/^(ดิถี|วันไท|วันเก้ากอง|ฟ้าตีแส่ง)/.test(line)) identityLines.push(line);
    else if (line.includes('โชค')) chokLines.push(line);
    else fortuneLines.push(line);
  }
  const identityOrder = ['วันไท', 'วันเก้ากอง', 'ฟ้าตีแส่ง', 'ดิถี'];
  identityLines.sort((a, b) => {
    const ia = identityOrder.findIndex(p => a.startsWith(p));
    const ib = identityOrder.findIndex(p => b.startsWith(p));
    return ia - ib;
  });

  const bodyText = "text-[18px] leading-[1.6]";

  return (
    <div className="bg-[#f8fafc] px-3 sm:px-4 pt-6 pb-12">
      {/* ส่วนหัวของวัน */}
      <Card>
        <h2 className="text-[20px] leading-[1.4] font-black text-slate-800">{fullDateText}</h2>
        <div className="mt-1 text-[18px] leading-[1.6] font-bold text-slate-700">
          <span className="whitespace-nowrap">{lunarPhrase}</span>{' '}
          <span className="whitespace-nowrap">{lannaMonthText}</span>
        </div>
        <div className="text-[18px] leading-[1.6] text-slate-600">
          {toArabicDigits(`ปี${zodiacLanna} ปี${zodiacThai} จ.ศ. ${cs ?? '-'}`)}
        </div>
      </Card>

      {/* กลุ่ม 1: คำตัดสิน */}
      <Card>
        <CardTitle title="คำตัดสิน" icon={Gavel} color="text-slate-500" />
        <div className="flex flex-col items-start gap-2">
          {verdictWords.map((v, i) => (
            <span key={i} className={`inline-block px-4 py-1 rounded-xl text-[24px] leading-[1.4] font-black ${chipClass(v.kind)}`}>
              {v.text}
            </span>
          ))}
        </div>
        {allLabels.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {allLabels.map((label) => (
              <span key={label} className={`px-3 py-1 rounded-lg text-[16px] leading-[1.5] font-bold ${chipClass(labelKindOf(label))}`}>
                {label}
              </span>
            ))}
          </div>
        )}
        {reasonLines.length > 0 && (
          <div className="mt-3 space-y-2">
            {reasonLines.map((line, i) => (
              <p key={i} className={`${bodyText} font-bold text-[#b3001b]`}>{line}</p>
            ))}
          </div>
        )}
      </Card>

      {/* กลุ่ม 2: ระบุวัน */}
      <Card>
        <CardTitle title="ระบุวัน" icon={Info} color="text-blue-500" />
        <dl className="space-y-2">
          <div className="flex flex-wrap gap-x-3">
            <dt className="font-black text-slate-700 text-[18px] leading-[1.6]">ข้างและค่ำ</dt>
            <dd className="text-[18px] leading-[1.6] text-slate-800"><span className="whitespace-nowrap">{lunarPhrase}</span></dd>
          </div>
          <div className="flex flex-wrap gap-x-3">
            <dt className="font-black text-slate-700 text-[18px] leading-[1.6]">เดือนล้านนา</dt>
            <dd className="text-[18px] leading-[1.6] text-slate-800"><span className="whitespace-nowrap">{lannaMonthText}</span></dd>
          </div>
          {data.wanThai && (
            <div className="flex flex-wrap gap-x-3">
              <dt className="font-black text-slate-700 text-[18px] leading-[1.6]">วันไท</dt>
              <dd className="text-[18px] leading-[1.6] text-slate-800"><span className="whitespace-nowrap">{toArabicDigits(`วัน${data.wanThai}`)}</span></dd>
            </div>
          )}
          {data.kaoKong && (
            <div className="flex flex-wrap gap-x-3">
              <dt className="font-black text-slate-700 text-[18px] leading-[1.6]">เก้ากอง</dt>
              <dd className="text-[18px] leading-[1.6] text-slate-800"><span className="whitespace-nowrap">{toArabicDigits(data.kaoKong)}</span></dd>
            </div>
          )}
          {data.fahTeeSang !== undefined && (
            <div className="flex flex-wrap gap-x-3">
              <dt className="font-black text-slate-700 text-[18px] leading-[1.6]">ฟ้าตีแส่ง</dt>
              <dd className="text-[18px] leading-[1.6] text-slate-800"><span className="whitespace-nowrap">{toArabicDigits(`เศษ ${data.fahTeeSang}`)}</span></dd>
            </div>
          )}
          {data.panjaDithi && (
            <div className="flex flex-wrap gap-x-3">
              <dt className="font-black text-slate-700 text-[18px] leading-[1.6]">ดิถี</dt>
              <dd className="text-[18px] leading-[1.6] text-slate-800"><span className="whitespace-nowrap">{toArabicDigits(data.panjaDithi)}</span></dd>
            </div>
          )}
        </dl>
        {identityLines.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
            {identityLines.map((line, i) => (
              <p key={i} className={`${bodyText} text-slate-700`}>{line}</p>
            ))}
          </div>
        )}
      </Card>

      {/* กลุ่ม 3: โชคและฤกษ์ */}
      <Card>
        <CardTitle title="โชคและฤกษ์" icon={Sparkles} color="text-amber-500" />
        {chokLines.length > 0 ? (
          <div className="space-y-2">
            {chokLines.map((line, i) => (
              <p key={i} className={`${bodyText} font-bold text-[#0f7a28]`}>{line}</p>
            ))}
          </div>
        ) : (
          <p className={`${bodyText} text-slate-600`}>วันนี้ไม่มีโชคพิเศษ</p>
        )}

        {data.kalaYok && (
          <div className={`p-4 rounded-2xl mt-4 ${data.kalaYok.isGood ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`font-black text-[20px] leading-[1.4] mb-1 ${data.kalaYok.isGood ? 'text-[#0f7a28]' : 'text-[#b3001b]'}`}>
              {toArabicDigits(data.kalaYok.name)}
            </div>
            <div className={`${bodyText} text-slate-700 font-bold`}>
              {toArabicDigits(data.kalaYok.meaning)}
            </div>
          </div>
        )}

        {data.directions && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-[18px] leading-[1.6] text-slate-600 font-black mb-1">ทิศศรี (มงคล)</div>
              <div className="text-[#0f7a28] font-black text-[20px] leading-[1.4]">{toArabicDigits(data.directions.sri)}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="text-[18px] leading-[1.6] text-slate-600 font-black mb-1">กาลกิณี (ห้าม)</div>
              <div className="text-[#b3001b] font-black text-[20px] leading-[1.4]">{toArabicDigits(data.directions.ka)}</div>
            </div>
          </div>
        )}

        {/* ฤกษ์เดินทาง (อุบากอง) ใช้ตารางเดิม */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={22} className="text-slate-500" />
            <h4 className="text-[20px] leading-[1.4] font-black text-slate-700">ฤกษ์เดินทาง (อุบากอง)</h4>
          </div>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {['เช้า', 'สาย', 'เที่ยง', 'บ่าย', 'เย็น'].map((label, i) => {
              const ubakongGrid = [
                [4, 0, -1, 0, 1],
                [1, 4, 0, -1, 0],
                [0, 1, 4, 0, -1],
                [-1, 0, 1, 4, 0],
                [0, -1, 0, 1, 4],
                [4, 0, -1, 0, 1],
                [1, 4, 0, -1, 0]
              ];
              const score = ubakongGrid[date.getDay()][i];
              const color = score === 4 ? 'text-[#0f7a28]' : (score === 1 || score === -1) ? 'text-[#b3001b]' : 'text-slate-500';
              const bg = score === 4 ? 'bg-green-50 border border-green-200' : (score === 1 || score === -1) ? 'bg-red-50 border border-red-200' : 'bg-slate-50 border border-slate-200';
              const symbols = score === 4 ? '••••' : score === 1 ? '•' : score === -1 ? '×' : '๐';
              return (
                <div key={i} className={`flex flex-col items-center py-3 rounded-2xl ${bg}`}>
                  <div className="text-[16px] leading-[1.5] font-black text-slate-500 mb-1">{label}</div>
                  <div className={`text-[24px] font-black leading-none ${color}`}>{symbols}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[16px] leading-[1.5] text-slate-600 font-bold">
            <span className="whitespace-nowrap">* •••• = ดีมาก</span>
            <span className="whitespace-nowrap">• = ดี/รีบไป</span>
            <span className="whitespace-nowrap">๐ = ปกติ</span>
            <span className="whitespace-nowrap">× = ห้ามไป</span>
          </div>
        </div>
      </Card>

      {/* กลุ่ม 4: ข้อห้ามและกิจวัตร */}
      <Card>
        <CardTitle title="ข้อห้ามและกิจวัตรประจำวัน" icon={AlertTriangle} color="text-indigo-500" />
        <div className="space-y-4">
          {data.rituals && data.rituals.length > 0 ? (
            data.rituals.map((r, i) => {
              const isBad = r.description.includes('ไม่') || r.description.includes('ห้าม') || r.description.includes('เสีย') || r.description.includes('ภัย') || r.description.includes('ศัตรู') || r.description.includes('ฉิบหาย') || r.description.includes('ทุกข์') || r.description.includes('ตาย');
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`p-3 rounded-xl shrink-0 ${isBad ? 'bg-red-50 text-[#b3001b]' : 'bg-green-50 text-[#0f7a28]'}`}>
                    <RitualIcon title={r.title} />
                  </div>
                  <div>
                    <div className="text-[18px] leading-[1.6] font-black text-slate-800">{toArabicDigits(r.title)}</div>
                    <div className={`text-[18px] leading-[1.6] font-bold ${isBad ? 'text-[#b3001b]' : 'text-[#0f7a28]'}`}>
                      {toArabicDigits(r.description)}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-slate-600 text-[18px] leading-[1.6] py-2">ไม่มีข้อมูลกิจวัตร</div>
          )}

          {data.warnings && data.warnings.length > 0 && (
            <div className="mt-2 space-y-3">
              {data.warnings.map((w, i) => (
                <div key={i} className="flex items-center gap-3 text-[#b3001b] font-black bg-red-50 p-4 rounded-2xl border border-red-200 text-[18px] leading-[1.6]">
                  <AlertTriangle size={24} className="shrink-0" />
                  {toArabicDigits(w)}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* กลุ่ม 5: คำทำนาย */}
      {fortuneLines.length > 0 && (
        <Card>
          <CardTitle title="คำทำนาย" icon={BookOpen} color="text-slate-500" />
          <div className="space-y-2">
            {fortuneLines.map((line, i) => (
              <p key={i} className={`${bodyText} text-slate-700`}>{line}</p>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
};
