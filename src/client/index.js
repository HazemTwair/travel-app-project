import { fetchWeatherDataAndUpdateUI } from "./js/app";
import {
    handleInputsValidation,
    handleRemoveTripClick,
    renderTrips,
    setMinMaxDate,
} from "./js/helpers";

import "./styles/style.scss";

// Event listeners to validate the input fields
document
    .getElementById("city")
    .addEventListener("input", handleInputsValidation);
document
    .getElementById("departingDate")
    .addEventListener("input", handleInputsValidation);

// Event listener to add function to existing HTML DOM element
document
    .getElementById("addTripBtn")
    .addEventListener("click", fetchWeatherDataAndUpdateUI);

// Event listener to remove trip card from the UI
document
    .getElementById("trip-list")
    .addEventListener("click", handleRemoveTripClick);

setMinMaxDate();
renderTrips();
