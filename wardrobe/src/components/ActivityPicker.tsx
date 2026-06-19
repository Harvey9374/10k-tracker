import React, { useState } from 'react';
import { ACTIVITIES, ActivityId, ZOE_SUB_ACTIVITIES } from '../types';

interface Props {
  selected: string;
  onSelect: (activity: string) => void;
  customText: string;
  onCustomText: (text: string) => void;
}

export function ActivityPicker({ selected, onSelect, customText, onCustomText }: Props) {
  const [zoeSubActivity, setZoeSubActivity] = useState('');

  const handleSelect = (id: ActivityId) => {
    if (id === 'day-with-zoe' && zoeSubActivity) {
      onSelect(`day-with-zoe:${zoeSubActivity}`);
    } else {
      onSelect(id);
    }
  };

  const baseSelected = selected.split(':')[0] as ActivityId;

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: 10,
      }}>
        {ACTIVITIES.map(act => (
          <button
            key={act.id}
            onClick={() => handleSelect(act.id)}
            style={{
              background: baseSelected === act.id ? 'var(--accent)' : 'var(--surface)',
              border: baseSelected === act.id ? '2px solid var(--accent)' : '2px solid var(--border)',
              borderRadius: 12,
              padding: '12px 8px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
              color: baseSelected === act.id ? '#000' : 'var(--text)',
            }}
          >
            <span style={{ fontSize: 28 }}>{act.emoji}</span>
            <span style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', lineHeight: 1.2 }}>
              {act.label}
            </span>
          </button>
        ))}
      </div>

      {baseSelected === 'day-with-zoe' && (
        <div style={{ marginTop: 12 }}>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 8 }}>Sub-activity:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {ZOE_SUB_ACTIVITIES.map(sub => (
              <button
                key={sub}
                onClick={() => {
                  setZoeSubActivity(sub);
                  onSelect(`day-with-zoe:${sub}`);
                }}
                style={{
                  background: selected === `day-with-zoe:${sub}` ? 'var(--accent)' : 'var(--surface)',
                  border: `1px solid ${selected === `day-with-zoe:${sub}` ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 20,
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: selected === `day-with-zoe:${sub}` ? '#000' : 'var(--text)',
                  textTransform: 'capitalize',
                }}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {baseSelected === 'custom' && (
        <div style={{ marginTop: 12 }}>
          <input
            type="text"
            placeholder="Describe your activity..."
            value={customText}
            onChange={e => {
              onCustomText(e.target.value);
              onSelect(`custom:${e.target.value}`);
            }}
            style={{
              width: '100%',
              padding: '10px 14px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text)',
              fontSize: 14,
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}
    </div>
  );
}
