import React, { useState } from 'react';
import { WardrobeItem, ItemCategory, ItemStatus, ItemPattern } from '../types';

const CATEGORIES: ItemCategory[] = ['vest', 'tee', 'shirt', 'shorts', 'trousers', 'shoes', 'outerwear', 'accessory', 'other'];
const STATUSES: ItemStatus[] = ['active', 'retired', 'reserve', 'dirty'];
const PATTERNS: { value: ItemPattern; label: string }[] = [
  { value: 'plain',   label: 'Plain' },
  { value: 'stripe',  label: 'Stripe' },
  { value: 'check',   label: 'Check / Plaid' },
  { value: 'graphic', label: 'Graphic / Text' },
  { value: 'pattern', label: 'Pattern / Print' },
];

interface Props {
  item: WardrobeItem;
  onSave: (item: WardrobeItem) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export function ItemEditModal({ item, onSave, onClose, onDelete }: Props) {
  const [draft, setDraft] = useState<WardrobeItem>({ ...item });

  const set = <K extends keyof WardrobeItem>(key: K, value: WardrobeItem[K]) => {
    setDraft(d => ({ ...d, [key]: value }));
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
    }} onClick={onClose}>
      <div
        style={{
          background: 'var(--bg)',
          borderRadius: '20px 20px 0 0',
          padding: 20,
          width: '100%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16 }}>Edit Item</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 20 }}>✕</button>
        </div>

        <img src={item.imageData} alt={item.filename} style={{ width: '100%', maxHeight: 180, objectFit: 'contain', borderRadius: 10, marginBottom: 16, background: 'var(--surface)' }} />

        <label style={labelStyle}>Category</label>
        <select value={draft.category} onChange={e => set('category', e.target.value as ItemCategory)} style={inputStyle}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={labelStyle}>Status</label>
        <select value={draft.status} onChange={e => set('status', e.target.value as ItemStatus)} style={inputStyle}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <label style={labelStyle}>Description</label>
        <input type="text" value={draft.description} onChange={e => set('description', e.target.value)} style={inputStyle} />

        <label style={labelStyle}>Primary Colour</label>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <input type="color" value={draft.primaryColour.startsWith('#') ? draft.primaryColour : '#888888'} onChange={e => set('primaryColour', e.target.value)} style={{ width: 40, height: 40, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'none' }} />
          <input type="text" value={draft.primaryColour} onChange={e => set('primaryColour', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} placeholder="e.g. navy, #1a2b3c" />
        </div>

        <label style={labelStyle}>Secondary Colour (optional)</label>
        <input type="text" value={draft.secondaryColour ?? ''} onChange={e => set('secondaryColour', e.target.value || undefined)} style={inputStyle} placeholder="e.g. white stripe" />

        <label style={labelStyle}>Pattern</label>
        <select value={draft.pattern ?? 'plain'} onChange={e => set('pattern', e.target.value as ItemPattern)} style={inputStyle}>
          {PATTERNS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>

        <label style={labelStyle}>Notes</label>
        <textarea
          value={draft.notes}
          onChange={e => set('notes', e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' as const }}
          placeholder="Any notes about this item..."
        />

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button
            onClick={() => onSave(draft)}
            style={{ flex: 1, padding: '12px', background: 'var(--accent)', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 15, color: '#000' }}
          >
            Save
          </button>
          <button
            onClick={() => { if (confirm('Delete this item?')) onDelete(item.id); }}
            style={{ padding: '12px 16px', background: '#8b2222', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 15, color: '#fff' }}
          >
            🗑
          </button>
        </div>
      </div>
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
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--text)',
  fontSize: 14,
  marginBottom: 0,
  boxSizing: 'border-box',
};
