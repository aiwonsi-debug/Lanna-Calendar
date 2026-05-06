import fs from 'fs';

function parseMultiMonth() {
    try {
        const inputData = JSON.parse(fs.readFileSync('selective-ingested.json', 'utf8'));
        const rawTextByMonth = inputData.rawTextByMonth || {};
        
        const recordsByMonth = {};
        
        const thaiToArabic = {
            '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
            '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9'
        };

        const convertThaiToArabic = (text) => {
            return text.split('').map(char => thaiToArabic[char] || char).join('');
        };

        for (const [monthKey, rawText] of Object.entries(rawTextByMonth)) {
            const lines = rawText.split('\n');
            const monthRecords = [];
            let currentRecord = null;
            
            // Refined Regex for PDF artifacts
            const dayStandalonePattern = /^([0-9]{1,2}|[๑-๙]|[๑-๒][๐-๙]|๓[๐-๑])$/;
            const isLunarLine = (l) => /เดื?.?.?อน\s*[0-9๑-๙]/.test(l);
            const isLabelLine = (l) => l.trim().startsWith('วัน');

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const isStandalone = dayStandalonePattern.test(line);
                const isLunar = isLunarLine(line);
                const isLabel = isLabelLine(line);

                // Case: Found a standalone number or a Lunar date (which usually starts a day record in these PDFs)
                if (isStandalone || isLunar) {
                    if (currentRecord) monthRecords.push(currentRecord);
                    
                    let dayValue = 'Unknown';
                    if (isStandalone) {
                        dayValue = parseInt(convertThaiToArabic(line), 10);
                    } else if (isLunar) {
                        // Extract day number after "ออก" (Waxing) or "แรีม" (Waning)
                        const lunarDayMatch = line.match(/(?:ออก|แรีม)\s*([0-9๑-๙]+)/);
                        if (lunarDayMatch) {
                            // Note: This is still a heuristic. Ideally we'd map lunar to solar.
                            // For now, let's at least get a better number.
                            // Wait, the PDF often has the solar day number separately.
                        }
                        
                        // Let's try to find a standalone number before the lunar line or use a counter
                        // Actually, looking at the text, the solar day number is often on its own line before or near.
                        // But if it's missing, let's keep a counter per month.
                        if (dayValue === 'Unknown') {
                            dayValue = monthRecords.length + 1;
                        }
                    }

                    currentRecord = {
                        day: dayValue,
                        lunar: isLunar ? line : '',
                        labels: [],
                        description: []
                    };
                    continue;
                }

                if (!currentRecord) continue;

                if (isLabel) {
                    currentRecord.labels.push(line);
                } else {
                    currentRecord.description.push(line);
                }
            }

            if (currentRecord) monthRecords.push(currentRecord);
            
            recordsByMonth[monthKey] = monthRecords;
        }

        const output = {
            recordsByMonth: recordsByMonth
        };

        fs.writeFileSync('multi-month-parsed.json', JSON.stringify(output, null, 2), 'utf8');
        
        console.log(`Multi-month parsing complete for ${Object.keys(recordsByMonth).length} months.`);
        for (const key in recordsByMonth) {
            console.log(` - ${key}: ${recordsByMonth[key].length} records`);
        }

    } catch (error) {
        console.error(`Multi-month parsing failed: ${error.message}`);
        process.exit(1);
    }
}

parseMultiMonth();
