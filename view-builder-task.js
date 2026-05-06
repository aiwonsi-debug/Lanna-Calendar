import fs from 'fs';
import path from 'path';

/**
 * View Builder for Lanna Calendar
 * Compiles resolved monthly data into a single final dataset for the UI.
 */
function runViewBuilder() {
    try {
        const dataDir = 'src/data/v2';
        // Look for resolved files specifically
        const files = fs.readdirSync(dataDir).filter(f => f.startsWith('resolved-') && f.endsWith('.json'));
        
        const finalDataset = {};

        for (const file of files) {
            const filePath = path.join(dataDir, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            const monthKey = content.month;
            const records = content.records || [];
            
            // Map to the final structure
            finalDataset[monthKey] = records;
        }

        const output = {
            finalDataset: finalDataset
        };

        // 1. Save to the designated output file
        fs.writeFileSync('final-ui-dataset.json', JSON.stringify(output, null, 2), 'utf8');

        // 2. Also update the main merged file for the Virtualized Calendar to pick up
        fs.writeFileSync('merged-full-dataset.json', JSON.stringify({ fullDataset: finalDataset }, null, 2), 'utf8');
        
        console.log(JSON.stringify({
            status: "Success",
            monthCount: Object.keys(finalDataset).length,
            sampleKeys: Object.keys(finalDataset).slice(0, 5)
        }, null, 2));

    } catch (error) {
        console.error(JSON.stringify({ status: "Error", error: error.message }, null, 2));
        process.exit(1);
    }
}

runViewBuilder();
