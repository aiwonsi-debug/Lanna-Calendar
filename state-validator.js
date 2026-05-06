import fs from 'fs';

function validateRecords() {
    try {
        const inputData = JSON.parse(fs.readFileSync('state-normalized-output.json', 'utf8'));
        const records = inputData.normalized || [];
        
        let errors = [];
        let invalidCount = 0;
        const EXPECTED_DAYS = 31; // Assuming 31 days for full month coverage based on typical requirement

        // 1. Full month coverage
        if (records.length !== EXPECTED_DAYS) {
            errors.push(`Expected ${EXPECTED_DAYS} days, but found ${records.length} records.`);
            invalidCount += Math.abs(EXPECTED_DAYS - records.length);
        }

        const daySet = new Set();
        
        for (const record of records) {
            let recordValid = true;

            // 2. No duplicate day
            if (daySet.has(record.day)) {
                errors.push(`Duplicate day found: ${record.day}`);
                recordValid = false;
            }
            daySet.add(record.day);

            // 3. Each record has lunar
            if (!record.lunar || record.lunar.trim() === '') {
                errors.push(`Missing 'lunar' for day ${record.day}`);
                recordValid = false;
            }

            if (!recordValid && !errors[errors.length - 1].includes('Expected')) {
                invalidCount++;
            }
        }

        const errorPercentage = (invalidCount / EXPECTED_DAYS) * 100;
        const valid = errorPercentage <= 5;

        const output = {
            valid: valid,
            errors: errors,
            errorPercentage: errorPercentage.toFixed(2) + '%'
        };

        fs.writeFileSync('state-validation-result.json', JSON.stringify(output, null, 2), 'utf8');
        console.log(JSON.stringify(output, null, 2));

        if (!valid) {
            console.error(`\nBLOCKING ERROR: Invalid rate is ${output.errorPercentage}, which exceeds the 5% threshold.`);
            process.exit(1);
        } else {
            console.log(`\nVALIDATION PASSED: Dataset meets the required standards.`);
        }

    } catch (error) {
        console.error(`Validation script failed: ${error.message}`);
        process.exit(1);
    }
}

validateRecords();
