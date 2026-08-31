export type ItemCategory = 'vest' | 'tee' | 'shirt' | 'shorts' | 'trousers' | 'shoes' | 'outerwear' | 'cap' | 'accessory' | 'other';
export type ItemStatus = 'active' | 'retired' | 'reserve' | 'dirty';
export type ItemPattern = 'plain' | 'graphic' | 'pattern' | 'stripe' | 'check';
export type AgeBracket = '30s' | '40s' | '50s' | '60plus';

export const AGE_BRACKETS: { value: AgeBracket; label: string }[] = [
  { value: '30s', label: '30s' },
  { value: '40s', label: '40s' },
  { value: '50s', label: '50s' },
  { value: '60plus', label: '60+' },
];

export interface WardrobeItem {
  id: string;
  filename: string;
  imageData: string; // base64 data URL
  category: ItemCategory;
  primaryColour: string;
  secondaryColour?: string;
  pattern?: ItemPattern;
  description: string;
  status: ItemStatus;
  notes: string;
  addedAt: string; // ISO date
}

export interface OutfitCombo {
  baseLayerId?: string;   // vest or tee
  topId?: string;         // shirt or outerwear worn open
  outerwearId?: string;
  bottomsId: string;
  shoesId?: string;
  capId?: string;
  accessoryIds: string[];
}

export interface OutfitLog {
  id: string;
  date: string; // YYYY-MM-DD
  activity: string;
  combo: OutfitCombo;
  confirmed: boolean;
  favourite: boolean;
  temperature?: number;
  conditions?: string;
}

export interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  uvIndex: number;
  label: string;
}

export type ActivityId =
  | 'beach'
  | 'school-run'
  | 'walk'
  | 'day-with-zoe'
  | 'lounging'
  | 'errands'
  | 'smart-casual-out'
  | 'surprise-me'
  | 'custom';

export interface Activity {
  id: ActivityId;
  label: string;
  emoji: string;
  hasSubActivity?: boolean;
}

export const ACTIVITIES: Activity[] = [
  { id: 'beach', label: 'Beach', emoji: '🏖️' },
  { id: 'school-run', label: 'School Run', emoji: '🎒' },
  { id: 'walk', label: 'Walk', emoji: '🥾' },
  { id: 'day-with-zoe', label: 'Day with Zoe', emoji: '❤️', hasSubActivity: true },
  { id: 'lounging', label: 'Lounging', emoji: '🛋️' },
  { id: 'errands', label: 'Errands', emoji: '🛒' },
  { id: 'smart-casual-out', label: 'Smart Casual Out', emoji: '🍽️' },
  { id: 'surprise-me', label: 'Surprise Me', emoji: '🎲' },
  { id: 'custom', label: 'Custom', emoji: '✏️' },
];

export const ZOE_SUB_ACTIVITIES = ['restaurant', 'cinema', 'walk', 'shopping'];
