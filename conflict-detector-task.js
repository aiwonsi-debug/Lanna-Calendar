import fs from 'fs';
import path from 'path';

/**
 * Conflict Detector for Lanna Calendar
 * Compares data across different sources for the same dateISO.
 */
function runConflictDetector() {
    try {
        const dataDir = 'src/data/v2';
        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        
        const allConflicts = [];

        for (const file of files) {
            const filePath = path.join(dataDir, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            // Normalize records to the expected schema if they are legacy
            let versions = [];
            if (Array.isArray(content.records)) {
                // Check if it's already a list of version objects or a list of day records
                if (content.records.length > 0 && content.records[0].data && Array.isArray(content.records[0].data)) {
                    versions = content.records;
                } else {
                    // Legacy: records is DayRecord[]
                    versions = [{
                        sourceId: "legacy-data",
                        version: 0,
                        data: content.records
                    }];
                }
            }

            // Map dateISO to all variations found
            const dateMap = {}; // { dateISO: [ { sourceId, hash, dayDataString } ] }

            for (const v of versions) {
                const sourceInfo = `${v.sourceId} (v${v.version})`;
                const dayRecords = v.data || [];

                for (const day of dayRecords) {
                    const dateISO = day.dateISO;
                    if (!dateISO) continue;

                    // Stringify data for comparison (strip metadata if any)
                    const { sourceId, version, updatedAt, fileHash, ...pureData } = day;
                    const dataStr = JSON.stringify(pureData);

                    if (!dateMap[dateISO]) {
                        dateMap[dateISO] = [];
                    }

                    // Check if we already have this specific data for this date
                    const existing = dateMap[dateISO].find(e => e.dataStr === dataStr);
                    if (existing) {
                        existing.sources.push(sourceInfo);
                    } else {
                        dateMap[dateISO].push({
                            dataStr,
                            sources: [sourceInfo]
                        });
                    }
                }
            }

            // Detect conflicts: dateISOs that have more than 1 unique data variation
            for (const [dateISO, variations] of Object.entries(dateMap)) {
                if (variations.length > 1) {
                    allConflicts.push({
                        dateISO,
                        sources: variations.map(v => ({
                            source: v.sources,
                            // data: JSON.parse(v.dataStr) // Optional: for debugging
                        }))
                    });
                }
            }
        }

        const output = {
            conflicts: allConflicts
        };

        console.log(JSON.stringify(output, null, 2));

    } catch (error) {
        console.error(JSON.stringify({ error: error.message }, null, 2));
        process.exit(1);
    }
}

runConflictDetector();
