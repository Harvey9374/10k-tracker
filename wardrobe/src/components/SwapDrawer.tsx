import React from 'react';
import { WardrobeItem } from '../types';

interface Props {
  category: string;
  currentId: string;
  items: WardrobeItem[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function SwapDrawer({ category, currentId, items, onSelect, onClose }: Props) {
  const alternatives = items.filter(
    i => i.category === category && i.id !== currentId && i.status !== 'retired' && i.status !== 'dirty'
  );

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      borderRadius: '20px 20px 0 0',
      padding: 16,
      zIndex: 100,
      maxHeight: '60vh',
      overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15, textTransform: 'capitalize' }}>Swap {category}</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 18 }}>✕</button>
      </div>
      {alternatives.length === 0 ? (
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>No alternatives available.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {alternatives.map(item => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                background: 'none',
                border: '2px solid var(--border)',
                borderRadius: 10,
                cursor: 'pointer',
                padding: 0,
                overflow: 'hidden',
              }}
            >
              <img
                src={item.imageData}
                alt={item.description || item.filename}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ padding: '4px 6px', fontSize: 10, color: 'var(--muted)', textAlign: 'left', background: 'var(--surface)' }}>
                {item.description || item.filename}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
