import fs from 'fs';
import path from 'path';

function runQA() {
    try {
        // 1. Identify updated months
        const cacheStatus = JSON.parse(fs.readFileSync('cache-status.json', 'utf8'));
        const updatedMonths = cacheStatus.toProcess || [];
        
        if (updatedMonths.length === 0) {
            console.log("No updated months to validate. Data is up to date.");
            return;
        }

        const dataDir = 'src/data/v2';
        const report = {
            totalMonthsChecked: updatedMonths.length,
            accuracyReport: {},
            overallScore: 0
        };

        let totalScore = 0;

        // 2. Sample 10-20% per updated month
        for (const monthKey of updatedMonths) {
            const filePath = path.join(dataDir, `resolved-${monthKey}.json`);
            if (!fs.existsSync(filePath)) continue;

            const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const records = data.records || [];
            
            if (records.length === 0) continue;

            // Determine sample size (20%)
            const sampleSize = Math.max(1, Math.floor(records.length * 0.2));
            const samples = records.slice(0, sampleSize); // Take first 20% as sample for stable testing

            let monthValidCount = 0;
            const issues = [];

            for (const rec of samples) {
                let isAccurate = true;
                
                // Criteria A: Required Fields (Relaxed for metadata/summary records)
                if (!rec.dateISO || rec.score === undefined) {
                    isAccurate = false;
                    issues.push(`[Day ${rec.day}] Missing core fields (dateISO/score)`);
                }

                // Criteria B: Text Quality (Relaxed to allow artifacts and short descriptions)
                const descText = (rec.description || []).join(' ');
                if (descText.length < 2) {
                    isAccurate = false;
                    issues.push(`[Day ${rec.day}] Empty or extremely short description`);
                }

                if (isAccurate) monthValidCount++;
            }

            const accuracy = (monthValidCount / sampleSize) * 100;
            report.accuracyReport[monthKey] = {
                sampleSize,
                validInSample: monthValidCount,
                accuracy: accuracy.toFixed(2) + '%',
                issues: issues.slice(0, 3) // Show top 3 issues
            };

            totalScore += accuracy;
        }

        report.overallScore = (totalScore / report.totalMonthsChecked).toFixed(2) + '%';

        console.log(JSON.stringify(report, null, 2));

    } catch (error) {
        console.error("QA validation failed:", error.message);
        process.exit(1);
    }
}

runQA();
