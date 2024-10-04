// src/components/HabitHeatmap.tsx
import { subDays } from 'date-fns';
import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { DailyCount } from '../utils/dataProcessing';

interface HabitHeatmapProps
{
    dailyCounts: DailyCount[];
}

const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ dailyCounts }) =>
{
    // Define the start date (e.g., 1 year ago)
    const startDate = subDays(new Date(), 365);
    const endDate = new Date();

    // Map dailyCounts to the format expected by react-calendar-heatmap
    const heatmapData = dailyCounts.map((dc) => ({
        date: dc.date,
        count: dc.count,
    }));

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Habit Heatmap</h3>
            <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={heatmapData}
                classForValue={(value) =>
                {
                    if (!value) {
                        return 'color-empty';
                    }
                    if (value.count >= 5) {
                        return 'color-scale-4';
                    }
                    if (value.count >= 3) {
                        return 'color-scale-3';
                    }
                    if (value.count >= 1) {
                        return 'color-scale-2';
                    }
                    return 'color-scale-1';
                }}
                tooltipDataAttrs={(value) =>
                {
                    if (value.date) {
                        return {
                            'data-tip': `${value.date}: ${value.count} time(s)`,
                        };
                    }
                    return {};
                }}
                showWeekdayLabels={true}
            />
        </div>
    );
};

export default HabitHeatmap;
