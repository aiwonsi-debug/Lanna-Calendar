import fs from 'fs';

function finalParse() {
    try {
        const data = JSON.parse(fs.readFileSync('processed-output.json', 'utf8'));
        const lines = data.lines;
        
        // Target range based on manual verification
        // Index 1000-1300 seems to contain the May overview and detail lines
        const targetLines = lines.slice(1000, 1300);
        
        const records = [];
        let currentRecord = null;
        
        const thaiToArabic = {
            '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
            '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9'
        };

        const convertThaiToArabic = (text) => {
            return text.split('').map(char => thaiToArabic[char] || char).join('');
        };

        for (const line of targetLines) {
            // RULES
            const isDayStart = /^(\d{1,2}|[๑-๙]|[๑-๒][๐-๙]|๓[๐-๑])$/.test(line);
            const isLunar = /เดือน|แรม|ออก/.test(line);
            const isLabel = line.startsWith('วัน');
            
            if (isDayStart) {
                if (currentRecord) records.push(currentRecord);
                
                const dayValue = parseInt(convertThaiToArabic(line), 10);
                currentRecord = {
                    day: dayValue,
                    lunar: '',
                    labels: [],
                    description: []
                };
                continue;
            }
            
            if (!currentRecord) continue;
            
            if (isLunar) {
                currentRecord.lunar = line;
            } else if (isLabel) {
                currentRecord.labels.push(line);
            } else {
                currentRecord.description.push(line);
            }
        }
        
        if (currentRecord) records.push(currentRecord);
        
        // The data has summary first (1-31) then detail lines.
        // We want the detail ones or combine them.
        // Looking at the output, the detail lines follow the summary.
        // Let's filter to keep the most descriptive ones for each day.
        
        const dayMap = new Map();
        for (const rec of records) {
            if (rec.day < 1 || rec.day > 31) continue;
            
            if (!dayMap.has(rec.day) || rec.description.length > dayMap.get(rec.day).description.length) {
                dayMap.set(rec.day, rec);
            } else if (rec.lunar && !dayMap.get(rec.day).lunar) {
                // If this one has lunar info and existing doesn't, update it
                const existing = dayMap.get(rec.day);
                existing.lunar = rec.lunar;
                existing.labels = [...new Set([...existing.labels, ...rec.labels])];
            }
        }
        
        const finalRecords = Array.from(dayMap.values()).sort((a, b) => a.day - b.day);
        
        const output = {
            records: finalRecords
        };
        
        fs.writeFileSync('final-parsed-may.json', JSON.stringify(output, null, 2), 'utf8');
        console.log(`Successfully extracted ${finalRecords.length} unique days for May 2569`);
        
    } catch (e) {
        console.error(e);
    }
}

finalParse();
