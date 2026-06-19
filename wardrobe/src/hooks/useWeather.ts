import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '../types';

const WMO_CODES: Record<number, string> = {
  0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
  61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
  71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
  80: 'Slight showers', 81: 'Moderate showers', 82: 'Heavy showers',
  95: 'Thunderstorm', 99: 'Thunderstorm with hail',
};

function decodeWeatherCode(code: number): string {
  return WMO_CODES[code] ?? 'Unknown';
}

const DEFAULT_LAT = 52.06;
const DEFAULT_LON = 1.27;

// Before 13:00 → use 13:00 forecast. After 13:00 → caller sets targetHour.
function defaultTargetHour(): number {
  const now = new Date();
  return now.getHours() < 13 ? 13 : now.getHours();
}

export interface UseWeatherResult {
  weather: WeatherData | null;
  error: string | null;
  loading: boolean;
  lat: number;
  lon: number;
  targetHour: number;
  needsTimePrompt: boolean;   // true when opened after 13:00 and user hasn't confirmed yet
  setTargetHour: (h: number) => void;
  confirmTargetHour: () => void;
  updateLocation: (lat: number, lon: number) => void;
}

export function useWeather(): UseWeatherResult {
  const storedLat = parseFloat(localStorage.getItem('weather_lat') ?? String(DEFAULT_LAT));
  const storedLon = parseFloat(localStorage.getItem('weather_lon') ?? String(DEFAULT_LON));
  const [lat, setLatState] = useState(storedLat);
  const [lon, setLonState] = useState(storedLon);

  const openHour = new Date().getHours();
  const openedAfter13 = openHour >= 13;

  const [targetHour, setTargetHourState] = useState<number>(defaultTargetHour());
  // Prompt only shown once per session if opened after 13:00
  const [timeConfirmed, setTimeConfirmed] = useState(!openedAfter13);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const updateLocation = (newLat: number, newLon: number) => {
    localStorage.setItem('weather_lat', String(newLat));
    localStorage.setItem('weather_lon', String(newLon));
    setLatState(newLat);
    setLonState(newLon);
  };

  const setTargetHour = (h: number) => setTargetHourState(h);

  const confirmTargetHour = useCallback(() => setTimeConfirmed(true), []);

  useEffect(() => {
    // Don't fetch until user has confirmed their going-out time (after 13:00 case)
    if (!timeConfirmed) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&hourly=temperature_2m,weathercode,windspeed_10m,uv_index` +
      `&timezone=Europe%2FLondon` +
      `&forecast_days=1`
    )
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const hourly = data.hourly;
        // hourly arrays index 0–23 correspond to hours 0–23 of today
        const idx = Math.min(Math.max(targetHour, 0), 23);
        setWeather({
          temperature: hourly.temperature_2m[idx],
          weatherCode: hourly.weathercode[idx],
          windSpeed: hourly.windspeed_10m[idx],
          uvIndex: hourly.uv_index?.[idx] ?? 0,
          label: decodeWeatherCode(hourly.weathercode[idx]),
        });
      })
      .catch(() => {
        if (!cancelled) setError('Weather unavailable');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [lat, lon, targetHour, timeConfirmed]);

  return {
    weather, error, loading, lat, lon,
    targetHour, setTargetHour,
    needsTimePrompt: openedAfter13 && !timeConfirmed,
    confirmTargetHour,
    updateLocation,
  };
}
