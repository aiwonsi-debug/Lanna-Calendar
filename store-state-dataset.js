import fs from 'fs';

function storeDataset() {
    try {
        const inputData = JSON.parse(fs.readFileSync('state-normalized-output.json', 'utf8'));
        const records = inputData.normalized || [];
        
        const yearMonth = '2026-05';
        
        const output = {
            metadata: {
                schemaVersion: "2.0.0",
                templateType: "T_STATE_MACHINE_WITH_AUTOFILL",
                parserName: "stateNormalizer",
                createdAt: new Date().toISOString()
            },
            month: yearMonth,
            records: records
        };
        
        const dir = 'src/data/v2';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const savePath = `${dir}/${yearMonth}.json`;
        fs.writeFileSync(savePath, JSON.stringify(output, null, 2), 'utf8');
        
        const result = {
            stored: true,
            path: savePath,
            key: yearMonth,
            totalRecords: records.length
        };
        
        console.log(JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error(JSON.stringify({ stored: false, error: error.message }, null, 2));
    }
}

storeDataset();
