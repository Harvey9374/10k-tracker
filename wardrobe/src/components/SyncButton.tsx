import React from 'react';
import { SyncStatus } from '../hooks/useGoogleDriveSync';

interface Props {
  status: SyncStatus;
  lastSynced: string | null;
  configured: boolean;
  onSave: () => void;
  onLoad: () => void;
}

const LABELS: Record<SyncStatus, string> = {
  idle: '☁ Sync',
  'signing-in': 'Signing in…',
  syncing: 'Syncing…',
  done: '✓ Synced',
  error: '✗ Failed',
};

const COLOURS: Record<SyncStatus, string> = {
  idle: 'var(--surface)',
  'signing-in': 'var(--surface)',
  syncing: 'var(--surface)',
  done: '#1a4a1a',
  error: '#4a1a1a',
};

export function SyncButton({ status, lastSynced, configured, onSave, onLoad }: Props) {
  if (!configured) return null;

  const busy = status === 'signing-in' || status === 'syncing';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {lastSynced && (
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>Last: {lastSynced}</span>
      )}
      <button
        onClick={onLoad}
        disabled={busy}
        title="Load from Google Drive"
        style={{
          padding: '6px 10px',
          background: COLOURS[status],
          border: '1px solid var(--border)',
          borderRadius: 8,
          color: status === 'done' ? '#4caf50' : status === 'error' ? '#f44336' : 'var(--text)',
          fontSize: 12,
          fontWeight: 600,
          cursor: busy ? 'default' : 'pointer',
          opacity: busy ? 0.7 : 1,
          whiteSpace: 'nowrap',
        }}
      >
        {LABELS[status]}
      </button>
      <button
        onClick={onSave}
        disabled={busy}
        title="Save to Google Drive"
        style={{
          padding: '6px 10px',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: 8,
          color: '#000',
          fontSize: 12,
          fontWeight: 700,
          cursor: busy ? 'default' : 'pointer',
          opacity: busy ? 0.7 : 1,
        }}
      >
        ↑ Save
      </button>
    </div>
  );
}
