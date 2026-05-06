import fs from 'fs';

function fallbackParse() {
    try {
        const data = JSON.parse(fs.readFileSync('processed-output.json', 'utf8'));
        const lines = data.lines.slice(1000, 1500); // Focus on a sample region
        
        const thaiToArabic = {
            '๐': '0', '๑': '1', '๒': '2', '๓': '3', '๔': '4',
            '๕': '5', '๖': '6', '๗': '7', '๘': '8', '๙': '9'
        };

        const convertThaiToArabic = (text) => {
            return text.split('').map(char => thaiToArabic[char] || char).join('');
        };

        const partialRecords = [];
        
        // Regex patterns
        const dayPattern = /^([0-9]{1,2}|[๑-๙]|[๑-๒][๐-๙]|๓[๐-๑])$/;
        // Flexible lunar pattern for PDF artifacts: "เดืือน ๑๐ ออก ๑๒ ค่ำํา"
        const lunarPattern = /(เดื?.?.?อน\s*[0-9๑-๙]+\s*(?:ข.?.?.น|อ.?.?.ก|แ.?.?.ม)\s*[0-9๑-๙]+\s*ค.?.?.?)/;

        let currentRecord = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            let foundDay = null;
            let foundLunar = null;

            // Check if line is just a day number
            if (dayPattern.test(line)) {
                foundDay = parseInt(convertThaiToArabic(line), 10);
            }
            
            // Check if line contains lunar info
            const lunarMatch = line.match(lunarPattern);
            if (lunarMatch) {
                foundLunar = lunarMatch[1]
                    .replace(/[^\u0E00-\u0E7F0-9\s]/g, '') // remove weird symbols
                    .replace(/\s+/g, ' ')
                    .trim();
            }

            if (foundDay !== null || foundLunar !== null) {
                partialRecords.push({
                    day: foundDay !== null ? foundDay : 'Unknown',
                    lunar: foundLunar !== null ? foundLunar : 'Unknown',
                    partial: true
                });
            }
        }
        
        const output = {
            strategy: "Fallback parser (Partial Data)",
            extractedRecords: partialRecords.slice(0, 15) // Show first 15 for brevity
        };
        
        fs.writeFileSync('fallback-records.json', JSON.stringify(output, null, 2), 'utf8');
        console.log(JSON.stringify(output, null, 2));
        
    } catch (e) {
        console.error(e);
    }
}

fallbackParse();
