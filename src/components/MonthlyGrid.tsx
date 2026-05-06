import React from 'react';
import { NormalizedRecord } from '../utils/lanna';

// Thai Numeral Helper (Removed, using Arabic)
const thaiNum = (n: number | string) => n.toString();

const WEEK_DAYS = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

interface DayCellProps {
  record: NormalizedRecord | null;
  dayNumber: number;
  isSelected: boolean;
  isToday: boolean;
  onSelect: (record: NormalizedRecord | null, date: Date) => void;
  viewMonth: Date;
}

function DayCell({ record, dayNumber, isSelected, isToday, onSelect, viewMonth }: DayCellProps) {
  const currentDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), dayNumber);

  if (!record) {
    return (
      <div className="min-h-[100px] sm:min-h-[120px] p-1 sm:p-2 border-b border-r border-gray-100 bg-gray-50/50">
        <div className="text-right text-gray-400 text-sm font-medium">{thaiNum(dayNumber)}</div>
      </div>
    );
  }

  let bgClass = "bg-white hover:bg-orange-50 cursor-pointer transition-colors";
  let borderClass = isSelected ? "ring-2 ring-inset ring-orange-500" : "";
  let textColor = "text-gray-700";

  if (record.score === 'good') {
    bgClass = "bg-green-50 hover:bg-green-100 cursor-pointer transition-colors";
    textColor = "text-green-800";
  } else if (record.score === 'bad') {
    bgClass = "bg-red-50 hover:bg-red-100 cursor-pointer transition-colors";
    textColor = "text-red-800";
  }

  if (isToday) {
    borderClass = "ring-2 ring-inset ring-blue-500";
  }

  // Find if it's a Buddhist holy day
  const isWanPhra = record.labels.includes("วันพระ");

  return (
    <div 
      onClick={() => onSelect(record, currentDate)}
      className={`min-h-[100px] sm:min-h-[120px] p-1 sm:p-2 border-b border-r border-gray-100 flex flex-col ${bgClass} ${borderClass}`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className={`text-xs sm:text-[10px] md:text-xs font-medium px-1 rounded-sm ${
          isWanPhra ? 'bg-yellow-100 text-yellow-800' : 'text-gray-500'
        } truncate max-w-[70%]`}>
          {record.lunar}
        </span>
        <span className={`text-base sm:text-lg font-bold ${textColor}`}>
          {dayNumber}
        </span>
      </div>

      <div className="flex-1 overflow-hidden">
        {record.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {record.labels.slice(0, 2).map((label, i) => (
              <span key={i} className="inline-block text-[10px] leading-tight px-1 py-0.5 bg-white/60 rounded border border-gray-200 truncate max-w-full">
                {label}
              </span>
            ))}
            {record.labels.length > 2 && (
              <span className="inline-block text-[10px] leading-tight px-1 py-0.5 text-gray-500">
                +{record.labels.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface MonthViewProps {
  viewMonth: Date;
  records: NormalizedRecord[];
  selectedDate: Date | null;
  onSelect: (record: NormalizedRecord | null, date: Date) => void;
}

export function MonthView({ viewMonth, records, selectedDate, onSelect }: MonthViewProps) {
  const firstDayOfWeek = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i);
  const today = new Date();

  // Create a map for quick lookup
  const recordMap = new Map<number, NormalizedRecord>();
  records.forEach(r => recordMap.set(r.day, r));

  const isToday = (dayNum: number) => {
    return today.getDate() === dayNum && 
           today.getMonth() === viewMonth.getMonth() && 
           today.getFullYear() === viewMonth.getFullYear();
  };

  const isSelected = (dayNum: number) => {
    return selectedDate?.getDate() === dayNum && 
           selectedDate?.getMonth() === viewMonth.getMonth() && 
           selectedDate?.getFullYear() === viewMonth.getFullYear();
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 border-b border-gray-100">
        {WEEK_DAYS.map((day, i) => (
          <div key={day} className={`py-2 sm:py-3 text-center text-xs sm:text-sm font-semibold border-r border-gray-100 last:border-r-0 ${
            i === 0 ? 'text-red-600 bg-red-50' : 
            i === 6 ? 'text-purple-600 bg-purple-50' : 'text-gray-700 bg-gray-50'
          }`}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-t border-gray-100">
        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="min-h-[100px] sm:min-h-[120px] bg-gray-50 border-b border-r border-gray-100"></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(dayNum => (
          <DayCell 
            key={`day-${dayNum}`}
            record={recordMap.get(dayNum) || null}
            dayNumber={dayNum}
            isSelected={isSelected(dayNum)}
            isToday={isToday(dayNum)}
            onSelect={onSelect}
            viewMonth={viewMonth}
          />
        ))}
      </div>
    </div>
  );
}
