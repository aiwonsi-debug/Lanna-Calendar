import { DayRecord } from "../types"

type Props = {
  data: DayRecord
  selected: boolean
  onClick: () => void
}

/**
 * Formats lunar string according to traditional Thai Lanna print rules.
 * Fine-tuned for ultra-dense typography.
 */
const formatLannaLunar = (lunarStr: string): { month: string, phase: string } => {
    if (!lunarStr) return { month: "", phase: "" };
    const cleaned = lunarStr.replace("ขึ้น", "ออก");
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
  
  // Selection / Paper-like Print Style
  const bgClass = selected ? "bg-[#f7ecd9]" : "bg-white";
  
  // Normalized Color Hierarchy for Print
  const textClass = isBad ? "text-red-600" : isGood ? "text-green-700" : "text-neutral-600";

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
      {/* Gregorian Day Number - Subtle Corner (Print style) */}
      <div className="absolute top-[2px] right-[3px] text-[9px] font-medium text-neutral-400 leading-none">
        {data.day}
      </div>
      
      {/* Lanna Month Name - Faint Header */}
      <div className="text-[7px] font-medium text-neutral-300 leading-none mb-[2px]">
        {month}
      </div>

      {/* Lunar Phase - Ultra Dense Typography */}
      <div className={`text-[8px] leading-[1] text-center font-normal ${textClass}`}>
        {phase}
      </div>

      {/* Special Labels - Spreadsheet Row Style */}
      <div className="flex flex-col gap-0 mt-auto w-full">
        {data.labels.slice(0, 2).map((l, i) => (
          <div
            key={i}
            className={`
                text-[8px] leading-[1] text-center truncate font-medium uppercase tracking-tighter
                ${isBad ? 'text-red-500' : isGood ? 'text-green-600' : 'text-blue-600'}
            `}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}
