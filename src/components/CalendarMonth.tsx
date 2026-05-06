import { useMemo, useState, useEffect } from "react"
import { DayRecord } from "../types"
import { createCalendarGrid } from "../utils/createCalendarGrid"
import DayCell from "./DayCell"
import DetailSection from "./DetailSection"

const headers = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."]

type Props = {
  monthTitle: string
  year: number
  monthNumber: number
  data: DayRecord[]
  onPrev: () => void
  onNext: () => void
}

export default function CalendarMonth({
  monthTitle,
  year,
  monthNumber,
  data,
  onPrev,
  onNext
}: Props) {
  const [selectedISO, setSelectedISO] = useState<string>("")
  
  const grid = useMemo(() => {
    return createCalendarGrid(year, monthNumber, data)
  }, [year, monthNumber, data])

  const selectedRecord = useMemo(() => {
    return data.find(d => d.dateISO === selectedISO) || data[0] || null
  }, [selectedISO, data])

  useEffect(() => {
    if (data.length > 0) {
      setSelectedISO(data[0].dateISO)
    }
  }, [year, monthNumber, data])

  return (
    <div className="max-w-[980px] w-full mx-auto bg-white border-[0.5px] border-neutral-400">
      {/* HEADER BAR - PRINT STYLE */}
      <div className="h-[32px] flex items-center justify-between px-2 bg-[#6f4632] text-white">
        <button 
          onClick={onPrev}
          className="w-6 h-6 flex items-center justify-center hover:bg-white/10 transition-colors text-xs"
        >
          ◄
        </button>
        <h2 className="text-[12px] font-black uppercase tracking-widest">{monthTitle}</h2>
        <button 
          onClick={onNext}
          className="w-6 h-6 flex items-center justify-center hover:bg-white/10 transition-colors text-xs"
        >
          ►
        </button>
      </div>

      {/* WEEK HEADER - RIGID */}
      <div className="grid grid-cols-7 border-b-[0.5px] border-neutral-400">
        {headers.map((h, i) => (
          <div
            key={h}
            className={`h-[24px] flex items-center justify-center border-r-[0.5px] last:border-r-0 border-neutral-400 text-[11px] font-semibold ${i === 0 ? 'text-red-600 bg-red-50/30' : 'text-neutral-700 bg-neutral-100/50'}`}
          >
            {h}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID - DENSE 105px HEIGHT */}
      <div className="grid grid-cols-7 border-b-[0.5px] border-neutral-400">
        {grid.map((cell, idx) => (
          <div
            key={idx}
            className="h-[105px] border-r-[0.5px] border-b-[0.5px] last:border-r-0 border-neutral-400 relative"
          >
            {cell ? (
              <DayCell
                data={cell}
                selected={cell.dateISO === selectedRecord?.dateISO}
                onClick={() => setSelectedISO(cell.dateISO)}
              />
            ) : (
              <div className="h-full w-full bg-neutral-50/50" />
            )}
          </div>
        ))}
      </div>

      {/* LEGEND - VERY COMPACT */}
      <div className="flex justify-center items-center gap-3 py-1 bg-white border-b-[0.5px] border-neutral-400 text-[10px] font-bold">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-700"></span>
          <span className="text-green-700">วันมงคล</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-red-600"></span>
          <span className="text-red-600">วันหลีกเลี่ยง</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-blue-700"></span>
          <span className="text-blue-700">วันพิเศษ</span>
        </div>
      </div>

      {/* DETAIL SECTION (CONNECTED) */}
      <div className="bg-white">
        {selectedRecord ? (
          <DetailSection data={selectedRecord} />
        ) : (
          <div className="p-4 text-center text-[10px] text-neutral-400 italic">
            — เลือกวันที่เพื่อดูตำรา —
          </div>
        )}
      </div>
    </div>
  )
}
