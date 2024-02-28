import React, { useState, useEffect } from 'react';
import { getWeatherDataByCity, getFiveDayForecastByCity, getWeatherDataByCoords, getFiveDayForecastByCoords } from '../../services/weather-service';
import "./dashboard.css"

function Dashboard() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [error,setError] = useState(null);

  useEffect(() => {
    // Fetch weather data for the initial city
    if (city.trim() !== '') {
      searchByCity(city);
    }
  }, [city]);

  const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        getWeatherDataByCoords(latitude, longitude)
          .then(data => {
            setWeatherData(data);
            setError(null);
            // Fetch 5-day forecast using coordinates
            getFiveDayForecastByCoords(latitude, longitude);
          })
          .catch(error => {
            console.error('Error fetching weather data:', error);
            setWeatherData(null);
            setError('Error fetching weather data. Please try again.');
          });
      },
      error => {
        if (error.code === error.PERMISSION_DENIED) {
          alert("Geolocation request denied. Please reset location permission to grant access again.");
        } else {
          alert("Geolocation request error. Please reset location permission.");
        }
      }
    );
  };

  const searchByCity = async (cityName) => {
    try {
      const weatherResponse = await getWeatherDataByCity(cityName);
      const forecastResponse = await getFiveDayForecastByCity(cityName);
      console.log(weatherResponse, forecastResponse);
      setWeatherData(weatherResponse);
      // Filter forecast data to include only the next 5 days
      const fiveDayForecast = forecastResponse.list.filter((forecast, index) => index % 8 === 0);
      setForecastData(fiveDayForecast);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(null);
      setForecastData([]);
      setError('Error fetching weather data. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <>
      <h1>Weather Dashboard</h1>
      <div className="container">
        <div className="weather-input">
          <h3>Enter a City Name</h3>
          <input
            className="city-input"
            type="text"
            value={city}
            onChange={handleInputChange}
          />
          <button className="search-btn" onClick={() => searchByCity(city)}>
            Search
          </button>
          {/* <div className="separator"></div> */}
          {/* <button className="location-btn" onClick={getUserCoordinates}>
            Use Current Location
          </button> */}
        </div>
        {weatherData && (
          <div className="weather-data">
            <div className="current-weather">
              <div className="details">
                <h2>{weatherData.name} ({new Date(weatherData.dt * 1000).toLocaleDateString()})</h2>
                <h6>Temperature: {(weatherData.main.temp - 273.15).toFixed(2)}°C</h6>
                <h6>Wind: {weatherData.wind.speed} M/S</h6>
                <h6>Humidity: {weatherData.main.humidity}%</h6>
              </div>
              <div className="icon">
                <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`} alt="weather-icon" />
                <h6>{weatherData.weather[0].description}</h6>
              </div>
            </div>
            <div className="days-forecast">
              <h2>5-Day Forecast</h2>
              <ul className="weather-cards">
                {forecastData.map((forecast, index) => (
                  <li className="card" key={index}>
                    <h3>({forecast.dt_txt.split(" ")[0]})</h3>
                    <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@4x.png`} alt="weather-icon" />
                    <h6>Temp: {(forecast.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: {forecast.wind.speed} M/S</h6>
                    <h6>Humidity: {forecast.main.humidity}%</h6>

                    {/* <h3>{forecast.dt_txt}</h3>
                    <h6>Temp: {(forecast.main.temp - 273.15).toFixed(2)}°C</h6>
                    <h6>Wind: {forecast.wind.speed} M/S</h6>
                    <h6>Humidity: {forecast.main.humidity}%</h6> */}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;