import fs from 'fs';

function cleanText() {
    try {
        const inputData = JSON.parse(fs.readFileSync('ingested-pdf.json', 'utf8'));
        const rawText = inputData.rawText || '';

        // 1. Split lines (handle both \r\n and \n)
        let lines = rawText.split(/\r?\n/);
        
        // 2. Trim whitespace from each line
        lines = lines.map(line => line.trim());
        
        // 3. Remove empty lines
        lines = lines.filter(line => line.length > 0);

        const output = {
            lines: lines
        };

        fs.writeFileSync('cleaned-lines.json', JSON.stringify(output, null, 2), 'utf8');
        
        console.log(`Text cleaning successful. Result: ${lines.length} lines.`);
        console.log(JSON.stringify({ lines: lines.slice(0, 5) }, null, 2));

    } catch (error) {
        console.error(`Text cleaning failed: ${error.message}`);
        process.exit(1);
    }
}

cleanText();
