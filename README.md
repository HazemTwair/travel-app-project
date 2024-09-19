# Travel App

## Project Description

This project demonstrates using the Geonames API, Weatherbit API, Pixabay API, and user data (trip location & date) to dynamically update the UI with trip cards containing weather forecast data and additional information.

The project aims to make you comfortable with Web APIs and Asynchronous Applications.

## How To Run

-   `cd` into your new folder and run: `npm install`
-   Add you API keys to .env file under 'geonamesUserName', 'weatherbitApiKey' and 'pixabayApiKey'
-   Run `npm run build-prod`
-   Run `npm run start`
-   Open local host on port 8080 on the browser
-   For testing: run `npm run test`

## Project Architecture

-   Webserver - Node
-   Web application framework for routing - Express
-   Build tool - Webpack
-   Unit testing - Jest
-   External script - Service Worker
-   External APIs - Geonames API, Weatherbit API, Pixabay API

## Advanced Features

### This weather app offers a range of advanced features to enhance your travel planning experience:

-   **Dynamic Imagery**: Show country images for obscure locations with Pixabay.
-   **Trip Management**: Add and remove trips.
-   **Improved UX**: Loader spinner on add, scroll to new trip.
-   **Data Persistence**: Local Storage saves your trips.
-   **Enhanced Forecasts**: View weather with icons.
-   **Expandable Itinerary**: Add multiple trips.
-   **Trip Status**: Track expired trips.
