import React, { useMemo, useRef, useState } from 'react';
import {
  getLannaDate,
  getDirections,
  getSongkranLabel,
  getDailyRituals,
  LannaCalcResult,
} from '../utils/lannaCalc';
import { monthChips, flagKalaYoks } from '../utils/dayLabels';
import './dispatch.css';

/* ============================================================
   ดีไซน์ใหม่แนว Dispatch (สาขา dispatch-design เท่านั้น)
   - ข้อมูลทุกอย่างมาจาก getLannaDate และโมดูล dayLabels ชุดเดียวกับแอพหลัก
   - ป้ายและคำอธิบายยึดแฟล็กตัวคำนวณและข้อความตำราเท่านั้น
     ห้ามแต่งคำสรุปประจำวันขึ้นเอง (ผู้ใช้สั่งตัดคำสรุปแต่งเองออก)
   - พจนานุกรมคำอธิบายดิถี/สิทธิโชคด้านล่างเป็นข้อความชุดเดียวกับ
     buildDescription ใน App.tsx ของแอพหลัก
   ============================================================ */

const toArabicDigits = (value: string | number) =>
  value
    .toString()
    .replace(/[๐-๙]/g, (char) => String('๐๑๒๓๔๕๖๗๘๙'.indexOf(char)));

const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
const THAI_DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

const sameDay = (a: Date, b: Date) =>
  a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const DITHI_DESC: Record<string, string> = {
  'นันทาดิถี': 'ควรสร้างบ้านเรือนวิหาร ศาลา ขุดสระน้ำ หล่อพระพุทธรูปสร้างพระธาตุ ออกเดินทางไปค้าขายยกยอมหาเถระสังฆราช ราชาภิเษกพระมหากษัตริย์ ตัดช่อและตุงไชยดีมาก',
  'ภัทราดิถี': 'คนส่งศุภสารการทูตส่งบ่าวสาวแต่งงาน ดำหัว ล้างทำความสะอาดเครื่องประดับ ย้ายที่อยู่ แกะสลักเขียนภาพ ตัดไม้ทำเรือนเข้าอยู่บ้าน ตั้งชื่อยศนามศักดิ์ ดีมาก',
  'ภัททราดิถี': 'คนส่งศุภสารการทูตส่งบ่าวสาวแต่งงาน ดำหัว ล้างทำความสะอาดเครื่องประดับ ย้ายที่อยู่ แกะสลักเขียนภาพ ตัดไม้ทำเรือนเข้าอยู่บ้าน ตั้งชื่อยศนามศักดิ์ ดีมาก',
  'ไชยาดิถี': 'ควรเริ่มสร้างอาวุธยกทัพ เจรจาความเมือง เลี้ยงหมู่ทหาร เรียนศิลปศาสตร์วิชาคุณก่อสร้างเมืองใหม่ ทำความสะอาดอาวุธ ทำรั้ว',
  'ปุณณาดิถี': 'ควรนำเข้าใหม่ขึ้นสู่ยุ้งฉาง นำคนใช้มาอยู่บ้าน พระสงฆ์เริ่มเรียนพระธรรมคัมภีร์ต่าง ๆ สร้างเวียงวัง เพิ่มนาม แต่งตั้งอำมาตย์ข้าราชการ เริ่มเรียนเวทมนต์คาถา',
  'ริตตาดิถี': 'ควรสร้างสวนทำไร่นา ปลูกต้นไม้ สร้างถนนหนทาง ทำแก้วแหวนมิ่งมงคล ตัดเสื้อผ้าทำขวัญสู่ขวัญตัดผมเข้าเฝ้าเจ้านาย',
  'ริทธาดิถี': 'ควรสร้างสวนทำไร่นา ปลูกต้นไม้ สร้างถนนหนทาง ทำแก้วแหวนมิ่งมงคล ตัดเสื้อผ้าทำขวัญสู่ขวัญตัดผมเข้าเฝ้าเจ้านาย',
};

const SITTHI_DESC: Record<string, string> = {
  'อมฤตโชค': 'ให้ผลดีมหาศาล มีความอุดมสมบูรณ์ และอายุยืนยาว เหมาะสำหรับงานมงคลทุกชนิด โดยเฉพาะการทำพิธีเพื่อความยั่งยืน',
  'อมริสสโชค': 'ให้ผลดีมหาศาล มีความอุดมสมบูรณ์ และอายุยืนยาว เหมาะสำหรับงานมงคลทุกชนิด โดยเฉพาะการทำพิธีเพื่อความยั่งยืน',
  'มหาสิทธิโชค': 'ให้ผลดีมหาศาล เหมาะสำหรับงานมงคลทุกประการ การเริ่มต้นใหม่ การเปิดกิจการ หรือการทำพิธีใหญ่',
  'สิทธิโชค': 'ให้ผลสำเร็จสมปรารถนา เหมาะสำหรับงานมงคลทั่วไป การติดต่อเจรจา และการทำงานที่ต้องการความราบรื่น',
  'ชัยโชค': 'ให้ผลทางชัยชนะ การแข่งขัน การเอาชนะอุปสรรค เหมาะสำหรับงานที่ต้องใช้ความกล้าหาญหรือการชิงชัย',
  'ไชยโชค': 'ให้ผลทางชัยชนะ การแข่งขัน การเอาชนะอุปสรรค เหมาะสำหรับงานที่ต้องใช้ความกล้าหาญหรือการชิงชัย',
  'ราชาโชค': 'ให้ผลทางบารมี เกียรติยศ การได้รับการอุปถัมภ์จากผู้ใหญ่ เหมาะสำหรับงานที่เกี่ยวกับยศถาบรรดาศักดิ์',
};

function fahMeaning(fah: number): string {
  if ([2, 4, 5, 6].includes(fah)) return 'ทำการสิ่งใดจักได้ดี อยู่ดีมีสุข พรั่งพร้อมด้วยยศสมบัติ';
  if (fah === 3 || fah === 7) return 'ระวัง ไฟจักไหม้หรือประสบอุบัติเหตุ เสียทรัพย์สิน';
  return 'ไม่เป็นมงคล อย่าทำพิธีหรือกิจกรรมสำคัญ';
}

/* ตำแหน่งเครื่องหมายบนมาตรวัด 3 ขั้น ยึดแฟล็กของวันเท่านั้น:
   isSia อยู่ขั้นวันเสีย, มีชุดสิทธิโชคและไม่ใช่วันเสียอยู่ขั้นวันดี, นอกนั้นขั้นวันปกติ */
function gaugeLeft(r: LannaCalcResult): string {
  if (r.isSia) return '10%';
  if (r.sitthiList.length > 0) return '90%';
  return '50%';
}

const UBAKONG_GRID = [
  [4, 0, -1, 0, 1],
  [1, 4, 0, -1, 0],
  [0, 1, 4, 0, -1],
  [-1, 0, 1, 4, 0],
  [0, -1, 0, 1, 4],
  [4, 0, -1, 0, 1],
  [1, 4, 0, -1, 0],
];
const UBAKONG_LABELS = ['เช้า', 'สาย', 'เที่ยง', 'บ่าย', 'เย็น'];

const ritualIsBad = (description: string) =>
  ['ไม่', 'ห้าม', 'เสีย', 'ภัย', 'ศัตรู', 'ฉิบหาย', 'ทุกข์', 'ตาย'].some((t) => description.includes(t));

/* สีป้ายในตารางเดือนใช้ชุดสีเข้มเฉพาะ (ตัวแปร -strong ใน dispatch.css)
   คอนทราสต์ต่อพื้นครีม #faf6ec ไม่ต่ำกว่า 6.6:1 ทุกสี เกินเกณฑ์ 4.5:1 */
const chipColor = (kind: string) =>
  kind === 'sin'
    ? 'var(--dp-sin-strong)'
    : kind === 'bad'
      ? 'var(--dp-bad-strong)'
      : kind === 'good'
        ? 'var(--dp-good-strong)'
        : 'var(--dp-neutral-strong)';

export default function DispatchApp() {
  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const paperRef = useRef<HTMLDivElement>(null);

  const info = useMemo(() => getLannaDate(selectedDate), [selectedDate]);
  const kalaYoks = useMemo(() => (info ? flagKalaYoks(info) : []), [info]);
  /* ป้ายประจำวันจากแฟล็กจริง (ลำดับเดียวกับ flagChips ใน dayLabels)
     ข้อความความหมายที่มีที่มา: หัวเรียงหมอน (ตำราบทที่ 14 หน้า 33) และ
     ไหม้/วอดวาย/มัจจุ (คำอธิบายท้ายปฏิทินล้านนา 2569 ฉบับ มช. ตามไฟล์ข้อมูลต้นทาง
     src/input/lanna-2569.ts บรรทัด 1666 ถึง 1668) ส่วนวันมหามัจจุ
     ไม่มีที่มาในตำราและปฏิทิน มช. จึงไม่แสดงป้ายนี้ แสดงเป็นวันมัจจุแทน (ดูด้านล่าง)
     กาลโยค 4 ตัว (ธงชัย อธิบดี อุบาทว์ โลกาวินาศ) แสดงเป็นข้อความตำราแยกแล้วจึงไม่รวมที่นี่ */
  const flagLabels = useMemo(() => {
    if (!info) return [] as { text: string; kind: string; desc?: string }[];
    const out: { text: string; kind: string; desc?: string }[] = [];
    if (info.isMai)
      out.push({ text: 'วันไหม้', kind: 'bad', desc: 'เป็นวันแห่งความหายนะ ไม่เหมาะกับงานมงคลใดๆ' });
    if (info.isWodwai)
      out.push({ text: 'วันวอดวาย', kind: 'bad', desc: 'เป็นวันแห่งความหายนะ ไม่เหมาะกับงานมงคลใดๆ' });
    /* วันมหามัจจุไม่แสดงในสาขานี้ตามคำสั่งผู้ใช้: ไม่มีที่มาในตำราวัดธาตุคำและ
       ปฏิทิน มช. มีเพียง "มัจจุ" วันเข้าเงื่อนไขเดิม (แรม 14 ค่ำตรงอังคารหรือเสาร์)
       จึงแสดงเป็นวันมัจจุพร้อมคำอธิบายของ มช. แทน (แฟล็กในผลคำนวณคงเดิม) */
    if (info.isMahaMachu || info.isMachu)
      out.push({ text: 'วันมัจจุ', kind: 'bad', desc: 'เป็นวันแห่งความตาย ไม่เหมาะกับงานมงคลใดๆ' });
    /* วันหล่มหลวงไม่แสดงในสาขานี้ตามคำสั่งผู้ใช้: เป็นป้ายสืบทอดจากแอพเดิม
       ไม่มีที่มาในตำราวัดธาตุคำและไม่มีในตารางรายวันของ มช. (แฟล็ก isLomLuang
       ในผลคำนวณคงอยู่ตามเดิม ไม่แตะตัวคำนวณ) */
    /* หัวเรียงหมอนมีข้อความความหมายในตำราวัดธาตุคำ บทที่ 14 หน้า 33 ใช้ข้อความเดิมตรงตัว:
       "แต่งงานสมรสดีนักแล" และ "ต้องเลือกให้ได้ในวันหัวเรียงหมอน จึงจะอยู่ด้วยกันยืนยาวนานและราบรื่น" */
    if (info.isHuaRiangMon)
      out.push({
        text: 'หัวเรียงหมอน',
        kind: 'neutral',
        desc: 'แต่งงานสมรสดีนักแล ต้องเลือกให้ได้ในวันหัวเรียงหมอน จึงจะอยู่ด้วยกันยืนยาวนานและราบรื่น',
      });
    return out;
  }, [info]);
  const directions = useMemo(() => getDirections(selectedDate.getDay()), [selectedDate]);
  const rituals = useMemo(() => getDailyRituals(selectedDate.getDay()), [selectedDate]);

  const monthCells = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const firstDow = new Date(y, m, 1).getDay();
    const cells: ({ date: Date; info: LannaCalcResult | null } | null)[] = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(y, m, d);
      cells.push({ date, info: getLannaDate(date) });
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [selectedDate]);

  const stepMonth = (n: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + n, 1));
  };

  const selectDay = (date: Date) => {
    setSelectedDate(date);
    requestAnimationFrame(() => {
      paperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const isToday = sameDay(selectedDate, today);
  const monthTitle = `${THAI_MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
  const headerYear = info
    ? toArabicDigits(`ปี${info.lannaYear.zodiacLanna} (ปี${info.lannaYear.zodiacThai}) จ.ศ. ${info.cs}`)
    : '';
  const dateLine = toArabicDigits(
    `${isToday ? 'วันนี้ · ' : ''}วัน${THAI_DAYS[selectedDate.getDay()]}ที่ ${selectedDate.getDate()} ${THAI_MONTHS[selectedDate.getMonth()]} พ.ศ. ${selectedDate.getFullYear() + 543}`,
  );

  /* คำทำนาย: ข้อความต้นทางจากตัวคำนวณมี ":" คั่นหัวข้อกับคำทำนาย (แก้ที่ต้นทางไม่ได้)
     จึงแยกที่ตัวคั่นแรกตอนแสดงผล: หัวข้อเป็นตัวหนา คำทำนายน้ำหนักปกติ ไม่มี ":"
     และตัดวงเล็บออกจากหัวข้อตอนแสดงผลตามคำสั่งผู้ใช้ (ข้อมูลต้นทางคงเดิม) */
  const fortuneLines = useMemo(() => {
    if (!info) return [] as { head: string; rest: string }[];
    const out: { head: string; rest: string }[] = [];
    const splitHead = (text: string) => {
      const i = text.indexOf(':');
      if (i < 0) return { head: text.replace(/[()]/g, ''), rest: '' };
      return { head: text.slice(0, i).replace(/[()]/g, ''), rest: text.slice(i + 1).trimStart() };
    };
    if (info.wanMuai) out.push(splitHead(`วัน${info.wanMuai}`));
    if (info.wanPhiKin) out.push(splitHead(info.wanPhiKin));
    return out;
  }, [info]);

  return (
    <div className="dp-root">
      <div className="dp-paper" ref={paperRef}>
        {/* แถบหัวข้อเดือน: บรรทัดปีล้านนา/จ.ศ. มีที่เดียวในหน้านี้ */}
        <div className="dp-monthbar">
          <button className="dp-monthbar-btn" onClick={() => stepMonth(-1)} aria-label="เดือนก่อนหน้า">&lt;</button>
          <div className="dp-monthbar-center">
            <div className="dp-monthbar-title">{toArabicDigits(monthTitle)}</div>
            <div className="dp-monthbar-year">{headerYear}</div>
          </div>
          <button className="dp-monthbar-btn" onClick={() => stepMonth(1)} aria-label="เดือนถัดไป">&gt;</button>
        </div>

        <div className="dp-rule-thick" />

        {info && (
          <>
            <div className="dp-dateline">{dateLine}</div>
            <div className="dp-lunarline">
              <span style={{ whiteSpace: 'nowrap' }}>{toArabicDigits(`${info.phase} ${info.lunarDay} ค่ำ`)}</span>{' '}
              <span style={{ whiteSpace: 'nowrap' }}>{toArabicDigits(`เดือน${info.lannaMonthName}${info.isSin ? ' วันศีล' : ''}`)}</span>
            </div>

            {/* มาตรวัด 3 ขั้น */}
            <div className="dp-gauge" aria-label="มาตรวัดวันเสีย วันปกติ วันดี">
              <div className="dp-gauge-labels">
                <span style={{ color: 'var(--dp-bad)' }}>วันเสีย</span>
                <span>วันปกติ</span>
                <span style={{ color: 'var(--dp-good)' }}>วันดี</span>
              </div>
              <div className="dp-gauge-track">
                <div className="dp-gauge-marker" style={{ left: gaugeLeft(info) }} />
              </div>
            </div>

            {/* ข้อห้ามและกิจวัตรอยู่ก่อนข้อมูลยาว: ผู้ใช้ส่วนใหญ่อยากรู้ก่อนว่าวันนี้ทำอะไรได้/ไม่ได้ */}
            <div className="dp-rule" />
            <div className="dp-section-label">ข้อห้ามและกิจวัตรประจำวัน</div>
            <div className="dp-rituals">
              {rituals.map((r, i) => (
                <div key={i} className="dp-ritual-row">
                  <span>{toArabicDigits(r.title)}</span>
                  <b style={{ color: ritualIsBad(r.description) ? 'var(--dp-bad)' : 'var(--dp-good)' }}>
                    {toArabicDigits(r.description)}
                  </b>
                </div>
              ))}
            </div>

            <div className="dp-rule" />
            <div className="dp-section-label">ข้อมูลประจำวัน</div>
            <div className="dp-topics">
              {/* สีประจำหัวข้อใส่ที่ตัวบล็อกทั้งก้อน: ชื่อหัวข้อและเนื้อหาทั้งรายการเป็นสีเดียวกัน
                  (เดิมใส่เฉพาะแท็ก b ทำให้เนื้อหาเป็นสีดำ ไม่ตรงหัวข้อ) */}
              <div style={{ color: '#1d4ed8' }}>
                <b>วันไท</b>{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{toArabicDigits(`วัน${info.wanThai}`)}</span>
                {info.wanThaiDesc && info.wanThaiDesc !== '-' ? <> {toArabicDigits(info.wanThaiDesc)}</> : null}
              </div>
              <div style={{ color: '#7e22ce' }}>
                <b>เก้ากอง</b>{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{toArabicDigits(info.kaoKong)}</span>
                {info.kaoKongDesc && info.kaoKongDesc !== '-' ? <> {toArabicDigits(info.kaoKongDesc)}</> : null}
              </div>
              <div style={{ color: '#0f766e' }}>
                <b>ดิถี</b>{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{toArabicDigits(info.panjaDithi)}</span>
                {DITHI_DESC[info.panjaDithi] ? <> {DITHI_DESC[info.panjaDithi]}</> : null}
              </div>
              <div style={{ color: '#8a5a00' }}>
                <b>ฟ้าตีแส่ง</b>{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{toArabicDigits(`เศษ ${info.fahTeeSang}`)}</span>{' '}
                {fahMeaning(info.fahTeeSang)}
              </div>
            </div>

            <div className="dp-rule" />
            <div className="dp-section-label">โชคและฤกษ์</div>
            {kalaYoks.length > 0 && (
              <div className="dp-kalayok">
                {kalaYoks.map((ky, i) => (
                  /* ทั้งรายการใช้สีเดียวกับหัวข้อ: ธงชัย/อธิบดี เขียวเข้ม อุบาทว์/โลกาวินาศ แดงเข้ม (ชุด -strong คอนทราสต์ผ่านบนพื้นครีม) */
                  <p key={i} style={{ color: ky.isGood ? 'var(--dp-good-strong)' : 'var(--dp-bad-strong)' }}>
                    <b>{toArabicDigits(ky.name)}</b>{' '}
                    {toArabicDigits(ky.meaning)}
                  </p>
                ))}
              </div>
            )}
            {/* ป้ายประจำวันอื่นตามแฟล็กจริง: ป้ายที่มีข้อความความหมายที่มีที่มาแสดงชื่อตัวหนาตามด้วยข้อความนั้น
                (หัวเรียงหมอนจากตำราบทที่ 14 หน้า 33, ไหม้/วอดวาย/มัจจุจากคำอธิบายท้ายปฏิทินล้านนา 2569 ฉบับ มช.)
                ทุกป้ายในชุดนี้มีข้อความความหมายที่มีที่มา (วันมหามัจจุไม่แสดงตามคำสั่งผู้ใช้ แสดงเป็นวันมัจจุแทน)
                (อุบาทว์/โลกาวินาศ/ธงชัย/อธิบดี มีข้อความกาลโยคด้านบนแล้ว ไม่แสดงซ้ำ) */}
            {flagLabels.map((f) => (
              <div key={f.text} className="dp-flaglabel" style={{ color: chipColor(f.kind) }}>
                <b>{toArabicDigits(f.text)}</b>
                {f.desc && <span style={{ fontWeight: 400 }}> {toArabicDigits(f.desc)}</span>}
              </div>
            ))}
            {info.sitthiList.map((s) =>
              SITTHI_DESC[s] ? (
                /* ป้ายสิทธิโชคทุกชื่อ: ชื่อป้ายตัวหนา ไม่มีเครื่องหมาย ":" คั่น ตามด้วยคำอธิบายเดิม (คำสั่งผู้ใช้) */
                <div key={s} className="dp-chok">
                  <b>{toArabicDigits(`วัน${s}`)}</b> {toArabicDigits(SITTHI_DESC[s])}
                </div>
              ) : null,
            )}
            <div className="dp-dirboxes">
              {/* หัวข้อและเนื้อหาในกล่องใช้สีเดียวกันทั้งกล่อง: ทิศศรีเขียวเข้ม กาลกิณีแดงเข้ม */}
              <div className="dp-dirbox" style={{ color: 'var(--dp-good-strong)' }}>
                ทิศศรี (มงคล)<br />
                <b>{toArabicDigits(directions.sri)}</b>
              </div>
              <div className="dp-dirbox" style={{ color: 'var(--dp-bad-strong)' }}>
                กาลกิณี (ห้าม)<br />
                <b>{toArabicDigits(directions.ka)}</b>
              </div>
            </div>

            <div className="dp-section-label" style={{ marginTop: 16 }}>ฤกษ์เดินทาง · อุบากอง</div>
            <div className="dp-ubakong">
              {UBAKONG_LABELS.map((label, i) => {
                const score = UBAKONG_GRID[selectedDate.getDay()][i];
                const cls = score === 4 ? 'good' : score === 1 || score === -1 ? 'bad' : 'normal';
                const sym = score === 4 ? '••••' : score === 1 ? '•' : score === -1 ? '×' : '๐';
                const color = score === 4 ? 'var(--dp-good)' : score === 1 || score === -1 ? 'var(--dp-bad)' : 'var(--dp-muted)';
                return (
                  <div key={i} className={`dp-ubakong-cell ${cls}`}>
                    {label}
                    <br />
                    <span className="dp-ubakong-sym" style={{ color }}>{sym}</span>
                  </div>
                );
              })}
            </div>
            <div className="dp-ubakong-legend">
              <span>•••• = ดีมาก</span>
              <span>• = ดี/รีบไป</span>
              <span>๐ = ปกติ</span>
              <span>× = ห้ามไป</span>
            </div>

            {fortuneLines.length > 0 && (
              <>
                <div className="dp-rule" />
                <div className="dp-section-label">คำทำนาย</div>
                <div className="dp-fortune">
                  {fortuneLines.map((line, i) => (
                    <p key={i}>
                      <b>{toArabicDigits(line.head)}</b>
                      {line.rest ? <> {toArabicDigits(line.rest)}</> : null}
                    </p>
                  ))}
                </div>
              </>
            )}

            <div className="dp-rule" />
            {/* หัวข้อตารางเดือน: ช่องซ้ายเป็นปุ่มกลับวันนี้ (แสดงเฉพาะเมื่อวันที่เลือกไม่ใช่วันนี้)
                ลูกศรเลื่อนเดือนขนาบชื่อเดือนตามคำสั่งผู้ใช้ เรียก stepMonth ตัวเดียวกับแถบด้านบน */}
            <div className="dp-gridbar">
              {isToday ? (
                <span aria-hidden="true" />
              ) : (
                <button className="dp-today-btn" onClick={() => selectDay(today)}>วันนี้</button>
              )}
              <button className="dp-gridbar-btn" onClick={() => stepMonth(-1)} aria-label="เดือนก่อนหน้า">&lt;</button>
              <div className="dp-gridbar-title">{toArabicDigits(monthTitle)}</div>
              <button className="dp-gridbar-btn" onClick={() => stepMonth(1)} aria-label="เดือนถัดไป">&gt;</button>
            </div>
            <div className="dp-monthgrid">
              {THAI_DAYS_SHORT.map((label, i) => (
                <div key={i} className="dp-monthgrid-head">{label}</div>
              ))}
              {monthCells.map((cell, idx) => {
                if (!cell || !cell.info) return <div key={idx} className="dp-cell-empty" />;
                const { date, info: ci } = cell;
                const cellToday = sameDay(date, today);
                const cellSelected = sameDay(date, selectedDate);
                /* monthChips เป็นฟังก์ชันร่วมกับแอพหลัก ห้ามแก้ที่ต้นทาง:
                   สาขานี้ไม่แสดงป้ายวันหล่มหลวงและวันมหามัจจุตามคำสั่งผู้ใช้ จึงส่งผลคำนวณที่
                   ปิดแฟล็ก isLomLuang และแปลง isMahaMachu เป็น isMachu (แสดงเป็นวันมัจจุ)
                   เฉพาะตอนขอป้ายตารางเดือนของสาขานี้ (ตัวคำนวณและแอพหลักไม่เปลี่ยน) */
                const chips = monthChips({
                  ...ci,
                  isLomLuang: false,
                  isMachu: ci.isMachu || ci.isMahaMachu,
                  isMahaMachu: false,
                });
                const festival = getSongkranLabel(date);
                return (
                  <button
                    key={idx}
                    className={`dp-cell${cellSelected ? ' selected' : ''}`}
                    onClick={() => selectDay(date)}
                    aria-label={toArabicDigits(`วันที่ ${date.getDate()}`)}
                  >
                    <span className={`dp-cell-num${cellToday ? ' today' : ''}`}>
                      {toArabicDigits(date.getDate())}
                    </span>
                    {chips.map((c, i) => (
                      <span key={i} className="dp-cell-label" style={{ color: chipColor(c.kind) }}>
                        {c.text}
                      </span>
                    ))}
                    {festival && (
                      <span className="dp-cell-label" style={{ color: 'var(--dp-neutral-strong)' }}>
                        {festival}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="dp-rule-thick" />
            <div className="dp-colophon">
              ข้อมูลคำนวณจากสูตรปฏิทินล้านนา<br />
              ฉบับวัดธาตุคำและมหาวิทยาลัยเชียงใหม่
            </div>
          </>
        )}
      </div>

      <div className="dp-footnote">ปฏิทินล้านนา · ดีไซน์ใหม่แนว Dispatch (สาขาทดลอง)</div>
    </div>
  );
}
