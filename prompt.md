@src/utils/lannaCalc.ts

The CS year boundary uses April 16 as วันพญาวัน (confirmed correct).
Fix the cs computation to use lannaYearTransitions data
instead of hardcoded month/date logic.

CURRENT (wrong):
  const cs = date.getFullYear() - 638 - (someCondition ? 1 : 0)

REPLACE WITH:

import { lannaYearTransitionByGregorianYear } from '../data/lannaYearTransitions';

Inside getLannaDate:
  const transition = lannaYearTransitionByGregorianYear.get(date.getFullYear());
  const payaWan = transition ? new Date(transition.payaWanDate) : new Date(date.getFullYear(), 3, 16);

  // CS switches on payaWanDate (April 16)
  const isNewYear = (
    date.getMonth() > payaWan.getMonth() ||
    (date.getMonth() === payaWan.getMonth() && date.getDate() >= payaWan.getDate())
  );
  const cs = isNewYear
    ? transition?.newChulasakarat ?? (date.getFullYear() - 638)
    : transition?.oldChulasakarat ?? (date.getFullYear() - 639);

  // yearZodiac also uses same boundary
  const zodiacLanna = isNewYear
    ? transition?.newZodiac ?? ""
    : transition?.oldZodiac ?? "";
  const zodiacThai  = zodiacLanna
    ? (DATA.LannaZodiacThaiMap?.[zodiacLanna] ?? "")
    : "";

Update the return object:
  cs,
  yearZodiac: zodiacLanna + (zodiacThai ? ` (${zodiacThai})` : ""),
  lannaYear: {
    zodiacLanna,
    zodiacThai,
    chulasakarat: cs,
  },

This ensures:
  - April 1–15, 2026  → CS 1387, ปีดับไส้ (มะเส็ง)
  - April 16+, 2026   → CS 1388, ปีรวายสะง้า (มะเมีย)

Output complete lannaCalc.ts.