import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import DailyEmissionsBar from '../components/DailyEmissionsBar';
import WeeklyEmissionsBar from '../components/WeeklyEmissionsBar';
import MonthlyEmissionsBar from '../components/MonthlyEmissionsBar';

const StatisticsPage = () => {
    const [dailyEmissions, setDailyEmissions] = useState(null);
    const [weeklyEmissions, setWeeklyEmissions] = useState(null);
    const [monthlyEmissions, setMonthlyEmissions] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const token = await user.getIdToken();
                    const daily = await axios.get(`${process.env.REACT_APP_API_URL}/api/emissions/daily`, { headers: { Authorization: `Bearer ${token}` } });
                    const weekly = await axios.get(`${process.env.REACT_APP_API_URL}/api/emissions/weekly`, { headers: { Authorization: `Bearer ${token}` } });
                    const monthly = await axios.get(`${process.env.REACT_APP_API_URL}/api/emissions/monthly`, { headers: { Authorization: `Bearer ${token}` } });

                    setDailyEmissions(daily.data.emissions);
                    setWeeklyEmissions(weekly.data.emissions);
                    setMonthlyEmissions(monthly.data.emissions);
                } else {
                    setError('User not authenticated');
                }
            } catch (error) {
                console.error('Error fetching emissions data:', error);
                setError('Error fetching emissions data. Please try again.');
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Emissions Statistics</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {dailyEmissions !== null && <DailyEmissionsBar data={dailyEmissions} />}
            {weeklyEmissions !== null && <WeeklyEmissionsBar data={weeklyEmissions} />}
            {monthlyEmissions !== null && <MonthlyEmissionsBar data={monthlyEmissions} />}
        </div>
    );
};

export default StatisticsPage;
