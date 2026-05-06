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
    
    // Traditional Lanna: "ขึ้น" becomes "ออก"
    const cleaned = lunarStr.replace("ขึ้น", "ออก");
    
    // Extract "เดือน X" and "ออก/แรม Y ค่ำ"
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
  
  // Important day detection for automatic background highlighting
  const isImportant = data.labels.some(l => 
    l.includes('วันพญาวัน') || 
    l.includes('วันเสีย') || 
    l.includes('วันธงชัย') || 
    l.includes('วันมงคล')
  );

  const { month, phase } = formatLannaLunar(data.lunar);
  
  // Final Color Logic
  const bgClass = selected ? "bg-[#f1dfc7]" : isImportant ? "bg-[#f3e2ca]" : "bg-white";
  const textClass = isBad ? "text-red-600" : isGood ? "text-green-700" : "text-neutral-700";

  return (
    <div
      onClick={onClick}
      className={`
        h-full w-full
        p-1
        cursor-pointer
        overflow-hidden
        flex flex-col items-center justify-start pt-[10px]
        relative
        transition-colors duration-75
        ${bgClass}
      `}
    >
      {/* 1. Gregorian Day Number - Top Right */}
      <div className={`absolute top-[2px] right-[3px] text-[9px] font-medium leading-none ${selected ? 'text-neutral-900' : 'text-neutral-400'}`}>
        {data.day}
      </div>
      
      {/* 2. Lunar Month Text */}
      <div className="text-[8px] font-bold text-neutral-400 leading-none mb-[1px]">
        {month}
      </div>

      {/* 3. Lunar Phase Text */}
      <div className={`text-[10px] font-medium leading-tight text-center ${textClass}`}>
        {phase}
      </div>

      {/* 4. Semantic Labels Stack (Vertical) */}
      <div className="flex flex-col gap-0 w-full mt-1">
        {data.labels.slice(0, 3).map((l, i) => (
          <div
            key={i}
            className={`
                text-[7px] leading-[1] text-center truncate font-black uppercase tracking-tighter
                ${l.includes('เสีย') || l.includes('มัจจุ') ? 'text-red-600' : 
                  l.includes('พญาวัน') || l.includes('ธงชัย') ? 'text-blue-700' : 
                  isGood ? 'text-green-700' : 'text-neutral-700'}
            `}
          >
            {l}
          </div>
        ))}
      </div>

      {/* 5. Status Dots Indicator */}
      <div className="flex gap-[2px] mt-auto pb-[2px]">
        {data.score === 'good' && <span className="w-[5px] h-[5px] rounded-full bg-green-600" />}
        {data.score === 'bad' && <span className="w-[5px] h-[5px] rounded-full bg-red-500" />}
        {data.labels.some(l => l.includes('วันศีล')) && <span className="w-[5px] h-[5px] rounded-full bg-blue-500" />}
        {isImportant && !isGood && !isBad && <span className="w-[5px] h-[5px] rounded-full bg-orange-400" />}
      </div>
    </div>
  )
}
