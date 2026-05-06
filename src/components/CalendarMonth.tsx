import { useMemo, useState } from "react"
import { DayRecord } from "../types"
import { createCalendarGrid } from "../utils/createCalendarGrid"
import DayCell from "./DayCell"
import DetailSection from "./DetailSection"

const headers = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"]

type Props = {
  month: string
  year: number
  monthNumber: number
  data: DayRecord[]
  onPrev: () => void
  onNext: () => void
}

export default function CalendarMonth({
  month,
  year,
  monthNumber,
  data,
  onPrev,
  onNext
}: Props) {
  const [selected, setSelected] = useState<string>("")
  
  const grid = useMemo(() => {
    return createCalendarGrid(year, monthNumber, data)
  }, [data, year, monthNumber])

  const selectedData =
    data.find(d => d.dateISO === selected) || data[0]

  return (
    <div className="max-w-6xl mx-auto bg-[#FDFCF9] shadow-xl rounded-2xl overflow-hidden border border-[#E8E2D2]">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-[#6B4231] to-[#8B5E3C] text-white">
        <button 
          onClick={onPrev}
          className="w-12 h-12 flex items-center justify-center hover:bg-white/20 rounded-full transition-all active:scale-90"
        >
          <span className="text-2xl font-bold">←</span>
        </button>
        <div className="text-center">
          <div className="text-3xl font-black tracking-tight drop-shadow-sm">
            {month}
          </div>
        </div>
        <button 
          onClick={onNext}
          className="w-12 h-12 flex items-center justify-center hover:bg-white/20 rounded-full transition-all active:scale-90"
        >
          <span className="text-2xl font-bold">→</span>
        </button>
      </div>

      {/* WEEK HEADER */}
      <div className="grid grid-cols-7 bg-[#F5F0E8] border-b border-[#E8E2D2]">
        {headers.map((h, i) => (
          <div
            key={h}
            className={`py-3 text-center font-bold text-sm uppercase tracking-widest ${i === 0 ? 'text-red-600' : 'text-[#6B4231]/70'}`}
          >
            {h}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 border-l border-[#E8E2D2]">
        {grid.map((cell, idx) => (
          <div
            key={idx}
            className={`
                border-r border-b border-[#E8E2D2] 
                h-[90px] sm:h-[130px] md:h-[150px] 
                relative transition-all duration-300
                ${!cell ? 'bg-[#F9F7F2]/50' : 'bg-white'}
            `}
          >
            {cell && (
              <DayCell
                data={cell}
                selected={
                  cell.dateISO === selectedData?.dateISO
                }
                onClick={() => setSelected(cell.dateISO)}
              />
            )}
          </div>
        ))}
      </div>

      {/* DETAIL SECTION - Sticky on mobile */}
      <div className="bg-white border-t-4 border-[#6B4231]">
        {selectedData ? (
          <DetailSection data={selectedData} />
        ) : (
          <div className="p-12 text-center text-[#6B4231]/40 italic font-medium">
            แตะวันที่เพื่อดูตำราปั๊กขะทืนล้านนา
          </div>
        )}
      </div>
    </div>
  )
}
