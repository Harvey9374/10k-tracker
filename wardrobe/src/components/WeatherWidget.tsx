import React, { useState } from 'react';
import { WeatherData } from '../types';

interface Props {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  lat: number;
  lon: number;
  targetHour: number;
  needsTimePrompt: boolean;
  onUpdateLocation: (lat: number, lon: number) => void;
  onSetTargetHour: (h: number) => void;
  onConfirmTargetHour: () => void;
}

const TIME_OPTIONS = [
  { label: 'Now', offsetHours: 0 },
  { label: 'In 1 hr', offsetHours: 1 },
  { label: 'In 2 hrs', offsetHours: 2 },
  { label: 'This evening (~19:00)', fixedHour: 19 },
] as const;

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

function fmt12(hour: number): string {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? 'am' : 'pm';
  return `${h}:00${ampm}`;
}

export function WeatherWidget({
  weather, loading, error, lat, lon,
  targetHour, needsTimePrompt,
  onUpdateLocation, onSetTargetHour, onConfirmTargetHour,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [latInput, setLatInput] = useState(String(lat));
  const [lonInput, setLonInput] = useState(String(lon));
  const [pendingHour, setPendingHour] = useState<number>(new Date().getHours());

  const handleSave = () => {
    const newLat = parseFloat(latInput);
    const newLon = parseFloat(lonInput);
    if (!isNaN(newLat) && !isNaN(newLon)) onUpdateLocation(newLat, newLon);
    setEditing(false);
  };

  const handleTimeOption = (opt: typeof TIME_OPTIONS[number]) => {
    const h = 'fixedHour' in opt ? opt.fixedHour : Math.min(new Date().getHours() + opt.offsetHours, 23);
    setPendingHour(h);
  };

  const handleConfirmTime = () => {
    onSetTargetHour(pendingHour);
    onConfirmTargetHour();
  };

  // Time prompt shown when opened after 13:00
  if (needsTimePrompt) {
    return (
      <div style={{
        background: 'var(--surface)', borderRadius: 12, padding: '16px',
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
          What time are you heading out?
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {TIME_OPTIONS.map(opt => {
            const h = 'fixedHour' in opt ? opt.fixedHour : Math.min(new Date().getHours() + opt.offsetHours, 23);
            const selected = pendingHour === h;
            return (
              <button
                key={opt.label}
                onClick={() => handleTimeOption(opt)}
                style={{
                  textAlign: 'left', padding: '10px 14px',
                  background: selected ? 'var(--accent)' : 'var(--bg)',
                  border: selected ? 'none' : '1px solid var(--border)',
                  borderRadius: 8, cursor: 'pointer',
                  color: selected ? '#000' : 'var(--text)', fontSize: 14,
                  fontWeight: selected ? 600 : 400,
                }}
              >
                {opt.label} <span style={{ opacity: 0.6, fontSize: 12 }}>({fmt12(h)})</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={handleConfirmTime}
          style={{
            width: '100%', padding: '10px', background: 'var(--accent)',
            border: 'none', borderRadius: 8, cursor: 'pointer',
            fontWeight: 700, fontSize: 14, color: '#000',
          }}
        >
          Get forecast for {fmt12(pendingHour)}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 12, padding: '12px 16px',
      marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                💨 {weather.windSpeed} km/h · UV {weather.uvIndex}
                {' · '}<span style={{ color: 'var(--accent)' }}>{fmt12(targetHour)} forecast</span>
              </div>
            </div>
          </>
        )}
      </div>
      <div>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
            <input type="number" placeholder="Lat" value={latInput}
              onChange={e => setLatInput(e.target.value)}
              style={{ width: 90, padding: '4px 8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', fontSize: 12 }} />
            <input type="number" placeholder="Lon" value={lonInput}
              onChange={e => setLonInput(e.target.value)}
              style={{ width: 90, padding: '4px 8px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text)', fontSize: 12 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={handleSave} style={{ padding: '4px 10px', background: 'var(--accent)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: '#000' }}>Save</button>
              <button onClick={() => setEditing(false)} style={{ padding: '4px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--text)' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setEditing(true)}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: 'var(--muted)', fontSize: 11 }}>
            📍 Edit
          </button>
        )}
      </div>
    </div>
  );
}
