import { WardrobeItem, OutfitCombo, OutfitLog, WeatherData } from './types';

function uuid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getUsableItems(items: WardrobeItem[], recentLogs: OutfitLog[]): WardrobeItem[] {
  // Never retired; never dirty; use reserve only if nothing active works
  const active = items.filter(i => i.status === 'active');
  const reserve = items.filter(i => i.status === 'reserve');
  return active.length > 0 ? [...active, ...reserve] : reserve;
}

function getRecentColourCombos(logs: OutfitLog[], items: WardrobeItem[], count: number): Set<string> {
  const itemMap = new Map(items.map(i => [i.id, i]));
  const combos = new Set<string>();
  const recent = logs.slice(0, count);
  for (const log of recent) {
    const ids = [
      log.combo.baseLayerId,
      log.combo.topId,
      log.combo.outerwearId,
      log.combo.bottomsId,
      log.combo.shoesId,
    ].filter(Boolean) as string[];
    const colours = ids.map(id => itemMap.get(id)?.primaryColour).filter(Boolean) as string[];
    if (colours.length >= 2) {
      for (let i = 0; i < colours.length; i++) {
        for (let j = i + 1; j < colours.length; j++) {
          combos.add([colours[i], colours[j]].sort().join('|'));
        }
      }
    }
  }
  return combos;
}

function comboKey(combo: OutfitCombo): string {
  return [
    combo.baseLayerId ?? '',
    combo.topId ?? '',
    combo.outerwearId ?? '',
    combo.bottomsId,
    combo.shoesId,
  ].join('|');
}

function getRecentComboKeys(logs: OutfitLog[]): Set<string> {
  return new Set(logs.filter(l => l.confirmed).slice(0, 5).map(l => comboKey(l.combo)));
}

function temperatureBand(temp: number): 'hot' | 'mild' | 'cold' {
  if (temp > 22) return 'hot';
  if (temp >= 15) return 'mild';
  return 'cold';
}

function formalityLevel(activity: string): 'relaxed' | 'comfortable' | 'practical' | 'smart-casual' {
  switch (activity) {
    case 'beach':
    case 'lounging':
      return 'relaxed';
    case 'school-run':
    case 'errands':
      return 'comfortable';
    case 'walk':
      return 'practical';
    case 'day-with-zoe':
    case 'smart-casual-out':
    default:
      return 'smart-casual';
  }
}

function pick<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function colourConflict(combo: OutfitCombo, items: WardrobeItem[], recentCombos: Set<string>): boolean {
  const itemMap = new Map(items.map(i => [i.id, i]));
  const ids = [combo.baseLayerId, combo.topId, combo.outerwearId, combo.bottomsId, combo.shoesId].filter(Boolean) as string[];
  const colours = ids.map(id => itemMap.get(id)?.primaryColour).filter(Boolean) as string[];
  for (let i = 0; i < colours.length; i++) {
    for (let j = i + 1; j < colours.length; j++) {
      if (recentCombos.has([colours[i], colours[j]].sort().join('|'))) return true;
    }
  }
  return false;
}

export function generateOutfits(
  allItems: WardrobeItem[],
  logs: OutfitLog[],
  weather: WeatherData | null,
  activity: string,
  count: number
): OutfitCombo[] {
  const temp = weather?.temperature ?? 18;
  const band = temperatureBand(temp);
  const formality = formalityLevel(activity);
  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  const recentConfirmed = sortedLogs.filter(l => l.confirmed);
  const usable = getUsableItems(allItems, recentConfirmed);
  const recentColours = getRecentColourCombos(recentConfirmed, allItems, 3);
  const recentKeys = getRecentComboKeys(recentConfirmed);

  const byCategory = (cat: string) => usable.filter(i => i.category === cat);

  const vests = byCategory('vest');
  const tees = byCategory('tee');
  const shirts = byCategory('shirt');
  const shorts = byCategory('shorts');
  const trousers = byCategory('trousers');
  const shoes = byCategory('shoes');
  const outerwear = byCategory('outerwear');
  const accessories = byCategory('accessory');

  const results: OutfitCombo[] = [];
  const usedKeys = new Set<string>();

  // Try to generate `count * 10` candidates and pick best
  const candidates: { combo: OutfitCombo; score: number }[] = [];

  for (let attempt = 0; attempt < count * 20; attempt++) {
    let bottoms: WardrobeItem | undefined;
    let baseLayer: WardrobeItem | undefined;
    let top: WardrobeItem | undefined;
    let outer: WardrobeItem | undefined;
    let shoe: WardrobeItem | undefined;
    let accIds: string[] = [];

    // Pick bottoms
    if (band === 'hot' && formality !== 'smart-casual') {
      bottoms = pick(shorts.length > 0 ? shorts : trousers);
    } else if (band === 'cold' || formality === 'smart-casual') {
      bottoms = pick(trousers.length > 0 ? trousers : shorts);
    } else {
      const pool = [...shorts, ...trousers];
      bottoms = pick(pool);
    }
    if (!bottoms) continue;

    // Pick base layer
    if (band === 'hot') {
      baseLayer = pick([...vests, ...tees]);
    } else {
      baseLayer = pick(tees);
    }

    // Pick top layer (shirt or outerwear as open layer)
    if (band !== 'hot' || formality === 'smart-casual') {
      if (formality === 'smart-casual') {
        top = pick(shirts);
      } else {
        top = pick([...shirts, ...outerwear.slice(0, 2)]);
      }
    } else if (Math.random() > 0.5) {
      top = pick(shirts);
    }

    // Outerwear if cold
    if (band === 'cold') {
      outer = pick(outerwear);
      if (!outer) continue; // rule: cold requires outerwear
    }

    // Shoes
    if (formality === 'relaxed' || formality === 'practical') {
      shoe = pick(shoes);
    } else {
      shoe = pick(shoes);
    }
    if (!shoe) continue;

    // Accessories (optional, max 1)
    if (accessories.length > 0 && Math.random() > 0.5) {
      const acc = pick(accessories);
      if (acc) accIds = [acc.id];
    }

    // Need at least a base layer or top
    if (!baseLayer && !top) continue;

    const combo: OutfitCombo = {
      baseLayerId: baseLayer?.id,
      topId: top?.id,
      outerwearId: outer?.id,
      bottomsId: bottoms.id,
      shoesId: shoe.id,
      accessoryIds: accIds,
    };

    const key = comboKey(combo);
    if (usedKeys.has(key)) continue;

    let score = 100;
    if (recentKeys.has(key)) score -= 50;
    if (colourConflict(combo, allItems, recentColours)) score -= 20;

    candidates.push({ combo, score });
    usedKeys.add(key);
  }

  // Sort by score desc and pick top `count`
  candidates.sort((a, b) => b.score - a.score);

  for (const { combo } of candidates.slice(0, count)) {
    results.push(combo);
  }

  // If we don't have enough, fill with random valid combos
  while (results.length < count) {
    const bottom = pick([...trousers, ...shorts]);
    const base = pick([...tees, ...vests]);
    const shoe = pick(shoes);
    if (!bottom || !shoe) break;
    results.push({
      baseLayerId: base?.id,
      bottomsId: bottom.id,
      shoesId: shoe.id,
      accessoryIds: [],
    });
  }

  return results;
}

export function surpriseOutfit(items: WardrobeItem[]): OutfitCombo | null {
  const usable = items.filter(i => i.status === 'active' || i.status === 'reserve');
  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const bottoms = pick(usable.filter(i => i.category === 'shorts' || i.category === 'trousers'));
  const base = pick(usable.filter(i => i.category === 'tee' || i.category === 'vest'));
  const shoe = pick(usable.filter(i => i.category === 'shoes'));
  if (!bottoms || !shoe) return null;
  return {
    baseLayerId: base?.id,
    bottomsId: bottoms.id,
    shoesId: shoe.id,
    accessoryIds: [],
  };
}

export function getAlternatives(
  items: WardrobeItem[],
  category: string,
  currentId: string
): WardrobeItem[] {
  return items.filter(
    i => i.category === category && i.id !== currentId && i.status !== 'retired' && i.status !== 'dirty'
  );
}

export { uuid };
