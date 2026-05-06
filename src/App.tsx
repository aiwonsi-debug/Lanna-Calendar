import React, { useEffect, useMemo, useState } from "react"
import CalendarMonth from "./components/CalendarMonth"
import { loadMonthData, NormalizedRecord, MONTH_NAMES } from './utils/lanna';

export default function App() {
  const [viewMonth, setViewMonth] = useState(new Date(2026, 4, 1)); // May 2026
  const [records, setRecords] = useState<NormalizedRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      const data = await loadMonthData(viewMonth);
      if (isMounted) {
        // Map old schema to match DayRecord expectations if fields are missing
        const mappedData = data.map(r => ({
            ...r,
            year: viewMonth.getFullYear(),
            month: viewMonth.getMonth() + 1
        }));
        setRecords(mappedData as any);
        setIsLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [viewMonth]);

  const handlePrev = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));
  };

  const monthLabel = `${MONTH_NAMES[viewMonth.getMonth()]} พ.ศ. ${viewMonth.getFullYear() + 543}`;

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-2 sm:p-4 text-xs">
      <CalendarMonth
        month={monthLabel}
        year={viewMonth.getFullYear()}
        monthNumber={viewMonth.getMonth() + 1}
        data={records as any}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  )
}
