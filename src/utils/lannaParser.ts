export interface LunarData {
  phase: "waxing" | "waning";
  day: number;
}

export interface Ritual {
  title: string;
  description: string;
}

export interface LannaDayInfo {
  y: number;
  m: number;
  d: number;
  lunar: LunarData;
  labels: {
    good: string[];
    bad: string[];
    special: string[];
  };
  description: string;
  warnings: string[];
  rituals: Ritual[];
  festival: string;
  rawText: string;
}

/**
 * Lanna Calendar Parser
 * A deterministic, pattern-based parser for structured Lanna calendar text.
 */
export class LannaParser {
  // Dictionary of known Lanna traditional terms and their categories
  private static DICTIONARY = {
    good: ["วันปลอด", "วันสิทธิโชค", "วันมหาสิทธิโชค", "วันชัยโชค", "วันราชาโชค", "วันฟู", "วันธงชัย", "วันอธิบดี"],
    bad: ["วันเสีย", "วันเสียใหญ่", "วันโลกาวินาศ", "วันอุบาทว์", "วันทุรวัน", "วันจม", "วันกาลกิณี", "วันม้วย"],
    special: ["วันศีล", "วันพระ", "วันโกน", "วันเข้าพรรษา", "วันออกพรรษา", "วันลอยกระทง", "วันสงกรานต์", "พญาวัน"]
  };

  // Patterns for extracting rituals
  private static RITUAL_PATTERNS = [
    { title: "การตัดผม", patterns: [/ตัดผม/, /โกนผม/] },
    { title: "การตัดเล็บ", patterns: [/ตัดเล็บ/] },
    { title: "การนุ่งผ้าใหม่", patterns: [/นุ่งผ้าใหม่/, /แต่งกายใหม่/] },
    { title: "การออกเดินทาง", patterns: [/เดินทาง/, /จรลี/] },
    { title: "การปลูกเรือน", patterns: [/ปลูกเรือน/, /สร้างบ้าน/] }
  ];

  /**
   * Parses a block of text containing Lanna calendar data for multiple days.
   */
  public parse(text: string): LannaDayInfo[] {
    const lines = text.split('\n');
    const results: LannaDayInfo[] = [];
    let currentDay: Partial<LannaDayInfo> | null = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Check if line starts a new day (e.g., "1 มกราคม 2568" or "วันที่ 1")
      const dayMatch = trimmedLine.match(/^(\d+)\s+([ก-๙]+)\s+(\d{4})/);
      if (dayMatch) {
        if (currentDay) results.push(this.finalizeDay(currentDay as LannaDayInfo));
        
        currentDay = {
          d: parseInt(dayMatch[1]),
          m: this.monthToNumber(dayMatch[2]),
          y: parseInt(dayMatch[3]),
          labels: { good: [], bad: [], special: [] },
          warnings: [],
          rituals: [],
          description: "",
          festival: "",
          rawText: trimmedLine
        };
        this.extractBasicInfo(trimmedLine, currentDay);
        continue;
      }

      if (currentDay) {
        currentDay.rawText += "\n" + trimmedLine;
        this.processContentLine(trimmedLine, currentDay);
      }
    }

    if (currentDay) results.push(this.finalizeDay(currentDay as LannaDayInfo));
    return results;
  }

  private processContentLine(line: string, day: Partial<LannaDayInfo>) {
    // 1. Extract Lunar Info if present
    const lunarMatch = line.match(/(ขึ้น|แรม)\s*(\d+)\s*ค่ำ/);
    if (lunarMatch) {
      day.lunar = {
        phase: lunarMatch[1] === "ขึ้น" ? "waxing" : "waning",
        day: parseInt(lunarMatch[2])
      };
    }

    // 2. Extract Labels
    for (const category of ["good", "bad", "special"] as const) {
      for (const term of LannaParser.DICTIONARY[category]) {
        if (line.includes(term) && !day.labels![category].includes(term)) {
          day.labels![category].push(term);
        }
      }
    }

    // 3. Extract Festival
    if (line.includes("เทศกาล") || line.includes("วันสำคัญ")) {
      const parts = line.split(/[:：]/);
      if (parts.length > 1) day.festival = parts[1].trim();
    }

    // 4. Extract Rituals
    for (const ritualType of LannaParser.RITUAL_PATTERNS) {
      for (const pattern of ritualType.patterns) {
        if (pattern.test(line)) {
          day.rituals!.push({
            title: ritualType.title,
            description: line.trim()
          });
          break;
        }
      }
    }

    // 5. Extract Warnings (Keywords like ห้าม, อย่า, บ่ดี)
    if (line.includes("ห้าม") || line.includes("อย่า") || line.includes("ไม่ควร") || line.includes("บ่ดี")) {
      const sentences = line.split(/[。.|!]/);
      for (const s of sentences) {
        if (s.includes("ห้าม") || s.includes("อย่า") || s.includes("ไม่ควร") || s.includes("บ่ดี")) {
          day.warnings!.push(s.trim());
        }
      }
    }

    // 6. Accumulate Description (everything else or specific description tag)
    if (line.includes("คำทำนาย") || line.includes("รายละเอียด")) {
       const parts = line.split(/[:：]/);
       if (parts.length > 1) day.description += (day.description ? "\n" : "") + parts[1].trim();
    } else if (!day.description && line.length > 20 && !day.rituals?.some(r => r.description === line)) {
       day.description = line;
    }
  }

  private extractBasicInfo(line: string, day: Partial<LannaDayInfo>) {
    // Look for Wan Thai (e.g. กาบยี่, ดับเหม้า)
    const wanThaiTerms = ["เปิก", "กัด", "กด", "ร้วง", "เต่า", "กา", "กาบ", "ดับ", "รวาย", "เมือง"];
    const lukMueTerms = ["ไจ้","เป้า","ยี่","เหม้า","สี","ไส้","สะง้า","เม็ด","สัน","เร้า","เส็ด","ไค้"];
    
    for (const m of wanThaiTerms) {
      for (const l of lukMueTerms) {
        const wt = m + l;
        if (line.includes(wt)) {
          day.labels?.special.push(`วัน${wt}`);
        }
      }
    }
  }

  private finalizeDay(day: LannaDayInfo): LannaDayInfo {
    // Ensure all arrays are unique and description is cleaned
    day.labels.good = [...new Set(day.labels.good)];
    day.labels.bad = [...new Set(day.labels.bad)];
    day.labels.special = [...new Set(day.labels.special)];
    day.warnings = [...new Set(day.warnings)];
    
    // Default lunar if not found (placeholder, in real scenario might need calculation)
    if (!day.lunar) {
      day.lunar = { phase: "waxing", day: 1 };
    }

    return day;
  }

  private monthToNumber(monthName: string): number {
    const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    return months.indexOf(monthName) + 1;
  }
}
