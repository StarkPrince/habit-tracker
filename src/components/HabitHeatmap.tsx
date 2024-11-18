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
    const startDate = subDays(new Date(), 365);
    const endDate = new Date();

    const heatmapData = dailyCounts.map((dc) => ({
        date: dc.date,
        count: dc.count,
    }));

    return (
        <div className="w-full overflow-x-auto">
            <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={heatmapData}
                classForValue={(value) =>
                {
                    if (!value || value.count === 0) {
                        return 'color-empty';
                    }
                    console.log("value", value.count);
                    const logValue = Math.min(Math.floor(Math.log2(value.count + 1)), 6);
                    return `color-scale-${logValue}`;
                }}
                tooltipDataAttrs={(value: any) =>
                {
                    if (!value || !value.date) {
                        return {};
                    }
                    return {
                        'data-tip': `${value.date}: ${value.count} time(s)`,
                    };
                }}
                showWeekdayLabels={true}
            />
            <style jsx global>{`
                .react-calendar-heatmap .color-scale-0 { fill: hsl(var(--primary) / 0.0); }
                .react-calendar-heatmap .color-scale-0 { fill: hsl(var(--primary) / 0.142); }
                .react-calendar-heatmap .color-scale-1 { fill: hsl(var(--primary) / 0.285); }
                .react-calendar-heatmap .color-scale-2 { fill: hsl(var(--primary) / 0.428); }
                .react-calendar-heatmap .color-scale-3 { fill: hsl(var(--primary) / 0.571); }
                .react-calendar-heatmap .color-scale-4 { fill: hsl(var(--primary) / 0.714); }
                .react-calendar-heatmap .color-scale-5 { fill: hsl(var(--primary) / 0.857); }
                .react-calendar-heatmap .color-scale-6 { fill: hsl(var(--primary) / 1); }
            `}</style>
        </div>
    );
};

export default HabitHeatmap;
