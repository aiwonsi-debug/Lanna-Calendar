import fs from 'fs';

function normalize() {
    try {
        const inputData = JSON.parse(fs.readFileSync('parsed-records.json', 'utf8'));
        const records = inputData.records || [];
        
        const goodKeywords = ['ดีมาก', 'มงคล', 'เหมาะ'];
        const badKeywords = ['ไม่ดี', 'เสีย', 'หลีกเลี่ยง'];
        
        const normalizedMap = new Map();
        
        for (const record of records) {
            // Trim all fields
            const day = record.day;
            const lunar = (record.lunar || '').trim();
            const labels = (record.labels || []).map(l => l.trim()).filter(l => l);
            const description = (record.description || []).map(d => d.trim()).filter(d => d);
            
            // Combine text to check for score
            const fullText = labels.join(' ') + ' ' + description.join(' ');
            let score = 'neutral';
            
            const hasGood = goodKeywords.some(kw => fullText.includes(kw));
            const hasBad = badKeywords.some(kw => fullText.includes(kw));
            
            if (hasBad) {
                // Precedence to 'bad' if both exist? Or just follow conditions.
                score = 'bad';
            } else if (hasGood) {
                score = 'good';
            }
            
            // Formatting dateISO for May 2026 (2569 Thai Calendar year, May is month 05)
            // If the day is invalid, fallback to 01
            const dayFormatted = String(day > 0 && day <= 31 ? day : 1).padStart(2, '0');
            const dateISO = `2026-05-${dayFormatted}`;
            
            // Remove duplicates by picking the one with more data or keeping the first
            if (!normalizedMap.has(day)) {
                normalizedMap.set(day, {
                    dateISO,
                    day,
                    lunar,
                    labels,
                    description,
                    score
                });
            } else {
                // Merge data if day already exists (as part of removing duplicates while preserving info)
                const existing = normalizedMap.get(day);
                if (!existing.lunar && lunar) existing.lunar = lunar;
                
                const mergedLabels = [...new Set([...existing.labels, ...labels])];
                const mergedDesc = [...new Set([...existing.description, ...description])];
                
                existing.labels = mergedLabels;
                existing.description = mergedDesc;
                
                const existingText = existing.labels.join(' ') + ' ' + existing.description.join(' ');
                const eHasGood = goodKeywords.some(kw => existingText.includes(kw));
                const eHasBad = badKeywords.some(kw => existingText.includes(kw));
                existing.score = eHasBad ? 'bad' : (eHasGood ? 'good' : 'neutral');
                
                normalizedMap.set(day, existing);
            }
        }
        
        // Convert map to array and sort by day
        const normalizedArray = Array.from(normalizedMap.values()).sort((a, b) => a.day - b.day);
        
        const output = {
            normalized: normalizedArray
        };
        
        fs.writeFileSync('normalized-records.json', JSON.stringify(output, null, 2), 'utf8');
        console.log(`Successfully normalized ${normalizedArray.length} records.`);
        
    } catch (error) {
        console.error(`Normalization failed: ${error.message}`);
    }
}

normalize();
