const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

const date = document.getElementById('date');
const current_day = document.getElementsByClassName('current_weather')[0];

const TRENCIN = {latitude: 48.8945, longitude: 18.0444};
const BRNO = {latitude: 49.1952, longitude: 16.608};

const WEATHER_MAPPINGS = {
  0: { icon: 'clear', description: 'Clear sky' },
  1: { icon: 'clear', description: 'Mainly clear' },
  2: { icon: 'cloudy', description: 'Partly cloudy' },
  3: { icon: 'cloudy', description: 'Overcast' },
  45: { icon: 'cloudy', description: 'Fog' },
  48: { icon: 'cloudy', description: 'Depositing rime fog' },
  51: { icon: 'cloudy', description: 'Light drizzle' },
  53: { icon: 'cloudy', description: 'Moderate drizzle' },
  55: { icon: 'cloudy', description: 'Dense drizzle' },
  56: { icon: 'cloudy', description: 'Light freezing drizzle' },
  57: { icon: 'cloudy', description: 'Dense freezing drizzle' },
  61: { icon: 'rainy', description: 'Slight rain' },
  63: { icon: 'rainy', description: 'Moderate rain' },
  65: { icon: 'rainy', description: 'Heavy rain' },
  66: { icon: 'rainy', description: 'Light freezing rain' },
  67: { icon: 'rainy', description: 'Heavy freezing rain' },
  71: { icon: 'snowfall', description: 'Slight snowfall' },
  73: { icon: 'snowfall', description: 'Moderate snowfall' },
  75: { icon: 'snowfall', description: 'Heavy snowfall' },
  77: { icon: 'snowfall', description: 'Snow grains' },
  80: { icon: 'rainy', description: 'Slight rain showers' },
  81: { icon: 'rainy', description: 'Moderate rain showers' },
  82: { icon: 'rainy', description: 'Violent rain showers' },
  85: { icon: 'snowfall', description: 'Slight snow showers' },
  86: { icon: 'snowfall', description: 'Heavy snow showers' },
  95: { icon: 'rainy', description: 'Thunderstorm' },
  96: { icon: 'rainy', description: 'Thunderstorm with slight hail' },
  99: { icon: 'rainy', description: 'Thunderstorm with heavy hail' },
};

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

async function setWeather() {
  const weatherData = await fetchWeatherData(TRENCIN.latitude, TRENCIN.longitude);
  console.log(weatherData);

  // -- Current weather update --
  current_day.querySelector('.main_day').textContent = getDayOfWeek(weatherData.daily.time[0]);

  const currentImage = current_day.querySelector('img');
  currentImage.src = getImgSrc(weatherData.current.weather_code, weatherData.current.is_day);
  currentImage.alt = getImgAlt(weatherData.current.weather_code);

  current_day.querySelector('.main_temp').textContent = weatherData.current.temperature_2m + '°C';

  // -- Forecast weather update --
  const forecast_elements = document.getElementsByClassName('day');

  for (let index = 0; index < forecast_elements.length; index++) {
    forecast_elements[index].querySelector('.f_day').innerText = getDayOfWeek(weatherData.daily.time[index + 1]);
    
    const forecast_image = forecast_elements[index].querySelector('img');
    forecast_image.src = getImgSrc(weatherData.daily.weather_code[index + 1], weatherData.current.is_day);
    forecast_image.alt = getImgAlt(weatherData.daily.weather_code[index + 1]);

    forecast_elements[index].querySelector('.f_temp').innerText = weatherData.daily.temperature_2m_max[index + 1] + '°C';
  }
}

async function fetchWeatherData(latitude, longitude) {
  const url = `${WEATHER_API_URL}?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max&current=temperature_2m,is_day,weather_code&timezone=auto`;
  return await fetchJson(url);
}

function getDayOfWeek(date) {
  switch (new Date(date).getDay()) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
  }
}

function getImgSrc(weather_code, is_day) {
  const icon = WEATHER_MAPPINGS[weather_code]?.icon || "question_mark";
  
  if(is_day) {
    return `../assets/day_${icon}.png`;
  }
  return `../assets/night_${icon}.png`;
}

function getImgAlt(weather_code) {
  return WEATHER_MAPPINGS[weather_code]?.description || "Unknown weather";
}

// --- Electron ---

document.getElementById('minimize_button').addEventListener('click', () => {
  window.electronAPI.send('minimize_window');
});

document.getElementById('exit_button').addEventListener('click', () => {
  window.electronAPI.send('exit_window');
});

setWeather();