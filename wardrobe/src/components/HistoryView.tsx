import React from 'react';
import { OutfitLog, WardrobeItem } from '../types';

interface Props {
  logs: OutfitLog[];
  items: WardrobeItem[];
  onToggleFavourite: (id: string) => void;
  onConfirm: (id: string) => void;
}

export function HistoryView({ logs, items, onToggleFavourite, onConfirm }: Props) {
  const itemMap = new Map(items.map(i => [i.id, i]));

  const getComboItems = (log: OutfitLog): WardrobeItem[] => {
    const ids = [
      log.combo.baseLayerId,
      log.combo.topId,
      log.combo.outerwearId,
      log.combo.bottomsId,
      log.combo.shoesId,
      ...log.combo.accessoryIds,
    ].filter(Boolean) as string[];
    return ids.map(id => itemMap.get(id)).filter(Boolean) as WardrobeItem[];
  };

  if (logs.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 60, fontSize: 14 }}>
        No outfit history yet. Confirm some outfits to build history!
      </div>
    );
  }

  return (
    <div>
      {logs.map(log => {
        const outfitItems = getComboItems(log);
        const activityLabel = log.activity.replace('day-with-zoe:', 'Day with Zoe — ').replace('custom:', '').replace(/-/g, ' ');
        return (
          <div key={log.id} style={{
            background: 'var(--surface)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
            border: `1px solid ${log.confirmed ? 'var(--border)' : 'var(--border)'}`,
            opacity: log.confirmed ? 1 : 0.7,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{log.date}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'capitalize', marginTop: 2 }}>{activityLabel}</div>
                {log.temperature != null && (
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{log.temperature}°C {log.conditions}</div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => onToggleFavourite(log.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: log.favourite ? 'var(--accent)' : 'var(--muted)' }}
                >
                  {log.favourite ? '★' : '☆'}
                </button>
                {!log.confirmed && (
                  <button
                    onClick={() => onConfirm(log.id)}
                    style={{ padding: '4px 10px', background: 'var(--accent)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600, color: '#000' }}
                  >
                    ✓ Wore this
                  </button>
                )}
                {log.confirmed && <span style={{ fontSize: 11, color: '#2a7a2a', fontWeight: 600 }}>✓ Worn</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {outfitItems.map(item => (
                <img
                  key={item.id}
                  src={item.imageData}
                  alt={item.description || item.filename}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, flexShrink: 0, border: '1px solid var(--border)' }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
