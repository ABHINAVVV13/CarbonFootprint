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

const DailyEmissionsBar = ({ data }) => {
    const chartData = {
        labels: ['Today'],
        datasets: [
            {
                label: 'Daily Emissions (kg CO2)',
                data: [data],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Avg Daily Emissions (kg CO2)',
                data: [10],
                backgroundColor: 'red',
                borderColor: 'red',
                borderWidth: 1
            }
        ]
    };

    return <Bar data={chartData} />;
};

export default DailyEmissionsBar;
