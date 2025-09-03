const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

const TRENCIN = {latitude: 48.8945, longitude: 18.0444};
const BRNO = {latitude: 49.1952, longitude: 16.608};

async function fetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw to be handled by caller
  }
}

async function fetchWeather() {
    const weatherData = await fetchWeatherData(TRENCIN.latitude, TRENCIN.longitude);
    console.log(weatherData);
}

async function fetchWeatherData(latitude, longitude) {
    const url = `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max&current=temperature_2m,is_day,weather_code&timezone=auto`;
    return await fetchJson(url);
}

const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

fetchWeather();