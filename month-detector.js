import fs from 'fs';

function detectMonths() {
    try {
        const inputData = JSON.parse(fs.readFileSync('cleaned-lines.json', 'utf8'));
        const lines = inputData.lines || [];
        
        // Month definitions (Regex to handle common PDF extraction artifacts)
        const monthDefinitions = [
            { name: "มกราคม", id: "01", pattern: /มกริ?.?.?ค์ม|มกราคม/ },
            { name: "กุมภาพันธ์", id: "02", pattern: /กุมภ?.?.?พันัธ์|กุมภาพันธ์/ },
            { name: "มีนาคม", id: "03", pattern: /มีนั?.?.?ค์ม|มีนาคม/ },
            { name: "เมษายน", id: "04", pattern: /เมษ?.?.?ยน์|เมษายน/ },
            { name: "พฤษภาคม", id: "05", pattern: /พฤษภ?.?.?ค์ม|พฤษภาคม/ },
            { name: "มิถุนายน", id: "06", pattern: /มิถุนั?.?.?ยน์|มิถุนายน/ },
            { name: "กรกฎาคม", id: "07", pattern: /กริกฎ?.?.?ค์ม|กรกฎาคม/ },
            { name: "สิงหาคม", id: "08", pattern: /สิงหั?.?.?ค์ม|สิงหาคม/ },
            { name: "กันยายน", id: "09", pattern: /กันัย?.?.?ยน์|กันยายน/ },
            { name: "ตุลาคม", id: "10", pattern: /ตุลั?.?.?ค์ม|ตุลาคม/ },
            { name: "พฤศจิกายน", id: "11", pattern: /พฤศจิก?.?.?ยน์|พฤศจิกายน/ },
            { name: "ธันวาคม", id: "12", pattern: /ธันวั?.?.?ค์ม|ธันวาคม/ }
        ];

        const foundMonths = new Set();
        const year = "2026"; // Derived from 2569 (BE)

        for (const line of lines) {
            for (const month of monthDefinitions) {
                if (month.pattern.test(line)) {
                    foundMonths.add(`${year}-${month.id}`);
                }
            }
        }

        const output = {
            months: Array.from(foundMonths).sort()
        };

        fs.writeFileSync('detected-months.json', JSON.stringify(output, null, 2), 'utf8');
        
        console.log(`Month detection complete. Found ${output.months.length} months.`);
        console.log(JSON.stringify(output, null, 2));

    } catch (error) {
        console.error(`Month detection failed: ${error.message}`);
        process.exit(1);
    }
}

detectMonths();
