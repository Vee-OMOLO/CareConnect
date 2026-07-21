const types = {
  feeding: { icon: 'restaurant', label: 'Feeding' },
  sleep: { icon: 'bedtime', label: 'Sleep' },
  diaper: { icon: 'child_care', label: 'Diaper' },
  play: { icon: 'sports_esports', label: 'Play' },
  medicine: { icon: 'medication', label: 'Medicine' },
  health: { icon: 'favorite', label: 'Health' },
};

export default function ActivityChip({ type, selected, onClick, size = 'md' }) {
  const t = types[type];
  if (!t) return null;

  const sizeClasses = size === 'lg'
    ? 'p-4 flex flex-col items-center gap-2'
    : 'px-3 py-1.5 flex items-center gap-1.5';

  const iconSize = size === 'lg' ? 'text-[24px]' : 'text-[16px]';

  return (
    <button
      onClick={onClick}
      className={`rounded-xl transition-all duration-150 ${sizeClasses} ${
        selected
          ? `activity-${type}`
          : 'bg-surface-container-low text-on-surface-variant border border-outline-variant/20'
      }`}
    >
      <span className={`material-symbols-outlined ${iconSize}`}>{t.icon}</span>
      <span className={`font-semibold ${size === 'lg' ? 'text-xs' : 'text-xs'}`}>{t.label}</span>
    </button>
  );
}

export { types };
