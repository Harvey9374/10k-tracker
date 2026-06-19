import React, { useState } from 'react';
import { WardrobeItem, OutfitLog, WeatherData, OutfitCombo } from '../types';
import { generateOutfits } from '../outfitEngine';

interface Props {
  items: WardrobeItem[];
  logs: OutfitLog[];
  weather: WeatherData | null;
}

interface DayPlan {
  day: number;
  combo: OutfitCombo;
}

export function PackingList({ items, logs, weather }: Props) {
  const [tripName, setTripName] = useState('');
  const [days, setDays] = useState(3);
  const [activity, setActivity] = useState('errands');
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [generated, setGenerated] = useState(false);

  const itemMap = new Map(items.map(i => [i.id, i]));

  const generate = () => {
    const allCombos: DayPlan[] = [];
    const usedKeys = new Set<string>();

    for (let d = 1; d <= days; d++) {
      const fakeLogs: OutfitLog[] = allCombos.map((dp, i) => ({
        id: `fake-${i}`,
        date: new Date(Date.now() - (days - i) * 86400000).toISOString().slice(0, 10),
        activity,
        combo: dp.combo,
        confirmed: true,
        favourite: false,
      }));

      const outfits = generateOutfits(items, [...logs, ...fakeLogs], weather, activity, 5);
      const unique = outfits.find(o => {
        const key = [o.baseLayerId, o.topId, o.outerwearId, o.bottomsId, o.shoesId].join('|');
        return !usedKeys.has(key);
      });
      if (unique) {
        const key = [unique.baseLayerId, unique.topId, unique.outerwearId, unique.bottomsId, unique.shoesId].join('|');
        usedKeys.add(key);
        allCombos.push({ day: d, combo: unique });
      }
    }

    setPlan(allCombos);
    setGenerated(true);
  };

  const exportText = () => {
    const lines: string[] = [`Packing List: ${tripName || 'Trip'} (${days} days)`, ''];
    for (const dp of plan) {
      lines.push(`Day ${dp.day}:`);
      const ids = [dp.combo.baseLayerId, dp.combo.topId, dp.combo.outerwearId, dp.combo.bottomsId, dp.combo.shoesId, ...dp.combo.accessoryIds].filter(Boolean) as string[];
      for (const id of ids) {
        const item = itemMap.get(id);
        if (item) lines.push(`  - ${item.description || item.filename} (${item.category})`);
      }
      lines.push('');
    }

    // Unique items needed
    const allIds = new Set(plan.flatMap(dp => [
      dp.combo.baseLayerId, dp.combo.topId, dp.combo.outerwearId,
      dp.combo.bottomsId, dp.combo.shoesId, ...dp.combo.accessoryIds
    ].filter(Boolean) as string[]));

    lines.push('--- Packing List ---');
    for (const id of allIds) {
      const item = itemMap.get(id);
      if (item) lines.push(`☐ ${item.description || item.filename}`);
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `packing-${tripName || 'trip'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ background: 'var(--surface)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Plan a Trip</h3>

        <label style={labelStyle}>Trip Name</label>
        <input
          type="text"
          value={tripName}
          onChange={e => setTripName(e.target.value)}
          placeholder="e.g. Paris Weekend"
          style={inputStyle}
        />

        <label style={labelStyle}>Number of Days</label>
        <input
          type="number"
          min={1}
          max={14}
          value={days}
          onChange={e => setDays(parseInt(e.target.value) || 1)}
          style={inputStyle}
        />

        <label style={labelStyle}>Primary Activity</label>
        <select value={activity} onChange={e => setActivity(e.target.value)} style={inputStyle}>
          <option value="errands">Errands</option>
          <option value="smart-casual-out">Smart Casual</option>
          <option value="walk">Walking</option>
          <option value="beach">Beach</option>
          <option value="lounging">Lounging</option>
        </select>

        <button onClick={generate} style={{ width: '100%', padding: '12px', background: 'var(--accent)', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 15, color: '#000', marginTop: 8 }}>
          Generate Plan
        </button>
      </div>

      {generated && plan.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>{tripName || 'Trip'} — {days} days</h3>
            <button onClick={exportText} style={{ padding: '6px 12px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 12, color: 'var(--text)' }}>
              Export ↓
            </button>
          </div>

          {plan.map(dp => {
            const ids = [dp.combo.baseLayerId, dp.combo.topId, dp.combo.outerwearId, dp.combo.bottomsId, dp.combo.shoesId, ...dp.combo.accessoryIds].filter(Boolean) as string[];
            const outfitItems = ids.map(id => itemMap.get(id)).filter(Boolean) as WardrobeItem[];
            return (
              <div key={dp.day} style={{ background: 'var(--surface)', borderRadius: 10, padding: 14, marginBottom: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: 'var(--accent)' }}>Day {dp.day}</div>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
                  {outfitItems.map(item => (
                    <div key={item.id} style={{ flexShrink: 0, textAlign: 'center' }}>
                      <img src={item.imageData} alt={item.description} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)', display: 'block' }} />
                      <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 2 }}>{item.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: 'var(--muted)',
  marginBottom: 4,
  marginTop: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '10px 12px',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 14,
  boxSizing: 'border-box',
};
