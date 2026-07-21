import { memo } from 'react';
import { activityColors, activityTypes } from '../constants/activityData';

const types = Object.fromEntries(activityTypes.map(t => [t.type, { icon: t.icon, label: t.label }]));

export default memo(function ActivityChip({ type, selected, onClick, size = 'md' }) {
  const t = types[type];
  if (!t) return null;

  const sizeClasses = size === 'lg'
    ? 'p-4 flex flex-col items-center gap-2'
    : 'px-3 py-1.5 flex items-center gap-1.5';

  const iconSize = size === 'lg' ? 'text-[24px]' : 'text-[16px]';

  return (
    <button
      onClick={onClick}
      className={`rounded-xl transition-all duration-150 ${
        selected ? '' : 'bg-surface-container-low text-on-surface-variant border border-outline-variant/20'
      } ${sizeClasses}`}
      style={selected ? { backgroundColor: activityColors[type]?.bg || '#edeeef', color: activityColors[type]?.text || '#44474c' } : undefined}
    >
      <span className={`material-symbols-outlined ${iconSize}`}>{t.icon}</span>
      <span className={`font-semibold ${size === 'lg' ? 'text-xs' : 'text-xs'}`}>{t.label}</span>
    </button>
  );
});

export { types };
