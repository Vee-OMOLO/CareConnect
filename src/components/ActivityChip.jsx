const TYPES = {
  feeding: { icon: 'restaurant', label: 'Feeding' },
  sleep: { icon: 'bedtime', label: 'Sleep' },
  diaper: { icon: 'child_care', label: 'Diaper' },
  play: { icon: 'sports_esports', label: 'Play' },
  medicine: { icon: 'medication', label: 'Medicine' },
  health: { icon: 'favorite', label: 'Health' },
};

export default function ActivityChip({ type, selected, onClick, size = 'md' }) {
  const config = TYPES[type];
  if (!config) return null;

  const sizeClasses = size === 'lg'
    ? 'w-full py-4 flex-col gap-1.5 text-sm'
    : 'px-4 py-2 text-xs';

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-150 touch-target
        ${sizeClasses}
        ${selected
          ? `activity-${type}`
          : 'bg-surface-container-low text-on-surface-variant border border-outline-variant/30'
        }
      `}
    >
      <span className="material-symbols-outlined" style={{ fontSize: size === 'lg' ? '28px' : '20px' }}>
        {config.icon}
      </span>
      {config.label}
    </button>
  );
}

export { TYPES };
