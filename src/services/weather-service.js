
const API_KEY = "322f5ac85c8f38253523c0754aa5c89a";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const getWeatherDataByCity = (cityName) => {
  const url = new URL(`${BASE_URL}/weather`);
  url.search = new URLSearchParams({ q: cityName, appid: API_KEY }).toString();

  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("City not found");
    }
    return res.json();
  });
};

export const getFiveDayForecastByCity = async (city) => {
  try {
    const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch 5-day forecast data');
  }
};
export const getFiveDayForecastByCoords = async (latitude, longitude) => {
  try {
    const response = await fetch(`${BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch 5-day forecast data');
  }
};
export const getWeatherDataByCoords = (latitude, longitude) => {
  const url = new URL(`${BASE_URL}/weather`);
  url.search = new URLSearchParams({
    lat: latitude,
    lon: longitude,
    appid: API_KEY,
  }).toString();

  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Weather data not available");
    }
    return res.json();
  });
};