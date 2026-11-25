import { getSongkranLabel, LannaCalcResult } from './lannaCalc';

export type ChipKind = 'sin' | 'bad' | 'good' | 'neutral';
export interface DayChip { text: string; kind: ChipKind }

/**
 * ป้ายของวัน ประกอบจากแฟล็กของ getLannaDate เท่านั้น
 * ห้ามสร้างป้ายจากการสแกนข้อความคำอธิบายเด็ดขาด (เคยเกิดป้ายเท็จ เช่น
 * เก้ากอง "วันไสเสีย" ทำให้เกิดป้าย วันเสีย ทั้งที่ isSia=false)
 * ลำดับคงที่: วันศีล, วันเสีย, วันร้ายอื่น, หัวเรียงหมอน, วันธงชัย, วันอธิบดี, โชค, เทศกาล
 */
export function flagChips(r: LannaCalcResult, date: Date): DayChip[] {
  const chips: DayChip[] = [];
  if (r.isSin) chips.push({ text: 'วันศีล', kind: 'sin' });
  if (r.isSia) chips.push({ text: 'วันเสีย', kind: 'bad' });
  if (r.isUbat) chips.push({ text: 'วันอุบาทว์', kind: 'bad' });
  if (r.isLokawinat) chips.push({ text: 'วันโลกาวินาศ', kind: 'bad' });
  if (r.isMai) chips.push({ text: 'วันไหม้', kind: 'bad' });
  if (r.isWodwai) chips.push({ text: 'วันวอดวาย', kind: 'bad' });
  if (r.isMahaMachu) chips.push({ text: 'วันมหามัจจุ', kind: 'bad' });
  else if (r.isMachu) chips.push({ text: 'วันมัจจุ', kind: 'bad' });
  if (r.isLomLuang) chips.push({ text: 'วันหล่มหลวง', kind: 'bad' });
  if (r.isHuaRiangMon) chips.push({ text: 'หัวเรียงหมอน', kind: 'neutral' });
  if (r.isThongChai) chips.push({ text: 'วันธงชัย', kind: 'good' });
  if (r.isAthipadi) chips.push({ text: 'วันอธิบดี', kind: 'good' });
  for (const s of r.sitthiList) chips.push({ text: s, kind: 'good' });
  const song = getSongkranLabel(date);
  if (song) chips.push({ text: song, kind: 'neutral' });
  return chips;
}

/** ป้ายสำหรับมุมมองเดือน: วันศีล วันเสีย วันดี เป็นหลัก ใช้คำเต็ม ป้ายละบรรทัด ยึดแฟล็กเท่านั้น */
export function monthChips(r: LannaCalcResult): DayChip[] {
  const chips: DayChip[] = [];
  if (r.isSin) chips.push({ text: 'วันศีล', kind: 'sin' });
  if (r.isSia) chips.push({ text: 'วันเสีย', kind: 'bad' });
  if (r.isUbat) chips.push({ text: 'วันอุบาทว์', kind: 'bad' });
  if (r.isLokawinat) chips.push({ text: 'วันโลกาวินาศ', kind: 'bad' });
  if (r.isMai) chips.push({ text: 'วันไหม้', kind: 'bad' });
  if (r.isWodwai) chips.push({ text: 'วันวอดวาย', kind: 'bad' });
  if (r.isMahaMachu) chips.push({ text: 'วันมหามัจจุ', kind: 'bad' });
  else if (r.isMachu) chips.push({ text: 'วันมัจจุ', kind: 'bad' });
  if (r.isLomLuang) chips.push({ text: 'วันหล่มหลวง', kind: 'bad' });
  if (r.isHuaRiangMon) chips.push({ text: 'หัวเรียงหมอน', kind: 'neutral' });
  if (r.sitthiList.length > 0) chips.push({ text: 'วันดี', kind: 'good' });
  return chips;
}

/** ป้ายสั้นป้ายเดียวใต้เลขวันในแถบสัปดาห์ ยึดแฟล็กเท่านั้น (วันเสียเฉพาะ isSia, วันไหม้เฉพาะ isMai) */
export function weekLabel(r: LannaCalcResult): { text: string; kind: ChipKind } | null {
  if (r.isSia) return { text: 'วันเสีย', kind: 'bad' };
  if (r.isMai) return { text: 'วันไหม้', kind: 'bad' };
  if (r.isSin) return { text: 'วันศีล', kind: 'sin' };
  if (r.sitthiList.length > 0) return { text: 'วันดี', kind: 'good' };
  return null;
}

/** เกณฑ์กาลโยคสำหรับรายละเอียดวัน ยึดแฟล็กชุดเดียวกัน (ธงชัย อธิบดี อุบาทว์ โลกาวินาศ) */
export interface KalaYokEntry { name: string; meaning: string; isGood: boolean }
export function flagKalaYoks(r: LannaCalcResult): KalaYokEntry[] {
  const out: KalaYokEntry[] = [];
  // คำอธิบายใช้ข้อความตามตำราวัดธาตุคำตรงตัว (ผู้ใช้สั่ง 25 พ.ย. 2569)
  if (r.isThongChai) out.push({ name: 'วันธงชัย', meaning: 'วันธงชัยเป็นวันที่ดี เมื่อประกอบกับวันดีอื่นๆ เปรียบเหมือนผู้นำกองทัพ มีธงแห่งชัยชนะเป็นเครื่องหมาย ทำให้วันอื่นๆ ดีที่สุด', isGood: true });
  if (r.isAthipadi) out.push({ name: 'วันอธิบดี', meaning: 'วันอธิบดีเป็นวันเดชานุภาพด้วยความเป็นใหญ่สามารถช่วยปกป้องคุ้มภัยอันตรายสิ่งร้ายๆ ทั้งปวง', isGood: true });
  if (r.isUbat) out.push({ name: 'วันอุบาทว์', meaning: 'วันอุบาทว์เป็นวันที่จะนำมาซึ่งอุปัทวเหตุเพศภัย สิ่งร้ายๆ ทั้งปวงจะเกิดขึ้น', isGood: false });
  if (r.isLokawinat) out.push({ name: 'วันโลกาวินาศ', meaning: 'วันโลกาวินาศ เป็นวันที่ไม่ดีจะทำอะไรก็ไม่เจริญ ไม่ก้าวหน้า', isGood: false });
  return out;
}
