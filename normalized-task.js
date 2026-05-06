import fs from 'fs';
import path from 'path';

function runNormalizer() {
    try {
        // 1. Load Inputs
        const parsedData = JSON.parse(fs.readFileSync('multi-month-parsed.json', 'utf8'));
        const recordsByMonth = parsedData.recordsByMonth || {};
        
        const fingerprintData = JSON.parse(fs.readFileSync('pdf-hash.json', 'utf8'));
        const fileHash = fingerprintData.fileHash;
        
        const version = 2.1;
        const normalizedByMonth = {};

        // 2. Normalization Rules
        const goodKeywords = ['ดีมาก', 'มงคล', 'เหมาะ', 'โชค', 'สิทธิ', 'ไชย', 'รับได้'];
        const badKeywords = ['ไม่ดี', 'เสีย', 'หลีกเลี่ยง', 'มัจจุ', 'วอดวาย', 'ไหม้', 'ตาย', 'เก้ากอง'];

        for (const [monthKey, records] of Object.entries(recordsByMonth)) {
            normalizedByMonth[monthKey] = records.map(rec => {
                const day = typeof rec.day === 'number' ? rec.day : 1;
                const dateISO = `${monthKey}-${String(day).padStart(2, '0')}`;
                
                // Clean text artifacts
                const clean = (t) => (t || '').toString().replace(/[^\u0E00-\u0E7F0-9a-zA-Z\s.-]/g, '').replace(/\s+/g, ' ').trim();
                
                const lunar = clean(rec.lunar);
                const labels = (rec.labels || []).map(clean).filter(l => l);
                const description = (rec.description || []).map(clean).filter(d => d);
                
                // Score mapping
                const fullText = [...labels, ...description].join(' ');
                let score = 'neutral';
                if (badKeywords.some(kw => fullText.includes(kw))) score = 'bad';
                else if (goodKeywords.some(kw => fullText.includes(kw))) score = 'good';

                return {
                    dateISO,
                    day,
                    lunar,
                    labels,
                    description,
                    score,
                    version, // Attach metadata per record/month as requested
                    fileHash // Attach metadata per record/month as requested
                };
            });
        }

        const output = {
            normalizedByMonth: normalizedByMonth
        };

        // 3. Save result
        fs.writeFileSync('normalized-by-month.json', JSON.stringify(output, null, 2), 'utf8');
        
        console.log(`Normalization complete for ${Object.keys(normalizedByMonth).length} months.`);
        console.log(`Version: ${version}`);
        console.log(`Hash: ${fileHash.substring(0, 16)}...`);

    } catch (error) {
        console.error(`Normalization failed: ${error.message}`);
        process.exit(1);
    }
}

runNormalizer();
