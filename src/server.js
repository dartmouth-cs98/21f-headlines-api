import express from 'express';
import passport from 'passport';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';
import apiRouter from './router';

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/headlines';
// const mongoURI = 'mongodb+srv://headlines_user:e202R1PXHho11bIU@cluster0.vapw9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const decodeIDToken = require('./authenticateToken');

mongoose.connect(mongoURI).then(() => {
  console.log('connected to database:', mongoURI);
}).catch((err) => {
  console.log('error: could not connect to db:', err);
});

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// Allow our routes to use this decodeIDToken function.
app.use(decodeIDToken);

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// additional init stuff should go before hitting the routing
app.use(passport.initialize());
app.use('/', apiRouter);

// default index route
app.get('/', (req, res) => {
  res.send('hi from server.js');
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
