import fs from 'fs';

function extractAndParse() {
    try {
        const data = JSON.parse(fs.readFileSync('processed-output.json', 'utf8'));
        const allLines = data.lines;
        
        // Find May 2069 section
        // We know from previous grep it's around 1630-1880
        // Let's look for "พฤษภาคม" again or just slice the range we saw
        const mayStartIdx = allLines.findIndex(line => line.includes("พฤษภาคม") || line.includes("พฤษภ"));
        console.log("Found May at index:", mayStartIdx);
        
        // The numbers 1 2 3 4 5 6 starts after the month header
        // Looking at the file content:
        // "พฤษภาคม พฤษภาคม ๒๕๖๙๒๕๖๙" is around line 1630
        // Then some rules, then "๑๒๓๔๕๖", then "๗๘๙๑๐๑๑๑๒๑๓"
        
        // Let's take lines from index 1600 to 1950 to be safe and parse
        const mayLines = allLines.slice(1600, 1950);
        
        const records = [];
        let currentRecord = null;
        
        const thaiToArabic = {
            '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
            '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9'
        };

        const convertThaiToArabic = (text) => {
            return text.split('').map(char => thaiToArabic[char] || char).join('');
        };

        for (const line of mayLines) {
            // RULES
            // Day start: matches ^\d{1,2}$ OR Thai numerals ๑-๓๑
            // Note: In this section, days are mostly Arabic 1, 2, 3... but check for both
            const isDayStart = /^(\d{1,2}|[๑-๙]|[๑-๒][๐-๙]|๓[๐-๑])$/.test(line);
            const isLunar = /เดือน|แรม|ออก/.test(line); // Added "ออก" as seen in data
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
        
        // Filter to keep only days 1-31 (avoid catching years or other numbers)
        const finalRecords = records.filter(r => r.day >= 1 && r.day <= 31);
        
        // Deduplicate or handle sequences (sometimes 1-31 appears twice if overview is included)
        // For May 2569, we expect one sequence of 1-31
        
        const output = {
            records: finalRecords
        };
        
        fs.writeFileSync('parsed-may-2569.json', JSON.stringify(output, null, 2), 'utf8');
        console.log(`Successfully parsed ${finalRecords.length} records for May 2569`);
        
    } catch (error) {
        console.error(`Extraction/Parsing failed: ${error.message}`);
    }
}

extractAndParse();
