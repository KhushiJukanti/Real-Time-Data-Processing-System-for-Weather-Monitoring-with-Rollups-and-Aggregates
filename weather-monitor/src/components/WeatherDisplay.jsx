import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alerts from './Alerts';
import GraphLine from './LineGraph';
import './WeatherDisplay.css';

const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

const WeatherDisplay = () => {
    const [weatherData, setWeatherData] = useState([]);
    const [selectedCity, setSelectedCity] = useState('Delhi'); // Default city
    const [currentWeather, setCurrentWeather] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            const result = await axios.get('/api/weather/fetchWeather');
            setWeatherData(result.data);
            // Set the current weather for the default city on initial load
            const defaultWeather = result.data.find(item => item.city === selectedCity);
            setCurrentWeather(defaultWeather);
        };

        fetchWeatherData();
        const interval = setInterval(fetchWeatherData, 300000); // Fetch every 5 minutes
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Update current weather when the selected city changes
        const weatherForCity = weatherData.find(item => item.city === selectedCity);
        setCurrentWeather(weatherForCity);
    }, [selectedCity, weatherData]);

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };
    console.log("Curent weather", currentWeather);

    return (
        <div className='container'>
            <h2>Weather Updates</h2>
            <label htmlFor="city-select">Select City:</label>
            <select id="city-select" value={selectedCity} onChange={handleCityChange}>
                {CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                ))}
            </select>

            {currentWeather ? (
                <div className="weather-info">
                    <h3>{currentWeather.city}</h3>
                    <p>Temperature: {currentWeather.temp.toFixed(2)} °C</p>
                    <p>Condition: {currentWeather.main}</p>
                    <p>Humidity: {currentWeather.humidity}</p>
                    <p>Wind Speed: {currentWeather.wind_speed}</p>
                </div>
            ) : (
                <p className="loading">Loading weather data...</p>
            )}
            <div className="alerts">
                <Alerts selectedCity={selectedCity} />
            </div>
            <GraphLine selectedCity={selectedCity} />
        </div>
    );
};

export default WeatherDisplay;
