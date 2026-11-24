// Dump ค่าจากตัวคำนวณ TypeScript (src/utils/lannaCalc.ts) เป็น JSON ทาง stdout
// ใช้เทียบกับตัวคำนวณ Python ในสคริปต์ calc/compare_ts_python.py
import { getLannaDate } from "../src/utils/lannaCalc";

function dumpFor(d: Date) {
  const r = getLannaDate(d);
  if (!r) return null;
  return {
    gregorian: r.dateISO,
    lanna_year: r.lannaYear.zodiacLanna,
    chulasakarat: r.cs,
    lanna_month: r.lannaMonth,
    lanna_month_name: r.lannaMonthName,
    phase: r.phase,
    kham: r.lunarDay,
    tithi: r.tithi,
    is_wan_phra: r.isSin,
    wan_thai: r.wanThai,
    kao_kong: r.kaoKong.replace(/^วัน/, ""),
    fah_tee_sang: r.fahTeeSang,
    panja_dithi: r.panjaDithi,
    is_wan_sia: r.isSia,
    is_mai: r.isMai,
    is_wodwai: r.isWodwai,
    is_machu: r.isMachu,
    is_hua_riang_mon: r.isHuaRiangMon,
    sitthi: [...r.sitthiList].sort(),
  };
}

const out: unknown[] = [];
// ปี 2569 (ค.ศ. 2026) ครบ 365 วัน
for (let t = Date.UTC(2026, 0, 1); t < Date.UTC(2027, 0, 1); t += 86400000) {
  const d = new Date(t);
  out.push(dumpFor(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())));
}
// ตัวอย่างปีอื่น: เริ่ม 1 ม.ค. ขยับทีละ 12 วัน จำนวน 30 วันต่อปี
for (const y of [2025, 2027, 2030]) {
  for (let i = 0; i < 30; i++) {
    const base = new Date(y, 0, 1);
    base.setDate(base.getDate() + i * 12);
    out.push(dumpFor(base));
  }
}
console.log(JSON.stringify(out));
