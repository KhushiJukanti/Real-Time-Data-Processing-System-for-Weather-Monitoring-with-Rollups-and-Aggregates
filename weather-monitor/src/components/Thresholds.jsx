import React, { useState } from 'react';
import axios from 'axios';
import './Thresholds.css'; // Import the CSS file

const Thresholds = () => {
    const [temperature, setTemperature] = useState(35);
    const [humidity, setHumidity] = useState(80);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('/api/weather/setThresholds', { temperature, humidity });
        alert("Thresholds updated!");
    };

    return (
        <div className="thresholds-container">
            <h2>Set Weather Thresholds</h2>
            <form onSubmit={handleSubmit} className="thresholds-form">
                <label className="form-label" style={{gap: "20px"}}>
                    <p>Temperature Threshold (°C):</p>
                    <input
                        type="number"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        className="form-input"
                    />
                </label>
                <label className="form-label" style={{gap: "50px"}}>
                    <p>Humidity Threshold (%): </p>
                    <input
                        type="number"
                        value={humidity}
                        onChange={(e) => setHumidity(e.target.value)}
                        className="form-input"
                    />
                </label>
                <button type="submit" className="submit-button">Set Thresholds</button>
            </form>
        </div>
    );
};

export default Thresholds;
