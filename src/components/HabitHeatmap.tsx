'use client';

import { DailyCount } from '@/utils/dataProcessing';
import { subDays } from 'date-fns';
import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

interface HabitHeatmapProps
{
    dailyCounts: DailyCount[];
}

const HabitHeatmap: React.FC<HabitHeatmapProps> = ({ dailyCounts }) =>
{
    const endDate = new Date();
    const startDate = subDays(endDate, 365);

    const getColorClassForValue = (value: number) =>
    {
        if (!value) return 'color-scale-0';
        if (value <= 2) return 'color-scale-1';
        if (value <= 4) return 'color-scale-2';
        if (value <= 6) return 'color-scale-3';
        if (value <= 8) return 'color-scale-4';
        if (value <= 10) return 'color-scale-5';
        return 'color-scale-6';
    };

    return (
        <div className="w-full overflow-x-auto">
            <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={dailyCounts}
                classForValue={(value) => getColorClassForValue(value?.count || 0)}
                showWeekdayLabels={true}
                gutterSize={4}
            />
            <style jsx global>{`
                .react-calendar-heatmap .color-scale-0 { fill: hsl(var(--primary) / 0.1); }
                .react-calendar-heatmap .color-scale-1 { fill: hsl(var(--primary) / 0.2); }
                .react-calendar-heatmap .color-scale-2 { fill: hsl(var(--primary) / 0.4); }
                .react-calendar-heatmap .color-scale-3 { fill: hsl(var(--primary) / 0.6); }
                .react-calendar-heatmap .color-scale-4 { fill: hsl(var(--primary) / 0.7); }
                .react-calendar-heatmap .color-scale-5 { fill: hsl(var(--primary) / 0.8); }
                .react-calendar-heatmap .color-scale-6 { fill: hsl(var(--primary) / 1); }
            `}</style>
        </div>
    );
};

export default HabitHeatmap;
