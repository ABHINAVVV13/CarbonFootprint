require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

console.log('Starting server...');

try {
    const serviceAccount = require(path.resolve(__dirname, 'config/serviceAccountKey.json'));
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin initialized');
} catch (error) {
    console.error('Error initializing Firebase Admin:', error);
}

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

console.log('Connecting to MongoDB...');
try {
    mongoose.connect(process.env.MONGO_URI, {})
        .then(() => console.log('MongoDB connected'))
        .catch(err => {
            console.error('Failed to connect to MongoDB', err);
            process.exit(1);
        });
} catch (error) {
    console.error('Error connecting to MongoDB:', error);
}

app.get('/', (req, res) => {
    res.send('Backend is running');
    console.log('GET / request received');
});

const emissionsRouter = require('./routes/emissions');
app.use('/api/emissions', emissionsRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
