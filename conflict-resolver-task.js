import fs from 'fs';
import path from 'path';

/**
 * Conflict Resolver for Lanna Calendar
 * Resolves conflicting records deterministically based on defined strategies.
 */
function runConflictResolver() {
    try {
        const dataDir = 'src/data/v2';
        const files = fs.readdirSync(dataDir).filter(f => !f.startsWith('resolved-') && f.endsWith('.json'));
        
        // Strategy 1: SOURCE PRIORITY (User-defined)
        // Highest priority first. 'legacy-data' is bottom.
        const sourcePriority = [
            "06907439-5253-408f-80a6-e2ec94e0ce6f", // Latest PDF registration
            "legacy-v2.1",
            "legacy-data",
            "unknown"
        ];

        for (const file of files) {
            const filePath = path.join(dataDir, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const monthKey = content.month;

            // 1. Group ALL records from ALL versions by dateISO
            const dateMap = {}; // { dateISO: [ { sourceId, version, updatedAt, data } ] }

            const versions = content.records || [];
            for (const v of versions) {
                const dayRecords = v.data || [];
                for (const day of dayRecords) {
                    const dateISO = day.dateISO;
                    if (!dateISO) continue;

                    if (!dateMap[dateISO]) dateMap[dateISO] = [];
                    dateMap[dateISO].push({
                        sourceId: v.sourceId,
                        version: v.version,
                        updatedAt: v.updatedAt,
                        data: day
                    });
                }
            }

            const resolvedRecords = [];

            // 2. Resolve conflicts per date
            for (const [dateISO, variations] of Object.entries(dateMap)) {
                if (variations.length === 1) {
                    resolvedRecords.push(variations[0].data);
                    continue;
                }

                // --- CONFLICT DETECTED ---
                
                // Strategy 1 & 2: Sort by Source Priority, then by Latest Version (updatedAt)
                variations.sort((a, b) => {
                    const prioA = sourcePriority.indexOf(a.sourceId);
                    const prioB = sourcePriority.indexOf(b.sourceId);
                    
                    // Lower index = Higher priority
                    if (prioA !== prioB) return (prioA === -1 ? 99 : prioA) - (prioB === -1 ? 99 : prioB);
                    
                    // Same source -> Strategy 2: LATEST VERSION
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });

                // Strategy 3: FIELD MERGE (fallback for similar priority levels)
                // For this implementation, we take the top winner but merge labels/descriptions 
                // from other variations if they have different content.
                const winner = variations[0].data;
                const otherVariations = variations.slice(1);

                for (const other of otherVariations) {
                    // Merge Labels (Union)
                    winner.labels = Array.from(new Set([...winner.labels, ...(other.data.labels || [])]));
                    
                    // Merge Description (Concat unique)
                    const otherDesc = other.data.description || [];
                    for (const desc of otherDesc) {
                        if (!winner.description.includes(desc)) {
                            winner.description.push(desc);
                        }
                    }
                }

                resolvedRecords.push(winner);
            }

            // 3. Sort resolved records by day
            resolvedRecords.sort((a, b) => a.day - b.day);

            // 4. Persist resolved data (we store separately to keep versions intact)
            const outputPath = path.join(dataDir, `resolved-${monthKey}.json`);
            fs.writeFileSync(outputPath, JSON.stringify({
                metadata: {
                    resolvedAt: new Date().toISOString(),
                    strategy: "PRIORITY > VERSION > MERGE"
                },
                month: monthKey,
                records: resolvedRecords
            }, null, 2), 'utf8');
            
            // Log success for May 2026 as sample
            if (monthKey === '2026-05') {
               // console.log(`Resolved ${monthKey}: ${resolvedRecords.length} records`);
            }
        }

        console.log(JSON.stringify({ status: "Success", message: "Conflicts resolved for all months." }, null, 2));

    } catch (error) {
        console.error(JSON.stringify({ status: "Error", error: error.message }, null, 2));
        process.exit(1);
    }
}

runConflictResolver();
