import { getLannaDate, getSongkranLabel } from "../src/utils/lannaCalc";

function show(y: number, m: number, d: number) {
  const date = new Date(y, m, d);
  const r = getLannaDate(date);
  console.log(JSON.stringify({
    date: `${y}-${m + 1}-${d}`,
    phase: r?.phase, kham: r?.lunarDay, monthName: r?.lannaMonthName,
    wanThai: r?.wanThai, kaoKong: r?.kaoKong, fah: r?.fahTeeSang,
    dithi: r?.panjaDithi, isSin: r?.isSin, isSia: r?.isSia,
    sitthi: r?.sitthiList, isMai: r?.isMai, isWodwai: r?.isWodwai,
    isMachu: r?.isMachu, isHuaRiangMon: r?.isHuaRiangMon,
    isThongChai: r?.isThongChai, isAthipadi: r?.isAthipadi,
    songkran: getSongkranLabel(date),
  }));
}
show(2026, 10, 25);
show(2026, 10, 24);
