import React, { useState, useEffect, memo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { loadMonthData, NormalizedRecord, MONTH_NAMES } from '../utils/lanna';
import { MonthView } from './MonthlyGrid';

// --- Types ---
interface MonthRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    months: Date[];
    onSelect: (record: NormalizedRecord | null, date: Date) => void;
    selectedDate: Date | null;
  };
}

// --- Memoized Row Component for Max Performance ---
const MonthRow = memo(({ index, style, data }: MonthRowProps) => {
  const { months, onSelect, selectedDate } = data;
  const monthDate = months[index];
  const [records, setRecords] = useState<NormalizedRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Stable Key: YYYY-MM
  const monthKey = `${monthDate.getFullYear()}-${(monthDate.getMonth() + 1).toString().padStart(2, '0')}`;

  useEffect(() => {
    let isMounted = true;
    const fetchMonth = async () => {
      setLoading(true);
      const data = await loadMonthData(monthDate);
      if (isMounted) {
        setRecords(data);
        setLoading(false);
      }
    };
    fetchMonth();
    return () => { isMounted = false; };
  }, [monthKey]);

  return (
    <div style={style} key={monthKey} className="px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {MONTH_NAMES[monthDate.getMonth()]} {monthDate.getFullYear() + 543}
          </h2>
          <span className="text-sm font-mono text-gray-400 uppercase tracking-widest">{monthKey}</span>
        </div>
        
        {loading ? (
          <div className="h-[400px] flex items-center justify-center italic text-gray-400">
            กำลังเตรียมข้อมูลมงคล...
          </div>
        ) : (
          <MonthView 
            viewMonth={monthDate}
            records={records}
            selectedDate={selectedDate}
            onSelect={onSelect}
          />
        )}
      </div>
    </div>
  );
});

// --- Main Virtualized Calendar Component ---
export function VirtualizedCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<NormalizedRecord | null>(null);

  // Generate list of months from 2025 to 2035 (132 months)
  const months = React.useMemo(() => {
    const startYear = 2025;
    const endYear = 2035;
    const list: Date[] = [];
    for (let y = startYear; y <= endYear; y++) {
      for (let m = 0; m < 12; m++) {
        list.push(new Date(y, m, 1));
      }
    }
    return list;
  }, []);

  const handleSelect = (record: NormalizedRecord | null, date: Date) => {
    setSelectedDate(date);
    setSelectedRecord(record);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Dynamic List with react-window */}
      <div className="flex-1">
        <List
          height={window.innerHeight - 100} // Dynamic height
          itemCount={months.length}
          itemSize={700} // Estimated height per month
          width="100%"
          overscanCount={1} // Render only 1 month above and below (Max 3 in DOM)
          itemData={{
            months,
            onSelect: handleSelect,
            selectedDate
          }}
        >
          {MonthRow}
        </List>
      </div>

      {/* Persistent Detail Bar for UX */}
      {selectedRecord && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-200 shadow-2xl p-4 animate-in slide-in-from-bottom duration-300 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <span className="text-orange-600 font-bold block text-sm">ฤกษ์วันนี้:</span>
              <span className="text-gray-800 font-medium">{selectedRecord.lunar}</span>
            </div>
            <div className="flex gap-2">
              {selectedRecord.labels.slice(0, 3).map((l, i) => (
                <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold uppercase">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
