import { DayRecord } from "../types"

export default function DetailSection({ data }: { data: DayRecord }) {
  const isGood = data.score === 'good';
  const isBad = data.score === 'bad';

  return (
    <div className="p-3 sm:p-5 bg-white animate-in fade-in duration-300">
      <div className="max-w-2xl mx-auto">
        {/* COMPACT ROW-BASED HEADER */}
        <div className="flex justify-between items-center border-b-[0.5px] border-neutral-300 pb-2 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-neutral-800">วันที่ {data.day}</span>
            <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${isGood ? 'bg-green-100 text-green-700' : isBad ? 'bg-red-100 text-red-700' : 'bg-neutral-100 text-neutral-500'}`}>
               {isGood ? "วันดีมงคล" : isBad ? "วันหลีกเลี่ยง" : "วันปกติ"}
            </span>
          </div>
          <div className="text-right">
             <div className="text-sm font-bold text-[#6B4231]">{data.lunar}</div>
          </div>
        </div>

        {/* LABELS ROW */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {data.labels.map((l, i) => (
            <span key={i} className="px-2 py-0.5 border-[0.5px] border-[#6B4231]/30 text-[#6B4231] text-[9px] font-bold rounded-sm uppercase tracking-tighter">
              {l}
            </span>
          ))}
        </div>

        {/* CONTENT - SPREADSHEET STYLE ROWS */}
        <div className="space-y-1.5">
          {data.description.length > 0 ? (
            data.description.map((desc, i) => (
              <div key={i} className="flex gap-2 items-start text-[11px] leading-snug text-neutral-700">
                <span className="text-[#6B4231] font-bold mt-[1px]">▸</span>
                <p className="flex-1">{desc}</p>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-neutral-400 italic">ไม่มีข้อมูลเพิ่มเติม</p>
          )}
        </div>
        
        {/* FOOTER METADATA */}
        <div className="mt-4 pt-2 border-t-[0.5px] border-neutral-100 text-[8px] text-neutral-300 flex justify-between uppercase tracking-widest">
            <span>{data.dateISO}</span>
            <span>ปั๊กขะทืนล้านนา 2.0c</span>
        </div>
      </div>
    </div>
  );
}
