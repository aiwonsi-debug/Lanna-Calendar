import { DayRecord } from "../types"

type Props = {
  data: DayRecord
  selected: boolean
  onClick: () => void
}

export default function DayCell({
  data,
  selected,
  onClick
}: Props) {
  const isGood = data.score === 'good';
  const isBad = data.score === 'bad';
  
  // Print-style dense logic
  const bgClass = selected ? "bg-[#F4E5CF]" : "bg-white";
  const textColor = isBad ? "text-red-600" : isGood ? "text-green-700" : "text-black";

  return (
    <div
      onClick={onClick}
      className={`
        h-full w-full
        p-1
        cursor-pointer
        overflow-hidden
        flex flex-col
        border-none
        relative
        ${bgClass}
      `}
    >
      {/* Day Number - Top Right (Spreadsheet style) */}
      <div className="absolute top-[2px] right-[4px] text-[9px] font-bold text-neutral-500 leading-none">
        {data.day}
      </div>
      
      {/* Lunar Text - Dense Center */}
      <div className={`text-[9px] leading-[1.05] mt-2 mb-1 text-center font-medium ${textColor}`}>
        {data.lunar}
      </div>

      {/* Labels - Informational Density */}
      <div className="flex flex-col gap-0 mt-auto w-full">
        {data.labels.slice(0, 2).map((l, i) => (
          <div
            key={i}
            className={`text-[8px] leading-[1] text-center truncate font-bold uppercase tracking-tighter ${isBad ? 'text-red-600' : isGood ? 'text-green-700' : 'text-neutral-600'}`}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}
