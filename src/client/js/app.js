import {
    createLocationImage,
    handleInputsValidation,
    renderTrips,
} from "./helpers";

import placeholderImg from "../media/image placeholder.png";

const departingDateInput = document.getElementById("departingDate");

/**
 * @async
 * @description Fetches trip date weather and Updates the UI wih the trips cards.
 */
const fetchWeatherDataAndUpdateUI = async () => {
    const buttonText = document.getElementById("button-text");
    const loadingSpinner = document.getElementById("spinner");
    buttonText.classList.add("hidden");
    loadingSpinner.classList.remove("hidden");

    const cityInput = document.getElementById("city");
    const city = cityInput.value.trim();
    let trip = {};
    try {
        const locationData = await getLocationData(city);
        const { lat, lng, name, countryName } = locationData;

        let weatherData = await getWeatherData(lat, lng);
        weatherData = {
            city: city,
            country: countryName,
            ...weatherData,
        };
        trip.info = weatherData;

        const locationImage = await getLocationImage(
            name,
            countryName,
            "photo"
        );
        trip.image = locationImage;
    } catch (error) {
        if (error.message.includes("No image available")) {
            const locationImage = {
                webformatURL: placeholderImg,
                tags: "No Image Available",
            };
            trip.image = locationImage;
            createLocationImage(locationImage);
        } else {
            alert(error.message);
        }
    } finally {
        const trips = JSON.parse(localStorage.getItem("trips")) || [];
        if (Object.keys(trip).length > 0) {
            if (!trips) {
                trips = [];
            }
            trips.unshift(trip);
            localStorage.setItem("trips", JSON.stringify(trips));
            renderTrips();
        }
        cityInput.value = "";
        departingDateInput.value = "";
        handleInputsValidation();
        buttonText.classList.remove("hidden");
        loadingSpinner.classList.add("hidden");
        document.querySelector("hr").scrollIntoView({ behavior: "smooth" });
    }
};

/**
 * @async
 * @description Fetches location data for a given city from the Geonames API.
 * @param {string} city - The name of the city to search for.
 * @returns {Promise<object>} A Promise that resolves to the location data if found, or rejects with an error if not found or an error occurs.
 */
const getLocationData = async (city) => {
    try {
        const response = await fetch("api/geonames", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ city }),
        });
        const responseData = await response.json();
        if (responseData.totalResultsCount > 0) {
            return responseData.geonames[0];
        }
        throw new Error(
            `Something went wrong. Please check the entered location! | getLocationData()`
        );
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * @async
 * @description Fetches weather data for a specific location and date from the Weatherbit API.
 * @param {number} lat - The latitude of the location.
 * @param {number} lon - The longitude of the location.
 * @returns {Promise<object>} A Promise that resolves to the weather data for the selected date if found, or rejects with an error if not found or an error occurs.
 */
const getWeatherData = async (lat, lon) => {
    try {
        const response = await fetch("api/weatherbit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ lat, lon }),
        });
        const responseData = await response.json();

        if (responseData.data.length > 0) {
            for (let day of responseData.data) {
                if (day.valid_date == departingDateInput.value) {
                    return day;
                }
            }
        }
        throw new Error(
            `Something went wrong. Please check the entered location / date`
        );
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * @async
 * @description Fetches an image for a given city from the Pixabay API.
 * @param {string} city - The name of the city to search for
 * @param {string} countryName - The name of the country to search for, if the entered city brings up no results
 * @param {string} imageType - The type of image to search for (e.g., "photo").
 * @returns {Promise<object>} A Promise that resolves to the image data if found, or rejects with an error if not found or an error occurs.
 */
const getLocationImage = async (city, countryName, imageType) => {
    try {
        const response = await fetch("api/pixabay", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ city, countryName, imageType }),
        });

        if (!response.ok) {
            throw new Error(`Error sending data: ${response.status}`);
        }

        const responseData = await response.json();
        if (responseData.totalHits > 0) {
            return responseData.hits[0];
        }
        throw new Error("Something went wrong. No image available");
    } catch (error) {
        throw new Error(error);
    }
};

export { fetchWeatherDataAndUpdateUI };
