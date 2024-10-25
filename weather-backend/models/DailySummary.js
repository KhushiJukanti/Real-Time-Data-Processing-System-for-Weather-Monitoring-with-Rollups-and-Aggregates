const mongoose = require('mongoose');

const DailySummarySchema = new mongoose.Schema({
    city: String,
    date: Date,
    avgTemp: Number,
    maxTemp: Number,
    minTemp: Number,
    dominantCondition: String,
});

module.exports = mongoose.model('DailySummary', DailySummarySchema);
