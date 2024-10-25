const mongoose = require('mongoose');
const { type } = require('os');

const WeatherSchema = new mongoose.Schema({
    city: { type: String, required: true },
    temp: { type: Number, required: true },
    main: { type: String, required: true },
    feels_like: {type: Number, required: true},
    humidity: {type: Number, required: true},
    wind_speed: {type: Number, required: true},
    dt: { type: Date, required: true }
});

const Weather = mongoose.model('Weather', WeatherSchema);
module.exports = Weather;
