import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import AddressAutocomplete from './AddressAutocomplete';

const Route = () => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [emissions, setEmissions] = useState(null);
    const [dailyEmissions, setDailyEmissions] = useState(null);
    const [error, setError] = useState(null);

    const fetchDailyEmissions = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/emissions/daily`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDailyEmissions(response.data.emissions);
            } else {
                setError('User not authenticated');
            }
        } catch (error) {
            console.error('Error fetching daily emissions:', error);
            setError('Error fetching daily emissions. Please try again.');
        }
    };

    useEffect(() => {
        fetchDailyEmissions();
    }, []);

    const calculateEmissions = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const token = await user.getIdToken();
                console.log('User token:', token);
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/emissions/calculate`, {
                    origin,
                    destination,
                    mode: 'driving'
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setEmissions(response.data);
                setError(null);
            } else {
                setError('User not authenticated');
            }
        } catch (error) {
            console.error('Error calculating emissions:', error);
            setError('Error calculating emissions. Please try again.');
            setEmissions(null);
        }
    };

    return (
        <div>
            <h2>Calculate Route and Emissions</h2>
            <AddressAutocomplete value={origin} onChange={setOrigin} />
            <AddressAutocomplete value={destination} onChange={setDestination} />
            <button onClick={calculateEmissions}>Calculate</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {emissions && (
                <div>
                    <p>Distance: {emissions.distance} km</p>
                    <p>Emissions: {emissions.emissions} kg CO2</p>
                </div>
            )}
            {dailyEmissions !== null && (
                <div>
                    <h3>Today's Total Emissions</h3>
                    <p>{dailyEmissions} kg CO2</p>
                </div>
            )}
        </div>
    );
};

export default Route;
