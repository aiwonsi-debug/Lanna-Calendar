import fs from 'fs';

function classifyDocument() {
    try {
        const data = JSON.parse(fs.readFileSync('processed-output.json', 'utf8'));
        // Use first 500 lines as sample
        const sampleLines = data.lines.slice(0, 500);
        
        let stats = {
            keywords: 0,
            numericOnly: 0,
            groupedNumbers: 0,
            longText: 0
        };
        
        for (const line of sampleLines) {
            const cleanLine = line.trim();
            if (!cleanLine) continue;
            
            // Check keywords
            if (/เดือน|แรม|ขึ้น|ออก/.test(cleanLine)) stats.keywords++;
            
            // Check numeric only (1-2 digits, Arabic or Thai)
            if (/^([0-9]{1,2}|[๑-๙]|[๑-๒][๐-๙]|๓[๐-๑])$/.test(cleanLine)) {
                stats.numericOnly++;
            }
            
            // Check grouped numbers (grid pattern like ๑๒๓๔๕)
            if (/^[0-9๑-๙\s]{3,}$/.test(cleanLine)) {
                stats.groupedNumbers++;
            }
            
            // Check long text (paragraph pattern)
            if (cleanLine.length > 40 && !/^[0-9๑-๙\s]+$/.test(cleanLine)) {
                stats.longText++;
            }
        }
        
        // Calculate heuristic scores for each template
        // T1: Standard grid (High grouped numbers + numeric only, low text)
        const scoreT1 = (stats.groupedNumbers * 3 + stats.numericOnly * 2) / (stats.longText + 1);
        
        // T2: Paragraph-based (High long text, low numeric groups)
        const scoreT2 = (stats.longText * 3 + stats.keywords) / (stats.groupedNumbers + 1);
        
        // T3: Mixed format (Both grid/numeric and paragraphs present significantly)
        const scoreT3 = (stats.groupedNumbers * 2 + stats.longText * 1.5 + stats.keywords);
        
        let templateType = "T_UNKNOWN";
        let confidence = 0.0;
        
        // Determine template and normalize confidence (0.0 to 1.0)
        // These thresholds are heuristics based on PDF extraction artifacts
        if (stats.groupedNumbers > 2 && stats.longText > 10) {
            templateType = "T3";
            confidence = Math.min(0.95, scoreT3 / 100);
        } else if (scoreT1 > scoreT2 && stats.groupedNumbers > 5) {
            templateType = "T1";
            confidence = Math.min(0.90, scoreT1 / 20);
        } else if (scoreT2 > scoreT1 && stats.longText > 20) {
            templateType = "T2";
            confidence = Math.min(0.85, scoreT2 / 30);
        }
        
        // Output formatting
        if (confidence < 0.6) {
            templateType = "T_UNKNOWN";
        }
        
        const result = {
            templateType,
            confidence: parseFloat(confidence.toFixed(2)),
            _debug_stats: stats // Added for clarity
        };
        
        console.log(JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error(`Classification failed: ${error.message}`);
    }
}

classifyDocument();
