export type Score = "good" | "bad" | "neutral";

export type DayRecord = {
  dateISO: string; // YYYY-MM-DD
  day: number;
  month: number;
  year: number;
  lunar: string;
  labels: string[];
  description: string[];
  score: Score;
};

export type MonthData = {
  month: string; // YYYY-MM
  data: DayRecord[];
  version: number;
  updatedAt: number;
};
