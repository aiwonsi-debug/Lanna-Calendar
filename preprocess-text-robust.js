import fs from 'fs';

async function extractAndPreprocess() {
    try {
        const filePath = 'C:/Users/psc-cm/.gemini/tmp/lanna-calendar-v2c/tool-outputs/session-11060b03-209f-4277-8f45-204be6852acb/run_shell_command_1777975505480_0.txt';
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Find the content of rawText manually
        const marker = '"rawText": "';
        const startIdx = content.indexOf(marker);
        if (startIdx === -1) throw new Error('Could not find rawText marker');
        
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
            // If we can't find a proper end quote (maybe truncated), just take till the end
            textEnd = content.length;
        }
        
        let rawText = content.substring(textStart, textEnd);
        
        // Unescape JSON string characters manually
        rawText = rawText
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t');

        const lines = rawText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.replace(/\s+/g, ' '));

        const output = {
            lines: lines
        };

        console.log(JSON.stringify(output, null, 2));
    } catch (error) {
        console.error(JSON.stringify({ error: `Preprocessing failed: ${error.message}` }));
        process.exit(1);
    }
}

extractAndPreprocess();
