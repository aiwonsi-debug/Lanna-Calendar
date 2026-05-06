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
            // RULES
            // Day start: ^\d{1,2}$ OR Thai numerals ๑-๓๑
            const isDayStart = /^(\d{1,2}|[๑-๙]|[๑-๒][๐-๙]|๓[๐-๑])$/.test(line);
            const isLunar = /เดือน|แรม|ขึ้น/.test(line);
            const isLabel = line.startsWith('วัน');
            
            if (isDayStart) {
                // If we were building a record, push it
                if (currentRecord) {
                    records.push(currentRecord);
                }
                
                // Start new record
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
            
            if (!currentRecord) continue; // Skip if no day started yet
            
            if (isLunar) {
                currentRecord.lunar = line;
                state = STATES.LUNAR;
            } else if (isLabel) {
                currentRecord.labels.push(line);
                state = STATES.LABEL;
            } else {
                // Remaining lines -> detail
                currentRecord.description.push(line);
                state = STATES.DETAIL;
            }
        }
        
        // Push last record
        if (currentRecord) {
            records.push(currentRecord);
        }
        
        // FAIL CONDITIONS: Missing day numbers
        // (Note: Since we use ^\d{1,2}$ as trigger, we check if records is empty or inconsistent)
        const invalid = records.length === 0;
        
        const output = {
            records: records,
            status: invalid ? "invalid" : "valid"
        };
        
        fs.writeFileSync('parsed-data.json', JSON.stringify(output, null, 2), 'utf8');
        console.log(`Successfully parsed ${records.length} records into parsed-data.json`);
        
        if (invalid) {
            console.error("Warning: Missing day numbers. Data flagged as invalid.");
        }
        
    } catch (error) {
        console.error(`Parsing failed: ${error.message}`);
    }
}

parse();
