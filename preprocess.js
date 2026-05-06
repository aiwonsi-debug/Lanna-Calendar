import fs from 'fs';

async function preprocess() {
    try {
        const data = JSON.parse(fs.readFileSync('final-utf8.json', 'utf8'));
        const rawText = data.rawText;

        const lines = rawText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.replace(/\s+/g, ' '));

        const output = {
            lines: lines
        };

        // Output to file to avoid terminal truncation and handle large data
        fs.writeFileSync('preprocessed-lines.json', JSON.stringify(output, null, 2));
        
        // Print a small sample and total count for verification
        console.log(JSON.stringify({
            sample: lines.slice(0, 5),
            totalLines: lines.length
        }, null, 2));
    } catch (error) {
        console.error(JSON.stringify({ error: `Preprocessing failed: ${error.message}` }));
        process.exit(1);
    }
}

preprocess();
