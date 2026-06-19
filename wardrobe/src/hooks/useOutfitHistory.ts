import { useState, useEffect, useCallback } from 'react';
import { OutfitLog } from '../types';
import { getAllLogs, saveLog, deleteLog, getFavouriteLogs } from '../db';

export function useOutfitHistory() {
  const [logs, setLogs] = useState<OutfitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const all = await getAllLogs();
    const sorted = all.sort((a, b) => b.date.localeCompare(a.date));
    setLogs(sorted);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addLog = useCallback(async (log: OutfitLog) => {
    await saveLog(log);
    await refresh();
  }, [refresh]);

  const updateLog = useCallback(async (log: OutfitLog) => {
    await saveLog(log);
    await refresh();
  }, [refresh]);

  const removeLog = useCallback(async (id: string) => {
    await deleteLog(id);
    await refresh();
  }, [refresh]);

  const toggleFavourite = useCallback(async (id: string) => {
    const log = logs.find(l => l.id === id);
    if (!log) return;
    await saveLog({ ...log, favourite: !log.favourite });
    await refresh();
  }, [logs, refresh]);

  const confirmOutfit = useCallback(async (id: string) => {
    const log = logs.find(l => l.id === id);
    if (!log) return;
    await saveLog({ ...log, confirmed: true });
    await refresh();
  }, [logs, refresh]);

  const getFavourites = useCallback(() => getFavouriteLogs(), []);

  return { logs, loading, refresh, addLog, updateLog, removeLog, toggleFavourite, confirmOutfit, getFavourites };
}
