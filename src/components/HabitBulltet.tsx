import { ResponsiveBullet } from '@nivo/bullet';
import { ResponsiveContainer } from 'recharts';


const analyzeTimestampPatterns = (timestamps) =>
{
    if (!timestamps || timestamps.length === 0) {
        return [];
    }
    const dates = timestamps.map(ts => new Date(ts));

    const metrics = [
        {
            id: "hourly_distribution",
            description: "Distribution of events across hours of the day",
            analyze: (dates) =>
            {
                const hours = dates.map(d => d.getUTCHours());
                const distribution = Array(24).fill(0);
                hours.forEach(h => distribution[h]++);
                return distribution;
            }
        },
        {
            id: "daily_frequency",
            description: "Average number of events per day",
            analyze: (dates) =>
            {
                const days = new Set(dates.map(d => d.toISOString().split('T')[0])).size;
                return dates.length / days;
            }
        },
        {
            id: "weekly_pattern",
            description: "Distribution of events across days of the week",
            analyze: (dates) =>
            {
                const days = dates.map(d => d.getUTCDay());
                const distribution = Array(7).fill(0);
                days.forEach(d => distribution[d]++);
                return distribution;
            }
        },
        {
            id: "time_between_events",
            description: "Average and range of time between consecutive events (in minutes)",
            analyze: (dates) =>
            {
                const sortedDates = dates.sort((a, b) => a - b);
                const differences = sortedDates.slice(1).map((d, i) => (d - sortedDates[i]) / (1000 * 60));
                const avg = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
                return {
                    average: avg,
                    min: Math.min(...differences),
                    max: Math.max(...differences)
                };
            }
        },
        {
            id: "monthly_distribution",
            description: "Distribution of events across months",
            analyze: (dates) =>
            {
                const months = dates.map(d => d.getUTCMonth());
                const distribution = Array(12).fill(0);
                months.forEach(m => distribution[m]++);
                return distribution;
            }
        }
    ];

    return metrics.map(metric =>
    {
        const result = metric.analyze(dates);

        let ranges, measures, markers;

        if (Array.isArray(result)) {
            const max = Math.max(...result);
            ranges = [0, max * 0.33, max * 0.66, 0, max];
            measures = [result.reduce((sum, val) => sum + val, 0) / result.length];
            markers = [max];
        } else if (typeof result === 'number') {
            ranges = [result * 0.5, result * 0.75, result * 1.25, 0, result * 2];
            measures = [result];
            markers = [result * 1.5];
        } else if (typeof result === 'object') {
            ranges = [result.min, result.average, result.max, 0, result.max * 1.5];
            measures = [result.average];
            markers = [result.max];
        }

        return {
            id: metric.id,
            ranges: ranges.map(v => parseFloat(v.toFixed(2))),
            measures: measures.map(v => parseFloat(v.toFixed(2))),
            markers: markers.map(v => parseFloat(v.toFixed(2)))
        };
    });
};



const HabitBullet = ({ habit }) =>
{
    const transformedData = analyzeTimestampPatterns(habit.logs);
    console.log(transformedData);
    return (
        <div className="px-4">
            <ResponsiveContainer width="100%" height={400}>
                <ResponsiveBullet
                    data={transformedData}
                    margin={{ top: 50, right: 90, bottom: 50, left: 140 }}
                    spacing={46}
                    titleAlign="start"
                    titleOffsetX={-120}
                    measureSize={0.2}
                />
            </ResponsiveContainer>
        </div>
    )
}

export default HabitBullet;