import fs from 'fs';

// Read as UTF-16LE (because PowerShell redirected stdout as such)
const content = fs.readFileSync('raw-output.json', 'utf16le');
const start = content.indexOf('{');
const end = content.lastIndexOf('}') + 1;
const jsonStr = content.substring(start, end);

try {
    const data = JSON.parse(jsonStr);
    // Print the rawText field as requested
    const result = {
        rawText: data.rawText
    };
    // Force output to be UTF-8
    process.stdout.write(JSON.stringify(result, null, 2));
} catch (e) {
    console.error("Extraction failed: " + e.message);
}
