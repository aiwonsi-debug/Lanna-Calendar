import React, { useMemo } from 'react';
import { getDayTheme } from '../utils/theme';

interface DayData {
  d: number;
  s: number;
  f?: boolean;
}

interface MonthlyGridProps {
  viewMonth: Date;
  days: DayData[];
  selectedDate: Date | null;
  filter: string;
  onSelect: (date: Date) => void;
}

export const MonthlyGrid: React.FC<MonthlyGridProps> = ({ viewMonth, days, selectedDate, filter, onSelect }) => {
  const firstDayOffset = useMemo(() => 
    new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay()
  , [viewMonth]);

  return (
    <div className="grid grid-cols-7 gap-1.5">
      {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d, i) => (
        <div key={d} className={`text-center text-[10px] font-black mb-2 ${i === 0 ? 'text-red-500' : 'text-gray-400'}`}>{d}</div>
      ))}
      
      {Array.from({ length: firstDayOffset }).map((_, i) => (
        <div key={`p-${i}`} className="aspect-square" />
      ))}

      {days.map((day) => {
        const isSelected = selectedDate?.getDate() === day.d && selectedDate?.getMonth() === viewMonth.getMonth();
        const isToday = new Date().getDate() === day.d && new Date().getMonth() === viewMonth.getMonth();
        
        const isGood = !!(day.s & 1);
        const isBad = !!(day.s & 2);
        const isHoly = !!(day.s & 4);
        
        let isActive = filter === 'all' || (filter === 'good' && (isGood || isHoly)) || (filter === 'bad' && isBad);
        const theme = getDayTheme(day.s, isActive);

        return (
          <button
            key={day.d}
            onClick={() => onSelect(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day.d))}
            className={`
              relative aspect-square w-full rounded-xl border flex items-center justify-center transition-all duration-75
              ${theme.bg}
              ${isSelected ? 'border-2 border-[#6B4231] z-10 scale-105 shadow-md' : 'border-gray-50'}
              ${isToday && !isSelected ? 'ring-1 ring-[#F59E0B] ring-offset-1' : ''}
              active:scale-95
            `}
          >
            <span className={`text-[17px] font-black ${theme.text}`}>{day.d}</span>
            {day.f && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0891B2]" />}
            {theme.dot !== 'transparent' && !day.f && (
              <div className={`absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ${theme.dot}`} />
            )}
          </button>
        );
      })}
    </div>
  );
};
