import fs from 'fs';

async function preprocess() {
    try {
        const rawData = JSON.parse(fs.readFileSync('./output-raw.json', 'utf8'));
        const rawText = rawData.rawText;

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

preprocess();
