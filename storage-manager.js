import fs from 'fs';
import crypto from 'crypto';

function storeData() {
    try {
        const pdfPath = 'lanna-calendar-2569.pdf';
        
        let pdfHash = '';
        if (fs.existsSync(pdfPath)) {
            const fileBuffer = fs.readFileSync(pdfPath);
            const hashSum = crypto.createHash('md5');
            hashSum.update(fileBuffer);
            pdfHash = hashSum.digest('hex');
        } else {
            console.error(`PDF file ${pdfPath} not found. Proceeding without hash.`);
            pdfHash = 'no-pdf-found';
        }
        
        const inputData = JSON.parse(fs.readFileSync('normalized-records.json', 'utf8'));
        const normalized = inputData.normalized || [];
        
        const cacheKey = `2026-05_${pdfHash}`;
        
        const output = {
            cacheKey: cacheKey,
            pdfHash: pdfHash,
            month: '2026-05',
            records: normalized
        };
        
        const dir = 'src/data/v2';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const savePath = `${dir}/2026-05.json`;
        fs.writeFileSync(savePath, JSON.stringify(output, null, 2), 'utf8');
        
        const result = {
            cacheKey: cacheKey,
            stored: true
        };
        
        console.log(JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error(`Storage failed: ${error.message}`);
        console.log(JSON.stringify({ cacheKey: '', stored: false, error: error.message }, null, 2));
    }
}

storeData();