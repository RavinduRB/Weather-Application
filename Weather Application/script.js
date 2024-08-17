document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
    const apiUrl = 'weather.php';

    const searchButton = document.getElementById('search-button');
    const refreshButton = document.getElementById('refresh-button');
    const locationButton = document.getElementById('location-button');
    const cityInput = document.getElementById('city-input');

    const updateWeather = async (city) => {
        try {
            const response = await fetch(`${apiUrl}?city=${city}&apiKey=${apiKey}`);
            const data = await response.json();
            
            if (data.error) {
                displayError(data.error);
                return;
            }

            document.getElementById('city-name').textContent = data.city;
            document.getElementById('temperature').textContent = `Temperature: ${data.temperature}°${data.unit}`;
            document.getElementById('weather-condition').textContent = `Condition: ${data.condition}`;
            document.getElementById('humidity').textContent = `Humidity: ${data.humidity}%`;
            document.getElementById('wind-speed').textContent = `Wind Speed: ${data.wind_speed} km/h`;

            // Populate forecast
            const forecastElement = document.getElementById('forecast');
            forecastElement.innerHTML = ''; // Clear previous forecast
            data.forecast.forEach(day => {
                forecastElement.innerHTML += `
                    <div>
                        <h3>${day.date}</h3>
                        <p>${day.condition}</p>
                        <p>${day.temperature}°${data.unit}</p>
                    </div>
                `;
            });
        } catch (error) {
            displayError('An error occurred while fetching the weather data.');
        }
    };

    const displayError = (message) => {
        document.getElementById('current-weather').innerHTML = `<p class="error">${message}</p>`;
    };

    searchButton.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
            updateWeather(city);
        }
    });

    refreshButton.addEventListener('click', () => {
        const city = cityInput.value;
        if (city) {
            updateWeather(city);
        }
    });

    locationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                updateWeather(`lat=${latitude}&lon=${longitude}`);
            }, () => {
                displayError('Unable to retrieve your location.');
            });
        } else {
            displayError('Geolocation is not supported by this browser.');
        }
    });

    // Initial load
    const savedCity = localStorage.getItem('city');
    if (savedCity) {
        cityInput.value = savedCity;
        updateWeather(savedCity);
    }
});
