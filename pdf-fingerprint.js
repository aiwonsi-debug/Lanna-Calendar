import fs from 'fs';
import crypto from 'crypto';

/**
 * Generates a SHA-256 hash of a file to serve as a unique fingerprint.
 * @param {string} filePath - Path to the file.
 * @returns {string} - SHA-256 hash string.
 */
function generateFingerprint(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const fileBuffer = fs.readFileSync(filePath);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        
        const fileHash = hashSum.digest('hex');
        
        const output = {
            fileHash: fileHash
        };

        console.log(JSON.stringify(output, null, 2));
        
        // Optional: Save to a small metadata file for later comparison
        // fs.writeFileSync('pdf-hash.json', JSON.stringify(output, null, 2));
        
        return fileHash;
    } catch (error) {
        console.error(JSON.stringify({ error: error.message }));
        process.exit(1);
    }
}

const pdfPath = './lanna-calendar-2569.pdf';
generateFingerprint(pdfPath);
