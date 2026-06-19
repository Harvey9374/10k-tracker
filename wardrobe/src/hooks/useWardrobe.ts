import { useState, useEffect, useCallback } from 'react';
import { WardrobeItem } from '../types';
import { getAllItems, saveItem, deleteItem } from '../db';

export function useWardrobe() {
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const all = await getAllItems();
    setItems(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(async (item: WardrobeItem) => {
    await saveItem(item);
    await refresh();
  }, [refresh]);

  const updateItem = useCallback(async (item: WardrobeItem) => {
    await saveItem(item);
    await refresh();
  }, [refresh]);

  const removeItem = useCallback(async (id: string) => {
    await deleteItem(id);
    await refresh();
  }, [refresh]);

  return { items, loading, refresh, addItem, updateItem, removeItem };
}
