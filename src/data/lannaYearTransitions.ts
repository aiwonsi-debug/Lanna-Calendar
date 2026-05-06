export type LannaYearTransition = {
  gregorianYear: number;

  sankranLongDate: string;
  naoDate: string;
  payaWanDate: string;
  thaloengSokDate: string;

  oldZodiac: string;
  newZodiac: string;

  oldChulasakarat: number;
  newChulasakarat: number;
};

export const LannaZodiac = [
  "ชวด",
  "เป้า",
  "ยี่",
  "เม้า",
  "สี",
  "ไส้",
  "สะง้า",
  "เม็ด",
  "สัน",
  "เร้า",
  "เส็ด",
  "ใค้",
] as const;

export const LannaZodiacThaiMap: Record<(typeof LannaZodiac)[number], string> = {
  ชวด: "หนู",
  เป้า: "วัว",
  ยี่: "เสือ",
  เม้า: "เถาะ",
  สี: "มะโรง",
  ไส้: "มะเส็ง",
  สะง้า: "มะเมีย",
  เม็ด: "มะแม",
  สัน: "วอก",
  เร้า: "ระกา",
  เส็ด: "จอ",
  ใค้: "กุน",
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const BASE_CS = 1386;
const BASE_THALOENG_SOK_UTC = Date.UTC(2024, 3, 16, 12, 0, 0);
const BASE_HARKUN = Math.floor((BASE_CS * 292207 + 373) / 800);

const toISODateUTC = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseISODateUTCNoon = (isoDate: string) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
};

const addDaysUTC = (date: Date, days: number) => new Date(date.getTime() + days * MS_PER_DAY);

const normalizeMod = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;

const zodiacFromChulasakarat = (chulasakarat: number) => {
  // Align CS cycle with Lanna zodiac ordering so that CS 1388 => สะง้า.
  const index = normalizeMod(chulasakarat + 10, 12);
  return LannaZodiac[index];
};

const buildTransitionForYear = (gregorianYear: number): LannaYearTransition => {
  const newChulasakarat = gregorianYear - 638;
  const oldChulasakarat = newChulasakarat - 1;

  const raw = newChulasakarat * 292207 + 373;
  const harkun = Math.floor(raw / 800);
  const fraction = (raw % 800) / 800;
  const diffDays = harkun - BASE_HARKUN;

  const thaloengSokMoment = new Date(
    BASE_THALOENG_SOK_UTC + diffDays * MS_PER_DAY + fraction * MS_PER_DAY
  );
  const thaloengSokDate = toISODateUTC(thaloengSokMoment);
  const thaloengSokNoon = parseISODateUTCNoon(thaloengSokDate);

  // In Lanna usage, วันพญาวัน and วันเถลิงศก are the same civil date.
  const payaWanDate = thaloengSokDate;
  const naoDate = toISODateUTC(addDaysUTC(thaloengSokNoon, -1));
  const sankranLongDate = toISODateUTC(addDaysUTC(thaloengSokNoon, -2));

  return {
    gregorianYear,
    sankranLongDate,
    naoDate,
    payaWanDate,
    thaloengSokDate,
    oldZodiac: zodiacFromChulasakarat(oldChulasakarat),
    newZodiac: zodiacFromChulasakarat(newChulasakarat),
    oldChulasakarat,
    newChulasakarat,
  };
};

export const lannaYearTransitions: LannaYearTransition[] = Array.from(
  { length: 2100 - 1900 + 1 },
  (_, index) => buildTransitionForYear(1900 + index)
);

export const lannaYearTransitionByGregorianYear = new Map(
  lannaYearTransitions.map((entry) => [entry.gregorianYear, entry] as const)
);
