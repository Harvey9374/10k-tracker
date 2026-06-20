import { useState, useCallback, useEffect } from 'react';
import { WardrobeItem, OutfitLog } from '../types';

const SCOPES = 'https://www.googleapis.com/auth/drive.appdata';
const METADATA_FILENAME = 'wardrobe-backup.json';

export type SyncStatus = 'idle' | 'signing-in' | 'syncing' | 'done' | 'error';

interface BackupData {
  items: WardrobeItem[];
  logs: OutfitLog[];
  savedAt: string;
}

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient(config: {
            client_id: string;
            scope: string;
            callback: (resp: { access_token?: string; error?: string }) => void;
          }): { requestAccessToken(): void };
        };
      };
    };
  }
}

let accessToken: string | null = null;
let clientIdCache: string | null = null;

async function fetchClientId(): Promise<string | null> {
  if (clientIdCache) return clientIdCache;
  try {
    const res = await fetch('/.netlify/functions/get-config');
    if (!res.ok) return null;
    const data = await res.json();
    clientIdCache = data.googleClientId ?? null;
    return clientIdCache;
  } catch {
    return null;
  }
}

function loadGsiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
}

async function getAccessToken(): Promise<string> {
  if (accessToken) return accessToken;
  const CLIENT_ID = await fetchClientId();
  if (!CLIENT_ID) throw new Error('Google Client ID not configured');

  await loadGsiScript();

  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID!,
      scope: SCOPES,
      callback: (resp) => {
        if (resp.error || !resp.access_token) {
          reject(new Error(resp.error ?? 'Auth failed'));
        } else {
          accessToken = resp.access_token;
          resolve(resp.access_token);
        }
      },
    });
    client.requestAccessToken();
  });
}

async function driveRequest(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken();
  return fetch(`https://www.googleapis.com/drive/v3/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
  });
}

async function findBackupFile(): Promise<string | null> {
  const res = await driveRequest(
    `files?spaces=appDataFolder&q=name='${METADATA_FILENAME}'&fields=files(id)`
  );
  const data = await res.json();
  return data.files?.[0]?.id ?? null;
}

async function uploadBackup(data: BackupData, existingId: string | null): Promise<void> {
  const body = JSON.stringify(data);
  const blob = new Blob([body], { type: 'application/json' });

  if (existingId) {
    // Update existing file
    await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: blob,
      }
    );
  } else {
    // Create new file in appDataFolder
    const meta = JSON.stringify({ name: METADATA_FILENAME, parents: ['appDataFolder'] });
    const form = new FormData();
    form.append('metadata', new Blob([meta], { type: 'application/json' }));
    form.append('file', blob);
    await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: form,
      }
    );
  }
}

async function downloadBackup(fileId: string): Promise<BackupData> {
  const res = await driveRequest(`files/${fileId}?alt=media`);
  return res.json();
}

export function useGoogleDriveSync() {
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [lastSynced, setLastSynced] = useState<string | null>(
    localStorage.getItem('wardrobe_last_synced')
  );
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    fetchClientId().then(id => setConfigured(!!id));
  }, []);

  const save = useCallback(async (items: WardrobeItem[], logs: OutfitLog[]) => {
    setStatus('signing-in');
    try {
      const token = await getAccessToken();
      if (!token) throw new Error('Not signed in');
      setStatus('syncing');
      const existingId = await findBackupFile();
      await uploadBackup({ items, logs, savedAt: new Date().toISOString() }, existingId);
      const ts = new Date().toLocaleTimeString();
      localStorage.setItem('wardrobe_last_synced', ts);
      setLastSynced(ts);
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (e) {
      console.error('Drive save error:', e);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }, []);

  const load = useCallback(async (): Promise<BackupData | null> => {
    setStatus('signing-in');
    try {
      await getAccessToken();
      setStatus('syncing');
      const fileId = await findBackupFile();
      if (!fileId) {
        setStatus('idle');
        return null;
      }
      const data = await downloadBackup(fileId);
      const ts = new Date().toLocaleTimeString();
      localStorage.setItem('wardrobe_last_synced', ts);
      setLastSynced(ts);
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
      return data;
    } catch (e) {
      console.error('Drive load error:', e);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
      return null;
    }
  }, []);

  return { save, load, status, lastSynced, configured };
}
