import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const WeeklyEmissionsBar = ({ data }) => {
    const chartData = {
        labels: ['This Week'],
        datasets: [
            {
                label: 'Weekly Emissions (kg CO2)',
                data: [data],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Avg Weekly Emissions (kg CO2)',
                data: [70],
                backgroundColor: 'red',
                borderColor: 'red',
                borderWidth: 1
            }
        ]
    };

    return <Bar data={chartData} />;
};

export default WeeklyEmissionsBar;
