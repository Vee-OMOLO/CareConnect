import { memo } from 'react';

export default memo(function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0 ${
        checked ? 'bg-health' : 'bg-outline-variant'
      }`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`absolute top-[4px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          checked ? 'translate-x-[24px]' : 'translate-x-[4px]'
        }`}
      />
    </button>
  );
});
