import fs from 'fs';

const content = fs.readFileSync('raw-output.json', 'utf16le');
const start = content.indexOf('{');
const end = content.lastIndexOf('}') + 1;
const jsonStr = content.substring(start, end);

try {
    const data = JSON.parse(jsonStr);
    // Ensure rawText exists and has length > 1000
    if (data.rawText && data.rawText.length >= 1000) {
        console.log(JSON.stringify({ rawText: data.rawText }, null, 2));
    } else {
        console.error(JSON.stringify({ error: "PDF extraction failed: text length < 1000 chars" }));
    }
} catch (e) {
    console.error(JSON.stringify({ error: `JSON parsing failed: ${e.message}` }));
}
