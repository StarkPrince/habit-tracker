import { eachDayOfInterval, format, parseISO, startOfDay } from "date-fns";

export interface DailyCount {
  date: string;
  count: number;
}

/**
 * Aggregates habit logs into daily counts.
 * @param logs Array of timestamp strings.
 * @returns Array of daily counts.
 */
export function aggregateLogsByDay(logs: string[]): DailyCount[] {
  if (logs.length === 0) {
    return [];
  }

  // Initialize the map with zero counts for all dates in the range
  const countsMap: { [key: string]: number } = {};

  // Determine the min and max date
  const dates = logs.map((log) => startOfDay(parseISO(log)));
  const minDate = new Date(Math.min(...dates.map((date) => date.getTime())));
  const maxDate = new Date(Math.max(...dates.map((date) => date.getTime())));

  // Populate countsMap with zero for each date in the interval
  eachDayOfInterval({ start: minDate, end: maxDate }).forEach((date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    countsMap[formattedDate] = 0;
  });

  // Count logs for each day
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
