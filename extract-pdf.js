import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const pdfPath = './lanna-calendar-2569.pdf';

async function extractText() {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);
        
        const output = {
            rawText: data.text
        };

        if (output.rawText.length < 1000) {
            console.error(JSON.stringify({ error: "PDF extraction failed: text length < 1000 chars" }));
            process.exit(1);
        }

        console.log(JSON.stringify(output, null, 2));
    } catch (error) {
        console.error(JSON.stringify({ error: `PDF extraction failed: ${error.message}` }));
        process.exit(1);
    }
}

extractText();
