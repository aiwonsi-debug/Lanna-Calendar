import fs from 'fs';
import path from 'path';

function runNormalizationWithMetadata() {
    try {
        // 1. Get Metadata from sources.json
        const sources = JSON.parse(fs.readFileSync('sources.json', 'utf8'));
        const latestSource = sources[sources.length - 1];
        const { sourceId, fileHash } = latestSource;
        
        // Load existing status to check version (mock increment for this source)
        const version = 1; 
        const updatedAt = new Date().toISOString();

        // 2. Load Parsed Records
        const parsedData = JSON.parse(fs.readFileSync('multi-month-parsed.json', 'utf8'));
        const recordsByMonth = parsedData.recordsByMonth || {};
        
        const normalizedDataset = {};

        // 3. Normalization Rules
        const goodKeywords = ['ดีมาก', 'มงคล', 'เหมาะ', 'โชค', 'สิทธิ', 'ไชย', 'รับได้'];
        const badKeywords = ['ไม่ดี', 'เสีย', 'หลีกเลี่ยง', 'มัจจุ', 'วอดวาย', 'ไหม้', 'ตาย', 'เก้ากอง'];

        for (const [monthKey, records] of Object.entries(recordsByMonth)) {
            normalizedDataset[monthKey] = records.map(rec => {
                const day = typeof rec.day === 'number' ? rec.day : 1;
                const dateISO = `${monthKey}-${String(day).padStart(2, '0')}`;
                
                // Clean text artifacts
                const clean = (t) => (t || '').toString()
                    .replace(/[^\u0E00-\u0E7F0-9a-zA-Z\s.-]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
                
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
                    // --- Conflict Resolution Metadata ---
                    sourceId,
                    fileHash,
                    version,
                    updatedAt
                };
            });
        }

        // 4. Save and Output result
        const output = {
            normalizedRecords: normalizedDataset
        };

        fs.writeFileSync('normalized-v2-metadata.json', JSON.stringify(output, null, 2), 'utf8');
        
        console.log(`Normalization complete.`);
        console.log(` - Metadata attached (Source: ${sourceId.substring(0,8)}...)`);
        console.log(` - Timestamp: ${updatedAt}`);
        
        // Log a sample record for verification
        const sampleMonth = Object.keys(normalizedDataset)[0];
        if (sampleMonth && normalizedDataset[sampleMonth].length > 0) {
           // console.log("Sample Record:", JSON.stringify(normalizedDataset[sampleMonth][0], null, 2));
        }

    } catch (error) {
        console.error(`Normalization failed: ${error.message}`);
        process.exit(1);
    }
}

runNormalizationWithMetadata();
