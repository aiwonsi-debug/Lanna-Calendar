import { useState, useEffect, useMemo } from "react";

// ============================================================
// DATA
// ============================================================
const DATA = {
  wanThaiDetailed: {
    กาบไจ้: "แม่วันดี หาวันปลอด (ดีมาก)",
    ดับเป้า: "อย่าเดินทางค้าขายจะถูกฆ่า",
    รวายยี่: "อย่าให้เหล้า/เงินแก่ท่าน จะเป็นหนี้ (ห้ามให้เงินท่าน)",
    เมืองเหม้า: "อย่าออกศึก อย่าสู้คดี",
    เปิกสี: "ควรหมั้นหมาย พ่อแม่วางหื้อลูก",
    กัดใส้: "อย่าสร้างดาบ อย่าซื้ออาวุธ",
    กดสะง้า: "อย่าขี่ม้าเทียวเมือง จะตกม้าตาย",
    ร้วงเม็ด: "อย่าทำหน้าไม้/ปืน",
    เต่าสัน: "ควรผูกมิตร เจรจาขอสาว",
    ก่าเร้า: "หาสิริมงคล เรียกขวัญข้าว/ลูกเต้าดี (วันเรียกขวัญ)",
    กาบเส็ด: "อย่าม้วนหูกทอลาย จะตกตาย",
    ดับไค้: "อย่าตัดผม สาวบ่ชมบ่สู้",
    รวายไจ้: "อย่าขี่ม้าแอ่วทาง จะเสียนางร่วมห้อง",
    เมืองเป้า: "อย่าตัดผ้าไหมนุ่ง จะตายจากกัน",
    เปิกยี่: "อย่าสานเสื่อปูชาน จะร้อนรุ่ม",
    กัดเหม้า: "ดีฟันเรือไว้หว้ายท่า ค้าขายได้แสนคำ",
    กดสี: "หื้อแรกไม้แปล๋งเรือน วัวควายเต๋มคอก (วันปลูกพืช)",
    ร้วงใส้: "อย่าเอาขวัญ เยียวเสียหลานเหลน",
    เต่าสะง้า: "อย่าฝั้นเชือกวัวควาย เยียวตัวตายตมม้วย",
    ก่าเม็ด: "อย่าฝนหลาวเถี่ยนกล้า จักฆ่าฟันตน",
    กาบสัน: "หื้อล้อมวัวควาย ปลูกพืชดีนัก (วันปลูกพืช)",
    ดับเร้า: "หื้อตัดผม ม่ายชู้สาวหากสู้มาหา",
    รวายเส็ด: "อย่าปลูกครัวยังสวน บ่ได้มาก",
    เมืองไค้: "หื้อยอพลรบท่าน ได้ทั้งช้างและนาง",
    เปิกไจ้: "ดีใส่รัก ทาเกี๊ยะแป๋งกล่องและกุบ",
    กัดเป้า: "อย่าได้สืบคำเมืองท่านบ่สู้",
    กดยี่: "หื้อสานก๋วยไปค้า ได้คำเต๋มชาน",
    ร้วงเหม้า: "ดีเยียะสวน ปลูกยา เป็นดอกดีงาม (วันปลูกพืช)",
    เต่าสี: "หื้อกระทำการเรือหอม สวนผักดาดี",
    ก่าใส้: "อย่าเอากันกินแขก จักถูกถ้อยคำ",
    กาบสะง้า: "หื้อแรกน้ำใส่นา ข้าวเต๋มหลอง",
    ดับเม็ด: "อย่าชวนกันค้าขาย เยียวท่านฆ่าเอาครัว",
    รวายสัน: "แรกไม้แปล๋งเวียง รบก็จักบ่แพ้",
    เมืองเร้า: "หื้อยอพลรบท่าน ได้ทั้งช้างและนาง",
    เปิกเส็ด: "อย่าหื้อตกนา เยียวตายโหงท่านฆ่า",
    กัดไค้: "อย่าก่ายห้างยิงกวาง บ่ดี",
    กดไจ้: "หื้อสานก๋วยไว้ เงินคำเต๋มก๋วย",
    ร้วงเป้า: "อย่าแป๋งสวนปลูกอ้อย ต้นงามบ่มีน้ำ",
    เต่ายี่: "หื้อปลูกไว้สวน ตกทลายขาวหม้า (วันปลูกพืช)",
    ก่าเหม้า: "อย่าหื้อของแก่ท่าน จักเสียล้านภายลูน",
    กาบสี: "แป๋งเครื่องย้อมไหมแดง ดีสิริมงคล",
    ดับใส้: "เอาเมียมาใหม่ จักได้ลูกตายพราย",
    รวายสะง้า: "แป๋งครกต๋ำข้าว ข้าวบ่ขาดหลอง",
    เมืองเม็ด: "สานแหทอดน้ำ เต๋มข้องพอหมาน",
    เปิกสัน: "หื้อใส่เหล้าบรรณาการ ขุนรักหื้อลาภ",
    กัดเร้า: "ก่ายห้างยิงนก หมานนัก",
    กดเส็ด: "อย่าฝั้นเชือกวัวควาย เสียตนตาย",
    ร้วงไค้: "อย่าชวนกันกินเหล้า เทียรย่อมผิดกัน",
    เต่าไจ้: "หื้อได้ล้อมคอกวัวควาย วัวตัวใหญ่หม้า",
    ก่าเป้า: "อย่าชวนกันลงเรือ",
    กาบยี่: "สานก๋วยไปกาด ได้ของค้าพอหาม",
    ดับเหม้า: "ตัดเสื้อผ้า นุ่งผ้าใหม่ ขุนนางรัก (วันนุ่งผ้าใหม่)",
    รวายสี: "หื้อหาครัวศึก รบก็จักบ่แพ้",
    เมืองใส้: "อย่าชวนกันรบท่าน เยียวตายถูกปืน",
    เปิกสะง้า: "อย่าสร้างครัวศึก เยียวเสียตายบ่แพ้",
    กัดเม็ด: "หื้อเอาวัวควายมาคอก สุขมาก (วันปลูกพืช)",
    กดสัน: "ห่อหมากถามสาวหุม บ่ร้าง",
    ร้วงสัน: "อย่าเย็บลายเข้านุ่ง จะได้ห่มเมื่อตาย",
    เต่าเร้า: "อย่าถมชีไฟ เตาไฟ ผีดั้งจักชัง",
    ก่าเส็ด: "อย่าซื้อวัวควายมาคอก ผีด้ำบ่ดี",
    กาบไค้: "อย่าดื่มเหล้าในงานเลี้ยง",
  },
  masterRules: {
    0: { 1:{n:"ตุงดิน",s:"ไม่ดี"}, 2:{n:"วันปลอด",s:"ดี"}, 3:{n:"ไชยาติถี",s:"ดีมาก"}, 5:{n:"ปุณณาติถี",s:"ดีมาก"}, 6:{n:"นันทาติถี",s:"ดี"}, 11:{n:"วันปลอด",s:"ดี"}, 14:{n:"ริตตาติถี",s:"ดีมาก"}, 24:{n:"อมริสสโชค",s:"ดีมาก"} },
    1: { 6:{n:"วันปลอด",s:"ดี"}, 9:{n:"อมริสสโชค",s:"ดีมาก"}, 13:{n:"วันปลอด",s:"ดี"}, 17:{n:"ภัทราติถี",s:"ดีมาก"}, 23:{n:"ไชยาติถี",s:"ดีมาก"}, 25:{n:"ปุณณาติถี",s:"ดีมาก"}, 26:{n:"นันทาติถี",s:"ดีมาก"} },
    2: { 1:{n:"วันปลอด",s:"ดี"}, 8:{n:"ไชยาติถี",s:"ดีมาก"}, 10:{n:"ปุณณาติถี",s:"ดี"}, 12:{n:"วันปลอด",s:"ดี"}, 19:{n:"ริตตาติถี",s:"ไม่ดี"} },
    3: { 1:{n:"วันปลอด",s:"ดี"}, 4:{n:"ริตตาติถี",s:"ดีมาก"}, 8:{n:"วันปลอด",s:"ดี"}, 11:{n:"วันปลอด",s:"ดี"}, 13:{n:"วันปลอด",s:"ดี"}, 22:{n:"ภัทราติถี",s:"ดีมาก"}, 28:{n:"ไชยาติถี",s:"ดีมาก"}, 30:{n:"ปุณณาติถี",s:"ดีที่สุด"} },
    4: { 1:{n:"วันปลอด",s:"ดี"}, 3:{n:"วันปลอด",s:"ดี"}, 5:{n:"วันปลอด",s:"ดี"}, 7:{n:"ภัทราติถี",s:"ดีมาก"}, 10:{n:"วันปลอด",s:"ดี"}, 13:{n:"ไชยาติถี",s:"ดีมาก"}, 15:{n:"ปุณณาติถี",s:"ดีที่สุด"}, 16:{n:"นันทาติถี",s:"ดีที่สุด"}, 24:{n:"ริตตาติถี",s:"ดีมาก"} },
    5: { 1:{n:"วันปลอด",s:"ดี"}, 8:{n:"วันชัยโชค",s:"ดี"}, 14:{n:"ไชยาติถี",s:"ดีมาก"}, 15:{n:"ปุณณาติถี",s:"ดีที่สุด"}, 30:{n:"ริตตาติถี",s:"ดีที่สุด"} },
    6: { 2:{n:"วันปลอด",s:"ดี"}, 7:{n:"วันปลอด",s:"ดี"}, 9:{n:"วันปลอด",s:"ดี"}, 12:{n:"ภัทราติถี",s:"ดีมาก"}, 18:{n:"ไชยาติถี",s:"ดีมาก"}, 20:{n:"ปุณณาติถี",s:"ดีมาก"}, 29:{n:"ปุณณาติถี",s:"ดีที่สุด"} },
  },
  kaoKongInfo: {
    เก้ากอง: "มงคลสูงสุดทุกประการ ได้ทรัพย์มาก ห้ามทำการฌาปนกิจศพเด็ดขาด",
    รองพื้น: "เหมาะทำไร่สวน ปลูกบ้าน ห้ามเก็บฟืนเข้าบ้าน",
    พื้นดอก: "มงคลทุกอย่าง สัตว์เลี้ยงแพร่พันธุ์ดี ทำคอกสัตว์ดี",
    พื้นดาย: "ห้ามซื้อสัตว์มาเลี้ยง ห้ามรับคนงานใหม่ จะไม่เจริญ",
    สุพัก: "แต่งงานมงคลยิ่ง ได้บุตรดี ซื้อสัตว์เลี้ยงดี",
    รับได้: "ติดต่อผู้ใหญ่ดี ห้ามรับฝากของ",
    รับตาย: "ห้ามแต่งงาน ห้ามนำสัตว์ทุกชนิดเข้าบ้าน",
    ขว้ำได้: "ค้าขายดี ห้ามแต่งงานจะร้างรา",
    ไสเจ้า: "ห้ามแต่งงาน ห้ามซื้อของแพง ห้ามนำสัตว์เข้าบ้าน",
    ไสเสีย: "ห้ามค้าขายทางไกล จะประสบอุบัติเหตุระหว่างทาง",
    ท้ายป้าว: "ค้าขายทางบกกำไรดี ห้ามเดินทางทางน้ำ",
    ยี่เพียง: "แต่งงานมงคล ซื้อของมีค่าและสัตว์ดี ค้าขายกำไรมาก",
  },
  yamData: [
    ["ปลอด","รุ่ง","เสีย","คาบ","ห้าม","สิทธิ","โชค","ชัย"],
    ["รุ่ง","เสีย","คาบ","ห้าม","สิทธิ","โชค","ชัย","ปลอด"],
    ["เสีย","คาบ","ห้าม","สิทธิ","โชค","ชัย","ปลอด","รุ่ง"],
    ["คาบ","ห้าม","สิทธิ","โชค","ชัย","ปลอด","รุ่ง","เสีย"],
    ["ห้าม","สิทธิ","โชค","ชัย","ปลอด","รุ่ง","เสีย","คาบ"],
    ["สิทธิ","โชค","ชัย","ปลอด","รุ่ง","เสีย","คาบ","ห้าม"],
    ["โชค","ชัย","ปลอด","รุ่ง","เสีย","คาบ","ห้าม","สิทธิ"],
  ],
  maeMue: ["กาบ","ดับ","รวาย","เมือง","เปิก","กัด","กด","ร้วง","เต่า","ก่า"],
  lukMue: ["ไจ้","เป้า","ยี่","เหม้า","สี","ไส้","สะง้า","เม็ด","สัน","เร้า","เส็ด","ไค้"],
  monthNames: ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"],
};

// ============================================================
// LANNA DATE CALCULATION
// ============================================================
function getLannaDate(date) {
  if (!date || isNaN(date.getTime())) return null;

  // Reference Point: April 30, 2026 (Benchmark)
  // BE 2569, CS 1388, Lanna Month 8, Waxing 14 (ออก 14), Year Raway Sa-nga (Horse)
  const refDate = new Date(2026, 3, 30); 
  const diffDays = Math.floor((date.getTime() - refDate.getTime()) / 86400000);
  
  let currentMonth = 8, currentKham = 14, currentPhase = 'ออก', currentYearBE = 2569;
  let isLeapMonthActive = false;
  const step = diffDays >= 0 ? 1 : -1;
  const absDiff = Math.abs(diffDays);
  
  for (let i = 0; i < absDiff; i++) {
    const yrInfo = getLunarYearInfo(currentYearBE);
    if (step === 1) {
      currentKham++;
      let maxKham = (currentMonth % 2 === 0) ? 15 : 14;
      if (currentMonth === 9 && yrInfo.isAthikawan) maxKham = 15;
      if (currentPhase === 'ออก' && currentKham > 15) { currentKham = 1; currentPhase = 'แรม'; }
      else if (currentPhase === 'แรม' && currentKham > maxKham) {
        currentKham = 1; currentPhase = 'ออก';
        if (currentMonth === 10 && yrInfo.isAthikamat && !isLeapMonthActive) isLeapMonthActive = true;
        else { isLeapMonthActive = false; currentMonth++; if (currentMonth > 12) { currentMonth = 1; currentYearBE++; } }
      }
    } else {
      currentKham--;
      if (currentPhase === 'ออก' && currentKham < 1) {
        currentMonth--; if (currentMonth < 1) { currentMonth = 12; currentYearBE--; }
        const yrInfoB = getLunarYearInfo(currentYearBE);
        if (currentMonth === 10 && yrInfoB.isAthikamat && !isLeapMonthActive) { isLeapMonthActive = true; currentMonth = 10; }
        else if (isLeapMonthActive) { isLeapMonthActive = false; currentMonth = 10; }
        currentPhase = 'แรม'; currentKham = (currentMonth % 2 === 0 || (currentMonth === 9 && yrInfoB.isAthikawan)) ? 15 : 14;
      } else if (currentPhase === 'แรม' && currentKham < 1) { currentKham = 15; currentPhase = 'ออก'; }
    }
  }

  const lannaMonthStr = isLeapMonthActive ? `${currentMonth}-${currentMonth}` : `${currentMonth}`;
  const rawLunarDay = currentPhase === 'ออก' ? currentKham : currentKham + 15;
  const dow = date.getDay();

  // Wan Thai
  const baseDateWan = new Date(2024, 1, 10);
  const diffWan = Math.floor((date.getTime() - baseDateWan.getTime()) / 86400000);
  const wanThaiIdx = (diffWan % 60 + 60) % 60;
  const wanThai = DATA.maeMue[wanThaiIdx % 10] + DATA.lukMue[wanThaiIdx % 12];

  // Songkran
  const yearCS = date.getFullYear() - 638; 
  const hRaw = (yearCS * 292207) + 373;
  const hDays = Math.floor(hRaw / 800);
  const hRem = hRaw % 800;
  const phayaWanDate = new Date(new Date(2025, 3, 16).getTime() + (hDays - Math.floor((1387 * 292207 + 373) / 800)) * 86400000);
  phayaWanDate.setHours(Math.floor((hRem * 24) / 800), Math.floor(((hRem * 24 % 800) * 60) / 800), Math.floor(((((hRem * 24 % 800) * 60) % 800) * 60) / 800), 0);
  const sangKhanLongDate = new Date(phayaWanDate.getTime() - (2 * 24 * 3600 + 3 * 3600 + 57 * 60 + 36) * 1000);
  const wanNaoDate = new Date(phayaWanDate.getTime() - 24 * 3600 * 1000);

  const isAfterPhayaWan = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() >= new Date(phayaWanDate.getFullYear(), phayaWanDate.getMonth(), phayaWanDate.getDate()).getTime();
  const cs = isAfterPhayaWan ? (date.getFullYear() - 638) : (date.getFullYear() - 639);

  // Stats
  const sitthi = (() => {
    const d = dow, l = currentKham;
    if ((d===0&&l===12)||(d===1&&l===11)||(d===2&&(l===7||l===12))||(d===3&&(l===3||l===13))||(d===4&&l===6)||(d===5&&l===12)||(d===6&&(l===12||l===15))) return "วันมหาสิทธิโชค";
    if ((d===0&&l===11)||(d===1&&l===5)||(d===2&&l===3)||(d===3&&l===6)||(d===4&&l===12)||(d===5&&l===11)||(d===6&&l===15)) return "วันสิทธิโชค";
    if ((d===0&&l===13)||(d===1&&l===12)||(d===2&&l===13)||(d===3&&l===14)||(d===4&&l===15)||(d===5&&l===1)||(d===6&&l===2)) return "วันอมริสสโชค";
    if ((d===0&&l===14)||(d===1&&l===13)||(d===2&&l===14)||(d===3&&l===15)||(d===4&&l===1)||(d===5&&l===2)||(d===6&&l===3)) return "วันชัยโชค";
    if ((d===0&&l===15)||(d===1&&l===14)||(d===2&&l===15)||(d===3&&l===1)||(d===4&&l===2)||(d===5&&l===3)||(d===6&&l===4)) return "วันราชาโชค";
    return null;
  })();

  const yrInfoNow = getLunarYearInfo(currentYearBE);
  const maxWaning = (currentMonth % 2 === 0 || (currentMonth === 9 && yrInfoNow.isAthikawan)) ? 15 : 14;
  const isSin = (currentKham === 8 || currentKham === 15 || (currentPhase === 'แรม' && currentKham === maxWaning));
  
  const jomCheck = { 1:[4,5],2:[6,0],3:[1,2],4:[3],5:[4,5],6:[6,0],7:[1,2],8:[3],9:[4,5],10:[6,0],11:[1,2],12:[3] };
  const fooCheck = { 1:[1],2:[2],3:[3],4:[4],5:[1],6:[2],7:[3],8:[4],9:[1],10:[2],11:[3],12:[4] };
  const siaCheck = { 1:[0,1],5:[0,1],9:[0,1],2:[2],6:[2],10:[2],4:[3,5],8:[3,5],12:[3,5],3:[6,4],7:[6,4],11:[6,4] };
  
  const fahVal = (cs % 108 + (parseInt(lannaMonthStr) || 0) + currentKham) * 5 - 7;
  const fahTeeSang = (fahVal % 9 < 0) ? (fahVal % 9 + 9) : (fahVal % 9);

  const zodiacList = [
    { name: "เส็ด", thai: "จอ", emoji: "🐶", flower: "ดอกจำปี", tree: "ต้นคูน" },
    { name: "ไก้", thai: "กุน", emoji: "🐘", flower: "ดอกหอมไกล", tree: "ต้นพุทรา" },
    { name: "ไจ้", thai: "ชวด", emoji: "🐭", flower: "ดอกบัวหลวง", tree: "ต้นมะพร้าว" },
    { name: "เป้า", thai: "ฉลู", emoji: "🐮", flower: "ดอกสลิด", tree: "ต้นตาล" },
    { name: "ยี่", thai: "ขาล", emoji: "🐯", flower: "ดอกรัง", tree: "ต้นรัง" },
    { name: "เหม้า", thai: "เถาะ", emoji: "🐰", flower: "ดอกกุ่ม", tree: "ต้นงิ้ว" },
    { name: "สี", thai: "มะโรง", emoji: "🐉", flower: "ดอกพยอม", tree: "ต้นไผ่" },
    { name: "ไส้", thai: "มะเส็ง", emoji: "🐍", flower: "ดอกบัวแดง", tree: "ต้นโพธิ์" },
    { name: "สะง้า", thai: "มะเมีย", emoji: "🐴", flower: "ดอกเล็บมือนาง", tree: "ต้นตะเคียน" },
    { name: "เม็ด", thai: "มะแม", emoji: "🐑", flower: "ดอกชบา", tree: "ต้นทองหลาง" },
    { name: "สัน", thai: "วอก", emoji: "🐒", flower: "ดอกพิกุล", tree: "ต้นขนุน" },
    { name: "เล้า", thai: "ระกา", emoji: "🐔", flower: "ดอกบัว", tree: "ต้นทองกวาว" }
  ];
  const maePeeList = ["เปิก", "กัด", "กด", "ร้วง", "เต่า", "กา", "กาบ", "ดับ", "รวาย", "เมือง"];
  const zInfo = zodiacList[cs % 12];
  const yearZodiac = maePeeList[cs % 10] + zInfo.name + " (" + zInfo.thai + ")";

  return {
    date, lannaMonth: lannaMonthStr, lunarDay: currentKham, phase: currentPhase, rawLunarDay, dow, wanThai,
    wanThaiDesc: DATA.wanThaiDetailed[wanThai] || "",
    sitthi, isSia: (siaCheck[currentMonth] || []).includes(dow), isJom: (jomCheck[currentMonth] || []).includes(dow),
    isFoo: (fooCheck[currentMonth] || []).includes(dow), isSin, isHuaRiang: [2,4,6,8,10,11,12,13].includes(currentKham),
    dithiName: {1:"นันทา",2:"ภัทรา",3:"ไชยา",4:"ริตตา",5:"ปุณณา",6:"นันทา",7:"ภัทรา",8:"ไชยา",9:"ริตตา",10:"ปุณณา",11:"นันทา",12:"ภัทรา",13:"ไชยา",14:"ริตตา",15:"ปุณณา",16:"นันทา",17:"ภัทรา",18:"ไชยา",19:"ริตตา",20:"ปุณณา",21:"นันทา",22:"ภัทรา",23:"ไชยา",24:"ริตตา",25:"ปุณณา",26:"นันทา",27:"ภัทรา",28:"ไชยา",29:"ริตตา",30:"ปุณณา"}[currentKham],
    master: (DATA.masterRules[(dow-(rawLunarDay-1)%7+7)%7]||{})[rawLunarDay] || {n:"ปรกติ",s:"ปรกติ"},
    sri: {0:"ใต้",1:"ตกแจ่งใต้",2:"ตก",3:"ตกแจ่งเหนือ",4:"ออกแจ่งเหนือ",5:"ออกแจ่งใต้",6:"เหนือ"}[dow],
    kala: {0:"เหนือ",1:"ออกแจ่งเหนือ",2:"ออก",3:"ออกแจ่งใต้",4:"ตกแจ่งใต้",5:"ตกแจ่งเหนือ",6:"ใต้"}[dow],
    jangrai: {0:"ตก",1:"ออก",2:"เหนือ",3:"ใต้",4:"ตก",5:"ออก",6:"ตก"}[dow],
    kaoKong: Object.keys(DATA.kaoKongInfo)[(wanThaiIdx % 12 - {1:7,2:6,3:5,4:4,5:3,6:2,7:1,8:0,9:11,10:10,11:9,12:8}[currentMonth] + 12) % 12],
    yam: DATA.yamData[dow], cs, fahTeeSang, isFahTeeSangGood: [2,4,5,6].includes(fahTeeSang),
    phiKinSat: {1:[4],2:[5],3:[6],4:[0],5:[1],6:[2],7:[3],8:[4],9:[5],10:[6],11:[0],12:[1]}[currentMonth]?.includes(dow) ? "ผีกินสัตว์" : null,
    huaKhaoOk: [1,8,15,22].includes(currentKham) ? "วันหัวเข้า" : ([4,11,18,25].includes(currentKham) ? "วันหัวออก" : null),
    mahaChalong: ["จักกะโก","ราชา","ปุริสะ","ปาสาณะ","ไชยา","มรณะ","สุภะ","โภคัง","ลาภา","สิทธิ","โศกัง","อโรคยา"][(currentKham-1)%12],
    wanLohk: ["กาลโชค","มหาวัน","มรณะ","นันทะ","วุฒิ","ลาภะ","วินาศ"][dow],
    yearZodiac, flower: zInfo.flower, tree: zInfo.tree,
    cutHair: ["ห้ามตัดผม (จะอาภัพ)","ตัดผมแล้วดี (จะมีลาภ)","ตัดผมแล้วดี (จะชนะความ)","ห้ามตัดผม (จะมีทุกข์)","ตัดผมแล้วดี (จะมีอายุยืน)","ตัดผมแล้วดี (จะมีสิริ)","ห้ามตัดผม (จะเสียขวัญ)"][dow],
    cutNail: ["ห้ามตัดเล็บ","ตัดเล็บดี (มีโชค)","ตัดเล็บดี (มีทรัพย์)","ห้ามตัดเล็บ","ห้ามตัดเล็บ","ตัดเล็บดี (มีเสน่ห์)","ห้ามตัดเล็บ"][dow],
    washHair: ["ดำหัวดี (มีศรี)","ห้ามดำหัว (จะเสีย)","ห้ามดำหัว (จะขัดสน)","ห้ามดำหัว (จะป่วย)","ดำหัวดี (มีอายุ)","ดำหัวดี (มีสุข)","ห้ามดำหัว (จะตกใจ)"][dow],
    newClothes: ["นุ่งผ้าใหม่ดี","นุ่งผ้าใหม่ดี","ห้ามฉลองผ้าใหม่","นุ่งผ้าใหม่ดี","นุ่งผ้าใหม่ดี","นุ่งผ้าใหม่ดีที่สุด","ห้ามฉลองผ้าใหม่"][dow],
    isGoodTravel: !DATA.wanThaiDetailed[wanThai]?.includes("อย่าเดินทาง"),
    isSoulCalling: DATA.wanThaiDetailed[wanThai]?.includes("เรียกขวัญ") || DATA.wanThaiDetailed[wanThai]?.includes("มงคล"),
    isGoodPlanting: DATA.wanThaiDetailed[wanThai]?.includes("ปลูกพืช") || DATA.wanThaiDetailed[wanThai]?.includes("แรกน้ำ"),
    isGiveMoneyBad: DATA.wanThaiDetailed[wanThai]?.includes("ห้ามให้เงินท่าน"),
    isThongChai: dow === 0, isAthipadi: dow === 1, isUbat: dow === 6, isLokawinat: dow === 3,
    sangKhanLong: sangKhanLongDate, wanNao: wanNaoDate, phayaWan: phayaWanDate
  };
}

// ============================================================
// COMPONENTS
// ============================================================
function Badge({ label, bgColor }) {
  return (
    <span className="px-4 py-1.5 text-[1.2rem] font-black text-white m-[4px] inline-block shadow-md"
      style={{ backgroundColor: bgColor || "#6B4231" }}>
      {label}
    </span>
  );
}

function DetailRow({ label, icon, desc, color }) {
  return (
    <div className="flex items-center gap-[15px] py-[15px] border-b border-gray-200 last:border-0 w-full">
      <div className="w-12 h-12 flex items-center justify-center text-white text-[1.4rem] flex-shrink-0 shadow-inner"
        style={{ backgroundColor: color || "#6B4231" }}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[1.2rem] font-black text-[#8B5E3C]">{label}</div>
        <div className="text-[1.4rem] text-[#333] font-bold leading-tight">{desc}</div>
      </div>
    </div>
  );
}

function SectionDetail({ title, desc, color }) {
  return (
    <div className="py-6 border-b border-[#D1CDC7] last:border-0">
      <div className="text-[1.5rem] font-black mb-2 flex items-center gap-3" style={{ color: color || "#6B4231" }}>
        <span className="w-2.5 h-7 block" style={{ backgroundColor: color || "#6B4231" }} />
        {title}
      </div>
      <div className="text-[1.7rem] text-[#333] leading-relaxed font-bold pl-5">{desc}</div>
    </div>
  );
}

// ============================================================
// HELPERS
// ============================================================
function getSongkranLabel(date) {
  const info = getLannaDate(date); if (!info) return null;
  const dStr = date.toISOString().split('T')[0];
  const sStr = info.sangKhanLong.toISOString().split('T')[0];
  const nStr = info.wanNao.toISOString().split('T')[0];
  const pStr = info.phayaWan.toISOString().split('T')[0];
  if (dStr === sStr) return "สังขานต์ล่อง";
  if (dStr === nStr) return "วันเนาว์";
  if (dStr === pStr) return "พญาวัน";
  return null;
}

function yamColor(name) {
  if (["ปลอด","รุ่ง","สิทธิ","โชค","ชัย"].includes(name)) return "#10B981";
  if (["เสีย","ห้าม","คาบ"].includes(name)) return "#EF4444";
  return "#6B7280";
}

function getZodiacEmoji(name) {
  const map = { "ไจ้":"🐭", "เป้า":"🐮", "ยี่":"🐯", "เหม้า":"🐰", "สี":"🐉", "ไส้":"🐍", "สะง้า":"🐴", "เม็ด":"🐑", "สัน":"🐒", "เร้า":"🐔", "เส็ด":"🐶", "ไก้":"🐘" };
  for (let k in map) { if (name.includes(k)) return map[k]; }
  return "🐴";
}

// ===== BUG FIX #5: คำอธิบาย วันโลก ครบทั้ง 7 ค่า =====
function wanLohkDesc(name) {
  const map = {
    กาลโชค: "วันแห่งโชคลาภจากกาล เหมาะแก่การค้าขาย ริเริ่มกิจกรรมที่ต้องอาศัยโชคและจังหวะ",
    มหาวัน: "วันใหญ่ที่เป็นมงคลยิ่ง ทำการสิ่งใดจะประสบความสำเร็จและมีอำนาจ",
    มรณะ: "วันแห่งความตาย ควรระมัดระวังในการดำเนินชีวิตและการเดินทาง หลีกเลี่ยงงานมงคลสำคัญ",
    นันทะ: "วันแห่งความยินดี เหมาะแก่การรื่นเริงและงานมงคลที่เน้นความสุขใจ",
    วุฒิ: "วันแห่งความเจริญงอกงาม เหมาะแก่การปลูกสร้าง หรือเริ่มงานที่เน้นความมั่นคง",
    ลาภะ: "วันแห่งโชคลาภ เหมาะแก่การค้าขาย เปิดกิจการ และเสี่ยงโชค",
    วินาศ: "วันแห่งความวิบัติ ควรหลีกเลี่ยงการเริ่มงานใหม่ งานมงคล และการตัดสินใจสำคัญ",
  };
  return map[name] || "เกณฑ์วันตามตำราวันโลก ควรพิจารณาประกอบกับฤกษ์อื่น";
}

// ===== BUG FIX #6: คำอธิบาย มหาโฉลก ครบทั้ง 12 ค่า =====
function mahaChalongDesc(name) {
  const map = {
    จักกะโก: "มีโชคด้านพาหนะและการเดินทาง ควรออกเดินทางหรือซื้อยานพาหนะ",
    ราชา: "มีความเป็นใหญ่โดดเด่น เหมาะแก่การเข้าพบผู้มีอำนาจหรือเข้ารับตำแหน่ง",
    ปุริสะ: "มีโชคด้านกำลังวังชาและความแข็งแกร่ง เหมาะแก่การออกกำลังกายและงานหนัก",
    ปาสาณะ: "มีความมั่นคงเหมือนหิน เหมาะแก่การวางรากฐานและสร้างสิ่งถาวร",
    ไชยา: "มีโชคด้านชัยชนะในทุกการแข่งขัน เหมาะแก่การต่อสู้คดีและการเจรจา",
    มรณะ: "ควรระมัดระวังในการดำเนินชีวิตประจำวัน หลีกเลี่ยงความเสี่ยงที่ไม่จำเป็น",
    สุภะ: "มีความงดงามและสิริมงคลในทุกด้าน เหมาะแก่งานแต่งงานและพิธีมงคล",
    โภคัง: "มีโชคลาภและทรัพย์สมบัติพั่งพร้อม เหมาะแก่การลงทุนและออมทรัพย์",
    ลาภา: "จะมีโชคลาภหลั่งไหลเข้ามา ประสบความสำเร็จในด้านการเงินและธุรกิจ",
    สิทธิ: "ทำการสิ่งใดจะสำเร็จสมปรารถนาโดยเร็ววัน เหมาะแก่การเริ่มต้นทุกอย่าง",
    โศกัง: "ควรระมัดระวังเรื่องจิตใจและอารมณ์ หลีกเลี่ยงความขัดแย้งและการเสี่ยงโชค",
    อโรคยา: "มีโชคลาภในด้านสุขภาพ ความไม่มีโรคเป็นลาภอันประเสริฐ เหมาะแก่การรักษาพยาบาล",
  };
  return map[name] || "เกณฑ์โฉลกประจำวันตามตำราล้านนา";
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [view, setView] = useState("monthly");

  // ===== BUG FIX #2: ใช้ new Date() แทน hardcode April 29 =====
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });
  const [filter, setFilter] = useState("all");

  // ===== BUG FIX #3: current yam อัปเดตทุก 1 นาที =====
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);
  const currentYam = useMemo(() => {
    const r = now.getHours() * 60 + now.getMinutes();
    return r < 360 || r >= 1080 ? -1 : Math.floor((r - 360) / 90);
  }, [now]);

  const dayInfo = useMemo(() => getLannaDate(selectedDate), [selectedDate]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const y = calendarMonth.getFullYear(), m = calendarMonth.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
    return cells;
  }, [calendarMonth]);

  // Filter visibility
  const filteredDays = useMemo(() =>
    calendarDays.map(d => {
      if (!d) return { date: d, visible: true };
      const info = getLannaDate(d);
      let visible = true;
      if (filter === "sin") visible = !!info?.isSin;
      else if (filter === "auspicious") visible = !!(info?.isThongChai || info?.isAthipadi || info?.sitthi || info?.isFahTeeSangGood);
      else if (filter === "inauspicious") visible = !!(info?.isSia || info?.isUbat || info?.isLokawinat || info?.isWanMutju);
      return { date: d, visible };
    }),
    [calendarDays, filter]
  );

  const headerBar = (
    <div className="bg-[#6B4231] text-[#FEF3C7] mb-4 p-3 flex justify-between items-center shadow-lg border border-[#4D3024]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FEF3C7] flex items-center justify-center text-[#6B4231] text-[1.2rem] font-black shadow-inner">
          {getZodiacEmoji(dayInfo?.yearZodiac || "")}
        </div>
        <div>
          <div className="text-[0.65rem] font-bold opacity-80 uppercase tracking-widest">ปีนักษัตร</div>
          <div className="text-[0.85rem] font-black leading-tight">ปี{dayInfo?.yearZodiac}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[0.65rem] font-bold opacity-80">จุลศักราช</div>
        <div className="text-[0.85rem] font-black">{dayInfo?.cs}</div>
      </div>
    </div>
  );

  // ─── MONTHLY VIEW ───────────────────────────────────────
  if (view === "monthly") {
    return (
      <div className="bg-[#E0DDD8] min-h-screen p-3 text-[#2D1B08] font-sans antialiased">
        <div className="max-w-[480px] mx-auto">
          {headerBar}

          <div className="bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-200">
            {/* Month navigator */}
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                className="border-none bg-[#F3EFE9] w-10 h-10 flex items-center justify-center font-black cursor-pointer hover:bg-[#EAE2D8] transition-colors">‹</button>
              <div className="text-center group relative">
                <div className="font-black text-[1.3rem] text-[#6B4231] tracking-tight">
                  {DATA.monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear() + 543}
                </div>
                <div className="text-[0.75rem] font-bold text-[#A38D74]">
                  จุลศักราช {getLannaDate(calendarMonth)?.cs}
                </div>
                <input type="date" className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={e => {
                    const t = new Date(e.target.value);
                    if (!isNaN(t.getTime())) { setSelectedDate(t); setCalendarMonth(new Date(t.getFullYear(), t.getMonth(), 1)); }
                  }} />
              </div>
              <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                className="border-none bg-[#F3EFE9] w-10 h-10 flex items-center justify-center font-black cursor-pointer hover:bg-[#EAE2D8] transition-colors">›</button>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {[{id:"all",label:"ทั้งหมด"},{id:"auspicious",label:"วันมงคล"},{id:"sin",label:"วันศีล"},{id:"inauspicious",label:"วันเสีย"}].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  className={`px-4 py-1.5 text-[0.7rem] font-black whitespace-nowrap transition-all ${filter===f.id?"bg-[#6B4231] text-white shadow-md":"bg-[#F3EFE9] text-[#8B5E3C]"}`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-[4px] text-center mb-3">
              {["อา","จ","อ","พ","พฤ","ศ","ส"].map((d,i) => (
                <div key={d} className={`text-[0.75rem] font-black ${i===0?"text-[#E11D48]":"text-[#8B5E3C]"}`}>{d}</div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-[6px]">
              {filteredDays.map(({ date: d, visible }, idx) => {
                if (!d) return <div key={`e${idx}`} className="aspect-[1/1.7]" />;
                const info = getLannaDate(d);
                const songkran = getSongkranLabel(d);
                const isSelected = d.toDateString() === selectedDate.toDateString();
                const isToday = d.toDateString() === new Date().toDateString();
                const badge = songkran || (info.isSin?"วันศีล":info.sitthi?info.sitthi.replace("วัน",""):info.isThongChai?"ธงชัย":info.isAthipadi?"อธิบดี":"");

                return (
                  <button key={d.toISOString()} onClick={() => { setSelectedDate(d); setView("daily"); }}
                    className={`aspect-[1/1.7] flex flex-col items-center justify-start p-1.5 cursor-pointer transition-all border-[2px]
                      ${isSelected?"border-[#92400E] bg-[#6B4231] text-white shadow-md z-10":isToday?"border-[#FCD34D] bg-[#FEF3C7] text-[#2D1B08]":"border-transparent bg-[#F9F6F1] text-[#2D1B08]"}
                      ${!visible?"opacity-20 grayscale":""}
                      ${!isSelected&&d.getDay()===0?"text-[#E11D48]":""}
                      hover:border-[#D1CDC7]`}>
                    <div className="w-full flex justify-between items-start mb-1">
                      <span className="text-[1.7rem] font-black leading-[1]">{d.getDate()}</span>
                      {info.isSin && <div className="w-[10px] h-[10px] bg-[#F59E0B] shadow-sm border-[1px] border-white flex-shrink-0" />}
                    </div>
                    <div className="flex flex-col items-center w-full gap-0.5 mt-[-4px]">
                      <span className={`text-[1.2rem] font-black leading-none truncate ${isSelected?"text-white":"text-[#8B5E3C]"}`}>เดือน {info.lannaMonth}</span>
                      <span className={`text-[1.2rem] font-bold leading-none ${isSelected?"text-[#FEF3C7]":"text-[#A38D74]"}`}>{info.phase}{info.lunarDay}</span>
                    </div>
                    {badge && (
                      <div className={`mt-1 text-[1.1rem] font-black px-1 text-center leading-tight truncate w-full
                        ${isSelected?"text-[#FEF3C7]":songkran?"text-[#06B6D4]":info.isSin?"text-[#D97706]":"text-[#059669]"}`}>
                        {badge}
                      </div>
                    )}
                    <div className="mt-auto w-full flex flex-wrap gap-[4px] justify-center pb-1">
                      {(info.isThongChai||info.isAthipadi||info.sitthi||info.isFahTeeSangGood) && <div className="w-[10px] h-[10px] bg-[#10B981] shadow-sm border-[1px] border-white" />}
                      {(info.isSia||info.isUbat||info.isLokawinat||info.isWanMutju) && <div className="w-[10px] h-[10px] bg-[#EF4444] shadow-sm border-[1px] border-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Monthly auspicious list */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h4 className="text-[1.8rem] font-black text-[#6B4231] mb-6 flex items-center gap-3">
                <span className="w-3.5 h-8 bg-[#6B4231]" />
                รายละเอียดวันมงคลและวันสำคัญ
              </h4>
              <div className="flex flex-col gap-4">
                {calendarDays.filter(d => d).map(d => {
                  const info = getLannaDate(d);
                  const songkran = getSongkranLabel(d);
                  if (!info?.isThongChai && !info?.isAthipadi && !info?.sitthi && !info?.isFahTeeSangGood && !songkran && !info?.isSin) return null;
                  return (
                    <div key={d.toISOString()} className="bg-[#F9F6F1] p-6 border border-[#EEE] shadow-sm">
                      <div className="flex items-start gap-5">
                        <div className={`w-16 h-16 flex items-center justify-center text-white text-[2rem] font-black flex-shrink-0 shadow-md ${info?.isSin?"bg-[#F59E0B]":songkran?"bg-[#06B6D4]":"bg-[#10B981]"}`}>
                          {d.getDate()}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col mb-2">
                            <div className="text-[1.6rem] font-black text-[#6B4231] leading-tight">{info?.phase} {info?.lunarDay} ค่ำ</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="text-[1.2rem] font-black text-[#8B5E3C]">เดือน {info?.lannaMonth}</div>
                              <div className="text-[1.1rem] font-bold px-3 py-0.5 bg-white border border-gray-200 text-[#A38D74]">{info?.wanThai}</div>
                            </div>
                          </div>
                          <div className="text-[1.5rem] text-[#3D3128] leading-relaxed">
                            {songkran && <span className="text-[#0891B2] font-black block mb-2">✨ {songkran}: {songkran==="พญาวัน"?"วันเถลิงศกใหม่ เปลี่ยนจุลศักราชและนักษัตรประจำปี เป็นสิริมงคลสูงสุด":songkran==="สังขานต์ล่อง"?"วันสิ้นสุดปีเก่า ชำระล้างสิ่งไม่ดี":"วันว่างระหว่างปีเก่าและปีใหม่"}</span>}
                            {info?.isSin && <span className="text-[#D97706] font-black block mb-2">☸️ วันศีล: เหมาะแก่การเข้าวัดฟังธรรม รักษาศีล และทำจิตใจให้ผ่องใส</span>}
                            {info?.sitthi && <span className="text-[#059669] font-black block mb-2">💎 {info.sitthi}: ฤกษ์มงคลที่ให้ผลสำเร็จอย่างรวดเร็วและยั่งยืน</span>}
                            {info?.isThongChai && <span className="text-[#059669] font-black block mb-2">🚩 วันธงชัย: วันแห่งชัยชนะ เหมาะแก่การยกทัพ จับงานใหญ่ หรือเปิดกิจการ</span>}
                            {info?.isAthipadi && <span className="text-[#2563EB] font-black block mb-2">👑 วันอธิบดี: วันแห่งความเป็นใหญ่ เหมาะแก่การเข้าหาผู้ใหญ่ หรือแต่งตั้งโยกย้าย</span>}
                            <p className="m-0 opacity-80 mt-2 italic border-t border-gray-200 pt-2 font-bold">"{info?.wanThaiDesc}"</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-3 border-t border-gray-100 pt-4">
              {[["#06B6D4","สงกรานต์"],["#F59E0B","วันศีล"],["#10B981","ฟ้าตีแส่งดี"],["#EF4444","วันเสีย"]].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <div className="w-2 h-2" style={{backgroundColor:c}} />
                  <span className="text-[0.6rem] font-bold opacity-60">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── DAILY VIEW ──────────────────────────────────────────
  const c = dayInfo;
  const songkranLabel = getSongkranLabel(selectedDate);

  return (
    <div className="bg-[#E0DDD8] min-h-screen p-3 text-[#2D1B08] font-sans antialiased">
      <div className="max-w-[480px] mx-auto">
        {headerBar}

        <div className="flex flex-col gap-6">

          {/* Nav */}
          <div className="bg-[#F9F6F1] p-6 border border-[#D1CDC7] shadow-sm">
            <div className="flex justify-between mb-6">
              <button onClick={() => setView("monthly")}
                className="border-none bg-[#6B4231] text-white px-7 py-3 font-black cursor-pointer text-[1.2rem] shadow-sm">‹ รายเดือน</button>
              <button onClick={() => setSelectedDate(new Date())}
                className="border-none bg-[#D6D3D1] px-7 py-3 font-black cursor-pointer text-[1.2rem]">วันนี้</button>
            </div>
            <div className="flex justify-between items-center px-4">
              <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate()-1); setSelectedDate(d); }}
                className="border-none bg-[#D6D3D1] w-14 h-14 flex items-center justify-center font-black cursor-pointer">‹</button>
              <div className="text-center">
                <div className="text-[1.2rem] font-bold text-[#6B4231] opacity-60 uppercase tracking-widest">เลือกวัน</div>
              </div>
              <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate()+1); setSelectedDate(d); }}
                className="border-none bg-[#D6D3D1] w-14 h-14 flex items-center justify-center font-black cursor-pointer">›</button>
            </div>
          </div>

          {/* Hero date card */}
          <div className="bg-[#6B4231] p-10 border border-[#4D3024] text-center text-[#FEF3C7] shadow-xl relative overflow-hidden">
            <div className="absolute top-[-20px] left-[-20px] w-32 h-32 bg-white opacity-5 rounded-full" />
            <div className="absolute bottom-[-30px] right-[-30px] w-52 h-52 bg-black opacity-10 rounded-full" />
            {songkranLabel && <div className="text-[#06B6D4] text-[3.8rem] font-black block mb-8 drop-shadow-lg animate-pulse leading-none">{songkranLabel}</div>}

            <div className="flex flex-col gap-3 mb-8 pb-8 border-b border-white/20">
              <div className="text-[2.2rem] font-black tracking-tight">
                {selectedDate.getDate()} {DATA.monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear() + 543}
              </div>
              <div className="text-[2.2rem] font-bold opacity-90">
                จ.ศ. {c?.cs} ปี{c?.yearZodiac}
              </div>
            </div>

            {/* ===== BUG FIX #4: ปรับปรุงการคำนวณเดือนและดิถีแบบล้านนา (Athikamat/Athikawan) ให้แม่นยำสูงสุด ===== */}

            <h2 className="text-[2.2rem] font-black leading-tight flex flex-col items-center gap-4">
              <span>{c?.phase} {c?.lunarDay} ค่ำ</span>
              <span>เดือน {c?.lannaMonth}</span>
            </h2>

            <div className="flex flex-wrap gap-[6px] justify-center mt-8 pt-6 border-t border-white/10">
              {c?.isSin && <Badge label="วันศีล" bgColor="#F59E0B" />}
              {c?.isThongChai && <Badge label="วันธงชัย" bgColor="#059669" />}
              {c?.isAthipadi && <Badge label="วันอธิบดี" bgColor="#2563EB" />}
              {c?.isUbat && <Badge label="วันอุบาทว์" bgColor="#DC2626" />}
              {c?.isLokawinat && <Badge label="วันโลกาวินาศ" bgColor="#000" />}
              <Badge label={`วัน${c?.wanLohk}`} bgColor="#4B5563" />
              {c?.isJom && <Badge label="วันจม" bgColor="#4B5563" />}
              {c?.isFoo && <Badge label="วันฟู" bgColor="#10B981" />}
              {c?.sitthi && <Badge label={c.sitthi} bgColor="#3B82F6" />}
              {c?.isHuaRiang && <Badge label="วันหัวเรียงหมอน" bgColor="#DB2777" />}
              {c?.isRahuTok && <Badge label="ราหูเกตุตก" bgColor="#4338CA" />}
              <Badge label={`${c?.dithiName}ดิถี`} bgColor="#92400E" />
              <Badge label={`โฉลก: ${c?.mahaChalong}`} bgColor="#78350F" />
            </div>
          </div>

          {/* เกณฑ์วันและดิถี */}
          <div className="bg-[#EEEAE3] p-8 border border-[#D1CDC7] shadow-sm">
            <h3 className="m-0 mb-2 text-[1.8rem] font-black text-[#92400E] border-b-2 border-[#D1CDC7] pb-3">ความหมายเกณฑ์วันและดิถี</h3>
            <div className="flex flex-col">
              {c?.isLokawinat && <SectionDetail title="วันโลกาวินาศ" desc="ห้ามทำการมงคลเด็ดขาด จะเกิดความพินาศฉิบหาย สูญเสียทรัพย์สินและบารมี" color="#000" />}
              {c?.isUbat && <SectionDetail title="วันอุบาทว์" desc="ห้ามริเริ่มงานใหม่หรือทำพิธีมงคล จะเกิดอุปสรรค ขัดข้อง และเรื่องเดือดร้อน" color="#DC2626" />}
              <SectionDetail title={`วัน${c?.wanLohk}`} desc={wanLohkDesc(c?.wanLohk)} color="#4B5563" />
              {c?.isJom && <SectionDetail title="วันจม" desc="ห้ามทำการมงคลที่เกี่ยวกับความคงทนถาวร เช่น ปลูกบ้าน ลงเสาเอก หรือซื้อสัตว์ใหญ่มาเลี้ยง" color="#4B5563" />}
              {c?.isFoo && <SectionDetail title="วันฟู" desc="วันแห่งความรุ่งเรือง เหมาะแก่การริเริ่มกิจการใหม่ ขึ้นบ้านใหม่ งานจะเฟื่องฟูและก้าวหน้า" color="#10B981" />}
              {c?.isHuaRiang && <SectionDetail title="วันหัวเรียงหมอน" desc="ฤกษ์มงคลสำหรับพิธีแต่งงาน ส่งตัวเข้าหอ จะทำให้คู่บ่าวสาวอยู่เย็นเป็นสุข รักกันยั่งยืน" color="#DB2777" />}
              <SectionDetail
                title={`${c?.dithiName}ดิถี`}
                desc={c?.dithiName==="นันทา"?"ดิถีแห่งความบันเทิงใจ ให้ผลดีในงานมงคลทั่วไป":c?.dithiName==="ภัทรา"?"ดิถีแห่งความเป็นศิริมงคล ให้ผลด้านความรุ่งเรืองและโชคลาภ":c?.dithiName==="ไชยา"?"ดิถีแห่งชัยชนะ ให้ผลดีเยี่ยมในการแข่งขัน เจรจา และความสำเร็จ":c?.dithiName==="ริตตา"?"ดิถีที่ว่างเปล่า (ดิถีเสีย) ควรหลีกเลี่ยงงานมงคลสำคัญ":c?.dithiName==="ปุณณา"?"ดิถีที่เต็มเปี่ยม ให้ผลมงคลสูงสุดในทุกด้าน":""}
                color="#92400E" />
              {c?.isRahuTok && <SectionDetail title="ราหูเกตุตก" desc="เกณฑ์อันตรายตามตำราโบราณ ระวังการทำพิธีใหญ่ หรือการเดินทางที่ต้องเสี่ยงภัย" color="#4338CA" />}
              <SectionDetail title={`โฉลก: ${c?.mahaChalong}`} desc={mahaChalongDesc(c?.mahaChalong)} color="#78350F" />
            </div>
          </div>

          {/* ทิศมงคล */}
          <div className="bg-[#EEEAE3] p-8 border border-[#D1CDC7] shadow-sm">
            <h3 className="m-0 mb-6 text-[1.6rem] font-black text-[#92400E] border-b-2 border-[#D1CDC7] pb-3">เกณฑ์และทิศมงคล</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[["ทิศศรี",c?.sri,"#059669"],["กาลกิณี",c?.kala,"#DC2626"],["ทิศจังไร",c?.jangrai,"#000"]].map(([t,v,co]) => (
                <div key={t} className="bg-white p-4 text-center shadow-sm">
                  <p className="m-0 text-[1.1rem] font-black text-gray-400 mb-1">{t}</p>
                  <p className="m-0 text-[1.6rem] font-black" style={{color:co}}>{v}</p>
                </div>
              ))}
            </div>
            <DetailRow label="แม่บทวันกระด้าง" icon="📜"
              desc={c?.master?.n && c.master.n !== "ปรกติ" ? `${c.master.n} (${c.master.s})` : "วันนวติถี (ปรกติ)"}
              color="#D97706" />
            {c?.phiKinSat && <DetailRow label="วันผีกินสัตว์" icon="👹" desc="ห้ามนำสัตว์เข้าบ้านหรือทำคอกสัตว์" color="#7F1D1D" />}
            {c?.huaKhaoOk && <DetailRow label="เกณฑ์หัวเข้า-ออก" icon="🚪"
              desc={c.huaKhaoOk === "วันหัวเข้า" ? "เหมาะนำทรัพย์เข้าบ้าน" : "เหมาะแก่การระบายออก"}
              color="#0369A1" />}
          </div>

          {/* ยามมงคล */}
          <div className="bg-[#EEEAE3] p-8 border border-[#D1CDC7] shadow-sm">
            <h3 className="m-0 mb-6 text-[1.6rem] font-black text-[#92400E] border-b-2 border-[#D1CDC7] pb-3">ยามมงคลประจำวัน</h3>
            <div className="grid grid-cols-4 gap-3">
              {c?.yam.map((name, i) => {
                const totalMin = i * 90;
                const h = String(6 + Math.floor(totalMin / 60)).padStart(2, "0");
                const m = String(totalMin % 60).padStart(2, "0");
                const isCurrentYam = selectedDate.toDateString() === new Date().toDateString() && i === currentYam;
                return (
                  <div key={i} className={`p-4 text-center border-2 transition-all ${isCurrentYam?"bg-white border-[#92400E] shadow-md scale-105":"bg-white/50 border-transparent"}`}>
                    <p className="m-0 text-[1rem] font-black text-gray-400 mb-1">{h}:{m}</p>
                    <p className="m-0 text-[1.3rem] font-black" style={{ color: yamColor(name) }}>{name}</p>
                    {isCurrentYam && <div className="text-[0.8rem] font-black text-[#92400E] mt-1 animate-pulse">ขณะนี้</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* คำแนะนำกิจวัตร */}
          <div className="bg-[#EEEAE3] p-8 border border-[#D1CDC7] shadow-sm">
            <h3 className="m-0 mb-6 text-[1.6rem] font-black text-[#92400E] border-b-2 border-[#D1CDC7] pb-3">คำแนะนำกิจวัตร</h3>
            <div className="flex flex-col gap-2">
              <DetailRow label="ตัดผม" icon="✂️" desc={c?.cutHair||""} color="#10B981" />
              <DetailRow label="ตัดเล็บ" icon="💅" desc={c?.cutNail||""} color="#8B5E3C" />
              <DetailRow label="ดำหัวสระผม" icon="💦" desc={c?.washHair||""} color="#06B6D4" />
              <DetailRow label="นุ่งผ้าใหม่" icon="👕" desc={c?.newClothes||""} color="#3B82F6" />
            </div>
          </div>

          {/* วันไท + เก้ากอง */}
          <div className="bg-[#EEEAE3] p-8 border border-[#D1CDC7] shadow-sm">
            <h3 className="m-0 mb-6 text-[1.6rem] font-black text-[#92400E]">วันไท ({c?.wanThai})</h3>
            <p className="m-0 text-[1.6rem] text-[#3D3128] leading-relaxed italic font-bold">"{c?.wanThaiDesc}"</p>
            <div className="flex flex-wrap gap-3 mt-6">
              {c?.isGoodTravel
                ? <Badge label="เดินทางมงคล" bgColor="#059669" />
                : <Badge label="ห้ามเดินทาง" bgColor="#DC2626" />}
              {c?.isSoulCalling && <Badge label="วันเรียกขวัญ" bgColor="#7C3AED" />}
              {c?.isGoodPlanting && <Badge label="วันปลูกพืช" bgColor="#047857" />}
              {c?.isGiveMoneyBad && <Badge label="ห้ามให้เงินท่าน" bgColor="#BE123C" />}
            </div>
            <div className="mt-8 pt-6 border-t border-[#D1CDC7]">
              <h3 className="m-0 mb-4 text-[1.6rem] font-black text-[#92400E]">ระบบเก้ากอง ({c?.kaoKong})</h3>
              <p className="m-0 text-[1.6rem] text-[#3D3128] leading-relaxed font-bold">{c?.kaoKongDesc}</p>
            </div>
          </div>

          {/* ฟ้าตีแส่ง */}
          <div className="bg-[#EEEAE3] p-8 border border-[#D1CDC7] shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b-2 border-[#D1CDC7] pb-3">
              <h3 className="m-0 text-[2.2rem] font-black text-[#92400E]">ฟ้าตีแส่งเศษ {c?.fahTeeSang}</h3>
              <div className={`px-5 py-2 text-[1.3rem] font-black ${c?.isFahTeeSangGood?"bg-[#10B981] text-white shadow-md":"bg-[#EF4444] text-white shadow-md"}`}>
                {c?.isFahTeeSangGood ? "ฤกษ์ดีมงคล" : "ฤกษ์เสียควรเลี่ยง"}
              </div>
            </div>
            <div className="bg-white p-8 shadow-inner mb-6 border border-gray-100">
              <div className="p-6 bg-[#F9F6F1] border-l-[12px] border-[#92400E] shadow-sm">
                <h4 className="text-[1.6rem] font-black text-[#6B4231] mb-3">คำทำนายตำราฟ้าตีแส่ง:</h4>
                <p className="m-0 text-[1.8rem] text-[#3D3128] leading-relaxed font-black">
                  {[0,1,8].includes(c?.fahTeeSang ?? -1) && (
                    <span className="text-[#EF4444] block">
                      <span className="text-[2.2rem] block mb-3 underline decoration-double">เกณฑ์เสีย (พินาศฉิบหาย)</span>
                      ไม่ดี แม้เป็นพระญาอินทราธิราชขึ้นทรงปราสาทก็จักวินาศฉิบหาย อย่าทำพิธีหรือกิจกรรมใด ถ้าทำไปไม่ถึงปีก็จักตาย หรือฉิบหาย หรือถูกไล่หนี
                    </span>
                  )}
                  {[3,7].includes(c?.fahTeeSang ?? -1) && (
                    <span className="text-[#EF4444] block">
                      <span className="text-[2.2rem] block mb-3 underline decoration-double">เกณฑ์เสีย (ไฟและอุบัติเหตุ)</span>
                      ไม่ดี ไฟจักไหม้ หรือจักประสบอุบัติเหตุ เป็นอันตรายแก่ท้าวพระญา ผีเสื้อบ้าน เสื้อเมือง หรือมิฉะนั้นตนจักตาย หรือจักเสียทรัพย์สิน เสียข้าวของเงินทอง
                    </span>
                  )}
                  {[2,4,5,6].includes(c?.fahTeeSang ?? -1) && (
                    <span className="text-[#10B981] block">
                      <span className="text-[2.2rem] block mb-3 underline decoration-double">เกณฑ์ดี (มงคลสำเร็จ)</span>
                      ดี จะประสบผลสำเร็จทุกประการ แม้นทุกข์ยากเข็ญใจก็จักได้ดี อยู่ดีมีสุข พรั่งพร้อมด้วยยศ สมบัติ ข้าวของเงินทอง
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="text-[1.1rem] text-gray-500 font-bold text-center space-y-1">
              <p className="m-0">สูตร: ((จ.ศ. {c?.cs} % 108) + เดือน {c?.lannaMonth} + ดิถี {c?.rawLunarDay}) × 5 - 7 แล้วหารด้วย 9</p>
              <p className="m-0 italic opacity-80">* เกณฑ์โบราณล้านนาสำหรับหาช่วงเวลาที่ "ท้องฟ้าเปิดรุ่งอรุณ" เหมาะแก่การเริ่มงานมงคล</p>
            </div>
          </div>

          <footer className="mt-12 text-center text-[1.2rem] text-[#8B5E3C] font-black pb-16 opacity-80">
            ข้อมูลอ้างอิง: ปั๊กขะทืนล้านนา ๒๕๖๙ มหาวิทยาลัยเชียงใหม่ & วัดธาตุคำ
          </footer>
        </div>
      </div>
    </div>
  );
}
