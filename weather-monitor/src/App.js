import React from 'react';
import Alerts from './components/Alerts';
import Thresholds from './components/Thresholds';
import WeatherDisplay from './components/WeatherDisplay';

const App = () => {
    return (
        <div className='App'>
            <h1 style={{textAlign: "center",
    fontFamily: "Helvetica",
    color: "#555555"}}>Real-Time Weather Monitoring System</h1>
            <Thresholds />
            <WeatherDisplay />
        </div>
    );
};

export default App;
