// src/lib/utils.ts
import { differenceInDays } from "date-fns";

export const calculateLongestStreak = (logs: Date[]): number => {
  if (logs.length === 0) return 0;

  const sortedLogs = logs.sort((a, b) => a.getTime() - b.getTime());
  let longest = 0;
  let current = 0;
  let previous = sortedLogs[0];

  for (let i = 1; i < sortedLogs.length; i++) {
    const diff = differenceInDays(sortedLogs[i], previous);
    if (diff > 1) {
      current += diff - 1;
    }
    longest = Math.max(longest, current);
    previous = sortedLogs[i];
  }

  return longest;
};
