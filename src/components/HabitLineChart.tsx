// src/components/HabitLineChart.tsx
import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { DailyCount } from '../utils/dataProcessing';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface HabitLineChartProps
{
    dailyCounts: DailyCount[];
}

const HabitLineChart: React.FC<HabitLineChartProps> = ({ dailyCounts }) =>
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
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
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
                text: 'Habit Trends Over Time',
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
            <h3 className="text-lg font-semibold mb-2">Habit Trends</h3>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default HabitLineChart;
