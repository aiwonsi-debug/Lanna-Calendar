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
  
  // Dense layout colors
  const bgClass = selected ? "bg-[#FFF9EB]" : "bg-white";
  const textColor = isGood ? "text-green-700" : isBad ? "text-red-700" : "text-neutral-800";
  const lunarColor = isGood ? "text-green-600/70" : isBad ? "text-red-600/70" : "text-neutral-400";

  return (
    <div
      onClick={onClick}
      className={`
        h-full w-full
        p-1
        cursor-pointer
        overflow-hidden
        transition-colors duration-100
        flex flex-col items-center
        ${bgClass} hover:bg-neutral-50
      `}
    >
      {/* Day Number - Compact */}
      <div className={`text-sm font-bold leading-none mt-0.5 ${textColor}`}>
        {data.day}
      </div>
      
      {/* Lunar Text - Very small/Tight */}
      <div className={`text-[9px] leading-tight mt-0.5 text-center px-0.5 line-clamp-2 ${lunarColor}`}>
        {data.lunar}
      </div>

      {/* Labels - Informational Density */}
      <div className="flex flex-col gap-0 mt-auto w-full">
        {data.labels.slice(0, 2).map((l, i) => (
          <div
            key={i}
            className={`text-[8px] leading-[1.1] text-center truncate px-0.5 font-medium ${isGood ? 'text-green-600' : isBad ? 'text-red-600' : 'text-blue-600'}`}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}
