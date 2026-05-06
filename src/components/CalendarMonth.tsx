import { useMemo, useState, useEffect } from "react"
import { DayRecord } from "../types"
import { createCalendarGrid } from "../utils/createCalendarGrid"
import DayCell from "./DayCell"
import DetailSection from "./DetailSection"

const headers = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"]

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
    <div className="max-w-[850px] mx-auto bg-[#FDFCF9] shadow-md border-[0.5px] border-neutral-300">
      {/* COMPACT HEADER */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#6B4231] text-white">
        <button 
          onClick={onPrev}
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-lg"
        >
          ←
        </button>
        <h2 className="text-base font-bold tracking-tight">{monthTitle}</h2>
        <button 
          onClick={onNext}
          className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-lg"
        >
          →
        </button>
      </div>

      {/* WEEK HEADER - TIGHT */}
      <div className="grid grid-cols-7 bg-neutral-100 border-b-[0.5px] border-neutral-400">
        {headers.map((h, i) => (
          <div
            key={h}
            className={`py-1 text-center text-[10px] font-bold ${i === 0 ? 'text-red-600' : 'text-neutral-500'}`}
          >
            {h}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID - SPREADSHEET STYLE */}
      <div className="grid grid-cols-7 border-l-[0.5px] border-neutral-400">
        {grid.map((cell, idx) => (
          <div
            key={idx}
            className="h-[85px] sm:h-[100px] border-r-[0.5px] border-b-[0.5px] border-neutral-400 relative"
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

      {/* DETAIL SECTION REFINEMENT */}
      <div className="bg-white border-t-[0.5px] border-neutral-400">
        {selectedRecord ? (
          <DetailSection data={selectedRecord} />
        ) : (
          <div className="py-8 text-center text-[11px] text-neutral-400 italic">
            แตะวันที่เพื่อดูตำราปั๊กขะทืน
          </div>
        )}
      </div>
    </div>
  )
}
