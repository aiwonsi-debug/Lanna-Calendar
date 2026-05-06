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

const normalizeMod = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;

const zodiacFromChulasakarat = (chulasakarat: number) => {
  // Align CS cycle with Lanna zodiac ordering.
  // Traditional Lanna zodiac (Mae Mue) cycle relative to Chulasakarat.
  // CS 1386 (2024) is "มะโรง" (Dragon) - in Lanna: "สี"
  // CS 1387 (2025) is "มะเส็ง" (Snake) - in Lanna: "ไส้"
  // LannaZodiac = ["ชวด","เป้า","ยี่","เหม้า","สี","ไส้","สะง้า","เม็ด","สัน","เร้า","เส็ด","ใค้"]
  // Index for 1386: (1386 - 2) % 12 = 1384 % 12 = 4 (สี)
  // Index for 1387: (1387 - 2) % 12 = 1385 % 12 = 5 (ไส้)
  const index = normalizeMod(chulasakarat - 2, 12);
  return LannaZodiac[index];
};

const buildTransitionForYear = (gregorianYear: number): LannaYearTransition => {
  const newChulasakarat = gregorianYear - 638;
  const oldChulasakarat = newChulasakarat - 1;

  // Simple rule for Songkran/Phaya Wan in Lanna
  // Usually April 14 (SangKhan Long), 15 (Nao), 16 (Phaya Wan)
  // These are fixed in most modern Lanna calendars unless using high-precision astronomical calculations
  const sankranLongDate = `${gregorianYear}-04-14`;
  const naoDate = `${gregorianYear}-04-15`;
  const payaWanDate = `${gregorianYear}-04-16`;
  const thaloengSokDate = `${gregorianYear}-04-16`;

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
