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
    <div className="max-w-[980px] w-full mx-auto bg-white border-[0.5px] border-neutral-300">
      {/* HEADER BAR - SUBTLE PRINT STYLE */}
      <div className="h-[24px] flex items-center justify-between px-2 bg-[#6f4632] text-white">
        <button 
          onClick={onPrev}
          className="w-5 h-5 flex items-center justify-center hover:bg-white/10 transition-colors text-[10px]"
        >
          ◄
        </button>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.1em]">{monthTitle}</h2>
        <button 
          onClick={onNext}
          className="w-5 h-5 flex items-center justify-center hover:bg-white/10 transition-colors text-[10px]"
        >
          ►
        </button>
      </div>

      {/* WEEK HEADER - COMPRESSED */}
      <div className="grid grid-cols-7 border-b-[0.5px] border-neutral-300">
        {headers.map((h, i) => (
          <div
            key={h}
            className={`h-[22px] flex items-center justify-center border-r-[0.5px] last:border-r-0 border-neutral-300 text-[10px] font-medium ${i === 0 ? 'text-red-500 bg-red-50/20' : 'text-neutral-500 bg-neutral-100/30'}`}
          >
            {h}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID - DENSE PRINT PROPORTIONS */}
      <div className="grid grid-cols-7 border-b-[0.5px] border-neutral-300">
        {grid.map((cell, idx) => (
          <div
            key={idx}
            className="h-[105px] border-r-[0.5px] border-b-[0.5px] last:border-r-0 border-neutral-300 relative"
          >
            {cell ? (
              <DayCell
                data={cell}
                selected={cell.dateISO === selectedRecord?.dateISO}
                onClick={() => setSelectedISO(cell.dateISO)}
              />
            ) : (
              <div className="h-full w-full bg-neutral-50/20" />
            )}
          </div>
        ))}
      </div>

      {/* LEGEND - SPREADSHEET FOOTER STYLE */}
      <div className="flex justify-center items-center gap-2 py-1 bg-white border-b-[0.5px] border-neutral-300 text-[9px] font-medium text-neutral-400">
        <div className="flex items-center gap-1">
          <span className="w-[7px] h-[7px] bg-green-700"></span>
          <span>วันมงคล</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-[7px] h-[7px] bg-red-600"></span>
          <span>วันหลีกเลี่ยง</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-[7px] h-[7px] bg-blue-700"></span>
          <span>วันพิเศษ</span>
        </div>
      </div>

      {/* DETAIL SECTION (PRINT FORM STYLE) */}
      <div className="bg-white">
        {selectedRecord ? (
          <DetailSection data={selectedRecord} />
        ) : (
          <div className="p-4 text-center text-[9px] text-neutral-300 italic">
            — เลือกวันที่ —
          </div>
        )}
      </div>
    </div>
  )
}
