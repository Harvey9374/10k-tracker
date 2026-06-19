import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight showers',
  81: 'Moderate showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
  99: 'Thunderstorm with hail',
};

function decodeWeatherCode(code: number): string {
  return WMO_CODES[code] ?? 'Unknown';
}

const DEFAULT_LAT = 52.06;
const DEFAULT_LON = 1.27;

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const storedLat = parseFloat(localStorage.getItem('weather_lat') ?? String(DEFAULT_LAT));
  const storedLon = parseFloat(localStorage.getItem('weather_lon') ?? String(DEFAULT_LON));
  const [lat, setLatState] = useState(storedLat);
  const [lon, setLonState] = useState(storedLon);

  const updateLocation = (newLat: number, newLon: number) => {
    localStorage.setItem('weather_lat', String(newLat));
    localStorage.setItem('weather_lon', String(newLon));
    setLatState(newLat);
    setLonState(newLon);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m,uv_index&timezone=Europe%2FLondon`
    )
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const current = data.current;
        setWeather({
          temperature: current.temperature_2m,
          weatherCode: current.weathercode,
          windSpeed: current.windspeed_10m,
          uvIndex: current.uv_index ?? 0,
          label: decodeWeatherCode(current.weathercode),
        });
      })
      .catch(() => {
        if (!cancelled) setError('Weather unavailable');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [lat, lon]);

  return { weather, error, loading, lat, lon, updateLocation };
}
