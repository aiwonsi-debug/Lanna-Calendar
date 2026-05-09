import { getLannaDate } from './src/utils/lannaCalc';

const d = new Date(2026, 6, 29); // July 29, 2026
const res = getLannaDate(d);
console.log('July 29, 2026:', JSON.stringify(res, null, 2));
