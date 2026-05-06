import fs from 'fs';

async function selectiveIngest() {
    try {
        const cacheStatus = JSON.parse(fs.readFileSync('cache-status.json', 'utf8'));
        const toProcess = cacheStatus.toProcess || [];

        if (toProcess.length === 0) {
            console.log("No months to process.");
            console.log(JSON.stringify({ rawTextByMonth: {} }, null, 2));
            return;
        }

        // Reuse already cleaned lines to avoid re-parsing entire PDF
        const cleanedData = JSON.parse(fs.readFileSync('cleaned-lines.json', 'utf8'));
        const lines = cleanedData.lines || [];
        
        const monthPatterns = [
            { id: "01", pattern: /มกริ?.?.?ค์ม|มกราคม/ },
            { id: "02", pattern: /กุมภ?.?.?พันัธ์|กุมภาพันธ์/ },
            { id: "03", pattern: /มีนั?.?.?ค์ม|มีนาคม/ },
            { id: "04", pattern: /เมษาย?.?.?ย?น?|เมษายน/ },
            { id: "05", pattern: /พฤษภ?.?.?ค์ม|พฤษัภ?.?.?ค์ม|พฤษภาคม/ },
            { id: "06", pattern: /มิถุนั?.?.?ย?น?|มิถุนายน/ },
            { id: "07", pattern: /กริกฎ?.?.?ค์ม|กรกฎาคม/ },
            { id: "08", pattern: /สิงห?.?.?ค์ม|สำิงห?.?.?ค์ม|สิงหาคม/ },
            { id: "09", pattern: /กันัย?.?.?ย?น?|กันยายน/ },
            { id: "10", pattern: /ตุล?.?.?ค์ม|ตุ่ล?.?.?ค์ม|ตุลาคม/ },
            { id: "11", pattern: /พฤศจิก?.?.?ย?น?|พฤศิจุิก?.?.?ย?น?|พฤศจิกายน/ },
            { id: "12", pattern: /ธันวั?.?.?ค์ม|ธันวาคม/ }
        ];

        const rawTextByMonth = {};

        for (const monthKey of toProcess) {
            const [year, monthId] = monthKey.split('-');
            const monthConfig = monthPatterns.find(m => m.id === monthId);
            
            if (!monthConfig) continue;

            // Find start and end line for this month
            let startLine = -1;
            let endLine = -1;

            for (let i = 0; i < lines.length; i++) {
                if (monthConfig.pattern.test(lines[i])) {
                    startLine = i;
                    // Look for the NEXT month to find the end boundary
                    for (let j = i + 1; j < lines.length; j++) {
                        // If any other month header is found, stop there
                        if (monthPatterns.some(m => m.pattern.test(lines[j]))) {
                            endLine = j;
                            break;
                        }
                    }
                    if (endLine === -1) endLine = lines.length;
                    break;
                }
            }

            if (startLine !== -1) {
                rawTextByMonth[monthKey] = lines.slice(startLine, endLine).join('\n');
            }
        }

        const output = {
            rawTextByMonth: rawTextByMonth
        };

        fs.writeFileSync('selective-ingested.json', JSON.stringify(output, null, 2), 'utf8');
        
        console.log(`Selective ingestion complete for ${Object.keys(rawTextByMonth).length} months.`);
        console.log("Output summary (keys):", Object.keys(rawTextByMonth));

    } catch (error) {
        console.error(`Selective ingestion failed: ${error.message}`);
        process.exit(1);
    }
}

selectiveIngest();
