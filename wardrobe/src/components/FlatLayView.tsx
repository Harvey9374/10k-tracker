import React from 'react';
import { OutfitCombo, WardrobeItem } from '../types';

interface Props {
  combo: OutfitCombo;
  items: WardrobeItem[];
  onClose: () => void;
}

const CATEGORY_ORDER = ['vest', 'tee', 'shirt', 'outerwear', 'shorts', 'trousers', 'shoes', 'accessory', 'other'];

export function FlatLayView({ combo, items, onClose }: Props) {
  const itemMap = new Map(items.map(i => [i.id, i]));

  const ids = [
    combo.baseLayerId,
    combo.topId,
    combo.outerwearId,
    combo.bottomsId,
    combo.shoesId,
    ...combo.accessoryIds,
  ].filter(Boolean) as string[];

  const outfitItems = ids
    .map(id => itemMap.get(id))
    .filter(Boolean) as WardrobeItem[];

  const sorted = [...outfitItems].sort((a, b) =>
    CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 300,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
    }} onClick={onClose}>
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          padding: '60px 20px 40px',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: 20 }}>Flat Lay View</h2>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', color: '#fff', fontSize: 14 }}>Close</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
          {sorted.map(item => (
            <div key={item.id} style={{ width: '100%', maxWidth: 320 }}>
              <img
                src={item.imageData}
                alt={item.description || item.filename}
                style={{
                  width: '100%',
                  borderRadius: 12,
                  display: 'block',
                  objectFit: 'contain',
                  maxHeight: 300,
                  background: 'rgba(255,255,255,0.05)',
                }}
              />
              <div style={{ textAlign: 'center', marginTop: 8, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                {item.description || item.filename} <span style={{ color: 'var(--accent)', textTransform: 'capitalize' }}>({item.category})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
