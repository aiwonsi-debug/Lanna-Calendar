import { DayRecord } from "../types"

export default function DetailSection({ data }: { data: DayRecord }) {
  const isGood = data.score === 'good';
  const isBad = data.score === 'bad';

  return (
    <div className="bg-white border-t-[0.5px] border-neutral-300 font-normal">
      {/* ULTRA-COMPACT PRINT FORM ROWS */}
      
      {/* Row 1: Primary Date Info */}
      <div className="flex border-b-[0.5px] border-neutral-200 items-stretch h-[22px]">
        <div className="w-[80px] border-r-[0.5px] border-neutral-200 bg-neutral-50 px-[6px] flex items-center text-[8px] font-bold uppercase text-neutral-400 tracking-tighter">
          สรุปวัน
        </div>
        <div className="flex-1 px-[6px] flex items-center gap-4">
          <span className="text-[10px] font-bold text-neutral-700">วันที่ {data.day}</span>
          <span className="text-[8px] text-neutral-300 font-medium tracking-tight">{data.dateISO}</span>
        </div>
        <div className={`px-4 flex items-center text-[9px] font-bold uppercase tracking-widest ${isGood ? 'bg-green-50/50 text-green-700' : isBad ? 'bg-red-50/50 text-red-700' : 'text-neutral-400'}`}>
          {isGood ? "วันมงคล" : isBad ? "วันหลีกเลี่ยง" : "วันปกติ"}
        </div>
      </div>

      {/* Row 2: Traditional Lanna Lunar */}
      <div className="flex border-b-[0.5px] border-neutral-200 items-stretch h-[22px]">
        <div className="w-[80px] border-r-[0.5px] border-neutral-200 bg-neutral-50 px-[6px] flex items-center text-[8px] font-bold uppercase text-neutral-400 tracking-tighter">
          จันทรคติ
        </div>
        <div className="flex-1 px-[6px] flex items-center text-[9px] font-bold text-[#6f4632]">
          {data.lunar.replace("ขึ้น", "ออก")}
        </div>
      </div>

      {/* Row 3: Classifications */}
      <div className="flex border-b-[0.5px] border-neutral-200 items-stretch min-h-[22px]">
        <div className="w-[80px] border-r-[0.5px] border-neutral-200 bg-neutral-50 px-[6px] flex items-center text-[8px] font-bold uppercase text-neutral-400 tracking-tighter">
          ลักษณะวัน
        </div>
        <div className="flex-1 px-[6px] py-[2px] flex flex-wrap gap-2 items-center">
          {data.labels.length > 0 ? (
            data.labels.map((l, i) => (
              <span key={i} className="text-[8px] font-medium border-[0.5px] border-neutral-200 px-1.5 py-0 text-neutral-600 bg-neutral-50/50 uppercase tracking-tighter">
                {l}
              </span>
            ))
          ) : (
            <span className="text-[8px] text-neutral-200 italic">— ไม่มีข้อมูล —</span>
          )}
        </div>
      </div>

      {/* Row 4: Prophecies & Descriptions */}
      <div className="flex items-stretch min-h-[50px]">
        <div className="w-[80px] border-r-[0.5px] border-neutral-200 bg-neutral-50 px-[6px] flex items-center text-[8px] font-bold uppercase text-neutral-400 tracking-tighter">
          คำทำนาย
        </div>
        <div className="flex-1 px-[6px] py-[3px] space-y-1">
          {data.description.length > 0 ? (
            data.description.map((desc, i) => (
              <div key={i} className="text-[9px] leading-[1.15] text-neutral-700 flex gap-1.5 items-start">
                <span className="text-[#6f4632] font-bold text-[10px] leading-none mt-[1px]">·</span>
                <p className="flex-1 font-normal">{desc}</p>
              </div>
            ))
          ) : (
            <p className="text-[8px] text-neutral-200 italic">ไม่มีข้อมูลเพิ่มเติมสำหรับวันนี้</p>
          )}
        </div>
      </div>

      {/* THIN FOOTER BAR */}
      <div className="bg-[#6f4632] h-[18px] px-2 flex items-center justify-between text-[8px] text-white/30 font-medium uppercase tracking-[0.2em]">
        <span>ปั๊กขะทืนล้านนา 2.1c (ULTRA-FINE PRINT)</span>
        <span>CODE: {data.dateISO.replace(/-/g, '')}</span>
      </div>
    </div>
  );
}
