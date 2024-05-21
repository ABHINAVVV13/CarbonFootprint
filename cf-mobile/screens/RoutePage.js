import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, Picker, ScrollView } from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const Route = () => {
    const [origin, setOrigin] = useState('');
    const [originCoords, setOriginCoords] = useState(null);
    const [destination, setDestination] = useState('');
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [mode, setMode] = useState('driving');
    const [emissions, setEmissions] = useState(null);
    const [dailyEmissions, setDailyEmissions] = useState(null);
    const [error, setError] = useState(null);

    const fetchDailyEmissions = async () => {
        try {
            const user = auth().currentUser;
            if (user) {
                const token = await user.getIdToken();
                const response = await axios.get('http://localhost:5002/api/emissions/daily', {
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
            const user = auth().currentUser;
            if (user) {
                const token = await user.getIdToken();
                const response = await axios.post('http://localhost:5002/api/emissions/calculate', {
                    origin,
                    destination,
                    mode
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

    const getCoordinates = async (address, setCoords) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCzPzuFj6CnkkEDHLBilCApvNV6MRipSVg`);
            const location = response.data.results[0].geometry.location;
            setCoords({ latitude: location.lat, longitude: location.lng });
        } catch (error) {
            console.error('Error fetching coordinates:', error);
            setError('Error fetching coordinates. Please try again.');
        }
    };

    useEffect(() => {
        if (origin) getCoordinates(origin, setOriginCoords);
        if (destination) getCoordinates(destination, setDestinationCoords);
    }, [origin, destination]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Calculate Route and Emissions</Text>
            <GooglePlacesAutocomplete
                placeholder='Enter Origin'
                onPress={(data, details = null) => setOrigin(data.description)}
                query={{
                    key: 'AIzaSyCzPzuFj6CnkkEDHLBilCApvNV6MRipSVg',
                    language: 'en',
                }}
                styles={{
                    textInput: styles.input,
                }}
            />
            <GooglePlacesAutocomplete
                placeholder='Enter Destination'
                onPress={(data, details = null) => setDestination(data.description)}
                query={{
                    key: 'AIzaSyCzPzuFj6CnkkEDHLBilCApvNV6MRipSVg',
                    language: 'en',
                }}
                styles={{
                    textInput: styles.input,
                }}
            />
            <Text style={styles.subTitle}>Select Mode of Transport</Text>
            <Picker
                selectedValue={mode}
                style={styles.picker}
                onValueChange={(itemValue) => setMode(itemValue)}
            >
                <Picker.Item label="Driving" value="driving" />
                <Picker.Item label="Walking" value="walking" />
                <Picker.Item label="Bicycling" value="bicycling" />
                <Picker.Item label="Transit" value="transit" />
            </Picker>
            <Button title="Calculate" onPress={calculateEmissions} />
            {error && <Text style={styles.error}>{error}</Text>}
            {emissions && (
                <View>
                    <Text>Distance: {emissions.distance} km</Text>
                    <Text>Emissions: {emissions.emissions} kg CO2</Text>
                </View>
            )}
            {dailyEmissions !== null && (
                <View>
                    <Text style={styles.subTitle}>Today's Total Emissions</Text>
                    <Text>{dailyEmissions} kg CO2</Text>
                </View>
            )}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    region={{
                        latitude: originCoords ? originCoords.latitude : 37.78825,
                        longitude: originCoords ? originCoords.longitude : -122.4324,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {originCoords && (
                        <Marker coordinate={originCoords} title="Origin" />
                    )}
                    {destinationCoords && (
                        <Marker coordinate={destinationCoords} title="Destination" />
                    )}
                    {originCoords && destinationCoords && (
                        <Polyline
                            coordinates={[originCoords, destinationCoords]}
                            strokeColor="#000"
                            strokeWidth={6}
                        />
                    )}
                </MapView>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    input: {
        backgroundColor: '#FFFFFF',
        height: 40,
        borderColor: '#DDDDDD',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
    mapContainer: {
        width: '100%',
        height: 300,
        marginTop: 20,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default Route;
