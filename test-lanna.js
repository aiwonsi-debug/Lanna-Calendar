import { getLannaDate } from './src/utils/lannaCalc.js';

const d = new Date(2026, 4, 5); // May 5, 2026
const res = getLannaDate(d);
console.log('May 5, 2026:', JSON.stringify(res, null, 2));

const d2 = new Date(2026, 4, 11); // May 11, 2026
const res2 = getLannaDate(d2);
console.log('May 11, 2026:', JSON.stringify(res2, null, 2));
