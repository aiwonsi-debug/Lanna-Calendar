import fs from 'fs';
import path from 'path';

function runNormalization() {
    try {
        // ในสถานะปัจจุบัน เราจะใช้ข้อมูลจาก multi-month-parsed.json เป็น Input
        const parsedData = JSON.parse(fs.readFileSync('multi-month-parsed.json', 'utf8'));
        const recordsByMonth = parsedData.recordsByMonth || {};
        
        // กฎการให้คะแนน (Score Rules)
        const scoreMapping = {
            good: ['ดีมาก', 'มงคล', 'เหมาะ'],
            bad: ['ไม่ดี', 'เสีย', 'หลีกเลี่ยง']
        };

        const result = {};

        for (const [monthKey, rawRecords] of Object.entries(recordsByMonth)) {
            const normalizedRecords = [];
            const seen = new Set();

            for (const rec of rawRecords) {
                // 1. Trim and Clean all fields
                const clean = (t) => (t || '').toString()
                    .replace(/[^\u0E00-\u0E7F0-9a-zA-Z\s.-]/g, '') // ลบอักขระพิเศษจากการ OCR
                    .replace(/\s+/g, ' ')
                    .trim();

                const day = typeof rec.day === 'number' ? rec.day : 1;
                const lunar = clean(rec.lunar);
                const labels = (rec.labels || []).map(clean).filter(l => l);
                const description = (rec.description || []).map(clean).filter(d => d);
                
                // 2. Map Score
                const fullText = [...labels, ...description].join(' ');
                let score = "neutral";
                if (scoreMapping.bad.some(kw => fullText.includes(kw))) {
                    score = "bad";
                } else if (scoreMapping.good.some(kw => fullText.includes(kw))) {
                    score = "good";
                }

                // 3. Prepare Object
                const dateISO = `${monthKey}-${String(day).padStart(2, '0')}`;
                const record = {
                    dateISO,
                    day,
                    lunar,
                    labels,
                    description,
                    score
                };

                // 4. Remove Duplicates (Check by content string)
                const fingerprint = JSON.stringify(record);
                if (!seen.has(fingerprint)) {
                    normalizedRecords.push(record);
                    seen.add(fingerprint);
                }
            }
            
            result[monthKey] = normalizedRecords;
        }

        // แสดงผลลัพธ์เฉพาะเดือนแรกเพื่อประหยัด Context (หรือตามความต้องการของผู้ใช้)
        const output = {
            normalized: result['2026-05'] || [] // แสดงผลลัพธ์เดือนพฤษภาคมเป็นหลักตามภารกิจ
        };

        console.log(JSON.stringify(output, null, 2));
        
        // บันทึกลงไฟล์เพื่อใช้ในขั้นตอนถัดไป
        fs.writeFileSync('normalized-output.json', JSON.stringify(result, null, 2), 'utf8');

    } catch (error) {
        console.error(`Normalization failed: ${error.message}`);
        process.exit(1);
    }
}

runNormalization();
