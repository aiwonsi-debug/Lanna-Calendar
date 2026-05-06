import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const pdfPath = './lanna-calendar-2569.pdf';

async function extractText() {
    try {
        if (!fs.existsSync(pdfPath)) {
            console.error(`PDF extraction failed: File not found at ${pdfPath}`);
            process.exit(1);
        }

        const dataBuffer = fs.readFileSync(pdfPath);
        
        // Use pdf-parse to extract text, preserving line structure
        const data = await pdf(dataBuffer);
        
        const output = {
            rawText: data.text
        };

        if (!output.rawText || output.rawText.length < 100) {
            console.error(JSON.stringify({ error: "PDF extraction failed: Invalid or empty text." }));
            process.exit(1);
        }

        // Save to file to avoid PowerShell encoding/redirection issues
        fs.writeFileSync('ingested-pdf.json', JSON.stringify(output, null, 2), 'utf8');
        
        console.log(`Extraction successful. Extracted ${output.rawText.length} characters.`);
        console.log("OUTPUT (preview):");
        console.log(JSON.stringify({ rawText: output.rawText.substring(0, 100) + '...' }, null, 2));
        
    } catch (error) {
        console.error(JSON.stringify({ error: `PDF extraction failed: ${error.message}` }));
        process.exit(1); // Abort if extraction fails
    }
}

extractText();
