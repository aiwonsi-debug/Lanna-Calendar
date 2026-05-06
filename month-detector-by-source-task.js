import fs from 'fs';

function detectMonthsBySource() {
    try {
        // 1. Get current sourceId
        const sources = JSON.parse(fs.readFileSync('sources.json', 'utf8'));
        const latestSource = sources[sources.length - 1];
        const sourceId = latestSource.sourceId;

        // 2. Load latest month detection logic
        const inputData = JSON.parse(fs.readFileSync('cleaned-lines.json', 'utf8'));
        const lines = inputData.lines || [];
        
        const monthDefinitions = [
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

        const foundMonths = new Set();
        const year = "2026";

        for (const line of lines) {
            for (const month of monthDefinitions) {
                if (month.pattern.test(line)) {
                    foundMonths.add(`${year}-${month.id}`);
                }
            }
        }

        const output = {
            sourceId: sourceId,
            months: Array.from(foundMonths).sort()
        };

        // Log the result as requested by the TASK
        console.log(JSON.stringify(output, null, 2));

    } catch (error) {
        console.error(JSON.stringify({ error: error.message }, null, 2));
        process.exit(1);
    }
}

detectMonthsBySource();
