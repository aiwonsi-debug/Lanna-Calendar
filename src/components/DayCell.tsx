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
  // Color logic based on score
  const isGood = data.score === 'good';
  const isBad = data.score === 'bad';
  
  const scoreBg = isGood ? "bg-green-50" : isBad ? "bg-red-50" : "bg-white";
  const textColor = isGood ? "text-green-700" : isBad ? "text-red-700" : "text-gray-800";
  const lunarColor = isGood ? "text-green-600/70" : isBad ? "text-red-600/70" : "text-gray-400";

  return (
    <div
      onClick={onClick}
      className={`
        h-full w-full
        p-2
        cursor-pointer
        overflow-hidden
        transition-all duration-200
        flex flex-col
        ${selected ? "ring-2 ring-inset ring-orange-400 bg-orange-50 z-10" : `${scoreBg} hover:bg-gray-100`}
      `}
    >
      <div className={`font-bold text-lg sm:text-xl ${selected ? "text-orange-700" : textColor}`}>
        {data.day}
      </div>
      
      <div className={`text-[10px] sm:text-xs font-medium leading-tight mt-0.5 ${lunarColor}`}>
        {data.lunar}
      </div>

      <div className="flex flex-wrap gap-1 mt-auto">
        {data.labels.slice(0, 2).map((l, i) => (
          <div
            key={i}
            className={`text-[9px] px-1 py-0.5 rounded-sm font-bold uppercase tracking-tighter ${isGood ? 'bg-green-200 text-green-800' : isBad ? 'bg-red-200 text-red-800' : 'bg-blue-100 text-blue-800'}`}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}
