import fs from 'fs';

function validateCrossTemplate() {
    try {
        // Read the unified normalized output
        const filePath = 'unified-normalized-output.json';
        if (!fs.existsSync(filePath)) {
            console.error(`File not found: ${filePath}`);
            process.exit(1);
        }
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const records = data.normalized || [];
        
        const anomalies = [];
        let isValid = true;
        
        if (records.length === 0) {
            anomalies.push("Dataset is empty.");
            isValid = false;
        }

        // 1. Check missing consecutive days
        // Sort records by day just in case
        const sortedRecords = [...records].sort((a, b) => a.day - b.day);
        const daysPresent = new Set(sortedRecords.map(r => r.day));
        
        if (sortedRecords.length > 0) {
            const minDay = sortedRecords[0].day;
            const maxDay = sortedRecords[sortedRecords.length - 1].day;
            
            for (let i = minDay; i <= maxDay; i++) {
                if (!daysPresent.has(i)) {
                    anomalies.push(`Missing consecutive day: Day ${i} is missing between ${minDay} and ${maxDay}.`);
                    isValid = false;
                }
            }
        }

        // 2. Detect inconsistent structure across days
        const requiredKeys = ['dateISO', 'day', 'lunar', 'labels', 'description', 'score', 'partial'];
        
        sortedRecords.forEach(record => {
            const day = record.day;
            
            // Check for missing keys
            requiredKeys.forEach(key => {
                if (!(key in record)) {
                    anomalies.push(`Inconsistent structure on Day ${day}: Missing key '${key}'.`);
                    isValid = false;
                }
            });
            
            // Check types
            if (record.labels && !Array.isArray(record.labels)) {
                anomalies.push(`Inconsistent structure on Day ${day}: 'labels' should be an array.`);
                isValid = false;
            }
            if (record.description && !Array.isArray(record.description)) {
                anomalies.push(`Inconsistent structure on Day ${day}: 'description' should be an array.`);
                isValid = false;
            }
            if (record.partial !== undefined && typeof record.partial !== 'boolean') {
                anomalies.push(`Inconsistent structure on Day ${day}: 'partial' should be a boolean.`);
                isValid = false;
            }
            if (record.lunar && typeof record.lunar !== 'string') {
                anomalies.push(`Inconsistent structure on Day ${day}: 'lunar' should be a string.`);
                isValid = false;
            }
        });

        // 3. Detect duplicate days
        const duplicateCheck = new Set();
        sortedRecords.forEach(record => {
            if (duplicateCheck.has(record.day)) {
                anomalies.push(`Duplicate day found: Day ${record.day}.`);
                isValid = false;
            }
            duplicateCheck.add(record.day);
        });

        const output = {
            valid: isValid,
            totalRecords: records.length,
            anomalies: anomalies
        };

        fs.writeFileSync('cross-validation-result.json', JSON.stringify(output, null, 2), 'utf8');
        console.log(JSON.stringify(output, null, 2));

        if (!isValid) {
            console.error(`\nVALIDATION FAILED: Found ${anomalies.length} anomalies.`);
            process.exit(1);
        } else {
            console.log(`\nVALIDATION PASSED: Dataset is consistent.`);
        }

    } catch (e) {
        console.error(`Cross-template validation failed: ${e.message}`);
        process.exit(1);
    }
}

validateCrossTemplate();
