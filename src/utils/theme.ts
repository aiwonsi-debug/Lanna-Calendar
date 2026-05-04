import { getLannaDate } from "./lannaCalc";

export type DayStatus = 'holy' | 'good' | 'bad' | 'neutral';

export interface DayTheme {
  bg: string;
  text: string;
  dot: string;
  label: string;
}

export const getDayTheme = (s: number, isActive: boolean): DayTheme => {
  if (!isActive) return { bg: 'bg-white opacity-10 grayscale', text: 'text-gray-300', dot: 'transparent', label: '' };

  const isGood = !!(s & 1);
  const isBad = !!(s & 2);
  const isHoly = !!(s & 4);

  if (isHoly) return { bg: 'bg-[#FFFBEB]', text: 'text-[#92400E]', dot: 'bg-[#F59E0B]', label: 'วันศีล' };
  if (isBad) return { bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]', dot: 'bg-[#EF4444]', label: 'วันเสีย' };
  if (isGood) return { bg: 'bg-[#F0FDF4]', text: 'text-[#166534]', dot: 'bg-[#10B981]', label: 'มงคล' };

  return { bg: 'bg-white', text: 'text-[#6B4231]', dot: 'transparent', label: '' };
};
