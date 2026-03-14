const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000',"https://task-app-rvad.onrender.com/"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database configuration
const database=require('./config/db');
database();



// Home Route.
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true,
    message: 'Server running' });
});

//user routes
const userRoute=require('./routes/auth');
const taskRoute=require('./routes/task');

app.use('/api/v1',userRoute);
app.use('/api/v1',taskRoute)


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

