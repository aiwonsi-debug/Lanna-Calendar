import fs from 'fs';
import { execSync } from 'child_process';

function runErrorCorrectionEngine() {
    console.log("[Engine] Starting Parsing Pipeline...");
    
    // Step 1: Initial pass with Standard Grid Parser
    console.log("[Engine] -> Running primary parser (Grid Parser)...");
    try {
        execSync('node parser-task.js', { stdio: 'ignore' });
        execSync('node normalizer.js', { stdio: 'ignore' });
    } catch(e) {
        console.warn("[Engine] Notice: Primary parser or normalizer encountered issues.");
    }
    
    // Step 2: Validate the initial output
    let validationResult;
    try {
        execSync('node validator.js', { stdio: 'ignore' });
    } catch (e) {
        // validator.js exits with 1 if failed. We just catch it and proceed.
    }

    if (fs.existsSync('validation-result.json')) {
        validationResult = JSON.parse(fs.readFileSync('validation-result.json', 'utf8'));
    } else {
        validationResult = { valid: false, errorPercentage: "100.00%" };
    }
    
    const errorRate = parseFloat(validationResult.errorPercentage);
    console.log(`[Engine] Initial Validation Error Rate: ${errorRate}%`);
    
    // Step 3: Error Correction Logic (Switch Parser if error > 10%)
    if (errorRate > 10) {
        console.log("[Engine] -> Error rate > 10%. Switching strategy to Hybrid Parser...");
        try {
            // Run fallback/hybrid parsers
            execSync('node hybrid-parser.js', { stdio: 'ignore' });
            execSync('node unified-normalizer.js', { stdio: 'ignore' });
            
            // The unified normalizer writes to 'unified-normalized-output.json'
            // We copy it to 'normalized-records.json' to let the validator check it again.
            fs.copyFileSync('unified-normalized-output.json', 'normalized-records.json');
            
            console.log("[Engine] -> Retrying validation with Hybrid Parser output...");
            execSync('node validator.js', { stdio: 'ignore' });
        } catch(e) {
            // Catching validator exit code 1
        }
        
        if (fs.existsSync('validation-result.json')) {
            const retryValidation = JSON.parse(fs.readFileSync('validation-result.json', 'utf8'));
            console.log(`[Engine] Retry Validation Error Rate: ${retryValidation.errorPercentage}`);
        }
    }
    
    // Step 4: Output best effort dataset
    let bestEffortData = [];
    if (fs.existsSync('normalized-records.json')) {
        const fileContent = JSON.parse(fs.readFileSync('normalized-records.json', 'utf8'));
        bestEffortData = fileContent.normalized || fileContent.records || [];
    }
    
    const output = {
        strategy: errorRate > 10 ? "Error correction triggered: Grid -> Hybrid fallback" : "Grid Parser (Primary)",
        bestEffortDataset: {
            totalRecords: bestEffortData.length,
            records: bestEffortData.slice(0, 5) // Show first 5 for brevity
        }
    };
    
    fs.writeFileSync('best-effort-dataset.json', JSON.stringify(output, null, 2), 'utf8');
    console.log("\n[Engine] Process complete. Best-effort dataset generated.");
    console.log(JSON.stringify(output, null, 2));
}

runErrorCorrectionEngine();
