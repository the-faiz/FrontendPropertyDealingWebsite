require("dotenv").config();
const port = process.env.PORT || 5000
const URI = process.env.URI

//Mongoose connection
const mongoose = require('mongoose');

// Replace 'your-database' with the name of your MongoDB database
const mongoURI = URI;
mongoose.connect(mongoURI)

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});


//Backend Code
const express = require('express');
const cors = require('cors');
const app = express()
app.use(cors());



app.use(express.json())//middleware to use req.body

//Available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/projects',require('./routes/projects'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})