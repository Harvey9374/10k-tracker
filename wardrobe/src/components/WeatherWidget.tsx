import React, { useState } from 'react';
import { WeatherData } from '../types';

interface Props {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  lat: number;
  lon: number;
  onUpdateLocation: (lat: number, lon: number) => void;
}

function weatherEmoji(code: number): string {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}

export function WeatherWidget({ weather, loading, error, lat, lon, onUpdateLocation }: Props) {
  const [editing, setEditing] = useState(false);
  const [latInput, setLatInput] = useState(String(lat));
  const [lonInput, setLonInput] = useState(String(lon));

  const handleSave = () => {
    const newLat = parseFloat(latInput);
    const newLon = parseFloat(lonInput);
    if (!isNaN(newLat) && !isNaN(newLon)) {
      onUpdateLocation(newLat, newLon);
    }
    setEditing(false);
  };

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 12,
      padding: '12px 16px',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {loading && <span style={{ color: 'var(--muted)', fontSize: 13 }}>Loading weather...</span>}
        {error && <span style={{ color: 'var(--muted)', fontSize: 13 }}>{error}</span>}
        {weather && !loading && (
          <>
            <span style={{ fontSize: 28 }}>{weatherEmoji(weather.weatherCode)}</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{Math.round(weather.temperature)}°C</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{weather.label}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>💨 {weather.windSpeed} km/h · UV {weather.uvIndex}</div>
            </div>
          </>
        )}
      </div>
      <div>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            <input
              type="number"
              placeholder="Lat"
              value={latInput}
              onChange={e => setLatInput(e.target.value)}
              style={{ width: 90, padding: '4px 8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', fontSize: 12 }}
            />
            <input
              type="number"
              placeholder="Lon"
              value={lonInput}
              onChange={e => setLonInput(e.target.value)}
              style={{ width: 90, padding: '4px 8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', fontSize: 12 }}
            />
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={handleSave} style={{ padding: '4px 10px', background: 'var(--accent)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: '#000' }}>Save</button>
              <button onClick={() => setEditing(false)} style={{ padding: '4px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--text)' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: 'var(--muted)', fontSize: 11 }}
          >
            📍 Edit
          </button>
        )}
      </div>
    </div>
  );
}
