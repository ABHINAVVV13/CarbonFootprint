const mongoose = require('mongoose');

const EmissionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    emissions: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Emission', EmissionSchema);
