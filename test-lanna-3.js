import { getLannaDate } from './src/utils/lannaCalc';

const d = new Date(2026, 4, 29); // May 29, 2026
const res = getLannaDate(d);
console.log('May 29, 2026:', JSON.stringify(res, null, 2));
