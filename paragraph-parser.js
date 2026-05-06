import fs from 'fs';

function paragraphParse() {
    try {
        const data = JSON.parse(fs.readFileSync('processed-output.json', 'utf8'));
        const lines = data.lines;
        
        // Focus on a section where paragraph rules usually appear
        const textBlock = lines.slice(100, 1000).join(' ');
        
        // STRATEGY: Split by keyword anchors "วัน" or "เดือน"
        // Also handling PDF artifacts like "วััน", "เดืือน"
        const segments = textBlock.split(/(?=(?:วั|ว).?.?น|เดื?.?.?อน)/g);
        
        const records = [];
        
        const thaiToArabic = {
            '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
            '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9'
        };

        const convertThaiToArabic = (text) => {
            return text.split('').map(char => thaiToArabic[char] || char).join('');
        };

        for (const segment of segments) {
            const cleanSegment = segment.trim();
            if (cleanSegment.length < 5) continue;
            
            // Detect if the segment starts with an anchor and contains a list of dates
            // e.g. "วันที่่ ๓  ๖  ๑๑  ๑๗  ๒๒  และ  ๒๗  เป้็นวัันดืี"
            // e.g. "เดือน ๖ ออก ๑๒ ค่ำํา"
            const dateMatch = cleanSegment.match(/^((?:วั|ว).?.?นท.?.?.?.?|เดื?.?.?อน)\s*([0-9๑-๙\sและ,]+)(.*)/);
            
            if (dateMatch) {
                const anchor = dateMatch[1];
                const daysText = dateMatch[2];
                const descriptionRaw = dateMatch[3];
                
                // If it's a "เดือน" anchor, it might be a specific date
                if (anchor.includes('ด')) {
                    // Just extracting the raw text for lunar mapping later
                    let cleanDesc = (daysText + descriptionRaw)
                        .replace(/[^\u0E00-\u0E7F0-9a-zA-Z\s]/g, '')
                        .replace(/\s+/g, ' ').trim();
                        
                    // Truncate at the next logical sentence break
                    const stopIdx = cleanDesc.search(/วั|ว.?.?น|เดื?.?.?อน/);
                    if (stopIdx > 5) cleanDesc = cleanDesc.substring(0, stopIdx).trim();

                    if (cleanDesc) {
                        records.push({
                            type: 'lunar_rule',
                            description: cleanDesc
                        });
                    }
                } 
                // If it's a "วัน" anchor, extract day numbers
                else {
                    const dayNumbers = daysText.match(/[0-9]+/g) || [];
                    const thaiDayNumbers = daysText.match(/[๑-๙][๐-๙]?/g) || [];
                    
                    const allDays = [...dayNumbers, ...thaiDayNumbers.map(convertThaiToArabic)]
                                    .map(d => parseInt(d, 10))
                                    .filter(d => !isNaN(d) && d >= 1 && d <= 31);
                    
                    if (allDays.length > 0 && descriptionRaw.length > 3) {
                        let cleanDesc = descriptionRaw
                            .replace(/[^\u0E00-\u0E7F0-9a-zA-Z\s]/g, '')
                            .replace(/\s+/g, ' ').trim();
                            
                        const stopIdx = cleanDesc.search(/วั|ว.?.?น|เดื?.?.?อน/);
                        if (stopIdx > 10) cleanDesc = cleanDesc.substring(0, stopIdx).trim();

                        if (cleanDesc) {
                            records.push({
                                type: 'day_rule',
                                detectedDays: [...new Set(allDays)].sort((a,b)=>a-b),
                                description: cleanDesc
                            });
                        }
                    }
                }
            }
        }
        
        const output = {
            strategy: "Paragraph parser (Split by 'วัน', 'เดือน')",
            extractedRecords: records.slice(0, 15) // Show first 15 to fit output
        };
        
        fs.writeFileSync('paragraph-records.json', JSON.stringify(output, null, 2), 'utf8');
        console.log(JSON.stringify(output, null, 2));
        
    } catch (e) {
        console.error(e);
    }
}

paragraphParse();
