import React, { useState, useEffect } from 'react';

export function NotificationSetup() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [dismissed, setDismissed] = useState(false);
  const [time, setTime] = useState('08:00');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
    const saved = localStorage.getItem('notification_time');
    if (saved) setTime(saved);
    const isEnabled = localStorage.getItem('notifications_enabled') === 'true';
    setEnabled(isEnabled);
    const isDismissed = localStorage.getItem('notification_dismissed') === 'true';
    setDismissed(isDismissed);
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm === 'granted') {
      localStorage.setItem('notifications_enabled', 'true');
      localStorage.setItem('notification_time', time);
      setEnabled(true);
      scheduleNotification(time);
    }
  };

  const scheduleNotification = (notifTime: string) => {
    // Store the time; a real service worker would handle scheduled delivery
    localStorage.setItem('notification_time', notifTime);
    // Demo notification
    if (permission === 'granted') {
      new Notification('Wardrobe Stylist', {
        body: `Good morning! Time to pick your outfit for today.`,
        icon: '/icon-192.png',
      });
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('notification_dismissed', 'true');
  };

  const handleSaveTime = () => {
    localStorage.setItem('notification_time', time);
    if (permission === 'granted') {
      new Notification('Wardrobe Stylist', {
        body: `Morning reminder set for ${time}`,
        icon: '/icon-192.png',
      });
    }
  };

  if (!('Notification' in window) || permission === 'denied' || dismissed) return null;

  if (permission === 'granted' && enabled) {
    return (
      <div style={{
        background: 'var(--surface)',
        borderRadius: 10,
        padding: '10px 14px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        border: '1px solid var(--border)',
        fontSize: 13,
      }}>
        <span>🔔</span>
        <span style={{ flex: 1, color: 'var(--muted)' }}>Morning reminder at {time}</span>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 12 }} />
        <button onClick={handleSaveTime} style={{ padding: '4px 10px', background: 'var(--accent)', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: '#000' }}>Set</button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'var(--surface)',
      borderRadius: 10,
      padding: '12px 14px',
      marginBottom: 16,
      border: '1px solid var(--accent)',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 20 }}>🔔</span>
      <span style={{ flex: 1, fontSize: 13, color: 'var(--text)' }}>Get morning outfit reminders?</span>
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={requestPermission} style={{ padding: '6px 12px', background: 'var(--accent)', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#000' }}>
          Enable
        </button>
        <button onClick={handleDismiss} style={{ padding: '6px 12px', background: 'none', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 12, color: 'var(--muted)' }}>
          Not now
        </button>
      </div>
    </div>
  );
}
