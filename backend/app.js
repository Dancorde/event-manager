const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(
  'mongodb+srv://Dancorde:u5q2Dn0vKbNc8xif@calendar-rv7ue.mongodb.net/test?retryWrites=true&w=majority',
  {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });
mongoose.Promise = global.Promise;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes import
const eventRoutes = require('./routes/event');

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === 'OPTIONS') {
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT");
    return res.status(200).json({});
  }

  next();
});

// Routes
app.use("/api/events", eventRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;