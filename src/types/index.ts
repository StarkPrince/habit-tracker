import { DailyCount } from "@/utils/dataProcessing";

// src/types/index.ts
export interface Habit {
  _id: string;
  name: string;
  createdAt: string;
  logs: string[];
  // Optionally add processed data
  dailyCounts?: DailyCount[];
}
