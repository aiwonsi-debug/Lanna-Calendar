import fs from 'fs';
import path from 'path';

function runMultiTemplateQA() {
    try {
        const dataDir = 'src/data/v2';
        if (!fs.existsSync(dataDir)) {
            console.error(`Directory not found: ${dataDir}`);
            process.exit(1);
        }

        const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        
        // Group files by template type
        const templateGroups = {};
        
        for (const file of files) {
            const filePath = path.join(dataDir, file);
            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            let templateType = 'UNKNOWN';
            
            // Detect Schema Version / Template
            if (data.metadata && data.metadata.templateType) {
                templateType = data.metadata.templateType; // New V2 Schema
            } else if (data.v && data.days) {
                templateType = 'LEGACY_V1'; // Old legacy schema
            }
            
            if (!templateGroups[templateType]) {
                templateGroups[templateType] = [];
            }
            templateGroups[templateType].push({ file, data });
        }

        const qaReport = {
            evaluation: "Cross-Template Consistency & Accuracy",
            templatesEvaluated: Object.keys(templateGroups).length,
            templateStats: {},
            mismatches: []
        };

        // Evaluate each template type
        for (const [templateType, datasets] of Object.entries(templateGroups)) {
            let totalRecords = 0;
            let validRecords = 0;
            
            for (const datasetObj of datasets) {
                const { file, data } = datasetObj;
                
                // Extract records based on schema type
                let records = [];
                let isLegacy = false;
                
                if (templateType === 'LEGACY_V1') {
                    records = data.days || [];
                    isLegacy = true;
                } else {
                    records = data.records || data.normalized || [];
                }
                
                // Sample 20% of records from this dataset
                const sampleSize = Math.max(1, Math.ceil(records.length * 0.20));
                const shuffled = [...records].sort(() => 0.5 - Math.random());
                const samples = shuffled.slice(0, sampleSize);
                
                totalRecords += sampleSize;
                
                for (const rec of samples) {
                    let isConsistent = true;
                    let issues = [];
                    
                    if (isLegacy) {
                        // Check Legacy Schema (d, l)
                        if (typeof rec.d !== 'number' || rec.d < 1 || rec.d > 31) {
                            isConsistent = false;
                            issues.push(`Legacy: Invalid day 'd': ${rec.d}`);
                        }
                        if (typeof rec.l !== 'string' || rec.l.length === 0) {
                            isConsistent = false;
                            issues.push(`Legacy: Invalid lunar 'l'`);
                        }
                    } else {
                        // Check New Schema (dateISO, day, lunar, labels, description, score)
                        const requiredKeys = ['dateISO', 'day', 'lunar', 'labels', 'description', 'score'];
                        for (const key of requiredKeys) {
                            if (!(key in rec)) {
                                isConsistent = false;
                                issues.push(`Missing key: ${key}`);
                            }
                        }
                        
                        if (rec.day < 1 || rec.day > 31) {
                            isConsistent = false;
                            issues.push(`Invalid day number: ${rec.day}`);
                        }
                        if (typeof rec.lunar !== 'string') {
                            isConsistent = false;
                            issues.push(`Invalid lunar string`);
                        }
                        if (!['good', 'bad', 'neutral'].includes(rec.score)) {
                            isConsistent = false;
                            issues.push(`Invalid score: ${rec.score}`);
                        }
                    }
                    
                    if (isConsistent) {
                        validRecords++;
                    } else {
                        qaReport.mismatches.push({
                            templateType,
                            file: file,
                            day: isLegacy ? rec.d : rec.day,
                            issues
                        });
                    }
                }
            }
            
            const accuracy = totalRecords > 0 ? (validRecords / totalRecords) * 100 : 0;
            qaReport.templateStats[templateType] = {
                samplesChecked: totalRecords,
                validSamples: validRecords,
                accuracy: parseFloat(accuracy.toFixed(2)) + '%'
            };
        }

        fs.writeFileSync('qa-multi-template-report.json', JSON.stringify(qaReport, null, 2), 'utf8');
        console.log(JSON.stringify(qaReport, null, 2));
        
        const allAccuracies = Object.values(qaReport.templateStats).map(s => parseFloat(s.accuracy));
        const avgAccuracy = allAccuracies.reduce((a,b) => a+b, 0) / (allAccuracies.length || 1);
        
        if (avgAccuracy < 90) {
            console.error(`\n[QA SYSTEM] FAIL: Average accuracy across templates is ${avgAccuracy.toFixed(2)}%, which is below 90% threshold.`);
            process.exit(1);
        } else {
            console.log(`\n[QA SYSTEM] PASS: Datasets across all templates maintain high structural consistency (${avgAccuracy.toFixed(2)}%).`);
        }

    } catch (e) {
        console.error(`QA System failed: ${e.message}`);
        process.exit(1);
    }
}

runMultiTemplateQA();
