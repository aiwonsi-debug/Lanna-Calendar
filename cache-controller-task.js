import fs from 'fs';
import path from 'path';

function runCacheController() {
    try {
        // 1. Get current registration info
        const sources = JSON.parse(fs.readFileSync('sources.json', 'utf8'));
        const latestSource = sources[sources.length - 1];
        const { sourceId, fileHash } = latestSource;

        // 2. Get detected months for this source
        // (In a real pipeline this would be piped, here we re-detect or use previous knowledge)
        // For this task, I'll use the 11 months found in the previous step.
        const detectedMonths = [
            "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", 
            "2026-06", "2026-07", "2026-08", "2026-09", "2026-10", "2026-11"
        ];

        const dataDir = 'src/data/v2';
        const toProcess = [];

        // 3. Logic: Compare (sourceId + month + fileHash)
        for (const month of detectedMonths) {
            const filePath = path.join(dataDir, `${month}.json`);
            
            if (fs.existsSync(filePath)) {
                try {
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    const meta = content.metadata || {};
                    
                    // Check triplet: sourceId, month (filename), and fileHash
                    const isUnchanged = (
                        meta.sourceId === sourceId && 
                        content.month === month && 
                        meta.pdfHash === fileHash // Or meta.fileHash depending on schema
                    );

                    if (!isUnchanged) {
                        toProcess.push({ sourceId, month });
                    }
                } catch (e) {
                    toProcess.push({ sourceId, month }); // Corrupted
                }
            } else {
                toProcess.push({ sourceId, month }); // New
            }
        }

        const output = {
            toProcess: toProcess
        };

        // Log the result as requested by the TASK
        console.log(JSON.stringify(output, null, 2));
        
        // Save for next step
        fs.writeFileSync('cache-status-v2.json', JSON.stringify(output, null, 2), 'utf8');

    } catch (error) {
        console.error(JSON.stringify({ error: error.message }, null, 2));
        process.exit(1);
    }
}

runCacheController();
