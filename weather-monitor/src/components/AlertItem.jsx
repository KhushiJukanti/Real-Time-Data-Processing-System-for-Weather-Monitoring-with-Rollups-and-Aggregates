import React from 'react';

const AlertItem = ({ alert, onAcknowledge }) => {
    return (
        <div style={{ border: '1px solid red', padding: '10px', margin: '10px 0' }}>
            <p><strong>{alert.message}</strong></p>
            <p><small>{new Date(alert.timestamp).toLocaleString()}</small></p>
            <button onClick={() => onAcknowledge(alert.id)}>Acknowledge</button>
        </div>
    );
};

export default AlertItem;
