import React from 'react';
import { OutfitCombo, WardrobeItem } from '../types';

interface Props {
  combo: OutfitCombo;
  items: WardrobeItem[];
}

const shadow: React.CSSProperties = { filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))' };

export function TryOnView({ combo, items }: Props) {
  const itemMap = new Map(items.map(i => [i.id, i]));

  const cap = combo.capId ? itemMap.get(combo.capId) : undefined;
  const outerwear = combo.outerwearId ? itemMap.get(combo.outerwearId) : undefined;
  const top = combo.topId ? itemMap.get(combo.topId) : undefined;
  const baseLayer = combo.baseLayerId ? itemMap.get(combo.baseLayerId) : undefined;
  const bottoms = itemMap.get(combo.bottomsId);
  const shoes = combo.shoesId ? itemMap.get(combo.shoesId) : undefined;
  const accessories = combo.accessoryIds.map(id => itemMap.get(id)).filter(Boolean) as WardrobeItem[];

  // The torso is shown as one main garment — outerwear if worn, else the top, else the base layer.
  const mainTorso = outerwear ?? top ?? baseLayer;
  const underLayers = [baseLayer, top].filter(
    (i): i is WardrobeItem => !!i && i.id !== mainTorso?.id
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: 280, aspectRatio: '3 / 5' }}>
        <svg viewBox="0 0 300 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <ellipse cx="150" cy="52" rx="36" ry="40" fill="var(--surface2)" stroke="var(--border)" strokeWidth="2" />
          <rect x="138" y="88" width="24" height="20" fill="var(--surface2)" stroke="var(--border)" strokeWidth="1" />
          <path d="M 95 116 Q 150 102 205 116 L 225 238 Q 150 258 75 238 Z" fill="var(--surface2)" stroke="var(--border)" strokeWidth="2" />
          <path d="M 95 118 L 55 228 L 76 240 L 110 143 Z" fill="var(--surface2)" stroke="var(--border)" strokeWidth="2" />
          <path d="M 205 118 L 245 228 L 224 240 L 190 143 Z" fill="var(--surface2)" stroke="var(--border)" strokeWidth="2" />
          <path d="M 100 243 L 92 420 L 130 420 L 145 258 Z" fill="var(--surface2)" stroke="var(--border)" strokeWidth="2" />
          <path d="M 200 243 L 208 420 L 170 420 L 155 258 Z" fill="var(--surface2)" stroke="var(--border)" strokeWidth="2" />
          <ellipse cx="107" cy="434" rx="27" ry="14" fill="var(--surface2)" stroke="var(--border)" strokeWidth="2" />
          <ellipse cx="193" cy="434" rx="27" ry="14" fill="var(--surface2)" stroke="var(--border)" strokeWidth="2" />
        </svg>

        {cap && (
          <img
            src={cap.imageData}
            alt={cap.description || 'cap'}
            style={{ position: 'absolute', top: '-2%', left: '50%', transform: 'translateX(-50%)', width: '32%', objectFit: 'contain', ...shadow }}
          />
        )}

        {mainTorso && (
          <img
            src={mainTorso.imageData}
            alt={mainTorso.description || 'top'}
            style={{ position: 'absolute', top: '17%', left: '50%', transform: 'translateX(-50%)', width: '54%', objectFit: 'contain', ...shadow }}
          />
        )}

        {bottoms && (
          <img
            src={bottoms.imageData}
            alt={bottoms.description || 'bottoms'}
            style={{ position: 'absolute', top: '46%', left: '50%', transform: 'translateX(-50%)', width: '42%', objectFit: 'contain', ...shadow }}
          />
        )}

        {shoes && (
          <img
            src={shoes.imageData}
            alt={shoes.description || 'shoes'}
            style={{ position: 'absolute', top: '82%', left: '50%', transform: 'translateX(-50%)', width: '36%', objectFit: 'contain', ...shadow }}
          />
        )}
      </div>

      {(underLayers.length > 0 || accessories.length > 0) && (
        <div style={{ width: '100%', maxWidth: 280 }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Also worn / layered
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {[...underLayers, ...accessories].map(item => (
              <img
                key={item.id}
                src={item.imageData}
                alt={item.description || item.filename}
                title={item.description || item.filename}
                style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }}
              />
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', maxWidth: 280, lineHeight: 1.5 }}>
        Stylised layout, not a photo — shows exactly which pieces from your wardrobe make up this outfit and roughly how they sit together.
      </p>
    </div>
  );
}
