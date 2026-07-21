export const activityColors = {
  feeding: { bg: '#FEF3E2', text: '#E8913A' },
  sleep: { bg: '#F0EDFF', text: '#7B61FF' },
  diaper: { bg: '#E6F9F7', text: '#4ECDC4' },
  play: { bg: '#E6F6FA', text: '#45B7D1' },
  medicine: { bg: '#FDE8EC', text: '#E85D75' },
  health: { bg: '#EAFBEC', text: '#6BCB77' },
  primary: { bg: '#edeeef', text: '#44474c' },
};

export const activityIcons = {
  feeding: 'restaurant',
  sleep: 'bedtime',
  diaper: 'child_care',
  play: 'sports_esports',
  medicine: 'medication',
  health: 'favorite',
};

export const activityTypes = [
  { type: 'feeding', icon: 'restaurant', label: 'Feeding', options: ['Bottle', 'Solids', 'Breastfeeding', 'Skipped'] },
  { type: 'sleep', icon: 'bedtime', label: 'Sleep', options: ['Nap', 'Night Sleep', 'Nursery', 'Other'] },
  { type: 'diaper', icon: 'child_care', label: 'Diaper', options: ['Wet', 'Dirty', 'Both', 'Dry'] },
  { type: 'play', icon: 'sports_esports', label: 'Play', options: ['Tummy Time', 'Floor Play', 'Outdoor', 'Sensory'] },
  { type: 'medicine', icon: 'medication', label: 'Medicine', options: ['Drops', 'Syrup', 'Pill', 'Inhaler'] },
  { type: 'health', icon: 'favorite', label: 'Health', options: ['Temperature', 'Doctor Visit', 'Vaccination', 'Other'] },
];
