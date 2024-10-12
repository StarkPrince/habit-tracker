'use client';

import { Habit } from '@/types';
import { ResponsiveHeatMapCanvas } from '@nivo/heatmap';
import React from 'react';
import { ResponsiveContainer } from 'recharts';


interface HeatMapDatum
{
    day: string;
    [hour: string]: number | string; // '0' to '23' as string keys
}

interface HabitHeatmapByHourAndDayProps
{
    habit: Habit;
}

type DataPoint = {
    x: string;
    y: number;
};

type DataEntry = {
    id: string;
    data: DataPoint[];
};

/**
 * @param timestamps - An array of ISO timestamp strings.
 * @returns An array of DataEntry objects structured as per your specification.
 */
function convertTimestampsToData(timestamps: string[]): DataEntry[]
{
    const monthNames = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    const dataMap: Map<string, Map<string, number>> = new Map();

    timestamps.forEach(ts =>
    {
        const date = new Date(ts);
        if (isNaN(date.getTime())) {
            return;
        }

        const year = date.getUTCFullYear().toString();
        const month = monthNames[date.getUTCMonth()]; // getUTCMonth() returns 0-11

        if (!dataMap.has(year)) {
            dataMap.set(year, new Map());
        }

        const yearMap = dataMap.get(year)!;

        if (!yearMap.has(month)) {
            yearMap.set(month, 0);
        }

        yearMap.set(month, yearMap.get(month)! + 1);
    });

    const result: DataEntry[] = [];

    dataMap.forEach((monthMap, year) =>
    {
        const dataPoints: DataPoint[] = [];

        monthNames.forEach(month =>
        {
            const count = monthMap.get(month) || 0;
            dataPoints.push({
                x: month,
                y: count
            });
        });

        result.push({
            id: year,
            data: dataPoints
        });
    });

    return result;
}


const transformTimestampData = (timestamps) =>
{
    const categories = ["Activity Level", "Usage Pattern"];

    const calculateMetrics = (date) =>
    {
        const hour = date.getHours();
        const dayOfWeek = date.getDay();

        return {
            activityLevel: hour / 24 * 100, // Simulates daily activity pattern
            usagePattern: (hour >= 9 && hour < 17 && dayOfWeek >= 1 && dayOfWeek <= 5) ? 85 : 30 // Higher during work hours on weekdays
        };
    };

    return categories.map(category =>
    {
        const mappedData = timestamps.map(timestamp =>
        {
            const date = new Date(timestamp);
            const metrics = calculateMetrics(date);

            let x, y;
            switch (category) {
                case "Activity Level":
                    x = date.getHours();
                    y = metrics.activityLevel;
                    break;
                case "Usage Pattern":
                    x = date.getHours();
                    y = metrics.usagePattern;
                    break;
            }
            return { x, y: parseFloat(y.toFixed(2)) };
        });
        const data = mappedData.sort((a, b) => a.x - b.x);
        return {
            id: category,
            data: data
        };
    });
};



const HabitHeatmapByMonthAndYear: React.FC<HabitHeatmapByHourAndDayProps> = ({ habit }) =>
{

    const heatmapData = transformTimestampData(habit.logs);
    return (
        <div className="px-4">
            <ResponsiveContainer width="100%" height={400}>
                <ResponsiveHeatMapCanvas
                    data={heatmapData}
                    margin={{ top: 70, right: 130, bottom: 20, left: 80 }}
                    valueFormat=">-.2s"
                    axisTop={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -90,
                        legend: '',
                        legendOffset: 46
                    }}
                    axisRight={{
                        tickSize: 5,
                        tickPadding: 25,
                        tickRotation: 0,
                        legend: 'year',
                        legendPosition: "middle",
                        legendOffset: 10
                    }}
                    axisLeft={null}
                    colors={{
                        type: 'quantize',
                        scheme: 'red_yellow_blue',
                        steps: 10,
                    }}
                    emptyColor="#555555"
                    borderWidth={1}
                    borderColor="#000000"
                    enableLabels={false}
                    legends={[
                        {
                            anchor: 'left',
                            translateX: -50,
                            translateY: 0,
                            length: 200,
                            thickness: 10,
                            direction: 'column',
                            tickPosition: 'after',
                            tickSize: 3,
                            tickSpacing: 4,
                            tickOverlap: false,
                            tickFormat: '>-.2s',
                            title: 'Value →',
                            titleAlign: 'start',
                            titleOffset: 4
                        }
                    ]}
                    annotations={[]}
                />
            </ResponsiveContainer>
        </div>
    );
};

export default HabitHeatmapByMonthAndYear;
