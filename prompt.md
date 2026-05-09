@src/App.tsx @src/utils/lannaCalc.ts @package.json

Fix 5 bugs found in code review of v0.03d:

BUG 1+2 — Remove ALL JSON label fallbacks for bad day flags.
Lanna calculation is the single source of truth.

In getStatusLines function, replace:
  if (day.isSia || check("วันเสีย"))
  if (day.isUbat || check("อุบาทว์"))
  if (day.isLokawinat || check("โลกาวินาศ"))
  if (day.isLomLuang || check("หล่มหลวง"))

With (remove all check() fallbacks for bad days):
  if (day.isSia)
  if (day.isUbat)
  if (day.isLokawinat)
  if (day.isLomLuang)

Keep check() ONLY for:
  if (day.isThongChai || check("ธงชัย"))
  if (day.isAthipadi || check("อธิบดี"))
  if (day.sitthi || check("สิทธิโชค"))

In the fetchData useEffect enriched mapping, change:
  isUbat: lanna.isUbat || labels.some(l => l.includes("อุบาทว์"))
  isLokawinat: lanna.isLokawinat || labels.some(l => l.includes("โลกาวินาศ"))
To:
  isUbat: lanna.isUbat
  isLokawinat: lanna.isLokawinat

BUG 3 — Delete stray file:
  src/components/import React from react.txt
Just delete it, no code change needed.

BUG 4 — getDirections missing jangrai:
In lannaCalc.ts, find getDirections function.
It currently returns { sri, ka }.
Add jangrai to the return based on day-of-week:
  const jangrai = ['ตก','ออกแจ่งใต้','เหนือ','ใต้','ตก','ออกแจ่งเหนือ','ตก'][dow] || '-'
  return { sri, ka, jangrai }

In App.tsx selectedDayFullInfo useMemo, update:
  directions: { sri: dir.sri, ka: dir.ka }
To:
  directions: { sri: dir.sri, ka: dir.ka, jangrai: dir.jangrai }


Output complete modified files:
App.tsx, lannaCalc.ts, package.json