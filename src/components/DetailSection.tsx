import { DayRecord } from "../types"

export default function DetailSection({ data }: { data: DayRecord }) {
  const isGood = data.score === 'good';
  const isBad = data.score === 'bad';

  return (
    <div className="bg-white border-t-[0.5px] border-neutral-400 font-medium">
      {/* COMPACT TABLE-LIKE ROWS */}
      
      {/* Row 1: Key Info */}
      <div className="flex border-b-[0.5px] border-neutral-300 items-stretch h-[32px]">
        <div className="w-[100px] border-r-[0.5px] border-neutral-300 bg-neutral-50 px-2 flex items-center text-[9px] font-black uppercase text-neutral-400">
          วันที่
        </div>
        <div className="flex-1 px-3 flex items-center gap-3">
          <span className="text-[12px] font-black">{data.day}</span>
          <span className="text-[9px] text-neutral-400 font-bold uppercase">{data.dateISO}</span>
        </div>
        <div className={`px-4 flex items-center text-[10px] font-black uppercase ${isGood ? 'bg-green-50 text-green-700' : isBad ? 'bg-red-50 text-red-700' : 'bg-neutral-50 text-neutral-500'}`}>
          {isGood ? "วันมงคล" : isBad ? "ควรหลีกเลี่ยง" : "วันปกติ"}
        </div>
      </div>

      {/* Row 2: Lunar Info */}
      <div className="flex border-b-[0.5px] border-neutral-300 items-stretch h-[32px]">
        <div className="w-[100px] border-r-[0.5px] border-neutral-300 bg-neutral-50 px-2 flex items-center text-[9px] font-black uppercase text-neutral-400">
          จันทรคติ
        </div>
        <div className="flex-1 px-3 flex items-center text-[11px] font-black text-[#6B4231]">
          {data.lunar}
        </div>
      </div>

      {/* Row 3: Labels */}
      <div className="flex border-b-[0.5px] border-neutral-300 items-stretch min-h-[32px]">
        <div className="w-[100px] border-r-[0.5px] border-neutral-300 bg-neutral-50 px-2 flex items-center text-[9px] font-black uppercase text-neutral-400">
          ลักษณะวัน
        </div>
        <div className="flex-1 px-3 py-1 flex flex-wrap gap-2 items-center">
          {data.labels.length > 0 ? (
            data.labels.map((l, i) => (
              <span key={i} className="text-[9px] font-black bg-[#6B4231] text-white px-2 py-0.5 rounded-sm uppercase tracking-tighter">
                {l}
              </span>
            ))
          ) : (
            <span className="text-[9px] text-neutral-300 italic">— ไม่มีป้ายกำกับ —</span>
          )}
        </div>
      </div>

      {/* Row 4: Descriptions (Dense Newspaper Style) */}
      <div className="flex items-stretch min-h-[60px]">
        <div className="w-[100px] border-r-[0.5px] border-neutral-300 bg-neutral-50 px-2 flex items-center text-[9px] font-black uppercase text-neutral-400">
          คำทำนาย
        </div>
        <div className="flex-1 px-3 py-2 space-y-1.5 bg-white">
          {data.description.length > 0 ? (
            data.description.map((desc, i) => (
              <div key={i} className="text-[10px] leading-snug text-neutral-800 flex gap-2">
                <span className="text-[#6B4231] font-black">▸</span>
                <p className="flex-1 font-medium">{desc}</p>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-neutral-300 italic">ไม่มีข้อมูลคำทำนายเพิ่มเติม</p>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-[#6B4231] h-[16px] px-2 flex items-center justify-between text-[8px] text-white/50 font-bold uppercase tracking-[0.2em]">
        <span>ปั๊กขะทืนล้านนา 2.1 (PRINT EDITION)</span>
        <span>{data.sourceId ? `ID: ${data.sourceId.substring(0,8)}` : ''}</span>
      </div>
    </div>
  );
}
