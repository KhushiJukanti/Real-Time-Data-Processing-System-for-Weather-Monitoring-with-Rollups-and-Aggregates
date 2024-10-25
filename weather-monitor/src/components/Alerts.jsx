import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AlertItem from './AlertItem';

const Alerts = ({selectedCity}) => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await axios.get('/api/weather/alerts');
                setAlerts(response.data);
            } catch (error) {
                console.error("Error fetching alerts:", error);
            }
        };

        fetchAlerts();

        const interval = setInterval(fetchAlerts, 30000); // Fetch alerts every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const filteredAlerts = alerts.filter(alert => alert.message.includes(selectedCity));

    const handleAcknowledge = async (alertId) => {
        try {
            await axios.post('/api/weather/acknowledgeAlert', { id: alertId });
            setAlerts(alerts.filter(alert => alert.id !== alertId)); // Update local state
        } catch (error) {
            console.error("Error acknowledging alert:", error);
        }
    };

    return (
        <div>
            <h2>Alerts for {selectedCity}</h2>
            {filteredAlerts.length > 0 ? (
                filteredAlerts.map(alert => (
                    <AlertItem key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
                ))
            ) : (
                <p>No current alerts for {selectedCity}.</p>
            )}
        </div>
    );
};

export default Alerts;
