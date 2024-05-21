import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import axios from 'axios';
import { auth } from '../firebase';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';

const libraries = ['places'];

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '15px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
};

const center = {
  lat: 40.748817,
  lng: -73.985428
};

const emissionFactors = {
  DRIVING: 120, // g CO2 per km
  BICYCLING: 0,
  TRANSIT: 68, // g CO2 per km
  WALKING: 0
};

const RoutePage = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState('DRIVING');
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const [dailyEmissions, setDailyEmissions] = useState(null);
  const [expectedEmissions, setExpectedEmissions] = useState(null);
  const [error, setError] = useState(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);

  useEffect(() => {
    fetchDailyEmissions();
  }, []);

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

  const calculateRoute = async () => {
    if (origin === '' || destination === '') {
      setError('Both origin and destination are required.');
      return;
    }
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode[mode]
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          calculateEmissions(result);
          setError(null);
        } else {
          setError('Error calculating route.');
        }
      }
    );
  };

  const calculateEmissions = (directionsResult) => {
    const route = directionsResult.routes[0];
    const distance = route.legs[0].distance.value / 1000; // distance in km
    const emissions = (distance * emissionFactors[mode]) / 1000; // emissions in kg CO2
    setExpectedEmissions(emissions);
  };

  const startJourney = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/emissions/calculate`, {
          origin,
          destination,
          mode: mode.toLowerCase()
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setDailyEmissions(dailyEmissions + expectedEmissions);
        setError(null);
      } else {
        setError('User not authenticated');
      }
    } catch (error) {
      console.error('Error calculating emissions:', error);
      setError('Error calculating emissions. Please try again.');
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <Container className="mt-4">
        <Card className="p-4 mb-4" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' , backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
          <h2 className="mb-4 text-center">Calculate Route and Emissions</h2>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Autocomplete
                  onLoad={(autocomplete) => (originRef.current = autocomplete)}
                  onPlaceChanged={() => setOrigin(originRef.current.getPlace().formatted_address)}
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter origin"
                  />
                </Autocomplete>
              </Col>
              <Col md={6}>
                <Autocomplete
                  onLoad={(autocomplete) => (destinationRef.current = autocomplete)}
                  onPlaceChanged={() => setDestination(destinationRef.current.getPlace().formatted_address)}
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter destination"
                  />
                </Autocomplete>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Select value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="DRIVING">Driving</option>
                  <option value="BICYCLING">Bicycling</option>
                  <option value="TRANSIT">Transit</option>
                  <option value="WALKING">Walking</option>
                </Form.Select>
              </Col>
              <Col md={6} className="text-right">
                <Button variant="primary" onClick={calculateRoute} className="me-2">
                  Show Route
                </Button>
                <Button variant="success" onClick={startJourney}>
                  Start Journey
                </Button>
              </Col>
            </Row>
          </Form>
          {error && <Alert variant="danger">{error}</Alert>}
        </Card>
        {dailyEmissions !== null && (
          <Card className="p-4 mb-4" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' , backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
            <h3>Today's Total Emissions</h3>
            <p>{dailyEmissions} kg CO2</p>
          </Card>
        )}
        {expectedEmissions !== null && (
          <Card className="p-4 mb-4" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' , backgroundColor: 'rgba(255, 255, 255, 0.5)'}}>
            <h3>Expected Emissions for this Journey</h3>
            <p>{expectedEmissions} kg CO2</p>
          </Card>
        )}
        <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', marginBottom: '30px' }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={map => setMap(map)}
          >
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </Card>
      </Container>
    </LoadScript>
  );
};

export default RoutePage;
