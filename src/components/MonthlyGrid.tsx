import React from 'react';

export interface LannaDayData {
  d: number;
  date: Date;
  lannaMonth: number;
  lunarDay: number;
  phase: string;
  wanThai: string;
  isSin?: boolean;
  isSia?: boolean;
  isUbat?: boolean;
  isLokawinat?: boolean;
  isWanMutju?: boolean;
  isThongChai?: boolean;
  isAthipadi?: boolean;
  sitthi?: string;
  songkranLabel?: string;
  isRahuTok?: boolean;
  isFahTeeSangGood?: boolean;
  dithiName?: string;
}

interface MonthlyGridProps {
  viewMonth: Date;
  days: LannaDayData[];
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

export function MonthlyGrid({ viewMonth, days, selectedDate, onSelect }: MonthlyGridProps) {
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const today = new Date();
  
  const isToday = (d: number) => 
    today.getDate() === d && 
    today.getMonth() === viewMonth.getMonth() && 
    today.getFullYear() === viewMonth.getFullYear();

  const isSelected = (d: number) => 
    selectedDate?.getDate() === d && 
    selectedDate?.getMonth() === viewMonth.getMonth() && 
    selectedDate?.getFullYear() === viewMonth.getFullYear();

  const weekDays = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 border-b border-gray-100">
        {weekDays.map((wd, i) => (
          <div key={wd} className={`py-2 text-center text-[10px] font-bold ${i === 0 ? 'text-red-500' : 'text-gray-400'}`}>
            {wd}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {blanks.map(b => (
          <div key={`b-${b}`} className="aspect-square border-b border-r border-gray-50 bg-gray-50/30" />
        ))}
        
        {days.map((day, i) => {
          const selected = isSelected(day.d);
          const currentIsToday = isToday(day.d);
          
          const hasInfo = day.isSin || day.isSia || day.isUbat || day.isLokawinat || 
                         day.isThongChai || day.isAthipadi || day.sitthi || 
                         day.isWanMutju || day.isRahuTok || day.songkranLabel;

          const bgColor = selected 
            ? 'bg-[#5A3520]' 
            : currentIsToday 
              ? 'bg-[#FFFBEB]' 
              : day.lannaMonth % 2 !== 0 ? 'bg-[#FFFFFF]' : 'bg-[#FAF7F2]';

          return (
            <div 
              key={day.d}
              onClick={() => onSelect(day.date)}
              className={`relative aspect-square border-b border-r border-gray-100 flex flex-col p-1 cursor-pointer transition-colors ${bgColor} ${currentIsToday && !selected ? 'border-2 border-[#F59E0B] z-10' : ''}`}
            >
              {/* Unconditional Month Pill */}
              <div className="flex flex-col gap-0.5">
                <span className={`text-[8px] font-bold px-[3px] py-[1px] rounded-[2px] w-fit ${selected ? 'bg-[#FEF3C7] text-[#5A3520]' : 'bg-[#EDE8DF] text-[#5A3520]'}`}>
                  เดือน{day.lannaMonth}
                </span>
              </div>

              {hasInfo ? (
                <>
                  <div className="flex justify-between items-start leading-none relative z-10">
                    <span className={`text-[12px] font-bold ml-auto ${selected ? 'text-[#FEF3C7]' : (day.date.getDay() === 0 ? 'text-[#DC2626]' : 'text-[#333]')}`}>
                      {day.d}
                    </span>
                  </div>

                  <div className={`text-[8.5px] mt-0.5 ${selected ? 'text-[#FDE68A]' : 'text-[#8B6E57]'}`}>
                    {day.phase}{day.lunarDay}
                  </div>

                  <div className="flex flex-col mt-auto overflow-hidden">
                    {day.songkranLabel && (
                      <span className="text-[8px] font-bold text-[#0891B2] truncate leading-tight">{day.songkranLabel}</span>
                    )}
                    {(day.isSia || day.isUbat || day.isLokawinat) && (
                      <span className={`text-[8px] font-bold text-[#DC2626] truncate leading-tight`}>
                        {day.isLokawinat ? 'โลกาวินาศ' : day.isUbat ? 'อุบาทว์' : day.isSia ? 'วันเสีย' : ''}
                      </span>
                    )}
                    {(day.isThongChai || day.isAthipadi || day.sitthi) && (
                      <span className={`text-[8px] font-bold text-[#059669] truncate leading-tight`}>
                        {day.isThongChai ? 'ธงชัย' : day.isAthipadi ? 'อธิบดี' : day.sitthi}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-[2px] mt-0.5">
                    {day.isSin && <div className={`w-[6px] h-[6px] rounded-full ${selected ? 'bg-[#FDE68A]' : 'bg-orange-400'}`} />}
                    {(day.isSia || day.isUbat || day.isLokawinat || day.isWanMutju) && (
                      <div className={`w-[6px] h-[6px] rounded-full ${selected ? 'bg-[#FCA5A5]' : 'bg-red-500'}`} />
                    )}
                    {(day.isThongChai || day.isAthipadi || day.sitthi || day.isFahTeeSangGood) && (
                      <div className={`w-[6px] h-[6px] rounded-full ${selected ? 'bg-[#6EE7B7]' : 'bg-green-500'}`} />
                    )}
                  </div>
                </>
              ) : (
                <div className="flex justify-end p-1">
                  <span className={`text-[12px] font-bold ${selected ? 'text-[#FEF3C7]' : (day.date.getDay() === 0 ? 'text-[#DC2626]' : 'text-[#333]')}`}>
                    {day.d}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
