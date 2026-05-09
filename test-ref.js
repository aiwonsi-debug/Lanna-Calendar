
import { getLannaDate } from './src/utils/lannaCalc';

const start = new Date(2025, 11, 1); // Dec 1, 2025
for (let i = 0; i < 90; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const res = getLannaDate(d);
    if (res.lannaMonth === 4 && res.phase === 'ออก' && res.lunarDay === 13) {
        console.log(d.toISOString().split('T')[0], res.lannaMonth, res.phase, res.lunarDay, res.wanThai);
    }
}
