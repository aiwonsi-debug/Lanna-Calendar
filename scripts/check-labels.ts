import { getLannaDate, LannaCalcResult } from "../src/utils/lannaCalc";
import { flagChips, monthChips, weekLabel, flagKalaYoks } from "../src/utils/dayLabels";

/**
 * ตรวจว่าป้ายที่ UI แสดง derive จากแฟล็กของ getLannaDate เท่านั้น
 * วิธีรัน: คอมไพล์ด้วย tsc แบบเดียวกับ scripts/compare-calc.ts แล้วรัน node
 * เกณฑ์: ชุดป้ายจาก dayLabels ต้องเท่ากับชุดที่ประกอบอิสระจากแฟล็กดิบในสคริปต์นี้
 * และวันที่ 22 ถึง 28 พ.ย. 2569 ต้องตรงค่าที่ตรวจยืนยันจากตัวคำนวณ
 */

// ประกอบชุดป้ายที่คาดหวังจากแฟล็กดิบโดยตรง (เขียนแยกจาก dayLabels เพื่อจับความเพี้ยน)
function expectedFromFlags(r: LannaCalcResult): string[] {
  const out: string[] = [];
  if (r.isSin) out.push('วันศีล');
  if (r.isSia) out.push('วันเสีย');
  if (r.isUbat) out.push('วันอุบาทว์');
  if (r.isLokawinat) out.push('วันโลกาวินาศ');
  if (r.isMai) out.push('วันไหม้');
  if (r.isWodwai) out.push('วันวอดวาย');
  if (r.isMahaMachu) out.push('วันมหามัจจุ');
  else if (r.isMachu) out.push('วันมัจจุ');
  if (r.isLomLuang) out.push('วันหล่มหลวง');
  if (r.isHuaRiangMon) out.push('หัวเรียงหมอน');
  if (r.isThongChai) out.push('วันธงชัย');
  if (r.isAthipadi) out.push('วันอธิบดี');
  for (const s of r.sitthiList) out.push(s);
  return out; // ไม่รวมป้ายเทศกาล (สงกรานต์/ยี่เป็ง) ซึ่งอยู่นอกฤดูตรวจนี้และส่งแยกเป็น festival
}

const sort = (a: string[]) => [...a].sort();
let failures = 0;
const fail = (msg: string) => { failures++; console.log('FAIL:', msg); };

// ค่าตายตัวที่ตรวจยืนยันแล้วจากตัวคำนวณ (เฉพาะป้ายแฟล็ก ไม่รวมเทศกาล)
const HARD: Record<number, string[]> = {
  22: ['หัวเรียงหมอน'],
  24: ['วันศีล', 'วันเสีย'],
  25: ['วันอุบาทว์', 'วันธงชัย'],
  26: ['วันหล่มหลวง'],
  27: ['วันไหม้'],
  28: ['หัวเรียงหมอน'], // บวกชื่อโชคจาก sitthiList ตรวจแยกด้านล่าง
};

for (let d = 22; d <= 28; d++) {
  const date = new Date(2026, 10, d);
  const r = getLannaDate(date);
  if (!r) { fail(`${d} พ.ย.: getLannaDate คืน null`); continue; }
  const uiSet = sort(flagChips(r, date).map(c => c.text).filter(t => !/ยี่เป็ง|สงกรานต์|ปี๋ใหม่/.test(t)));
  const expSet = sort(expectedFromFlags(r));
  if (JSON.stringify(uiSet) !== JSON.stringify(expSet)) {
    fail(`${d} พ.ย.: ป้าย UI ${JSON.stringify(uiSet)} ไม่เท่าแฟล็ก ${JSON.stringify(expSet)}`);
  }
  if (HARD[d]) {
    const hard = sort(HARD[d]);
    const missing = hard.filter(h => !uiSet.includes(h));
    if (missing.length) fail(`${d} พ.ย.: ขาดป้ายที่ยืนยันแล้ว ${missing.join(' ')} (มี ${JSON.stringify(uiSet)})`);
  }
  console.log(`${d} พ.ย. 2569: ป้าย = ${uiSet.join(' | ') || '(ไม่มี)'} ; weekLabel = ${weekLabel(r)?.text ?? '-'} ; กาลโยค = ${flagKalaYoks(r).map(k => k.name).join(' | ') || '-'}`);
}

// เงื่อนไขเฉพาะที่ผู้ใช้ชี้จากภาพจริง
const r25 = getLannaDate(new Date(2026, 10, 25))!;
const chips25 = flagChips(r25, new Date(2026, 10, 25)).map(c => c.text);
if (chips25.includes('วันเสีย')) fail('25 พ.ย.: มีป้าย วันเสีย เท็จ');
if (flagKalaYoks(r25).some(k => k.name.includes('โลกาวินาศ'))) fail('25 พ.ย.: กาลโยคมี โลกาวินาศ เท็จ');
if (!chips25.includes('วันอุบาทว์') || !chips25.includes('วันธงชัย')) fail('25 พ.ย.: ต้องมี วันอุบาทว์ และ วันธงชัย');
const r27 = getLannaDate(new Date(2026, 10, 27))!;
if (weekLabel(r27)?.text !== 'วันไหม้') fail('27 พ.ย.: ป้ายแถบสัปดาห์ต้องเป็น วันไหม้');
if (flagChips(r27, new Date(2026, 10, 27)).some(c => c.text === 'วันเสีย')) fail('27 พ.ย.: มีป้าย วันเสีย เท็จ');
const r28 = getLannaDate(new Date(2026, 10, 28))!;
if (r28.sitthiList.length === 0) fail('28 พ.ย.: sitthiList ต้องไม่ว่าง (สิทธิโชค)');
if (!monthChips(r28).some(c => c.text === 'วันดี')) fail('28 พ.ย.: ป้ายเดือนต้องมี วันดี จากชุดโชค');
if (!monthChips(r25).some(c => c.text === 'วันอุบาทว์')) fail('25 พ.ย.: ป้ายเดือนต้องมี วันอุบาทว์');
if (monthChips(r25).some(c => c.text === 'วันเสีย')) fail('25 พ.ย.: ป้ายเดือนมี วันเสีย เท็จ');

console.log(failures === 0 ? 'PASS: ป้ายทุกชุดตรงแฟล็กตัวคำนวณ' : `FAILED: ${failures} ข้อ`);
if (failures > 0) throw new Error(`check-labels: ${failures} ข้อไม่ผ่าน`);
