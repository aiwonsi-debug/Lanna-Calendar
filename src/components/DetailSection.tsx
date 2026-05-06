import { DayRecord } from "../types"

export default function DetailSection({ data }: { data: DayRecord }) {
  const isGood = data.score === 'good';
  const isBad = data.score === 'bad';
  
  const statusColor = isGood ? "text-green-600" : isBad ? "text-red-600" : "text-[#6B4231]";
  const statusBg = isGood ? "bg-green-50" : isBad ? "bg-red-50" : "bg-[#FDFCF9]";

  return (
    <div className={`p-6 sm:p-10 ${statusBg} transition-all duration-500 animate-in fade-in slide-in-from-bottom-4`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-[#6B4231]/10 pb-6 mb-8">
          <div>
            <span className={`text-sm font-bold uppercase tracking-[0.2em] mb-2 block ${statusColor}`}>
              {isGood ? "วันดีมงคล" : isBad ? "วันเสีย/ควรหลีกเลี่ยง" : "วันปกติ"}
            </span>
            <h3 className="text-4xl font-black text-[#2D1B08]">
              วันที่ {data.day}
            </h3>
            <p className="text-[#6B4231]/60 font-medium mt-1">
               {data.dateISO}
            </p>
          </div>
          <div className="text-right sm:text-right">
            <div className="text-xl font-bold text-[#6B4231]">
              {data.lunar}
            </div>
            <div className="flex gap-2 mt-2 justify-end">
              {data.labels.map((l, i) => (
                <span key={i} className="px-3 py-1 bg-[#6B4231] text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-black text-[#6B4231]/40 uppercase tracking-widest mb-3">คำทำนายและข้อควรปฏิบัติ</h4>
            <div className="text-lg sm:text-xl text-[#4D3024] leading-relaxed font-medium space-y-4">
              {data.description.length > 0 ? (
                data.description.map((d, i) => (
                  <p key={i} className="relative pl-6">
                    <span className="absolute left-0 top-3 w-2 h-2 bg-[#6B4231]/20 rounded-full"></span>
                    {d}
                  </p>
                ))
              ) : (
                <p className="italic text-[#6B4231]/30">ไม่มีรายละเอียดเพิ่มเติมสำหรับวันนี้</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}