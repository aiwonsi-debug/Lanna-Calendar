import { getLannaDate, getSongkranLabel } from "./lannaCalc";

export type DayStatus = 'holy' | 'auspicious' | 'inauspicious' | 'neutral';

export interface DayTheme {
  bg: string;
  border: string;
  text: string;
  dot: string;
  label: string;
}

export const getDayTheme = (date: Date): { status: DayStatus; theme: DayTheme; info: ReturnType<typeof getLannaDate> } => {
  const info = getLannaDate(date);
  if (!info) return { status: 'neutral', theme: {} as DayTheme, info: null };

  const isAuspicious = !!(info.isThongChai || info.isAthipadi || info.sitthi || info.isFoo);
  const isInauspicious = !!(info.isUbat || info.isLokawinat || info.isWanMutju || info.isSia);
  const song = getSongkranLabel(date);

  let status: DayStatus = 'neutral';
  if (info.isSin) status = 'holy';
  else if (isInauspicious) status = 'inauspicious';
  else if (isAuspicious || song) status = 'auspicious';

  const themes: Record<DayStatus, DayTheme> = {
    holy: {
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#FCD34D]',
      text: 'text-[#92400E]',
      dot: 'bg-[#F59E0B]',
      label: 'วันศีล'
    },
    auspicious: {
      bg: 'bg-[#F0FDF4]',
      border: 'border-[#86EFAC]',
      text: 'text-[#065F46]',
      dot: 'bg-[#10B981]',
      label: 'วันมงคล'
    },
    inauspicious: {
      bg: 'bg-[#FEF2F2]',
      border: 'border-[#FCA5A5]',
      text: 'text-[#991B1B]',
      dot: 'bg-[#EF4444]',
      label: 'วันเสีย'
    },
    neutral: {
      bg: 'bg-white',
      border: 'border-[#F3F4F6]',
      text: 'text-[#6B4231]',
      dot: 'transparent',
      label: ''
    }
  };

  return { status, theme: themes[status], info };
};
