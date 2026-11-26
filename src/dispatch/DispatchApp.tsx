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

const chipColor = (kind: string) =>
  kind === 'sin'
    ? 'var(--dp-sin)'
    : kind === 'bad'
      ? 'var(--dp-bad)'
      : kind === 'good'
        ? 'var(--dp-good)'
        : 'var(--dp-neutral)';

export default function DispatchApp() {
  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const paperRef = useRef<HTMLDivElement>(null);

  const info = useMemo(() => getLannaDate(selectedDate), [selectedDate]);
  const kalaYoks = useMemo(() => (info ? flagKalaYoks(info) : []), [info]);
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

  /* ย่อหน้าคำอธิบายประจำวัน: ข้อความตำราของกาลโยคประจำวันเรียงต่อกันตรงตัว
     ถ้าวันนั้นไม่มีกาลโยค ใช้คำอธิบายสิทธิโชคจากพจนานุกรมเดิมแทน ไม่มีคือไม่แสดง */
  const dayParagraph = useMemo(() => {
    if (!info) return '';
    if (kalaYoks.length > 0) return kalaYoks.map((k) => k.meaning).join(' ');
    return info.sitthiList
      .map((s) => (SITTHI_DESC[s] ? `วัน${s}: ${SITTHI_DESC[s]}` : ''))
      .filter(Boolean)
      .join(' ');
  }, [info, kalaYoks]);

  const fortuneLines = useMemo(() => {
    if (!info) return [] as string[];
    const out: string[] = [];
    if (info.wanMuai) out.push(`วัน${info.wanMuai}`);
    if (info.wanPhiKin) out.push(info.wanPhiKin);
    return out;
  }, [info]);

  return (
    <div className="dp-root">
      {/* แถบชื่อเหนือแผ่นกระดาษ */}
      <div className="dp-masthead">
        <div className="dp-masthead-name">ล้านนา</div>
        <div className="dp-masthead-issue">{toArabicDigits(`ฉบับประจำวัน · ${monthTitle}`)}</div>
      </div>

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
              <span style={{ whiteSpace: 'nowrap' }}>{toArabicDigits(`เดือน${info.lannaMonthName}`)}</span>
            </div>

            {dayParagraph && <div className="dp-daytext">{toArabicDigits(dayParagraph)}</div>}

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

            <div className="dp-rule" />
            <div className="dp-section-label">ข้อมูลประจำวัน</div>
            <div className="dp-topics">
              <div>
                <b style={{ color: '#1d4ed8' }}>วันไท</b>{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{toArabicDigits(`วัน${info.wanThai}`)}</span>
                {info.wanThaiDesc && info.wanThaiDesc !== '-' ? <> {toArabicDigits(info.wanThaiDesc)}</> : null}
              </div>
              <div>
                <b style={{ color: '#7e22ce' }}>เก้ากอง</b>{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{toArabicDigits(info.kaoKong)}</span>
                {info.kaoKongDesc && info.kaoKongDesc !== '-' ? <> {toArabicDigits(info.kaoKongDesc)}</> : null}
              </div>
              <div>
                <b style={{ color: '#0f766e' }}>ดิถี</b>{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{toArabicDigits(info.panjaDithi)}</span>
                {DITHI_DESC[info.panjaDithi] ? <> {DITHI_DESC[info.panjaDithi]}</> : null}
              </div>
              <div>
                <b style={{ color: '#8a5a00' }}>ฟ้าตีแส่ง</b>{' '}
                <span style={{ whiteSpace: 'nowrap' }}>{toArabicDigits(`เศษ ${info.fahTeeSang}`)}</span>{' '}
                {fahMeaning(info.fahTeeSang)}
              </div>
            </div>

            <div className="dp-rule" />
            <div className="dp-section-label">โชคและฤกษ์</div>
            {kalaYoks.length > 0 && (
              <div className="dp-kalayok">
                {kalaYoks.map((ky, i) => (
                  <p key={i}>
                    <b style={{ color: ky.isGood ? 'var(--dp-good)' : 'var(--dp-bad)' }}>
                      {toArabicDigits(ky.name)}
                    </b>{' '}
                    {toArabicDigits(ky.meaning)}
                  </p>
                ))}
              </div>
            )}
            {info.sitthiList.map((s) =>
              SITTHI_DESC[s] ? (
                <div key={s} className="dp-chok">{toArabicDigits(`วัน${s}: ${SITTHI_DESC[s]}`)}</div>
              ) : null,
            )}
            <div className="dp-dirboxes">
              <div className="dp-dirbox">
                ทิศศรี (มงคล)<br />
                <b style={{ color: 'var(--dp-good)' }}>{toArabicDigits(directions.sri)}</b>
              </div>
              <div className="dp-dirbox">
                กาลกิณี (ห้าม)<br />
                <b style={{ color: 'var(--dp-bad)' }}>{toArabicDigits(directions.ka)}</b>
              </div>
            </div>

            <div className="dp-section-label" style={{ marginTop: 16 }}>ฤกษ์เดินทาง · อุบากอง</div>
            <div className="dp-ubakong">
              {UBAKONG_LABELS.map((label, i) => {
                const score = UBAKONG_GRID[selectedDate.getDay()][i];
                const cls = score === 4 ? 'good' : score === 1 || score === -1 ? 'bad' : '';
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

            {fortuneLines.length > 0 && (
              <>
                <div className="dp-rule" />
                <div className="dp-section-label">คำทำนาย</div>
                <div className="dp-fortune">
                  {fortuneLines.map((line, i) => (
                    <p key={i}>{toArabicDigits(line)}</p>
                  ))}
                </div>
              </>
            )}

            <div className="dp-rule" />
            <div className="dp-section-label">{toArabicDigits(`ทั้งเดือน · ${monthTitle}`)}</div>
            <div className="dp-monthgrid">
              {THAI_DAYS_SHORT.map((label, i) => (
                <div key={i} className="dp-monthgrid-head">{label}</div>
              ))}
              {monthCells.map((cell, idx) => {
                if (!cell || !cell.info) return <div key={idx} className="dp-cell-empty" />;
                const { date, info: ci } = cell;
                const cellToday = sameDay(date, today);
                const cellSelected = sameDay(date, selectedDate);
                const chips = monthChips(ci);
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
                      <span className="dp-cell-label" style={{ color: 'var(--dp-neutral)' }}>
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
