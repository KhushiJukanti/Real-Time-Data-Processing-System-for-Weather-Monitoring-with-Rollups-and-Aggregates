import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Custom tooltip component
const CustomTooltip = ({ payload, label, active }) => {
    if (active && payload && payload.length) {
        const { avgTemp, minTemp, maxTemp, dominantCondition } = payload[0].payload;

        return (
            <div
                style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    padding: "10px",
                }}
            >
                <p>{`Date: ${label}`}</p>
                <p>{`Average Temperature: ${avgTemp}°C`}</p>
                <p>{`Min Temperature: ${minTemp}°C`}</p>
                <p>{`Max Temperature: ${maxTemp}°C`}</p>
                <p>{`Dominant Condition: ${dominantCondition}`}</p>
            </div>
        );
    }

    return null;
};

const GraphLine = ({ selectedCity }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWeatherSummaries = async () => {
        try {
            const response = await fetch(`/api/weather/daily-summaries?city=${selectedCity}`); // Include selected city
            const summaries = await response.json();
            console.log("Fetched summaries:", summaries);
            console.log("selected city is", selectedCity);
            setData(summaries); 
        } catch (error) {
            console.error('Error fetching daily summaries:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchWeatherSummaries();
    }, [selectedCity]); // Fetch data on component mount

    // Filter data for the selected city
   

    if (loading) {
        return <div>Loading...</div>; // Show loading state
    }

    // Prepare data for the graph
    const graphData = data.map(item => ({
        date: item.date.split('T')[0], // Format date to YYYY-MM-DD
        avgTemp: item.avgTemp,
        maxTemp: item.maxTemp,
        minTemp: item.minTemp,
        dominantCondition: item.dominantCondition,
    }));

    console.log("Graph Data:", graphData); // Log graph data for debugging

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={graphData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />

                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="avgTemp" // Match this with the graphData mapping
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    name="Average Temperature"
                    strokeWidth={4}
                />
                <Line
                    type="monotone"
                    dataKey="minTemp" // Match this with the graphData mapping
                    stroke="#82ca9d"
                    name="Min Temperature"
                />
                <Line
                    type="monotone"
                    dataKey="maxTemp" // Match this with the graphData mapping
                    stroke="#ffc658"
                    name="Max Temperature"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default GraphLine;
