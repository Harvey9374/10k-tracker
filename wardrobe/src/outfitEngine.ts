import { WardrobeItem, OutfitCombo, OutfitLog, WeatherData } from './types';

export function uuid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── Colour compatibility ──────────────────────────────────────────────────────

const NEUTRALS = new Set([
  'white', 'cream', 'ivory', 'off-white',
  'black', 'charcoal',
  'grey', 'gray', 'light grey', 'dark grey',
  'navy', 'navy blue',
  'beige', 'tan', 'khaki', 'stone', 'sand', 'camel',
  'brown', 'chocolate', 'taupe',
  'denim', 'indigo',
]);

// Colours that clash badly when paired together
const CLASHING_PAIRS: [string, string][] = [
  ['red', 'orange'], ['red', 'pink'], ['red', 'purple'],
  ['orange', 'pink'], ['orange', 'yellow'],
  ['green', 'red'], ['green', 'orange'],
  ['blue', 'green'], ['purple', 'orange'],
  ['yellow', 'purple'],
];

function normalise(colour: string): string {
  return colour.toLowerCase().trim();
}

function isNeutral(colour: string): boolean {
  const c = normalise(colour);
  if (NEUTRALS.has(c)) return true;
  // partial matches
  for (const n of NEUTRALS) {
    if (c.includes(n) || n.includes(c)) return true;
  }
  return false;
}

function baseColour(colour: string): string {
  const c = normalise(colour);
  // strip qualifiers like "light", "dark", "pale", "bright", "olive"
  return c
    .replace(/\b(light|dark|pale|bright|deep|pastel|dusty|muted|faded|washed)\b/g, '')
    .trim();
}

function coloursClash(a: string, b: string): boolean {
  if (isNeutral(a) || isNeutral(b)) return false;
  const ba = baseColour(a);
  const bb = baseColour(b);
  if (ba === bb) return false; // same hue family is fine
  for (const [x, y] of CLASHING_PAIRS) {
    if ((ba.includes(x) && bb.includes(y)) || (ba.includes(y) && bb.includes(x))) return true;
  }
  return false;
}

/** Score a pair of colours: higher = better. Range roughly 0–100. */
function colourPairScore(a: string, b: string): number {
  if (isNeutral(a) && isNeutral(b)) return 90;
  if (isNeutral(a) || isNeutral(b)) return 80;
  if (coloursClash(a, b)) return 0;
  return 60;
}

/** Score the full outfit's colour harmony (returns 0–100). */
function outfitColourScore(combo: OutfitCombo, itemMap: Map<string, WardrobeItem>): number {
  const ids = [
    combo.baseLayerId,
    combo.topId,
    combo.outerwearId,
    combo.bottomsId,
    combo.shoesId,
  ].filter(Boolean) as string[];

  const colours = ids
    .map(id => itemMap.get(id)?.primaryColour)
    .filter(Boolean) as string[];

  if (colours.length < 2) return 80;

  let total = 0;
  let pairs = 0;
  for (let i = 0; i < colours.length; i++) {
    for (let j = i + 1; j < colours.length; j++) {
      total += colourPairScore(colours[i], colours[j]);
      pairs++;
    }
  }
  return pairs > 0 ? total / pairs : 80;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getUsableItems(items: WardrobeItem[]): WardrobeItem[] {
  const active = items.filter(i => i.status === 'active');
  return active.length > 0 ? active : items.filter(i => i.status === 'reserve');
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

// ── Main generator ────────────────────────────────────────────────────────────

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
  const usable = getUsableItems(allItems);
  const recentKeys = getRecentComboKeys(recentConfirmed);
  const itemMap = new Map(allItems.map(i => [i.id, i]));

  const byCategory = (cat: string) => usable.filter(i => i.category === cat);

  const vests      = byCategory('vest');
  const tees       = byCategory('tee');
  const shirts     = byCategory('shirt');
  const shorts     = byCategory('shorts');
  const trousers   = byCategory('trousers');
  const shoes      = byCategory('shoes');
  const outerwear  = byCategory('outerwear');
  const accessories = byCategory('accessory');

  const usedKeys = new Set<string>();
  const candidates: { combo: OutfitCombo; score: number }[] = [];

  for (let attempt = 0; attempt < count * 40; attempt++) {
    // ── Pick bottoms ──
    let bottoms: WardrobeItem | undefined;
    if (band === 'hot' && formality !== 'smart-casual') {
      bottoms = pick(shorts.length > 0 ? shorts : trousers);
    } else if (band === 'cold' || formality === 'smart-casual') {
      bottoms = pick(trousers.length > 0 ? trousers : shorts);
    } else {
      bottoms = pick([...shorts, ...trousers]);
    }
    if (!bottoms) continue;

    // ── Decide layering strategy first ──
    // hot: single top only (tee OR shirt, not both)
    // mild/cold smart-casual: shirt over tee acceptable but score it
    // mild casual: usually just one top
    const wantDoubleLayer =
      (band === 'mild' || band === 'cold') &&
      (formality === 'smart-casual' || formality === 'comfortable') &&
      Math.random() > 0.5;

    let baseLayer: WardrobeItem | undefined;
    let top: WardrobeItem | undefined;
    let outer: WardrobeItem | undefined;

    if (band === 'hot') {
      // Single layer — tee, vest, or shirt (not both tee+shirt)
      const singlePool = formality === 'smart-casual'
        ? [...shirts, ...tees]
        : [...tees, ...vests, ...shirts];
      const chosen = pick(singlePool);
      if (!chosen) continue;
      if (chosen.category === 'tee' || chosen.category === 'vest') baseLayer = chosen;
      else top = chosen;
    } else if (wantDoubleLayer && tees.length > 0 && shirts.length > 0) {
      // Tee under open shirt — pick compatible colours
      // Try up to 10 pairs to find a colour-compatible combo
      let found = false;
      for (let p = 0; p < 10; p++) {
        const t = pick(tees)!;
        const s = pick(shirts)!;
        if (!coloursClash(t.primaryColour, s.primaryColour)) {
          baseLayer = t;
          top = s;
          found = true;
          break;
        }
      }
      if (!found) {
        // Fall back to single top
        baseLayer = pick(tees);
        top = undefined;
      }
    } else {
      // Single top
      const pool = formality === 'smart-casual'
        ? [...shirts, ...tees]
        : [...tees, ...shirts];
      const chosen = pick(pool);
      if (!chosen) continue;
      if (chosen.category === 'tee' || chosen.category === 'vest') baseLayer = chosen;
      else top = chosen;
    }

    // ── Outerwear (cold only) ──
    if (band === 'cold') {
      outer = pick(outerwear);
      if (!outer) continue;
    }

    // ── Shoes ──
    const shoe = pick(shoes);
    if (!shoe) continue;

    // ── Accessories (optional) ──
    const accIds: string[] = [];
    if (accessories.length > 0 && Math.random() > 0.6) {
      const acc = pick(accessories);
      if (acc) accIds.push(acc.id);
    }

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
    usedKeys.add(key);

    // ── Score ──
    let score = outfitColourScore(combo, itemMap);
    if (recentKeys.has(key)) score -= 40; // discourage repeats

    candidates.push({ combo, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  const results = candidates.slice(0, count).map(c => c.combo);

  // Fallback if not enough candidates
  while (results.length < count) {
    const bottom = pick([...trousers, ...shorts]);
    const base   = pick([...tees, ...vests]);
    const shoe   = pick(shoes);
    if (!bottom || !shoe) break;
    results.push({ baseLayerId: base?.id, bottomsId: bottom.id, shoesId: shoe.id, accessoryIds: [] });
  }

  return results;
}

export function surpriseOutfit(items: WardrobeItem[]): OutfitCombo | null {
  const usable = items.filter(i => i.status === 'active' || i.status === 'reserve');
  const p = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const bottoms = p(usable.filter(i => i.category === 'shorts' || i.category === 'trousers'));
  const base    = p(usable.filter(i => i.category === 'tee' || i.category === 'vest'));
  const shoe    = p(usable.filter(i => i.category === 'shoes'));
  if (!bottoms || !shoe) return null;
  return { baseLayerId: base?.id, bottomsId: bottoms.id, shoesId: shoe.id, accessoryIds: [] };
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
