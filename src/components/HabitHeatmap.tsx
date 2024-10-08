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
                    if (!value) {
                        return 'color-empty';
                    }
                    return `color-scale-${Math.min(value.count, 4)}`;
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
        .react-calendar-heatmap .color-scale-1 { fill: hsl(var(--primary) / 0.2); }
        .react-calendar-heatmap .color-scale-2 { fill: hsl(var(--primary) / 0.4); }
        .react-calendar-heatmap .color-scale-3 { fill: hsl(var(--primary) / 0.6); }
        .react-calendar-heatmap .color-scale-4 { fill: hsl(var(--primary) / 0.8); }
      `}</style>
        </div>
    );
};

export default HabitHeatmap;