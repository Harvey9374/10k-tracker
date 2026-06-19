import React from 'react';
import { OutfitLog, WardrobeItem } from '../types';

interface Props {
  logs: OutfitLog[];
  items: WardrobeItem[];
  onToggleFavourite: (id: string) => void;
}

export function FavouritesView({ logs, items, onToggleFavourite }: Props) {
  const favourites = logs.filter(l => l.favourite);
  const itemMap = new Map(items.map(i => [i.id, i]));

  if (favourites.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 60, fontSize: 14 }}>
        No favourites yet. Star an outfit to save it here!
      </div>
    );
  }

  return (
    <div>
      {favourites.map(log => {
        const ids = [
          log.combo.baseLayerId,
          log.combo.topId,
          log.combo.outerwearId,
          log.combo.bottomsId,
          log.combo.shoesId,
          ...log.combo.accessoryIds,
        ].filter(Boolean) as string[];
        const outfitItems = ids.map(id => itemMap.get(id)).filter(Boolean) as WardrobeItem[];
        const activityLabel = log.activity.replace('day-with-zoe:', 'Day with Zoe — ').replace('custom:', '').replace(/-/g, ' ');

        return (
          <div key={log.id} style={{
            background: 'var(--surface)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
            border: '1px solid var(--accent)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{log.date}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'capitalize', marginTop: 2 }}>{activityLabel}</div>
              </div>
              <button
                onClick={() => onToggleFavourite(log.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: 'var(--accent)' }}
              >
                ★
              </button>
            </div>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {outfitItems.map(item => (
                <img
                  key={item.id}
                  src={item.imageData}
                  alt={item.description || item.filename}
                  style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 8, flexShrink: 0, border: '1px solid var(--border)' }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
