export const calculateStreaks = (timestamps: string[]) => {
  if (!timestamps.length) return [];

  const dates = timestamps
    .map((ts) => new Date(ts).toISOString().split("T")[0])
    .sort()
    .filter((date, index, array) => array.indexOf(date) === index);

  const streaks: { start: string; length: number }[] = [];
  let currentStreak = { start: dates[0], length: 1 };

  for (let i = 1; i < dates.length; i++) {
    const currentDate = new Date(dates[i]);
    const prevDate = new Date(dates[i - 1]);
    const diffDays =
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);

    if (diffDays === 1) {
      currentStreak.length++;
    } else {
      streaks.push(currentStreak);
      currentStreak = { start: dates[i], length: 1 };
    }
  }
  streaks.push(currentStreak);

  return streaks;
};
