import fs from 'fs';

function parseRecords() {
    try {
        const inputData = JSON.parse(fs.readFileSync('cleaned-lines.json', 'utf8'));
        const lines = inputData.lines || [];
        
        const records = [];
        let currentRecord = null;
        
        const STATES = {
            IDLE: 'IDLE',
            DAY: 'DAY',
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
            const cleanLine = line.trim();
            if (!cleanLine) continue;
            
            // Rules
            const isDayStart = /^([0-9]{1,2}|[๑-๙]|[๑-๒][๐-๙]|๓[๐-๑])$/.test(cleanLine);
            const isLunar = /เดือน|แรม|ขึ้น/.test(cleanLine);
            const isLabel = cleanLine.startsWith('วัน');
            
            if (isDayStart) {
                if (currentRecord) {
                    records.push(currentRecord);
                }
                
                const dayValue = parseInt(convertThaiToArabic(cleanLine), 10);
                
                currentRecord = {
                    day: dayValue,
                    lunar: '',
                    labels: [],
                    description: []
                };
                
                state = STATES.DAY;
                continue;
            }
            
            if (!currentRecord) continue;
            
            if (isLunar) {
                currentRecord.lunar = cleanLine;
                state = STATES.LUNAR;
            } else if (isLabel) {
                currentRecord.labels.push(cleanLine);
                state = STATES.LABEL;
            } else {
                currentRecord.description.push(cleanLine);
                state = STATES.DETAIL;
            }
        }
        
        if (currentRecord) {
            records.push(currentRecord);
        }
        
        const output = {
            records: records
        };
        
        fs.writeFileSync('parsed-records-state.json', JSON.stringify(output, null, 2), 'utf8');
        
        console.log(`Parsing complete. Extracted ${records.length} records using State Machine.`);
        console.log("Output preview (first 2 records):");
        console.log(JSON.stringify({ records: records.slice(0, 2) }, null, 2));

    } catch (error) {
        console.error(`Parser failed: ${error.message}`);
        process.exit(1);
    }
}

parseRecords();
