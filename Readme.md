# Real-Time Weather Monitoring System

## Overview
This project implements a real-time data processing system to monitor weather conditions using data from the OpenWeatherMap API. It provides summarized insights through rollups and aggregates, enabling users to track weather trends and receive alerts based on user-defined thresholds.

## Features
- Continuous retrieval of weather data for major metros in India (Delhi, Mumbai, Chennai, Bangalore, Kolkata, Hyderabad).
- Daily weather summaries including:
  - Average temperature
  - Maximum temperature
  - Minimum temperature
  - Dominant weather condition
- User-configurable alerting thresholds for temperature and specific weather conditions.
- Data visualizations for daily weather summaries, historical trends, and triggered alerts.
- Support for additional weather parameters such as humidity and wind speed.
- Support for future enhancements.

## Table of Contents
- [Getting Started](#getting-started)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Configuration](#configuration)
- [Bonus Features](#bonus-features)
- [Contributing](#contributing)
- [License](#license)

## Getting Started
To run this application, ensure you have Docker installed on your machine. The system consists of several components that work together to retrieve, process, and visualize weather data.

### Prerequisites
- A valid API key from OpenWeatherMap (sign up [here](https://openweathermap.org/)).


## Setup Instructions

1. **Clone the repository :**
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   cd rule-engine-ast
   ```
2. **Install dependencies :**
    - **For the frontend :**
        ```bash
        cd weather-monitering
        npm install
        ```
      
    - **For the backend :** 
        ```bash
        cd weather-backend
        npm install
        ```

3. **Create a `.env` file in the `backend` directory and set up your environment variables:**
    ```bash
    MONGO_URI=your_mongo_db_connection_string
    PORT=7000
    ```

4. **Ensure MongoDB is running and the environment variables are correctly set up in your `.env` file.**

## Running the Application

1. Run Backend:
   ```bash
   cd weather-moniter-backend
   node server.js
   ```
2. Run Front-end:
   ```bash
   cd weather-moniter-frontend
   npm start
   ```

3. Ensure the necessary environment variables are set for the OpenWeatherMap API key.

4. **Navigate to the app in your browser** at `http://localhost:3000`.

## Usage

1. Access the application via the web interface  and run the backend services in your terminal.
2. The system will start retrieving weather data every 5 minutes (configurable).
3. View daily summaries, alerts, and visualizations through the provided interface or console logs.
4. View historical trends from the graph in UI (Used last one week data, configurable).

## Configuration

You can configure various aspects of the system through environment variables:

- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key.
- `MONGO_URI`: Interval for fetching weather data (default is 5 minutes).

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

<!-- ## License
This project is licensed under the MIT License

--- -->

For any questions or issues, feel free to reach out through the GitHub repository or raise an issue. Happy coding!