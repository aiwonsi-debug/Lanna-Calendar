import fs from 'fs';
import path from 'path';

/**
 * Storage Engine for Lanna Calendar
 * Stores multiple versions of data per month without overwriting.
 */
function runStorageEngine() {
    try {
        // 1. Load Normalized Data with Metadata
        const normalizedFile = 'normalized-v2-metadata.json';
        if (!fs.existsSync(normalizedFile)) {
            throw new Error(`Normalized data not found: ${normalizedFile}`);
        }
        const { normalizedRecords } = JSON.parse(fs.readFileSync(normalizedFile, 'utf8'));

        const dataDir = 'src/data/v2';
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const stats = {
            monthsUpdated: 0,
            versionsStored: 0
        };

        // 2. Process each month
        for (const [monthKey, dayRecords] of Object.entries(normalizedRecords)) {
            const filePath = path.join(dataDir, `${monthKey}.json`);
            let fileContent = {
                month: monthKey,
                records: []
            };

            // 3. Load existing content if exists
            if (fs.existsSync(filePath)) {
                try {
                    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    if (Array.isArray(existing.records)) {
                        // Check if it's already a list of version objects or a list of day records
                        if (existing.records.length > 0 && existing.records[0].data && Array.isArray(existing.records[0].data)) {
                            fileContent.records = existing.records;
                        } else {
                            // Legacy: records is DayRecord[] -> Wrap it
                            fileContent.records = [{
                                sourceId: "legacy-v2.1",
                                version: 0,
                                updatedAt: new Date(fs.statSync(filePath).mtime).toISOString(),
                                data: existing.records
                            }];
                        }
                    }
                } catch (e) {
                    console.warn(`[StorageEngine] Handling corrupted or old format file: ${monthKey}.json`);
                }
            }

            // 4. Prepare new version entry (extracting metadata from first record)
            const metadata = dayRecords[0] || {};
            const newVersionEntry = {
                sourceId: metadata.sourceId || "unknown",
                version: metadata.version || 1,
                updatedAt: metadata.updatedAt || new Date().toISOString(),
                fileHash: metadata.fileHash || "",
                data: dayRecords.map(r => {
                    // Strip storage-specific metadata from individual day records to save space
                    const { sourceId, fileHash, version, updatedAt, ...cleanData } = r;
                    return cleanData;
                })
            };

            // 5. Rule: No overwrite. Check if this version from this source already exists
            const existingIndex = fileContent.records.findIndex(
                r => r.sourceId === newVersionEntry.sourceId && r.version === newVersionEntry.version
            );

            if (existingIndex > -1) {
                // Technically an overwrite of the SAME version, but we append if version/source differs
                fileContent.records[existingIndex] = newVersionEntry;
            } else {
                fileContent.records.push(newVersionEntry);
            }

            // 6. Persist
            fs.writeFileSync(filePath, JSON.stringify(fileContent, null, 2), 'utf8');
            
            stats.monthsUpdated++;
            stats.versionsStored++;
        }

        console.log(JSON.stringify({
            status: "Success",
            stats: stats
        }, null, 2));

    } catch (error) {
        console.error(JSON.stringify({ status: "Error", error: error.message }, null, 2));
        process.exit(1);
    }
}

runStorageEngine();
