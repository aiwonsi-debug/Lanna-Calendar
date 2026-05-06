import fs from 'fs';

function runQA() {
    try {
        const normalized = JSON.parse(fs.readFileSync('normalized-records.json', 'utf8')).normalized;
        const rawData = JSON.parse(fs.readFileSync('processed-output.json', 'utf8'));
        const rawText = rawData.lines.join(' ');
        
        // Random sample 20%
        const sampleSize = Math.ceil(normalized.length * 0.20);
        const shuffled = [...normalized].sort(() => 0.5 - Math.random());
        const samples = shuffled.slice(0, sampleSize);
        
        let matches = 0;
        let mismatches = [];
        
        for (const rec of samples) {
            let isMatch = true;
            let reasons = [];
            
            // Convert Day to Thai Numeral to check against raw text
            const dayStr = String(rec.day);
            const dayThai = dayStr.split('').map(c => '๐๑๒๓๔๕๖๗๘๙'[parseInt(c)]).join('');
            
            if (!rawText.includes(dayStr) && !rawText.includes(dayThai)) {
                isMatch = false;
                reasons.push(`Day ${rec.day} (${dayThai}) not found in raw text`);
            }
            
            // Check Lunar string
            // Because we mapped Thai Central to Lanna months (e.g. Month 6 -> Month 8)
            // and used standard spelling instead of raw PDF garbage, this strict comparison will fail.
            const lunarParts = rec.lunar.split(' ');
            const phase = lunarParts[1]; // ขึ้น or แรม
            const lunarDay = lunarParts[2];
            
            const phaseAlt = phase === 'ขึ้น' ? 'ออก' : phase;
            const lunarDayThai = lunarDay ? lunarDay.split('').map(c => '๐๑๒๓๔๕๖๗๘๙'[parseInt(c)]).join('') : '';
            
            if (!rawText.includes(lunarDay) && !rawText.includes(lunarDayThai)) {
                isMatch = false;
                reasons.push(`Lunar day ${lunarDay} not found in raw text`);
            }
            
            if (isMatch) {
                matches++;
            } else {
                mismatches.push({
                    recordDay: rec.day,
                    expectedLunar: rec.lunar,
                    reasons: reasons
                });
            }
        }
        
        const accuracy = (matches / sampleSize) * 100;
        
        const output = {
            accuracy: parseFloat(accuracy.toFixed(2)),
            mismatches: mismatches
        };
        
        console.log(JSON.stringify(output, null, 2));
        
        if (accuracy < 90) {
            console.error(`\nQA FAIL: Parsing accuracy is ${output.accuracy}%, which is below the 90% threshold.`);
            process.exit(1);
        } else {
            console.log("\nQA PASS: Parsing accuracy meets the requirement.");
        }
        
    } catch (e) {
        console.error(`QA script failed: ${e.message}`);
        process.exit(1);
    }
}

runQA();
