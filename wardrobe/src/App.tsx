import React, { useState, useEffect } from 'react';
import { useWardrobe } from './hooks/useWardrobe';
import { useOutfitHistory } from './hooks/useOutfitHistory';
import { useWeather } from './hooks/useWeather';
import { useGoogleDriveSync } from './hooks/useGoogleDriveSync';
import { generateOutfits, surpriseOutfit, getAlternatives, uuid } from './outfitEngine';
import { OutfitCombo, OutfitLog, WardrobeItem } from './types';
import { ActivityPicker } from './components/ActivityPicker';
import { WeatherWidget } from './components/WeatherWidget';
import { OutfitCard } from './components/OutfitCard';
import { WardrobeManager } from './components/WardrobeManager';
import { HistoryView } from './components/HistoryView';
import { FavouritesView } from './components/FavouritesView';
import { PackingList } from './components/PackingList';
import { FlatLayView } from './components/FlatLayView';
import { NotificationSetup } from './components/NotificationSetup';
import { SyncButton } from './components/SyncButton';
import { saveItem, deleteItem, saveLog } from './db';

type Tab = 'today' | 'wardrobe' | 'history' | 'favourites' | 'packing';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'today', icon: '👔', label: 'Today' },
  { id: 'wardrobe', icon: '🗄️', label: 'Wardrobe' },
  { id: 'history', icon: '📅', label: 'History' },
  { id: 'favourites', icon: '★', label: 'Favourites' },
  { id: 'packing', icon: '🧳', label: 'Packing' },
];

export function App() {
  const [tab, setTab] = useState<Tab>('today');
  const [activity, setActivity] = useState('errands');
  const [customText, setCustomText] = useState('');
  const [outfits, setOutfits] = useState<OutfitCombo[]>([]);
  const [outfitLogs, setOutfitLogs] = useState<OutfitLog[]>([]);
  const [flatLayCombo, setFlatLayCombo] = useState<OutfitCombo | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const { items, loading: wardrobeLoading, addItem, updateItem, removeItem, refresh: refreshWardrobe } = useWardrobe();
  const { logs, addLog, updateLog, removeLog, toggleFavourite, confirmOutfit, refresh: refreshLogs } = useOutfitHistory();
  const driveSync = useGoogleDriveSync();
  const {
    weather, loading: weatherLoading, error: weatherError,
    lat, lon, targetHour, needsTimePrompt,
    updateLocation, setTargetHour, confirmTargetHour,
  } = useWeather();

  // Generate outfits when activity or weather changes (after initial load)
  const generate = () => {
    if (items.length === 0) return;
    const combos = generateOutfits(items, logs, weather, activity, 3);
    setOutfits(combos);
    setHasGenerated(true);

    // Create pending log entries for these outfits
    const today = new Date().toISOString().slice(0, 10);
    const newLogs: OutfitLog[] = combos.map(combo => ({
      id: uuid(),
      date: today,
      activity,
      combo,
      confirmed: false,
      favourite: false,
      temperature: weather?.temperature,
      conditions: weather?.label,
    }));
    setOutfitLogs(newLogs);
  };

  const handleSurprise = () => {
    const combo = surpriseOutfit(items);
    if (!combo) return;
    setOutfits([combo]);
    setHasGenerated(true);
    const today = new Date().toISOString().slice(0, 10);
    setOutfitLogs([{
      id: uuid(),
      date: today,
      activity: 'surprise-me',
      combo,
      confirmed: false,
      favourite: false,
      temperature: weather?.temperature,
      conditions: weather?.label,
    }]);
  };

  const handleSwap = (outfitIndex: number, category: string, newItemId: string) => {
    const updated = [...outfits];
    const combo = { ...updated[outfitIndex] };
    const item = items.find(i => i.id === newItemId);
    if (!item) return;

    if (category === 'shoes') combo.shoesId = newItemId;
    else if (category === 'shirt' || category === 'tee') combo.topId = newItemId;
    else if (category === 'shorts' || category === 'trousers') combo.bottomsId = newItemId;
    else if (category === 'outerwear') combo.outerwearId = newItemId;
    else if (category === 'vest' || category === 'tee') combo.baseLayerId = newItemId;

    updated[outfitIndex] = combo;
    setOutfits(updated);

    // Update log
    const updatedLogs = [...outfitLogs];
    if (updatedLogs[outfitIndex]) {
      updatedLogs[outfitIndex] = { ...updatedLogs[outfitIndex], combo };
      setOutfitLogs(updatedLogs);
    }
  };

  const handleFavourite = async (outfitIndex: number) => {
    const log = outfitLogs[outfitIndex];
    if (!log) return;
    const existing = logs.find(l => l.id === log.id);
    if (existing) {
      await toggleFavourite(log.id);
    } else {
      const newLog = { ...log, favourite: !log.favourite };
      await addLog(newLog);
      const updatedLogs = [...outfitLogs];
      updatedLogs[outfitIndex] = newLog;
      setOutfitLogs(updatedLogs);
    }
  };

  const handleConfirm = async (outfitIndex: number) => {
    const log = outfitLogs[outfitIndex];
    if (!log) return;
    const confirmed = { ...log, confirmed: true };
    const existing = logs.find(l => l.id === log.id);
    if (existing) {
      await confirmOutfit(log.id);
    } else {
      await addLog(confirmed);
    }
    const updatedLogs = [...outfitLogs];
    updatedLogs[outfitIndex] = confirmed;
    setOutfitLogs(updatedLogs);
  };

  const isLogFavourited = (outfitIndex: number) => {
    const log = outfitLogs[outfitIndex];
    if (!log) return false;
    const existing = logs.find(l => l.id === log.id);
    return existing ? existing.favourite : log.favourite;
  };

  const isLogConfirmed = (outfitIndex: number) => {
    const log = outfitLogs[outfitIndex];
    if (!log) return false;
    const existing = logs.find(l => l.id === log.id);
    return existing ? existing.confirmed : log.confirmed;
  };

  const handleDriveSave = () => driveSync.save(items, logs);

  const handleDriveLoad = async () => {
    const data = await driveSync.load();
    if (!data) { alert('No backup found on Google Drive.'); return; }
    // Write all items and logs into IndexedDB then refresh
    for (const item of data.items) await saveItem(item);
    for (const log of data.logs) await saveLog(log);
    await refreshWardrobe();
    await refreshLogs();
    alert(`Loaded ${data.items.length} items and ${data.logs.length} logs from Google Drive.`);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)', letterSpacing: -0.5 }}>
            👔 Wardrobe
          </h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <SyncButton
              status={driveSync.status}
              lastSynced={driveSync.lastSynced}
              configured={driveSync.configured}
              onSave={handleDriveSave}
              onLoad={handleDriveLoad}
            />
          {tab === 'today' && !wardrobeLoading && items.length > 0 && (
            <button
              onClick={handleSurprise}
              style={{
                padding: '6px 14px',
                background: 'none',
                border: '1px solid var(--accent)',
                borderRadius: 20,
                cursor: 'pointer',
                fontSize: 12,
                color: 'var(--accent)',
                fontWeight: 600,
              }}
            >
              🎲 Surprise me
            </button>
          )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="app-content">
        {tab === 'today' && (
          <div>
            <NotificationSetup />
            <WeatherWidget
              weather={weather}
              loading={weatherLoading}
              error={weatherError}
              lat={lat}
              lon={lon}
              targetHour={targetHour}
              needsTimePrompt={needsTimePrompt}
              onUpdateLocation={updateLocation}
              onSetTargetHour={setTargetHour}
              onConfirmTargetHour={confirmTargetHour}
            />

            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                What's the occasion?
              </h2>
              <ActivityPicker
                selected={activity}
                onSelect={setActivity}
                customText={customText}
                onCustomText={setCustomText}
              />
            </div>

            <button
              onClick={generate}
              disabled={items.length === 0}
              style={{
                width: '100%',
                padding: '14px',
                background: items.length === 0 ? 'var(--surface)' : 'var(--accent)',
                border: 'none',
                borderRadius: 12,
                cursor: items.length === 0 ? 'default' : 'pointer',
                fontWeight: 800,
                fontSize: 16,
                color: items.length === 0 ? 'var(--muted)' : '#000',
                marginBottom: 20,
                letterSpacing: 0.5,
              }}
            >
              {items.length === 0 ? 'Add items to wardrobe first' : '✨ Generate Outfits'}
            </button>

            {hasGenerated && outfits.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 40, fontSize: 14 }}>
                Not enough items to build an outfit. Add more clothes to your wardrobe!
              </div>
            )}

            {outfits.map((combo, idx) => (
              <OutfitCard
                key={idx}
                combo={combo}
                items={items}
                rank={idx + 1}
                weather={weather}
                activity={activity}
                onSwap={(cat, newId) => handleSwap(idx, cat, newId)}
                onFavourite={() => handleFavourite(idx)}
                onConfirm={() => handleConfirm(idx)}
                isFavourited={isLogFavourited(idx)}
                isConfirmed={isLogConfirmed(idx)}
                onRegenerate={generate}
                onFlatLay={() => setFlatLayCombo(combo)}
              />
            ))}
          </div>
        )}

        {tab === 'wardrobe' && (
          <WardrobeManager
            items={items}
            onAdd={addItem}
            onUpdate={updateItem}
            onDelete={removeItem}
          />
        )}

        {tab === 'history' && (
          <HistoryView
            logs={logs}
            items={items}
            onToggleFavourite={toggleFavourite}
            onConfirm={confirmOutfit}
          />
        )}

        {tab === 'favourites' && (
          <FavouritesView
            logs={logs}
            items={items}
            onToggleFavourite={toggleFavourite}
          />
        )}

        {tab === 'packing' && (
          <PackingList
            items={items}
            logs={logs}
            weather={weather}
          />
        )}
      </main>

      {/* Tab bar */}
      <nav className="tab-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Flat-lay overlay */}
      {flatLayCombo && (
        <FlatLayView
          combo={flatLayCombo}
          items={items}
          onClose={() => setFlatLayCombo(null)}
        />
      )}
    </div>
  );
}
