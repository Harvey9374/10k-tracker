import { useState, useEffect } from 'react'

export interface WeatherData {
  tempC: number
  feelsLikeC: number
  humidity: number
  description: string
  icon: string
}

export interface HeatAdjustment {
  adjSecs: number
  level: 'none' | 'mild' | 'moderate' | 'high' | 'extreme'
  label: string
  color: string
}

export function calcHeatAdj(feelsLikeC: number, humidity: number): HeatAdjustment {
  const humidPenalty = humidity > 80 ? 12 : humidity > 70 ? 6 : 0
  if (feelsLikeC >= 35)
    return { adjSecs: 65 + humidPenalty, level: 'extreme', label: 'Extreme heat — run at dawn/dusk only, cut distance', color: '#ef4444' }
  if (feelsLikeC >= 30)
    return { adjSecs: 40 + humidPenalty, level: 'high', label: `Very hot${humidity > 70 ? ' & humid' : ''} — slow down significantly, hydrate every km`, color: '#ef4444' }
  if (feelsLikeC >= 25)
    return { adjSecs: 22 + humidPenalty, level: 'moderate', label: `Hot${humidity > 75 ? ' & humid' : ''} — run by feel, not pace`, color: 'var(--warn)' }
  if (feelsLikeC >= 20)
    return { adjSecs: 10 + humidPenalty, level: 'mild', label: 'Warm — slight pace adjustment recommended', color: 'var(--warn)' }
  return { adjSecs: 0, level: 'none', label: 'Good conditions — no adjustment needed', color: 'var(--accent)' }
}

const CACHE_KEY = 'weatherCache'
const CACHE_TTL = 30 * 60 * 1000 // 30 min

function loadCached(): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts < CACHE_TTL) return data as WeatherData
  } catch { /* */ }
  return null
}

function saveCache(data: WeatherData) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })) } catch { /* */ }
}

function weatherIcon(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '⛅'
  if (code <= 3) return '☁️'
  if (code <= 49) return '🌫️'
  if (code <= 67) return '🌧️'
  if (code <= 77) return '❄️'
  if (code <= 82) return '🌦️'
  return '⛈️'
}

function weatherDesc(code: number): string {
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 49) return 'Foggy'
  if (code <= 59) return 'Drizzle'
  if (code <= 67) return 'Rain'
  if (code <= 77) return 'Snow'
  if (code <= 82) return 'Rain showers'
  return 'Thunderstorm'
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(loadCached)
  const [loading, setLoading] = useState(false)
  const [permissionDenied, setPermissionDenied] = useState(false)

  useEffect(() => {
    if (loadCached()) return
    if (!navigator.geolocation) return
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude.toFixed(4)}&longitude=${coords.longitude.toFixed(4)}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code&timezone=auto`
          const res = await fetch(url)
          const json = await res.json()
          const c = json.current
          const data: WeatherData = {
            tempC: Math.round(c.temperature_2m),
            feelsLikeC: Math.round(c.apparent_temperature),
            humidity: Math.round(c.relative_humidity_2m),
            description: weatherDesc(c.weather_code),
            icon: weatherIcon(c.weather_code),
          }
          saveCache(data)
          setWeather(data)
        } catch { /* silent */ }
        finally { setLoading(false) }
      },
      () => { setPermissionDenied(true); setLoading(false) },
      { timeout: 8000, maximumAge: 300000 }
    )
  }, [])

  return { weather, loading, permissionDenied }
}
