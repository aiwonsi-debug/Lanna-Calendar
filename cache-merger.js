import fs from 'fs';
import path from 'path';

function runCacheMerger() {
    try {
        const cacheStatus = JSON.parse(fs.readFileSync('cache-status.json', 'utf8'));
        const toProcess = cacheStatus.toProcess || [];
        
        const parsedData = JSON.parse(fs.readFileSync('multi-month-parsed.json', 'utf8'));
        const recordsByMonth = parsedData.recordsByMonth || {};
        
        const dataDir = 'src/data/v2';
        const fullDataset = {};

        // 1. Load existing files that are NOT in toProcess
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            const monthKey = file.replace('.json', '');
            if (!toProcess.includes(monthKey)) {
                try {
                    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
                    fullDataset[monthKey] = data.normalized || data.records || [];
                } catch (e) {
                    console.error(`Failed to load existing file ${file}: ${e.message}`);
                }
            }
        }

        // 2. Normalize and Merge new months
        const goodKeywords = ['ดี', 'มงคล', 'เหมาะ', 'โชค', 'สิทธิ', 'ไชย', 'รับได้'];
        const badKeywords = ['ไม่ดี', 'เสีย', 'หลีกเลี่ยง', 'มัจจุ', 'วอดวาย', 'ไหม้', 'ตาย', 'เก้ากอง'];

        for (const monthKey of toProcess) {
            const rawRecords = recordsByMonth[monthKey] || [];
            
            // Basic Normalization logic
            const normalized = rawRecords.map(rec => {
                const day = typeof rec.day === 'number' ? rec.day : 1;
                const dateISO = `${monthKey}-${String(day).padStart(2, '0')}`;
                
                const cleanText = (t) => t.replace(/[^\u0E00-\u0E7F0-9a-zA-Z\s.-]/g, '').replace(/\s+/g, ' ').trim();
                
                const lunar = cleanText(rec.lunar || '');
                const labels = (rec.labels || []).map(cleanText).filter(l => l);
                const description = (rec.description || []).map(cleanText).filter(d => d);
                
                const fullText = labels.join(' ') + ' ' + description.join(' ');
                let score = 'neutral';
                if (badKeywords.some(kw => fullText.includes(kw))) score = 'bad';
                else if (goodKeywords.some(kw => fullText.includes(kw))) score = 'good';

                return {
                    dateISO,
                    day,
                    lunar,
                    labels,
                    description,
                    score
                };
            });

            // Update Storage
            const output = {
                metadata: {
                    schemaVersion: "2.1.0",
                    templateType: "T3_HYBRID",
                    parserName: "multiMonthParser",
                    mergedAt: new Date().toISOString()
                },
                month: monthKey,
                records: normalized
            };
            
            fs.writeFileSync(path.join(dataDir, `${monthKey}.json`), JSON.stringify(output, null, 2), 'utf8');
            
            // Add to Full Dataset
            fullDataset[monthKey] = normalized;
        }

        // Final output
        const result = {
            fullDataset: fullDataset
        };

        fs.writeFileSync('merged-full-dataset.json', JSON.stringify(result, null, 2), 'utf8');
        
        console.log(`Cache merge complete. Total months in dataset: ${Object.keys(fullDataset).length}`);
        console.log(`Processed (Replaced): ${toProcess.join(', ')}`);
        
    } catch (error) {
        console.error(`Cache merge failed: ${error.message}`);
        process.exit(1);
    }
}

runCacheMerger();
