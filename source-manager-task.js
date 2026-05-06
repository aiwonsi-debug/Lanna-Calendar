import fs from 'fs';
import crypto from 'crypto';

/**
 * Source Manager for Lanna Calendar
 * Registers PDF sources with unique IDs and hashes.
 */
function registerSource(pdfPath, sourceName) {
    try {
        if (!fs.existsSync(pdfPath)) {
            throw new Error(`File not found: ${pdfPath}`);
        }

        // 1. Generate SHA-256 fileHash
        const fileBuffer = fs.readFileSync(pdfPath);
        const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

        // 2. Generate UUID v4 for sourceId
        const sourceId = crypto.randomUUID();

        const registryPath = 'sources.json';
        let registry = [];

        if (fs.existsSync(registryPath)) {
            registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
        }

        // Check if already registered by hash
        const existing = registry.find(s => s.fileHash === fileHash);
        
        if (existing) {
            console.log(JSON.stringify({
                sourceId: existing.sourceId,
                fileHash: existing.fileHash,
                message: "Source already registered"
            }, null, 2));
            return;
        }

        // 3. Register new source
        const newSource = {
            sourceId,
            sourceName,
            fileHash,
            fileName: pdfPath.split('/').pop(),
            registeredAt: new Date().toISOString()
        };

        registry.push(newSource);
        fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf8');

        // 4. Output as requested
        console.log(JSON.stringify({
            sourceId: newSource.sourceId,
            fileHash: newSource.fileHash
        }, null, 2));

    } catch (error) {
        console.error(JSON.stringify({ error: error.message }, null, 2));
        process.exit(1);
    }
}

const pdfPath = './lanna-calendar-2569.pdf';
const sourceName = 'ปฏิทินล้านนา พ.ศ. 2569 (ฉบับวัดธาตุคำ)';

registerSource(pdfPath, sourceName);
