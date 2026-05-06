import fs from 'fs';

function unifiedNormalize() {
    try {
        // Read input from one of the parsers (e.g. hybrid parser)
        const inputData = JSON.parse(fs.readFileSync('hybrid-records.json', 'utf8'));
        const rawRecords = inputData.extractedRecords || [];
        
        // Mock metadata from Classifier (In real pipeline, this is passed down)
        const metadata = {
            templateType: "T3",
            confidence: 0.95
        };

        const goodKeywords = ['ดี', 'มงคล', 'เหมาะ', 'โชค', 'สิทธิ', 'ไชย', 'รับได้'];
        const badKeywords = ['ไม่ดี', 'เสีย', 'หลีกเลี่ยง', 'มัจจุ', 'วอดวาย', 'ไหม้', 'ตาย', 'เก้ากอง'];

        const normalizedRecords = rawRecords.map((rec, index) => {
            // Determine day (Fallback or partial might have "Unknown")
            // If unknown, we assign a placeholder or sequential number for schema compatibility
            let day = parseInt(rec.day, 10);
            if (isNaN(day)) day = index + 1; // Fallback assignment
            
            // Format ISO date (assuming May 2026 for this dataset)
            const dayStr = String(day).padStart(2, '0');
            const dateISO = `2026-05-${dayStr}`;

            // Ensure lunar is string
            const lunar = (rec.lunar || '').trim();

            // Unified description array
            let descriptions = [];
            if (Array.isArray(rec.details)) {
                descriptions = [...rec.details];
            } else if (rec.description) {
                descriptions.push(rec.description);
            }

            // Extract labels (e.g. if any description is short, treat as label, or just leave empty)
            const labels = [];
            
            // Compute score based on combined text
            const fullText = descriptions.join(' ');
            let score = 'neutral';
            
            if (badKeywords.some(kw => fullText.includes(kw))) {
                score = 'bad';
            } else if (goodKeywords.some(kw => fullText.includes(kw))) {
                score = 'good';
            }

            // Construct unified schema
            const unifiedRecord = {
                dateISO,
                day,
                lunar,
                labels,
                description: descriptions,
                score,
                partial: rec.partial || false // Inherit partial flag from Fallback parser if any
            };

            return unifiedRecord;
        });

        // Final payload structure
        const output = {
            metadata: metadata,
            normalized: normalizedRecords
        };

        fs.writeFileSync('unified-normalized-output.json', JSON.stringify(output, null, 2), 'utf8');
        console.log(`Successfully unified ${normalizedRecords.length} records.`);
        console.log(JSON.stringify(output, null, 2));

    } catch (e) {
        console.error(`Unified normalization failed: ${e.message}`);
    }
}

unifiedNormalize();
