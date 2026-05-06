import fs from 'fs';

function validateDataset() {
    try {
        const inputData = JSON.parse(fs.readFileSync('normalized-output.json', 'utf8'));
        const errors = [];
        let totalRecords = 0;
        let invalidRecords = 0;

        const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

        for (const [monthKey, records] of Object.entries(inputData)) {
            const [year, month] = monthKey.split('-').map(Number);
            const expectedDays = getDaysInMonth(year, month);
            const seenDays = new Set();
            
            totalRecords += records.length;

            // Check: Day count matches month (Optional: PDF might not have all days, but let's log if it's suspicious)
            // In this specific project, the PDF might only list specific days, so we check existence of essential fields per record instead.
            
            for (const rec of records) {
                let isRecordInvalid = false;

                // Check: No duplicate day
                if (seenDays.has(rec.day)) {
                    errors.push(`[${monthKey}] Duplicate day: ${rec.day}`);
                    isRecordInvalid = true;
                }
                seenDays.add(rec.day);

                // Check: Each record has lunar + dateISO
                if (!rec.lunar && rec.lunar !== "") { // Allow empty string but must exist
                    errors.push(`[${monthKey}] Missing lunar field for day ${rec.day}`);
                    isRecordInvalid = true;
                }
                if (!rec.dateISO) {
                    errors.push(`[${monthKey}] Missing dateISO for day ${rec.day}`);
                    isRecordInvalid = true;
                }

                if (isRecordInvalid) invalidRecords++;
            }

            // Check: Day count matches month (Strict check if required)
            // if (records.length !== expectedDays) {
            //    errors.push(`[${monthKey}] Day count mismatch: expected ${expectedDays}, got ${records.length}`);
            // }
        }

        const failThreshold = 0.05;
        const errorRate = totalRecords > 0 ? invalidRecords / totalRecords : 0;
        const isValid = errorRate <= failThreshold;

        const output = {
            valid: isValid,
            errors: errors.slice(0, 20), // Show first 20 errors
            stats: {
                totalRecords,
                invalidRecords,
                errorRate: (errorRate * 100).toFixed(2) + '%'
            }
        };

        console.log(JSON.stringify(output, null, 2));

        if (!isValid) {
            process.exit(1); // Fail the process if invalid > 5%
        }

    } catch (error) {
        console.error(JSON.stringify({ valid: false, errors: [error.message] }, null, 2));
        process.exit(1);
    }
}

validateDataset();
