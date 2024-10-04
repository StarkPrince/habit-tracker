// src/utils/dataProcessing.ts
import { format, parseISO, startOfDay } from "date-fns";

export interface DailyCount {
  date: string; // Format: 'YYYY-MM-DD'
  count: number;
}

/**
 * Aggregates habit logs into daily counts.
 * @param logs Array of timestamp strings.
 * @returns Array of daily counts.
 */
export function aggregateLogsByDay(logs: string[]): DailyCount[] {
  const countsMap: { [key: string]: number } = {};

  logs.forEach((log) => {
    const date = format(startOfDay(parseISO(log)), "yyyy-MM-dd");
    countsMap[date] = (countsMap[date] || 0) + 1;
  });

  // Convert the map to an array
  const dailyCounts: DailyCount[] = Object.keys(countsMap).map((date) => ({
    date,
    count: countsMap[date],
  }));

  return dailyCounts;
}
