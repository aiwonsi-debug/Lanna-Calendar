import fs from 'fs';

function hybridParse() {
    try {
        const data = JSON.parse(fs.readFileSync('processed-output.json', 'utf8'));
        const lines = data.lines.slice(1000, 1500); // Focus on a sample region where we expect a month
        
        const thaiToArabic = {
            '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
            '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9'
        };

        const convertThaiToArabic = (text) => {
            return text.split('').map(char => thaiToArabic[char] || char).join('');
        };

        const records = [];
        let activeRecord = null;
        const orphanTexts = [];

        // First pass: detect day blocks
        // We look for patterns that strongly indicate a new day starting.
        // In mixed format, a day block often starts with a standalone number, 
        // OR a clear lunar date like "เดือน ๖ ออก ๑ ค่ำ"
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const isNumberLine = /^([0-9]{1,2}|[๑-๙]|[๑-๒][๐-๙]|๓[๐-๑])$/.test(line);
            const isLunarLine = /^(?:เดื?.?.?อน)\s*[0-9๑-๙]/.test(line);

            if (isNumberLine || isLunarLine) {
                // If it's a number line, we assume it's a day marker
                let dayNum = -1;
                if (isNumberLine) {
                    dayNum = parseInt(convertThaiToArabic(line), 10);
                }
                
                // Create a new day block
                activeRecord = {
                    day: dayNum, // Might be -1 if lunar line
                    lunar: isLunarLine ? line : '',
                    details: [],
                    lineIndex: i
                };
                records.push(activeRecord);
            } else {
                if (activeRecord) {
                    activeRecord.details.push(line);
                } else {
                    orphanTexts.push({ text: line, lineIndex: i });
                }
            }
        }
        
        // Second pass: attach orphan text to nearest day
        // For orphans, find the record with the closest lineIndex
        for (const orphan of orphanTexts) {
            let nearestRecord = null;
            let minDistance = Infinity;
            
            for (const rec of records) {
                const dist = Math.abs(rec.lineIndex - orphan.lineIndex);
                if (dist < minDistance) {
                    minDistance = dist;
                    nearestRecord = rec;
                }
            }
            
            if (nearestRecord) {
                // Attach to nearest record, mark as orphan-attached
                nearestRecord.details.push(`[Attached] ${orphan.text}`);
            }
        }
        
        // Clean up the records
        const structuredRecords = records.map(r => {
            return {
                day: r.day !== -1 ? r.day : 'Unknown',
                lunar: r.lunar,
                details: r.details.slice(0, 3) // show first 3 for brevity
            };
        }).filter(r => r.day !== 'Unknown' || r.lunar !== '');

        const output = {
            strategy: "Hybrid parser (Grid + Long notes)",
            extractedRecords: structuredRecords.slice(0, 10) // Show first 10
        };
        
        fs.writeFileSync('hybrid-records.json', JSON.stringify(output, null, 2), 'utf8');
        console.log(JSON.stringify(output, null, 2));
        
    } catch (e) {
        console.error(e);
    }
}

hybridParse();
