import fs from 'fs';

function buildFinal() {
    try {
        const inputData = JSON.parse(fs.readFileSync('processed-output.json', 'utf8'));
        const lines = inputData.lines;
        
        const mayLunarMap = [
            { day: 1, lunarPattern: /ด.?.?.น\s*[8๘]\s*อ.?.?ก\s*(15|๑๕)\s*ค/ },
            { day: 2, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(1|๑)\s*ค/ },
            { day: 3, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(2|๒)\s*ค/ },
            { day: 4, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(3|๓)\s*ค/ },
            { day: 5, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(4|๔)\s*ค/ },
            { day: 6, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(5|๕)\s*ค/ },
            { day: 7, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(6|๖)\s*ค/ },
            { day: 8, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(7|๗)\s*ค/ },
            { day: 9, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(8|๘)\s*ค/ },
            { day: 10, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(9|๙)\s*ค/ },
            { day: 11, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(10|๑๐)\s*ค/ },
            { day: 12, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(11|๑๑)\s*ค/ },
            { day: 13, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(12|๑๒)\s*ค/ },
            { day: 14, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(13|๑๓)\s*ค/ },
            { day: 15, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(14|๑๔)\s*ค/ },
            { day: 16, lunarPattern: /ด.?.?.น\s*[8๘]\s*แ.?.?ม\s*(15|๑๕)\s*ค/ },
            { day: 17, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(1|๑)\s*ค/ },
            { day: 18, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(2|๒)\s*ค/ },
            { day: 19, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(3|๓)\s*ค/ },
            { day: 20, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(4|๔)\s*ค/ },
            { day: 21, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(5|๕)\s*ค/ },
            { day: 22, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(6|๖)\s*ค/ },
            { day: 23, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(7|๗)\s*ค/ },
            { day: 24, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(8|๘)\s*ค/ },
            { day: 25, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(9|๙)\s*ค/ },
            { day: 26, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(10|๑๐)\s*ค/ },
            { day: 27, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(11|๑๑)\s*ค/ },
            { day: 28, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(12|๑๒)\s*ค/ },
            { day: 29, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(13|๑๓)\s*ค/ },
            { day: 30, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(14|๑๔)\s*ค/ },
            { day: 31, lunarPattern: /ด.?.?.น\s*[9๙]\s*อ.?.?ก\s*(15|๑๕)\s*ค/ }
        ];

        const records = [];
        let currentDayIdx = 0;
        let isCollecting = false;

        const goodKeywords = ['ดีมาก', 'มงคล', 'เหมาะ', 'โชค', 'สิทธิ', 'ไชย', 'รับได้'];
        const badKeywords = ['ไม่ดี', 'เสีย', 'หลีกเลี่ยง', 'มัจจุ', 'วอดวาย', 'ไหม้', 'ตาย', 'เก้ากอง'];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (currentDayIdx < mayLunarMap.length) {
                if (mayLunarMap[currentDayIdx].lunarPattern.test(line)) {
                    isCollecting = true;
                    records.push({
                        day: mayLunarMap[currentDayIdx].day,
                        lunar: line.replace(/[^\u0E00-\u0E7F0-9\s]/g, '').replace(/\s+/g, ' ').trim(), // Clean lunar string
                        labels: [],
                        description: []
                    });
                    currentDayIdx++;
                    continue;
                }
            }

            // Check if this line is the start of another month's lunar or something that breaks the block
            // But we already collect until the next target lunar
            if (isCollecting && currentDayIdx <= mayLunarMap.length) {
                // If it matches the NEXT pattern, the loop will catch it in the next iteration 
                // because we just incremented currentDayIdx.
                // Wait, the logic above only checks `currentDayIdx`.
                // Let's see if line matches any lunar pattern. If it matches a generic lunar pattern and not ours, maybe stop?
                // Actually, just collect until the next `currentDayIdx` matches.
                
                // Also stop collecting if we hit a long series of numbers (grid) or next month header
                if (/^[0-9๑-๙\s]{5,}$/.test(line) || line.includes('มิถุนายน')) {
                    isCollecting = false;
                    continue;
                }

                const rec = records[records.length - 1];
                const cleanLine = line.replace(/[^\u0E00-\u0E7F0-9\s]/g, '').replace(/\s+/g, ' ').trim();
                
                if (cleanLine.length === 0) continue;

                if (/^.?\s?ว.?.?.น/.test(cleanLine)) {
                    rec.labels.push(cleanLine);
                } else if (!/^ฟ้|เศษ/.test(cleanLine)) { // Ignore "ฟ้าสีแสงเศษ"
                    rec.description.push(cleanLine);
                }
            }
        }

        // Normalize
        const normalizedArray = records.map(rec => {
            const fullText = rec.labels.join(' ') + ' ' + rec.description.join(' ');
            let score = 'neutral';
            
            const hasGood = goodKeywords.some(kw => fullText.includes(kw));
            const hasBad = badKeywords.some(kw => fullText.includes(kw));
            
            if (hasBad) {
                score = 'bad';
            } else if (hasGood) {
                score = 'good';
            }

            const dayFormatted = String(rec.day).padStart(2, '0');
            return {
                dateISO: `2026-05-${dayFormatted}`,
                day: rec.day,
                lunar: rec.lunar,
                labels: rec.labels,
                description: rec.description,
                score: score
            };
        });

        const output = {
            normalized: normalizedArray
        };
        
        fs.writeFileSync('normalized-records.json', JSON.stringify(output, null, 2), 'utf8');
        console.log(`Successfully generated ${normalizedArray.length} records based on external lunar calendar mapping.`);

    } catch (e) {
        console.error(e);
    }
}

buildFinal();
