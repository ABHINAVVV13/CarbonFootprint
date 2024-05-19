const express = require('express');
const moment = require('moment');
const Emission = require('../models/Emission');
const verifyToken = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

const emissionFactors = {
    'driving': 120,
    'transit': 68,
    'bicycling': 0,
    'walking': 0
};

router.post('/calculate', verifyToken, async (req, res) => {
    const { origin, destination, mode } = req.body;

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json`, {
            params: {
                origin,
                destination,
                mode,
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        const distance = response.data.routes[0].legs[0].distance.value / 1000;
        const emissions = (distance * emissionFactors[mode]) / 1000;

        const newEmission = new Emission({
            userId: req.user.uid,
            emissions: emissions,
            date: new Date() // Ensure date is added to match the aggregation criteria
        });
        await newEmission.save();

        res.json({ distance, emissions });
    } catch (error) {
        console.error('Error calculating emissions:', error);
        res.status(500).json({ error: 'Error calculating emissions' });
    }
});

router.get('/daily', verifyToken, async (req, res) => {
    try {
        const today = moment().startOf('day');
        const emissions = await Emission.aggregate([
            {
                $match: {
                    userId: req.user.uid,
                    date: { $gte: today.toDate() }
                }
            },
            {
                $group: {
                    _id: null,
                    totalEmissions: { $sum: "$emissions" }
                }
            }
        ]);

        res.json({ emissions: emissions[0]?.totalEmissions || 0 });
    } catch (error) {
        console.error('Error fetching daily emissions:', error);
        res.status(500).json({ error: 'Error fetching daily emissions' });
    }
});

router.get('/weekly', verifyToken, async (req, res) => {
    try {
        const startOfWeek = moment().startOf('week');
        const emissions = await Emission.aggregate([
            {
                $match: {
                    userId: req.user.uid,
                    date: { $gte: startOfWeek.toDate() }
                }
            },
            {
                $group: {
                    _id: null,
                    totalEmissions: { $sum: "$emissions" }
                }
            }
        ]);

        res.json({ emissions: emissions[0]?.totalEmissions || 0 });
    } catch (error) {
        console.error('Error fetching weekly emissions:', error);
        res.status(500).json({ error: 'Error fetching weekly emissions' });
    }
});

router.get('/monthly', verifyToken, async (req, res) => {
    try {
        const startOfMonth = moment().startOf('month');
        const emissions = await Emission.aggregate([
            {
                $match: {
                    userId: req.user.uid,
                    date: { $gte: startOfMonth.toDate() }
                }
            },
            {
                $group: {
                    _id: null,
                    totalEmissions: { $sum: "$emissions" }
                }
            }
        ]);

        res.json({ emissions: emissions[0]?.totalEmissions || 0 });
    } catch (error) {
        console.error('Error fetching monthly emissions:', error);
        res.status(500).json({ error: 'Error fetching monthly emissions' });
    }
});

router.get('/yearly', verifyToken, async (req, res) => {
    try {
        const startOfYear = moment().startOf('year');
        const emissions = await Emission.aggregate([
            {
                $match: {
                    userId: req.user.uid,
                    date: { $gte: startOfYear.toDate() }
                }
            },
            {
                $group: {
                    _id: null,
                    totalEmissions: { $sum: "$emissions" }
                }
            }
        ]);

        res.json({ emissions: emissions[0]?.totalEmissions || 0 });
    } catch (error) {
        console.error('Error fetching yearly emissions:', error);
        res.status(500).json({ error: 'Error fetching yearly emissions' });
    }
});

module.exports = router;
