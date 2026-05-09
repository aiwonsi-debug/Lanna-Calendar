import { getLannaDate } from './src/utils/lannaCalc';

const d = new Date(2026, 3, 16); // April 16, 2026
const res = getLannaDate(d);
console.log('April 16, 2026:', JSON.stringify(res, null, 2));
