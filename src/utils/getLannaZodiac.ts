import {
  lannaYearTransitionByGregorianYear,
  lannaYearTransitions,
  LannaZodiacThaiMap,
  type LannaYearTransition,
} from "../data/lannaYearTransitions";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const parseISODateUTCNoon = (isoDate: string) => {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
};

const toISODateUTC = (date: Date) => {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const normalizeToUTCNoon = (date: Date) =>
  new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0));

const buildFallbackTransition = (gregorianYear: number): LannaYearTransition => {
  const nearest = lannaYearTransitions.reduce((current, candidate) => {
    return Math.abs(candidate.gregorianYear - gregorianYear) < Math.abs(current.gregorianYear - gregorianYear)
      ? candidate
      : current;
  }, lannaYearTransitions[0]);

  const yearDelta = gregorianYear - nearest.gregorianYear;
  const shiftDays = yearDelta * 365;

  const shift = (isoDate: string) => {
    const base = parseISODateUTCNoon(isoDate);
    const shifted = new Date(base.getTime() + shiftDays * MS_PER_DAY);
    return toISODateUTC(shifted);
  };

  return {
    gregorianYear,
    sankranLongDate: shift(nearest.sankranLongDate),
    naoDate: shift(nearest.naoDate),
    payaWanDate: shift(nearest.payaWanDate),
    thaloengSokDate: shift(nearest.thaloengSokDate),
    oldZodiac: nearest.oldZodiac,
    newZodiac: nearest.newZodiac,
    oldChulasakarat: gregorianYear - 639,
    newChulasakarat: gregorianYear - 638,
  };
};

export const getLannaYearTransition = (gregorianYear: number): LannaYearTransition => {
  return lannaYearTransitionByGregorianYear.get(gregorianYear) ?? buildFallbackTransition(gregorianYear);
};

export const resolveLannaZodiacForDate = (date: Date, transition?: LannaYearTransition) => {
  const targetTransition = transition ?? getLannaYearTransition(date.getFullYear());
  const normalizedDate = normalizeToUTCNoon(date);
  const thaloengSokDate = parseISODateUTCNoon(targetTransition.thaloengSokDate);

  if (normalizedDate < thaloengSokDate) {
    return {
      zodiacLanna: targetTransition.oldZodiac,
      zodiacThai: LannaZodiacThaiMap[targetTransition.oldZodiac as keyof typeof LannaZodiacThaiMap],
      chulasakarat: targetTransition.oldChulasakarat,
    };
  }

  return {
    zodiacLanna: targetTransition.newZodiac,
    zodiacThai: LannaZodiacThaiMap[targetTransition.newZodiac as keyof typeof LannaZodiacThaiMap],
    chulasakarat: targetTransition.newChulasakarat,
  };
};

export const getLannaZodiac = (date: Date) => {
  const transition = getLannaYearTransition(date.getFullYear());
  return resolveLannaZodiacForDate(date, transition);
};
