import { useState } from 'react';
import '../CSS/Weather.css';
import { AnimatePresence, motion } from 'framer-motion';
import MapSelector from '../components/MapSelector'; // Adjust the path as needed

type WeatherData = {
  name: string;
  sys: { country: string };
  weather: { main: string; description: string }[];
  main: { temp: number; humidity: number };
  wind: { speed: number };
};

const Weather = () => {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const API_KEY = '03316f609a50b77b76c17ff1c03d68ee';

  // Fetch by city name
  const getWeatherByCity = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) throw new Error(data.message);
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch by lat/lon (from map)
  const getWeatherByCoordinates = async (lat: number, lon: number) => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) throw new Error(data.message);
      setWeather(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Main-App">
      <h1>🌤️ React Weather App</h1>

      {/* City input section */}
      <div className="input-group">
        <input
          type="text"
          value={city}
          placeholder="Enter city"
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') getWeatherByCity();
          }}
        />
        <button onClick={getWeatherByCity}>Search</button>
      </div>

      <h3 className='Heading3'>OR select location on the map 👇</h3>

      {/* Map component */}
      <MapSelector onSelect={getWeatherByCoordinates} />

      {loading && <p>Loading weather data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Weather data card */}
      <AnimatePresence>
        {weather && (
          <motion.div
            className="weather-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.7 }}
          >
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>
            <p>
              <strong>{weather.weather[0].main}</strong> -{' '}
              {weather.weather[0].description}
            </p>
            <p>🌡️ Temp: {weather.main.temp}°C</p>
            <p>💧 Humidity: {weather.main.humidity}%</p>
            <p>💨 Wind: {weather.wind.speed} m/s</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Weather;
