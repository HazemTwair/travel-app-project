/**
 * @description Sets the minimum and maximum dates for the departing date input field.
 *
 * The minimum date is set to the current date, and the maximum date is set to 16 days after the current date.
 */
const setMinMaxDate = () => {
    const departingDateInput = document.getElementById("departingDate");
    const tempDate = new Date();
    departingDateInput.min = tempDate.toISOString().split("T")[0];
    tempDate.setDate(tempDate.getDate() + 16);
    departingDateInput.max = tempDate.toISOString().split("T")[0];
};

/**
 * @description Calculates the remaining days between the current date and a given valid date.
 * @param {string} valid_date - The valid date in YYYY-MM-DD format.
 * @returns {number} The number of remaining days.
 */
const getRemainingDays = (valid_date) => {
    const departingDate = new Date(valid_date);
    const today = new Date();
    if (departingDate.toDateString() == today.toDateString()) {
        return 0;
    }
    const timeDiff = departingDate - today;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    return Number(daysDiff.toFixed());
};

/**
 * @description Validates the input fields by checking if they are not empty.
 * @returns {boolean} True if the input fields are valid, false otherwise.
 */
const validateInputs = () => {
    const cityInput = document.getElementById("city");
    const departingDateInput = document.getElementById("departingDate");
    return cityInput.value !== "" && departingDateInput.value !== "";
};

/**
 * @description Handles the input fields validation and enables/disables the submit button accordingly.
 */
const handleInputsValidation = () => {
    const submitButton = document.getElementById("addTripBtn");
    submitButton.disabled = !validateInputs();
};

/**
 * @description Removes a trip from the trips array, updates localStorage and the UI.
 * @param {number} index - The index of the trip to remove.
 */
const removeTrip = (index) => {
    const trips = JSON.parse(localStorage.getItem("trips")) || [];
    trips.splice(index, 1);
    localStorage.setItem("trips", JSON.stringify(trips));
    renderTrips();
};

/**
 * @description Handles the click event on a "remove-trip" button.
 * @param {Event} event - The click event object.
 */
const handleRemoveTripClick = (event) => {
    const { target } = event;
    const index = target.dataset.index;

    if (target.classList.contains("remove-trip")) {
        removeTrip(index);
    }
};

/**
 * @description Creates a div containing the location image.
 * @param {Object} imageData - An object containing the location image data.
 * @param {string} imageData.webformatURL - The image URL.
 * @param {string[]} imageData.tags - The tags associated with the location image.
 * @returns {HTMLElement} Div containing the location image.
 */
const createLocationImage = ({ webformatURL, tags }) => {
    const caption =
        tags == "No Image Available" ? "Image Not Found" : "Image from Pixabay";
    const locationImg = document.createElement("div");
    locationImg.className = "location-img";
    locationImg.innerHTML = `
    <figure>
        <img src="${webformatURL}" alt="${tags}" width="500" height="300"></img>
        <figcaption>${caption}</figcaption>
    </figure>`;
    return locationImg;
};

/**
 * @description Creates a div containing the trip information element.
 * @param {Object} tripData - An object containing the trip data.
 * @param {string} tripData.city - The name of the city the trip is to.
 * @param {string} tripData.country - The name of the country the trip is to.
 * @param {string} tripData.valid_date - The valid date for the trip.
 * @param {number} tripData.max_temp - The maximum temperature for the trip.
 * @param {number} tripData.min_temp - The minimum temperature for the trip.
 * @param {string} tripData.weather - The weather forecast for the trip.
 * @param {string} tripData.rem - The remaining days to trip date.
 * @returns {HTMLElement}  A div element containing the trip information.
 */
const CreateTripInfo = ({
    city,
    country,
    valid_date,
    max_temp,
    min_temp,
    weather,
    rem,
}) => {
    const tripInfo = document.createElement("div");
    tripInfo.className = "trip-info";
    tripInfo.innerHTML = `
    <div class="flight">
        <h3>My trip to: ${city}, ${country}</h3>
        <h3>Departing: ${valid_date}</h3>
        <p>${rem}</p>
    </div>
    <div class="weather">
        <p>Typical weather for then is:</p>
        <p>High - ${max_temp}, Low - ${min_temp}</p>
        <p class="description">${weather.description}</p>
    </div>`;

    import(`../media/icons/${weather.icon}.png`)
        .then((icon) => {
            const iconElement = document.createElement("img");
            iconElement.src = icon.default;
            iconElement.alt = "Weather Icon";
            iconElement.width = 32;
            iconElement.height = 32;
            tripInfo.querySelector(".description").prepend(iconElement);
        })
        .catch((error) => {
            console.error("Error importing weather icon:", error);
        });

    return tripInfo;
};

/**
 * @description Move expired trips to bottom
 * @param {HTMLElement} tripsList - Div containing the trips list
 */
const moveExpiredToBottom = (tripsList) => {
    const cards = document.querySelectorAll(".trip-card");
    const expiredList = document.createElement("div");
    expiredList.className = "expired-trips";
    cards.forEach((trip) => {
        if (trip.dataset.expired === "true") {
            expiredList.appendChild(trip);
        }
    });
    if (expiredList.childNodes.length !== 0) tripsList.appendChild(expiredList);
};

/**
 * @description Render trips cards to the UI.
 */
const renderTrips = () => {
    const tripsList = document.getElementById("trip-list");
    tripsList.innerHTML = "";
    const trips = JSON.parse(localStorage.getItem("trips")) || [];

    for (const [index, trip] of trips.entries()) {
        const tripCard = document.createElement("li");
        tripCard.className = "trip-card";
        tripCard.setAttribute("data-index", index);

        const tripDiv = document.createElement("div");
        tripDiv.className = "trip";

        const { city, valid_date } = trip.info;
        const remainingDays = getRemainingDays(valid_date);
        let rem = `${city} is ${remainingDays} days away`;
        if (remainingDays < 0) {
            rem = `${city} trip is <strong>Expired</strong>`;
            tripCard.setAttribute("data-expired", "true");
        } else if (remainingDays == 0) {
            rem = `${city} trip is Today!`;
        }

        tripDiv.appendChild(createLocationImage(trip.image));
        tripDiv.appendChild(CreateTripInfo({ ...trip.info, rem }));
        tripCard.appendChild(tripDiv);

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-trip";
        removeBtn.textContent = "Remove Trip";
        removeBtn.setAttribute("data-index", index);
        tripCard.appendChild(removeBtn);

        tripsList.appendChild(tripCard);
    }

    moveExpiredToBottom(tripsList);
};

export {
    createLocationImage,
    handleInputsValidation,
    handleRemoveTripClick,
    getRemainingDays,
    renderTrips,
    setMinMaxDate,
    validateInputs,
};
