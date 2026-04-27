export const TIMER_SECONDS = 10;

export const OPPONENT_NAMES = [
  'Alex', 'Jordan', 'Sam', 'Taylor', 'Morgan',
  'Riley', 'Casey', 'Quinn', 'Drew', 'Avery',
];

export const DIFFICULTY_CONFIG = {
  easy:   { icon: '😊', label: 'Easy',   desc: 'Warm up — great for beginners', color: '#16A34A', bg: '#F0FDF4' },
  medium: { icon: '🔥', label: 'Medium', desc: 'A real challenge',               color: '#D97706', bg: '#FFFBEB' },
  hard:   { icon: '💀', label: 'Hard',   desc: 'Expert level only',              color: '#DC2626', bg: '#FEF2F2' },
} as const;

export const OPPONENT_ACCURACY: Record<string, number> = {
  easy:   0.78,
  medium: 0.58,
  hard:   0.38,
};
