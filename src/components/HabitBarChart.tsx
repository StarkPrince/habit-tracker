// src/components/HabitBarChart.tsx
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { DailyCount } from '../utils/dataProcessing';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface HabitBarChartProps
{
    dailyCounts: DailyCount[];
}

const HabitBarChart: React.FC<HabitBarChartProps> = ({ dailyCounts }) =>
{
    // Sort the data by date
    const sortedData = [...dailyCounts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Prepare data for the chart
    const labels = sortedData.map((dc) => dc.date);
    const data = sortedData.map((dc) => dc.count);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Occurrences',
                data,
                backgroundColor: 'rgba(75,192,192,0.6)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Habit Occurrences Over Time',
            },
        },
        scales: {
            x: {
                ticks: {
                    maxTicksLimit: 10, // Adjust as needed
                    autoSkip: true,
                },
            },
            y: {
                beginAtZero: true,
                precision: 0,
            },
        },
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Habit Performance</h3>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default HabitBarChart;
