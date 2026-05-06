import React, { useState, useEffect, useRef } from 'react';
import { loadMonthData, NormalizedRecord, MONTH_NAMES } from '../utils/lanna';
import { MonthView } from './MonthlyGrid';
import { DetailSection } from './DetailSection';

export function Calendar() {
  const [viewMonth, setViewMonth] = useState(new Date(2026, 4, 1)); // May 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<NormalizedRecord | null>(null);
  const [records, setRecords] = useState<NormalizedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const detailRef = useRef<HTMLDivElement>(null);

  // Load normalized data for the SINGLE active month
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      const data = await loadMonthData(viewMonth);
      if (isMounted) {
        setRecords(data);
        setIsLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [viewMonth]);

  const handlePrevMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
    setSelectedDate(null);
    setSelectedRecord(null);
  };

  const handleNextMonth = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedRecord(null);
  };

  const handleSelectDay = (record: NormalizedRecord | null, date: Date) => {
    setSelectedDate(date);
    setSelectedRecord(record);
    
    if (window.innerWidth < 768 && detailRef.current) {
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      
      {/* Memory-efficient Month Navigation */}
      <div className="flex justify-between items-center bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
        <button 
          onClick={handlePrevMonth}
          className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 rounded-lg text-gray-700 font-medium transition-all active:scale-95"
        >
          <span className="text-xl">←</span> 
          <span className="hidden sm:inline">ก่อนหน้า</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 tracking-tight">
            {MONTH_NAMES[viewMonth.getMonth()]}
          </h2>
          <div className="text-sm sm:text-base text-gray-500 font-bold uppercase tracking-widest mt-1">
            พ.ศ. {viewMonth.getFullYear() + 543}
          </div>
        </div>
        
        <button 
          onClick={handleNextMonth}
          className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 rounded-lg text-gray-700 font-medium transition-all active:scale-95"
        >
          <span className="hidden sm:inline">ถัดไป</span>
          <span className="text-xl">→</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Grid (Only 1 month in DOM) */}
        <div className="flex-1 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden h-fit">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[450px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
              <p className="text-gray-400 font-medium">กำลังโหลดข้อมูลมงคล...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[450px] text-gray-500 p-8 text-center">
              <span className="text-5xl mb-4">📭</span>
              <p className="text-xl font-bold mb-2">ไม่มีข้อมูล</p>
              <p className="text-sm opacity-70">ยังไม่มีการสกัดข้อมูลสำหรับเดือนนี้</p>
            </div>
          ) : (
            <MonthView 
              viewMonth={viewMonth}
              records={records}
              selectedDate={selectedDate}
              onSelect={handleSelectDay}
            />
          )}
        </div>

        {/* Details Section */}
        <div className="w-full lg:w-96 shrink-0">
          <div ref={detailRef} className="lg:sticky lg:top-24">
            {selectedDate ? (
              <DetailSection selectedDate={selectedDate} record={selectedRecord} />
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center text-gray-400 mt-0">
                <span className="text-5xl block mb-4 opacity-30">🗓️</span>
                <p className="text-lg font-medium">แตะวันที่เพื่อดูฤกษ์มงคล</p>
                <p className="text-sm mt-2">รายละเอียดวันมงคลจะแสดงที่นี่</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
