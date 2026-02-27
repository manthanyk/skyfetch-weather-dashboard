// Your OpenWeatherMap API Key
const API_KEY = '7403d43af6e4859b75c640135669225c';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
async function getWeather(city) {
    // Show loading state
    showLoading();

    // Disable search button while loading
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';

    // Build the complete URL
    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    
    try {
        // Make API call using Axios with await
        const response = await axios.get(url);
        
        // Success! We got the data
        console.log('Weather Data:', response.data);
        displayWeather(response.data);
    } catch (error) {
        // Something went wrong
        console.error('Error fetching weather:', error);
        
        if (error.response && error.response.status === 404) {
            showError(`City "${city}" not found. Please check the spelling and try again.`);
        } else {
            showError('Something went wrong. Please try again later.');
        }
    } finally {
        // Re-enable button
        searchBtn.disabled = false;
        searchBtn.innerHTML = '🔍 Search';
    }
}

// Function to show loading state
function showLoading() {
    const loadingHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching weather data...</p>
        </div>
    `;
    document.getElementById('weather-display').innerHTML = loadingHTML;
}

// Function to display error messages
function showError(message) {
    const errorHTML = `
        <div class="error-message">
            <span class="error-icon">⚠️</span>
            <div class="error-content">
                <h3>Oops!</h3>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    document.getElementById('weather-display').innerHTML = errorHTML;
}

// Function to display weather data
function displayWeather(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    // Create HTML to display
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
    
    // Put it on the page
    document.getElementById('weather-display').innerHTML = weatherHTML;

    // Focus back on input for next search
    cityInput.focus();
}

// --- Event Listeners ---

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');

// Function to handle search logic
function handleSearch() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    if (city.length < 2) {
        showError('City name too short. Please enter at least 2 characters.');
        return;
    }

    getWeather(city);
    cityInput.value = ''; // Clear input after search
}

// Click event for search button
searchBtn.addEventListener('click', handleSearch);

// Enter key support for input field
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

// --- Initial Page Load ---

// Show a welcome message instead of a default city
document.getElementById('weather-display').innerHTML = `
    <div class="welcome-message">
        <p>Enter a city name above to get started! 🌍</p>
    </div>
`;