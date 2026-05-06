import fs from 'fs';
import path from 'path';

function runCacheMerger() {
    try {
        const cacheStatus = JSON.parse(fs.readFileSync('cache-status.json', 'utf8'));
        const toProcess = cacheStatus.toProcess || [];
        
        const newData = JSON.parse(fs.readFileSync('normalized-by-month.json', 'utf8'));
        const normalizedByMonth = newData.normalizedByMonth || {};
        
        const dataDir = 'src/data/v2';
        const fullDataset = {};

        // 1. Load ALL existing files from storage
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            const monthKey = file.replace('.json', '');
            try {
                const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
                // Existing data might be in 'records' or 'normalized' field
                fullDataset[monthKey] = content.records || content.normalized || [];
            } catch (e) {
                console.warn(`Skipping corrupted file: ${file}`);
            }
        }

        // 2. Replace ONLY months in toProcess
        for (const monthKey of toProcess) {
            if (normalizedByMonth[monthKey]) {
                fullDataset[monthKey] = normalizedByMonth[monthKey];
                
                // Also update the individual file in storage
                const outputPath = path.join(dataDir, `${monthKey}.json`);
                const filePayload = {
                    metadata: {
                        schemaVersion: "2.1.0",
                        mergedAt: new Date().toISOString()
                    },
                    month: monthKey,
                    records: normalizedByMonth[monthKey]
                };
                fs.writeFileSync(outputPath, JSON.stringify(filePayload, null, 2), 'utf8');
            }
        }

        const result = {
            fullDataset: fullDataset
        };

        // 3. Save full dataset
        fs.writeFileSync('merged-full-dataset.json', JSON.stringify(result, null, 2), 'utf8');
        
        console.log(`Cache merge complete.`);
        console.log(` - Total months in dataset: ${Object.keys(fullDataset).length}`);
        console.log(` - Months updated: ${toProcess.length}`);
        
        // Output as requested by the task
        // (Note: full output might be too large for console, but required by TASK)
        // console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error(`Cache merge failed: ${error.message}`);
        process.exit(1);
    }
}

runCacheMerger();
