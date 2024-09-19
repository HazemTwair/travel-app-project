const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static("dist"));

// Configuration object to store API keys and base URLs
const config = {
    geonames: {
        username: process.env.geonamesUserName,
        baseUrl: "http://api.geonames.org/searchJSON",
    },
    weatherbit: {
        apiKey: process.env.weatherbitApiKey,
        baseUrl: "https://api.weatherbit.io/v2.0/forecast/daily",
    },
    pixabay: {
        apiKey: process.env.pixabayApiKey,
        baseUrl: "https://pixabay.com/api",
    },
};

// Setup Server
const port = 8080;

app.listen(port, () => {
    console.log(`Running on localhost:${port}`);
});

app.get("/", (req, res) => {
    res.sendFile("dist/index.html");
});

app.post("/api/geonames", async function (req, res) {
    const { city } = req.body;
    const response = await fetch(
        `${config.geonames.baseUrl}?q=${city}&username=${config.geonames.username}`
    );
    if (!response.ok) {
        throw new Error(
            `Error fetching coordinates from GeoNames: ${response.statusText}`
        );
    }
    const data = await response.json();
    res.json(data);
});

app.post("/api/weatherbit", async function (req, res) {
    const { lat, lon } = req.body;
    const response = await fetch(
        `${config.weatherbit.baseUrl}?key=${config.weatherbit.apiKey}&lat=${lat}&lon=${lon}`
    );
    if (!response.ok) {
        throw new Error(
            `Error fetching weather from Weatherbit: ${response.statusText}`
        );
    }
    const data = await response.json();
    res.json(data);
});

app.post("/api/pixabay", async function (req, res) {
    const { city, countryName, imageType } = req.body;
    let response = await fetch(
        `${config.pixabay.baseUrl}?key=${config.pixabay.apiKey}&q=${city}&image_type=${imageType}`
    );
    if (!response.ok) {
        throw new Error(
            `Error fetching image from Pixabay: ${response.statusText}`
        );
    }
    let data = await response.json();

    // Pull in an image for the country when the entered location brings up no results
    if (data.totalHits == 0) {
        response = await fetch(
            `${config.pixabay.baseUrl}?key=${config.pixabay.apiKey}&q=${countryName}&image_type=${imageType}`
        );
        if (!response.ok) {
            throw new Error(
                `Error fetching image from Pixabay: ${response.statusText}`
            );
        }
        data = await response.json();
    }
    res.json(data);
});

module.exports = app;
