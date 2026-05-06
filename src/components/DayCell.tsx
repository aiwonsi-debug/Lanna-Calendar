import { DayRecord } from "../types"

type Props = {
  data: DayRecord
  selected: boolean
  onClick: () => void
}

/**
 * Formats lunar string according to traditional Thai Lanna print rules.
 * "ขึ้น 1 ค่ำ" -> "ออก 1 ค่ำ"
 */
const formatLannaLunar = (lunarStr: string): { month: string, phase: string } => {
    if (!lunarStr) return { month: "", phase: "" };
    
    // Replace "ขึ้น" with "ออก"
    const cleaned = lunarStr.replace("ขึ้น", "ออก");
    
    // Logic to separate "เดือน X" from "ออก/แรม Y ค่ำ"
    const monthMatch = cleaned.match(/เดือน\s*\d+/);
    const phaseMatch = cleaned.match(/(?:ออก|แรม)\s*\d+\s*ค่ำ/);
    
    return {
        month: monthMatch ? monthMatch[0] : "",
        phase: phaseMatch ? phaseMatch[0] : cleaned.replace(/เดือน\s*\d+\s*/, "")
    };
};

export default function DayCell({
  data,
  selected,
  onClick
}: Props) {
  const isGood = data.score === 'good';
  const isBad = data.score === 'bad';
  
  const { month, phase } = formatLannaLunar(data.lunar);
  
  // Selection / Print Style
  const bgClass = selected ? "bg-[#f1dfc7]" : "bg-white";
  
  // Color Hierarchy
  const textClass = isBad ? "text-red-600" : isGood ? "text-green-700" : "text-neutral-700";

  return (
    <div
      onClick={onClick}
      className={`
        h-full w-full
        p-1
        cursor-pointer
        overflow-hidden
        flex flex-col items-center justify-start
        relative
        transition-colors duration-75
        ${bgClass}
      `}
    >
      {/* Gregorian Day Number - Top Right Corner */}
      <div className="absolute top-[2px] right-[3px] text-[10px] font-semibold text-neutral-500 leading-none">
        {data.day}
      </div>
      
      {/* Lanna Month Name */}
      <div className="text-[8px] font-bold text-neutral-400 mt-0.5 leading-none">
        {month}
      </div>

      {/* Lunar Phase - Primary Content */}
      <div className={`text-[9px] leading-[1.05] mt-0.5 text-center font-bold ${textClass}`}>
        {phase}
      </div>

      {/* Labels - High Information Density */}
      <div className="flex flex-col gap-0 mt-auto w-full">
        {data.labels.slice(0, 2).map((l, i) => (
          <div
            key={i}
            className={`
                text-[8px] leading-[1.05] text-center truncate font-black uppercase tracking-tighter
                ${isBad ? 'text-red-600' : isGood ? 'text-green-700' : 'text-blue-700'}
            `}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}
