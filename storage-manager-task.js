import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function runStorageManager() {
    try {
        const pdfPath = './lanna-calendar-2569.pdf';
        const dataDir = 'src/data/v2';
        const normalizedFile = 'normalized-output.json';

        // 1. Generate PDF Hash
        if (!fs.existsSync(pdfPath)) {
            throw new Error(`PDF file not found: ${pdfPath}`);
        }
        const fileBuffer = fs.readFileSync(pdfPath);
        const pdfHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        // 2. Load Normalized Data
        if (!fs.existsSync(normalizedFile)) {
            throw new Error(`Normalized data file not found: ${normalizedFile}`);
        }
        const normalizedData = JSON.parse(fs.readFileSync(normalizedFile, 'utf8'));

        // 3. Persist each month
        const processedMonths = [];
        for (const [monthKey, records] of Object.entries(normalizedData)) {
            const outputPath = path.join(dataDir, `${monthKey}.json`);
            
            const payload = {
                metadata: {
                    schemaVersion: "2.1.0",
                    templateType: "T3_HYBRID",
                    pdfHash: pdfHash,
                    storedAt: new Date().toISOString()
                },
                month: monthKey,
                records: records
            };

            fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf8');
            processedMonths.push(monthKey);
        }

        // 4. Update Cache Status
        const cacheStatus = {
            pdfHash: pdfHash,
            lastProcessed: new Date().toISOString(),
            months: processedMonths
        };
        fs.writeFileSync('cache-status.json', JSON.stringify(cacheStatus, null, 2), 'utf8');

        // Final Output for Role TASK
        const output = {
            cacheKey: pdfHash.substring(0, 16), // Use short hash as key
            stored: true
        };

        console.log(JSON.stringify(output, null, 2));

    } catch (error) {
        console.error(JSON.stringify({ cacheKey: "unknown", stored: false, error: error.message }, null, 2));
        process.exit(1);
    }
}

runStorageManager();
