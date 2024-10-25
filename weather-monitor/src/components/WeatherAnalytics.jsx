import React, { useState, useEffect } from "react";
// // import GraphBar from '../BarGraph/GraphBar';
import LineGraph from "../LineGraph/LineGraph";

// import data from "./data.json";
import "./weatherAnalytics.css";
import axios from "axios";

const WeatherAnalytics = ({ location }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [interval, setInterval] = useState(7); // Default to past 7 days

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:5000/current-weather",
          {
            city: location,
            days: interval,
          },
          {
            headers: {
              "Content-Type": "application/json", // Specify the content type
              // 'Authorization': 'Bearer YOUR_TOKEN_HERE', // If your API requires an authorization token
              // 'Access-Control-Allow-Origin': '*', // Allow all origins (CORS)
              // 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', // Methods allowed
              // 'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Headers allowed
              // // Add any other h
            },
          }
        );
        console.log(response.data.summaries);

        // Slice the data based on interval and set the state
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, [location, interval]);

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  return (
    <div className="weather-analytics">
      <div className="interval-select">
        <label htmlFor="interval">Select Interval: </label>
        <select id="interval" value={interval} onChange={handleIntervalChange}>
          <option value={7}>Past 7 days</option>
          <option value={14}>Past 14 days</option>
          <option value={21}>Past 21 days</option>
          <option value={30}>Past 30 days</option>
          <option value={90}>Past 3 months</option>
        </select>
      </div>

      <LineGraph data={weatherData.summaries} />
    </div>
  );
};

export default WeatherAnalytics;




