import fs from 'fs';

function parse() {
    try {
        const data = JSON.parse(fs.readFileSync('processed-output.json', 'utf8'));
        const lines = data.lines;
        
        const records = [];
        let currentRecord = null;
        
        // State Machine States
        const STATES = {
            IDLE: 'IDLE',
            DAY_HEADER: 'DAY_HEADER',
            LUNAR: 'LUNAR',
            LABEL: 'LABEL',
            DETAIL: 'DETAIL'
        };
        
        let state = STATES.IDLE;
        
        const thaiToArabic = {
            '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
            '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9'
        };

        const convertThaiToArabic = (text) => {
            return text.split('').map(char => thaiToArabic[char] || char).join('');
        };

        for (const line of lines) {
            // RULES (Robust versions to handle extra vowels/marks from PDF)
            // Day start: ^\d{1,2}$ OR Thai numerals ๑-๓๑
            const isDayStart = /^([0-9]{1,2}|[๑-๙]|[๑-๒][๐-๙]|๓[๐-๑])$/.test(line);
            
            // Lunar: matches "เดือน" (with any noise), "แรม", "ขึ้น", "ออก"
            const isLunar = /ด.?.?.น|แ.?.?.ม|ข.?.?.น|อ.?.?.ก/.test(line) && /ค.?.?.า/.test(line);
            
            // Label: startsWith "วัน" (allowing for space or extra vowels)
            const isLabel = /^.?\s?ว.?.?.น/.test(line);
            
            if (isDayStart) {
                if (currentRecord) records.push(currentRecord);
                
                const dayValue = parseInt(convertThaiToArabic(line), 10);
                currentRecord = {
                    day: dayValue,
                    lunar: '',
                    labels: [],
                    description: []
                };
                state = STATES.DAY_HEADER;
                continue;
            }
            
            if (!currentRecord) continue;
            
            if (isLunar) {
                currentRecord.lunar = line;
                state = STATES.LUNAR;
            } else if (isLabel) {
                currentRecord.labels.push(line);
                state = STATES.LABEL;
            } else {
                currentRecord.description.push(line);
                state = STATES.DETAIL;
            }
        }
        
        if (currentRecord) records.push(currentRecord);
        
        // FAIL CONDITIONS: Missing day numbers -> flag invalid
        const isValid = records.length > 0;
        
        const output = {
            records: records,
            status: isValid ? "valid" : "invalid"
        };
        
        fs.writeFileSync('parsed-records.json', JSON.stringify(output, null, 2), 'utf8');
        console.log(`Status: ${output.status}, Records found: ${records.length}`);
        
    } catch (error) {
        console.error(`Parsing failed: ${error.message}`);
    }
}

parse();
