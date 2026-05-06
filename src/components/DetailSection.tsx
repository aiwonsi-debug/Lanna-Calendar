import { DayRecord } from "../types"

export default function DetailSection({ data }: { data: DayRecord }) {
  const isGood = data.score === 'good';
  const isBad = data.score === 'bad';

  return (
    <div className="bg-white border-t-[0.5px] border-neutral-400 font-medium">
      {/* SPREADSHEET STYLE COMPACT ROWS */}
      
      {/* Row 1: Header Info */}
      <div className="flex border-b-[0.5px] border-neutral-300 items-stretch h-[28px] bg-neutral-50/50">
        <div className="w-[80px] border-r-[0.5px] border-neutral-300 bg-neutral-100 px-2 flex items-center text-[9px] font-black uppercase text-neutral-500 tracking-tighter">
          สรุปวัน
        </div>
        <div className="flex-1 px-3 flex items-center gap-4">
          <span className="text-[12px] font-black text-neutral-800">วันที่ {data.day}</span>
          <span className="text-[9px] text-neutral-400 font-bold tracking-tight">{data.dateISO}</span>
        </div>
        <div className={`px-4 flex items-center text-[10px] font-black uppercase tracking-widest ${isGood ? 'bg-green-100 text-green-800' : isBad ? 'bg-red-100 text-red-800' : 'text-neutral-500'}`}>
          {isGood ? "วันมงคล" : isBad ? "วันหลีกเลี่ยง" : "วันปกติ"}
        </div>
      </div>

      {/* Row 2: Lunar Traditional */}
      <div className="flex border-b-[0.5px] border-neutral-300 items-stretch h-[28px]">
        <div className="w-[80px] border-r-[0.5px] border-neutral-300 bg-neutral-100 px-2 flex items-center text-[9px] font-black uppercase text-neutral-500 tracking-tighter">
          จันทรคติ
        </div>
        <div className="flex-1 px-3 flex items-center text-[11px] font-black text-[#6f4632]">
          {data.lunar.replace("ขึ้น", "ออก")}
        </div>
      </div>

      {/* Row 3: Labels / Almanac Categories */}
      <div className="flex border-b-[0.5px] border-neutral-300 items-stretch min-h-[30px]">
        <div className="w-[80px] border-r-[0.5px] border-neutral-300 bg-neutral-100 px-2 flex items-center text-[9px] font-black uppercase text-neutral-500 tracking-tighter">
          ลักษณะวัน
        </div>
        <div className="flex-1 px-3 py-1 flex flex-wrap gap-2 items-center">
          {data.labels.length > 0 ? (
            data.labels.map((l, i) => (
              <span key={i} className="text-[9px] font-black border-[0.5px] border-neutral-400 px-2 py-0.5 text-neutral-700 bg-neutral-50 uppercase tracking-tighter">
                {l}
              </span>
            ))
          ) : (
            <span className="text-[9px] text-neutral-300 italic">— ไม่มีป้ายกำกับ —</span>
          )}
        </div>
      </div>

      {/* Row 4: Detailed Description */}
      <div className="flex items-stretch min-h-[60px]">
        <div className="w-[80px] border-r-[0.5px] border-neutral-300 bg-neutral-100 px-2 flex items-center text-[9px] font-black uppercase text-neutral-500 tracking-tighter">
          คำทำนาย
        </div>
        <div className="flex-1 px-3 py-2 space-y-1.5">
          {data.description.length > 0 ? (
            data.description.map((desc, i) => (
              <div key={i} className="text-[10px] leading-snug text-neutral-800 flex gap-2 items-start">
                <span className="text-[#6f4632] font-black text-[12px] leading-none mt-[1px]">·</span>
                <p className="flex-1 font-medium">{desc}</p>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-neutral-300 italic">ไม่มีข้อมูลเพิ่มเติมสำหรับวันนี้</p>
          )}
        </div>
      </div>

      {/* FOOTER BAR */}
      <div className="bg-[#6f4632] h-[14px] px-2 flex items-center justify-between text-[8px] text-white/40 font-bold uppercase tracking-[0.3em]">
        <span>ปั๊กขะทืนล้านนา 2.1c (MASTER EDITION)</span>
        <span>ID: {data.dateISO.replace(/-/g, '')}</span>
      </div>
    </div>
  );
}
