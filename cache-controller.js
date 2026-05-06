import fs from 'fs';
import path from 'path';

function runCacheController() {
    try {
        // 1. Load Inputs
        const detectedMonthsData = JSON.parse(fs.readFileSync('detected-months.json', 'utf8'));
        const detectedMonths = detectedMonthsData.months || [];
        
        const fingerprintData = JSON.parse(fs.readFileSync('pdf-hash.json', 'utf8'));
        const currentHash = fingerprintData.fileHash;

        const dataDir = 'src/data/v2';
        const toProcess = [];
        const skipped = [];

        // 2. Logic: Compare each month's existing file and hash
        for (const monthKey of detectedMonths) {
            const filePath = path.join(dataDir, `${monthKey}.json`);
            
            if (fs.existsSync(filePath)) {
                try {
                    const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    const existingHash = existingData.metadata?.pdfHash;

                    if (existingHash === currentHash) {
                        skipped.push(monthKey);
                    } else {
                        toProcess.push(monthKey); // Hash changed
                    }
                } catch (e) {
                    toProcess.push(monthKey); // Corruption or old format
                }
            } else {
                toProcess.push(monthKey); // New month
            }
        }

        const output = {
            toProcess,
            skipped
        };

        // 3. Persist for next tasks
        fs.writeFileSync('cache-status.json', JSON.stringify(output, null, 2), 'utf8');
        
        console.log(`Cache control complete.`);
        console.log(` - To process: ${toProcess.length}`);
        console.log(` - Skipped: ${skipped.length}`);
        console.log(JSON.stringify(output, null, 2));

    } catch (error) {
        console.error(`Cache control failed: ${error.message}`);
        process.exit(1);
    }
}

runCacheController();
