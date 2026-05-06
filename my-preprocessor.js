import fs from 'fs';

function preprocess() {
    try {
        const content = fs.readFileSync('output-raw.json', 'utf8');
        
        // Find the content of rawText manually to bypass JSON parsing errors
        const marker = '"rawText": "';
        const startIdx = content.indexOf(marker);
        if (startIdx === -1) {
            console.error(JSON.stringify({ error: "Could not find rawText marker in output-raw.json" }));
            return;
        }
        
        const textStart = startIdx + marker.length;
        // Search for the end of rawText by looking for the closing quote that isn't escaped
        let textEnd = -1;
        for (let i = textStart; i < content.length; i++) {
            if (content[i] === '"' && content[i-1] !== '\\') {
                textEnd = i;
                break;
            }
        }
        
        if (textEnd === -1) {
            textEnd = content.length;
            // Maybe it's missing the closing brace/quote
            if (content.endsWith('"}')) textEnd -= 2;
            else if (content.endsWith('"} ')) textEnd -= 3;
        }
        
        let rawText = content.substring(textStart, textEnd);
        
        // Unescape JSON string characters
        rawText = rawText
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\u([0-9a-fA-F]{4})/g, (match, grp) => {
                return String.fromCharCode(parseInt(grp, 16));
            });

        // OPERATIONS:
        // * Split by newline
        const lines = rawText.split(/\r?\n/)
            // * Trim whitespace
            .map(line => line.trim())
            // * Remove empty lines
            .filter(line => line.length > 0)
            // * Normalize spacing (single space)
            .map(line => line.replace(/\s+/g, ' '));

        const output = {
            lines: lines
        };

        // Write directly to file to ensure UTF-8 encoding on Windows
        fs.writeFileSync('processed-output.json', JSON.stringify(output, null, 2), 'utf8');
        console.log("Successfully processed and saved to processed-output.json");
    } catch (error) {
        console.error(JSON.stringify({ error: `Preprocessing failed: ${error.message}` }));
    }
}

preprocess();
