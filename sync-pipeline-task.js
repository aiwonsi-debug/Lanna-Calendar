import fs from 'fs';
import { execSync } from 'child_process';

/**
 * Sync Engine Orchestrator
 * Monitors sources and re-runs conflict resolution to update materialized views.
 */
function runSyncPipeline() {
    try {
        console.log("[SyncEngine] Starting integrity check...");

        // 1. Check for New/Updated Sources
        // We compare sources.json against a last-synced marker
        const sources = JSON.parse(fs.readFileSync('sources.json', 'utf8'));
        const syncMetaPath = 'sync-metadata.json';
        let syncMeta = { lastSourceCount: 0, knownHashes: [] };

        if (fs.existsSync(syncMetaPath)) {
            syncMeta = JSON.parse(fs.readFileSync(syncMetaPath, 'utf8'));
        }

        const currentHashes = sources.map(s => s.fileHash);
        const hasNewSource = sources.length > syncMeta.lastSourceCount;
        const hasUpdatedSource = currentHashes.some(h => !syncMeta.knownHashes.includes(h));

        if (hasNewSource || hasUpdatedSource) {
            console.log("[SyncEngine] Change detected. Triggering Conflict Resolution Pipeline...");

            // 2. Re-run Conflict Resolution
            // This script produces the resolved-YYYY-MM.json files (Materialized View)
            execSync('node conflict-resolver-task.js', { stdio: 'inherit' });

            // 3. Update View Builder (Compile final dataset)
            execSync('node view-builder-task.js', { stdio: 'inherit' });

            // 4. Update Sync Metadata
            syncMeta.lastSourceCount = sources.length;
            syncMeta.knownHashes = currentHashes;
            syncMeta.lastSyncAt = new Date().toISOString();
            fs.writeFileSync(syncMetaPath, JSON.stringify(syncMeta, null, 2));

            console.log(JSON.stringify({
                updated: true,
                trigger: hasNewSource ? "NEW_SOURCE" : "SOURCE_UPDATE",
                timestamp: syncMeta.lastSyncAt,
                message: "Materialized view successfully updated."
            }, null, 2));
        } else {
            console.log(JSON.stringify({
                updated: false,
                message: "No changes in sources. Materialized view is already optimal."
            }, null, 2));
        }

    } catch (error) {
        console.error("[SyncEngine] Pipeline failed:", error.message);
        process.exit(1);
    }
}

runSyncPipeline();
