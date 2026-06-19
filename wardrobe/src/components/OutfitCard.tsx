import React, { useState } from 'react';
import { OutfitCombo, WardrobeItem, WeatherData } from '../types';
import { SwapDrawer } from './SwapDrawer';

interface Props {
  combo: OutfitCombo;
  items: WardrobeItem[];
  rank: number;
  weather: WeatherData | null;
  activity: string;
  onSwap: (category: string, newItemId: string) => void;
  onFavourite: () => void;
  onConfirm: () => void;
  isFavourited: boolean;
  isConfirmed: boolean;
  onRegenerate: () => void;
  onFlatLay: () => void;
}

function activityRationale(activity: string, weather: WeatherData | null): string {
  const temp = weather ? `${Math.round(weather.temperature)}°C ${weather.label}` : '';
  const base = activity.replace('day-with-zoe:', 'Day with Zoe — ').replace('custom:', '');
  const label = base.replace(/-/g, ' ');
  return temp ? `${temp} · ${label}` : label;
}

export function OutfitCard({
  combo, items, rank, weather, activity,
  onSwap, onFavourite, onConfirm, isFavourited, isConfirmed,
  onRegenerate, onFlatLay
}: Props) {
  const [swapCategory, setSwapCategory] = useState<string | null>(null);
  const itemMap = new Map(items.map(i => [i.id, i]));

  const outfitItems: WardrobeItem[] = [
    combo.baseLayerId ? itemMap.get(combo.baseLayerId) : undefined,
    combo.topId ? itemMap.get(combo.topId) : undefined,
    combo.outerwearId ? itemMap.get(combo.outerwearId) : undefined,
    combo.bottomsId ? itemMap.get(combo.bottomsId) : undefined,
    combo.shoesId ? itemMap.get(combo.shoesId) : undefined,
    ...combo.accessoryIds.map(id => itemMap.get(id)),
  ].filter(Boolean) as WardrobeItem[];

  const rankLabel = ['🥇 Best Match', '🥈 Casual Alt', '🥉 Wild Card'][rank - 1] ?? `Option ${rank}`;

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      border: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1 }}>{rankLabel}</span>
        <button
          onClick={onFlatLay}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: 'var(--muted)', fontSize: 11 }}
        >
          👔 Flat-lay
        </button>
      </div>

      {/* Item grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        marginBottom: 12,
      }}>
        {outfitItems.map(item => (
          <div key={item.id} style={{ position: 'relative' }}>
            <img
              src={item.imageData}
              alt={item.description || item.filename}
              style={{
                width: '100%',
                aspectRatio: '1',
                objectFit: 'cover',
                borderRadius: 8,
                border: '1px solid var(--border)',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 4,
              left: 4,
              background: 'rgba(0,0,0,0.7)',
              borderRadius: 4,
              padding: '2px 5px',
              fontSize: 9,
              color: '#fff',
              textTransform: 'capitalize',
            }}>
              {item.category}
            </div>
          </div>
        ))}
      </div>

      {/* Rationale */}
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.6 }}>
        {activityRationale(activity, weather)}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {combo.topId && (
          <button onClick={() => setSwapCategory('shirt')} style={btnStyle}>↕ Top</button>
        )}
        {combo.bottomsId && (
          <button onClick={() => setSwapCategory(
            items.find(i => i.id === combo.bottomsId)?.category ?? 'shorts'
          )} style={btnStyle}>↕ Bottoms</button>
        )}
        {combo.shoesId && (
          <button onClick={() => setSwapCategory('shoes')} style={btnStyle}>↕ Shoes</button>
        )}
        <button onClick={onRegenerate} style={btnStyle}>♻ All</button>
        <button
          onClick={onFavourite}
          style={{ ...btnStyle, background: isFavourited ? 'var(--accent)' : undefined, color: isFavourited ? '#000' : undefined }}
        >
          {isFavourited ? '★' : '☆'} Fav
        </button>
        <button
          onClick={onConfirm}
          style={{ ...btnStyle, background: isConfirmed ? '#2a7a2a' : undefined, borderColor: isConfirmed ? '#2a7a2a' : undefined }}
        >
          {isConfirmed ? '✓ Worn' : '✓ Confirm'}
        </button>
      </div>

      {/* Swap drawer */}
      {swapCategory && (
        <SwapDrawer
          category={swapCategory}
          currentId={
            swapCategory === 'shoes' ? (combo.shoesId ?? '') :
            swapCategory === 'shirt' ? (combo.topId ?? '') :
            combo.bottomsId
          }
          items={items}
          onSelect={(id) => {
            onSwap(swapCategory, id);
            setSwapCategory(null);
          }}
          onClose={() => setSwapCategory(null)}
        />
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 20,
  padding: '5px 12px',
  cursor: 'pointer',
  fontSize: 12,
  color: 'var(--text)',
};
