import fs from 'fs';
import path from 'path';

/**
 * Script to migrate generated legacy files to the new resolved schema.
 */
function migrateGeneratedFiles() {
    try {
        const dataDir = 'src/data/v2';
        const files = fs.readdirSync(dataDir).filter(f => !f.startsWith('resolved-') && f.match(/^\d{4}-\d{2}\.json$/));
        
        console.log(`Migrating ${files.length} generated files...`);

        for (const file of files) {
            const filePath = path.join(dataDir, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            // Skip if it's already in the new versioned schema (records array of version objects)
            if (content.records && Array.isArray(content.records) && content.records.length > 0 && content.records[0].sourceId) {
                // This is a versioned file from our storage engine (e.g. 2026 data)
                // We should run the conflict resolver on these instead of this migration
                continue;
            }

            const monthKey = file.replace('.json', '');
            const [year, month] = monthKey.split('-');
            
            const resolvedRecords = (content.days || []).map(d => {
                let score = 'neutral';
                if (d.labels?.good?.length > 0) score = 'good';
                else if (d.labels?.bad?.length > 0) score = 'bad';

                const labels = [
                    ...(d.labels?.good || []),
                    ...(d.labels?.bad || []),
                    ...(d.labels?.special || [])
                ];

                return {
                    dateISO: `${monthKey}-${String(d.d).padStart(2, '0')}`,
                    day: d.d,
                    lunar: d.l || "",
                    labels: labels,
                    description: [d.description].filter(x => x),
                    score: score
                };
            });

            const output = {
                metadata: {
                    resolvedAt: new Date().toISOString(),
                    strategy: "MIGRATED_FROM_GENERATOR"
                },
                month: monthKey,
                records: resolvedRecords
            };

            fs.writeFileSync(path.join(dataDir, `resolved-${file}`), JSON.stringify(output, null, 2));
        }

        console.log("Migration complete.");
    } catch (error) {
        console.error("Migration failed:", error.message);
    }
}

migrateGeneratedFiles();
