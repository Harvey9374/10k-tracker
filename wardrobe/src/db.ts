import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { WardrobeItem, OutfitLog } from './types';

interface WardrobeDB extends DBSchema {
  wardrobe: {
    key: string;
    value: WardrobeItem;
  };
  outfitLogs: {
    key: string;
    value: OutfitLog;
  };
}

let dbPromise: Promise<IDBPDatabase<WardrobeDB>> | null = null;

function getDB(): Promise<IDBPDatabase<WardrobeDB>> {
  if (!dbPromise) {
    dbPromise = openDB<WardrobeDB>('wardrobe-stylist', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('wardrobe')) {
          db.createObjectStore('wardrobe', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('outfitLogs')) {
          db.createObjectStore('outfitLogs', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// Wardrobe CRUD
export async function getAllItems(): Promise<WardrobeItem[]> {
  const db = await getDB();
  return db.getAll('wardrobe');
}

export async function getItem(id: string): Promise<WardrobeItem | undefined> {
  const db = await getDB();
  return db.get('wardrobe', id);
}

export async function saveItem(item: WardrobeItem): Promise<void> {
  const db = await getDB();
  await db.put('wardrobe', item);
}

export async function deleteItem(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('wardrobe', id);
}

// OutfitLog CRUD
export async function getAllLogs(): Promise<OutfitLog[]> {
  const db = await getDB();
  return db.getAll('outfitLogs');
}

export async function getLog(id: string): Promise<OutfitLog | undefined> {
  const db = await getDB();
  return db.get('outfitLogs', id);
}

export async function saveLog(log: OutfitLog): Promise<void> {
  const db = await getDB();
  await db.put('outfitLogs', log);
}

export async function deleteLog(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('outfitLogs', id);
}

export async function getRecentLogs(days: number): Promise<OutfitLog[]> {
  const all = await getAllLogs();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return all
    .filter(l => l.confirmed && new Date(l.date) >= cutoff)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getFavouriteLogs(): Promise<OutfitLog[]> {
  const all = await getAllLogs();
  return all.filter(l => l.favourite).sort((a, b) => b.date.localeCompare(a.date));
}
