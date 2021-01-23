// const dotenv = require("dotenv");
// dotenv.config();
// var path = require("path");
const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

const storeController = require('../controllers/storeController');

const app = express();
const port = 8081;

let savedTrips = [];

app.use(cors());
// to use json
app.use(bodyParser.json());
// to use url encoded values
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use(express.static('dist'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    if (!process.env.GEONAMES_USERNAME) {
        console.error('GEONAMES_USERNAME required');
    }
    if (!process.env.WEATHERBIT_API_KEY) {
        console.error('WEATHERBIT_API_KEY required');
    }
    if (!process.env.PIXABAY_API_KEY) {
        console.error('PIXABAY_API_KEY required');
    }
});

app.get('/', storeController.homePage);
app.post('/geo-name-locations', storeController.geoNameLocations);
app.post('/weather-bit-forecast', storeController.weatherBitForecast);
app.post('/pixabay-images', storeController.pixabayImages);

// TODO: This is where it may be a better approach to add middlewhere
app.post('/save-trip', (req, res) => {
    const trip = { ...req.body };
    console.log(trip);

    savedTrips.push(trip);
    res.send(trip);
});

app.get('/get-saved-trips', (req, res) => {
    res.json(savedTrips);
});

app.post('/remove-saved-trip', (req, res) => {
    console.log('Request Body: ', req.body);
    const tripId = req.body.id;

    savedTrips = savedTrips.filter((savedTrip) => {
        console.log('savedTripID: ', savedTrip.id);
        return savedTrip.id != tripId;
    });
    console.log('Saved Trips Updated To: ', savedTrips);

    res.json(savedTrips);
});