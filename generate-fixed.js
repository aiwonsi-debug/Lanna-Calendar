import fs from 'fs';

function generateFixedRecords() {
    const records = [];
    
    // Lunar phase for May 2026 (Thai: เดือน 6 and 7, Lanna: เดือน 8 and 9)
    // Lanna is 2 months ahead of Thai central.
    // Thai May 1, 2026 = ขึ้น 15 ค่ำ เดือน 6 => Lanna: เดือน 8 ขึ้น 15 ค่ำ (ออก 15 ค่ำ)
    // Thai May 16, 2026 = แรม 15 ค่ำ เดือน 6 => Lanna: เดือน 8 แรม 15 ค่ำ
    // Thai May 17, 2026 = ขึ้น 1 ค่ำ เดือน 7 => Lanna: เดือน 9 ขึ้น 1 ค่ำ (ออก 1 ค่ำ)
    
    for (let day = 1; day <= 31; day++) {
        let lunar = '';
        let month = 8;
        let phase = '';
        let lunarDay = 0;
        
        if (day === 1) {
            month = 8;
            phase = 'ขึ้น';
            lunarDay = 15;
        } else if (day >= 2 && day <= 16) {
            month = 8;
            phase = 'แรม';
            lunarDay = day - 1;
        } else if (day >= 17 && day <= 31) {
            month = 9;
            phase = 'ขึ้น';
            lunarDay = day - 16;
        }
        
        lunar = `เดือน ${month} ${phase} ${lunarDay} ค่ำ`;
        
        const dayStr = String(day).padStart(2, '0');
        const dateISO = `2026-05-${dayStr}`;
        
        // Add external religious day flags
        const labels = [];
        const description = [];
        let score = 'neutral';
        
        if (day === 1) {
            labels.push('วันพระ', 'วันแรงงานแห่งชาติ');
            score = 'good';
        }
        if (day === 4) {
            labels.push('วันฉัตรมงคล');
            score = 'good';
        }
        if (day === 9) {
            labels.push('วันพระ');
            score = 'good';
        }
        if (day === 11) {
            labels.push('วันพืชมงคล');
            score = 'good';
        }
        if (day === 16) {
            labels.push('วันพระ');
            score = 'good';
        }
        if (day === 24) {
            labels.push('วันพระ');
            score = 'good';
        }
        if (day === 31) {
            labels.push('วันพระ', 'วันวิสาขบูชา');
            score = 'good';
        }
        
        records.push({
            dateISO,
            day,
            lunar,
            labels,
            description,
            score
        });
    }
    
    const output = {
        normalized: records
    };
    
    fs.writeFileSync('normalized-records.json', JSON.stringify(output, null, 2), 'utf8');
    console.log(`Successfully generated ${records.length} fixed records using external data.`);
}

generateFixedRecords();
