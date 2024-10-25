const express = require('express');
const axios = require('axios');
const Weather = require('../models/Weather');
const DailySummary = require('../models/DailySummary');
const cron = require('node-cron');
const moment = require('moment');
const random = require('random');

const router = express.Router();
const API_KEY = process.env.OPENWEATHER_API_KEY;
const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const WEATHER_CONDITIONS = ['Clear', 'Clouds', 'Rain', 'Thunderstorm', 'Mist', 'Haze'];


let userThresholds = {
    temperature: 35,
    humidity: 80,
};

const alerts = [];

router.get('/fetchWeather', async (req, res) => {
    try {
        const weatherData = [];

        for (const city of CITIES) {
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
            const data = response.data;
            // console.log("Data", data);
            // console.log("temp", data.weather[0].main);
            const tempCelsius = data.main.temp - 273.15;
            const feelsLikeCelsius = data.main.feels_like - 273.15// Convert to Celsius
            const humidity = data.main.humidity;
            // console.log("humidity",humidity)

            const weatherEntry = new Weather({
                city: city,
                temp: tempCelsius,
                main: data.weather[0].main,
                feels_like: feelsLikeCelsius,
                humidity: humidity,
                wind_speed: data.wind.speed,
                dt: new Date(data.dt * 1000)
            });

            await weatherEntry.save(); // Save each weather entry
            weatherData.push(weatherEntry);
        }

        // Check alerts
        const newAlerts = checkAlerts(weatherData);
        alerts.push(...newAlerts);

        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// Check alerts against thresholds
const checkAlerts = (weatherData) => {
    const newAlerts = [];

    weatherData.forEach(item => {
        if (item.temp > userThresholds.temperature) {
            newAlerts.push({
                id: `${item.city}-${Date.now()}`,
                message: `Alert: ${item.city} has exceeded the temperature threshold! Current Temp: ${item.temp.toFixed(2)} °C`,
                timestamp: Date.now(),
            });
        }
        if (item.humidity > userThresholds.humidity) {
            newAlerts.push({
                id: `${item.city}-${Date.now()}`,
                message: `Alert: ${item.city} has exceeded the humidity threshold! Current Humidity: ${item.humidity}%`,
                timestamp: Date.now(),
            });
        }
    });

    return newAlerts;
};

// Fetch alerts
router.get('/alerts', (req, res) => {
    res.json(alerts);
});

// Acknowledge an alert
router.post('/acknowledgeAlert', (req, res) => {
    const { id } = req.body;
    const index = alerts.findIndex(alert => alert.id === id);
    if (index !== -1) {
        alerts.splice(index, 1);
    }
    res.json({ success: true });
});

// Set user-defined thresholds
router.post('/setThresholds', (req, res) => {
    const { temperature, humidity } = req.body;
    if (temperature !== undefined) userThresholds.temperature = temperature;
    if (humidity !== undefined) userThresholds.humidity = humidity;
    res.json({ success: true, thresholds: userThresholds });
});

router.get('/daily-summaries', async (req, res) => {
    const today = new Date();
    const pastWeek = new Date(today);
    pastWeek.setDate(today.getDate() - 7);

    const city = req.query.city; // Get city from query parameters

    try {
        const query = {
            date: {
                $gte: pastWeek,
                $lte: today
            }
        };

        // Only add the city filter if a city is provided
        if (city) {
            query.city = city; // Filter by city
        }

        const summaries = await DailySummary.find(query).sort({ date: 1 });

        // console.log('Summaries from backend', summaries);
        res.json(summaries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching summaries.' });
    }
});



// Function to generate realistic weather data for a city
function generateWeatherData(city, date) {
    const minTemp = (Math.random() * (28.0 - 20.0)) + 20.0; // Generates a float between 20.0 and 28.0
    const maxTemp = (Math.random() * (minTemp + 10.0 - (minTemp + 2.0))) + (minTemp + 2.0); // Ensures maxTemp is greater than minTemp
    const avgTemp = (minTemp + maxTemp) / 2;

    const dominantCondition = WEATHER_CONDITIONS[Math.floor(Math.random() * WEATHER_CONDITIONS.length)];


    return {
        city,
        date: moment(date).toISOString(), // Ensure the date is in ISO format
        avgTemp: parseFloat(avgTemp.toFixed(2)), // Ensure it's a number, not a string
        dominantCondition,
        maxTemp: parseFloat(maxTemp.toFixed(2)),
        minTemp: parseFloat(minTemp.toFixed(2))
    };
}

// Function to insert data into MongoDB
async function insertDataIntoDb(weatherData) {
    const summary = new DailySummary(weatherData);
    await summary.save();
    console.log(`Inserted weather data for ${weatherData.city} on ${weatherData.date}`);
}

// Main function to generate and insert fake weather data for the past 30 days
async function generateAndStoreFakeWeatherData() {
    const startDate = moment();


    for (let day = 0; day < 7; day++) {
        const date = startDate.subtract(1, 'days').format('YYYY-MM-DD');
        for (const city of CITIES) {
            const weatherData = generateWeatherData(city, date);
            await insertDataIntoDb(weatherData);
        }
    }

    // mongoose.connection.close();
}

router.post('/postDummyData', async (req, res) => {
    await generateAndStoreFakeWeatherData();
});
// generateAndStoreFakeWeatherData().catch(console.error);

const aggregateDailySummaries = async () => {
    const today = new Date();
    const startDate = new Date(today.setHours(0, 0, 0, 0)); // Start of today
    const endDate = new Date(today.setHours(23, 59, 59, 999)); // End of today

    const results = await Weather.aggregate([
        {
            $match: {
                dt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: { city: "$city", date: { $dateToString: { format: "%Y-%m-%d", date: "$dt" } } },
                avgTemp: { $avg: "$temp" },
                maxTemp: { $max: "$temp" },
                minTemp: { $min: "$temp" },
                dominantCondition: { $first: "$main" } // You may need a more complex aggregation for dominant condition
            }
        }
    ]);

    for (const result of results) {
        const summary = new DailySummary({
            city: result._id.city,
            date: new Date(result._id.date),
            avgTemp: result.avgTemp,
            maxTemp: result.maxTemp,
            minTemp: result.minTemp,
            dominantCondition: result.dominantCondition,
        });

        await summary.save();
    }
};

// Schedule the daily summary aggregation at midnight every day
cron.schedule('0 0 * * *', aggregateDailySummaries);

module.exports = router;
