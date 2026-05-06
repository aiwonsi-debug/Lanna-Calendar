import fs from 'fs';

function findMay() {
    try {
        const data = JSON.parse(fs.readFileSync('processed-output.json', 'utf8'));
        const lines = data.lines;
        
        console.log("Total lines:", lines.length);
        
        // Let's print some samples around where we think May is
        for (let i = 1500; i < lines.length; i++) {
            if (lines[i].includes("พฤษภา") || lines[i].includes("พฤษภ") || lines[i].includes("๕")) {
                console.log(`[${i}] ${lines[i]}`);
                if (lines[i].includes("พฤษภา")) {
                   // Found it! Print a bit more
                   for(let j=i; j<i+50; j++) {
                       if(lines[j]) console.log(`[${j}] ${lines[j]}`);
                   }
                   break;
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

findMay();
