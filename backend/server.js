const express = require('express');
const mongoose = require ('mongoose');
const cors = require('cors')
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.Mongo_Uri).then(()=>{
    console.log('mongodb connected');
}).catch((err)=>{
    console(err)
});

app.get('/', (req, res)=>{
    res.send('Hi Khushi')
})


app.listen(7000, ()=>{
    console.log(`Server is running at 7000`);
})
