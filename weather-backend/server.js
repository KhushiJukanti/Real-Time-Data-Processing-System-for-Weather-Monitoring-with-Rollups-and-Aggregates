const express = require('express');
const connectDB = require('./config');
const weatherRoutes = require('./routes/weather');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/weather', weatherRoutes);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


