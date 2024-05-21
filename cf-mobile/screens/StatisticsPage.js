import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { auth } from '../firebase';

export default function StatisticsPage() {
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
          const daily = await axios.get(`http://192.168.2.14:5002/api/emissions/daily`, { headers: { Authorization: `Bearer ${token}` } });
          const weekly = await axios.get(`http://192.168.2.14:5002/api/emissions/weekly`, { headers: { Authorization: `Bearer ${token}` } });
          const monthly = await axios.get(`http://192.168.2.14:5002/api/emissions/monthly`, { headers: { Authorization: `Bearer ${token}` } });

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
    <View style={styles.container}>
      <Text>Emissions Statistics</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      {dailyEmissions !== null && <Text>Daily Emissions: {dailyEmissions} kg CO2</Text>}
      {weeklyEmissions !== null && <Text>Weekly Emissions: {weeklyEmissions} kg CO2</Text>}
      {monthlyEmissions !== null && <Text>Monthly Emissions: {monthlyEmissions} kg CO2</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
