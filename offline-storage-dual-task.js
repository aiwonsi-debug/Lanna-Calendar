import fs from 'fs';
import path from 'path';

/**
 * Task to simulate persisting both raw versions and resolved data to offline storage.
 */
function runOfflineStorageTask() {
    try {
        // 1. Collect Resolved Dataset
        const resolvedFile = 'final-ui-dataset.json';
        const resolvedData = JSON.parse(fs.readFileSync(resolvedFile, 'utf8')).finalDataset;

        // 2. Collect Raw Multi-version Data
        const dataDir = 'src/data/v2';
        const rawVersions = {};
        const files = fs.readdirSync(dataDir).filter(f => !f.startsWith('resolved-') && f.endsWith('.json'));
        
        for (const file of files) {
            const monthKey = file.replace('.json', '');
            const content = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
            rawVersions[monthKey] = content.records; // This is the array of versions [{sourceId, data}]
        }

        // 3. Get Metadata
        const sources = JSON.parse(fs.readFileSync('sources.json', 'utf8'));
        const fileHash = sources[sources.length - 1].fileHash;

        // 4. Create the dual-payload OfflineCache
        const offlineCache = {
            resolvedData: resolvedData,
            rawVersions: rawVersions,
            fileHash: fileHash,
            lastUpdated: new Date().toISOString()
        };

        // 5. Persist to a mock local file (simulating IndexedDB/LocalCache)
        fs.writeFileSync('offline-persistent-cache.json', JSON.stringify(offlineCache, null, 2), 'utf8');

        console.log(JSON.stringify({
            stored: true,
            resolvedMonthCount: Object.keys(resolvedData).length,
            rawVersionMonthCount: Object.keys(rawVersions).length,
            message: "Both raw and resolved data persisted for future re-resolution."
        }, null, 2));

    } catch (error) {
        console.error(JSON.stringify({ stored: false, error: error.message }, null, 2));
        process.exit(1);
    }
}

runOfflineStorageTask();
