import { useNavigate } from 'react-router-dom';

export default function PageHeader({ title, subtitle, onBack, rightAction }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-5 sm:mb-6 animate-fade-in-up">
      <div className="flex items-center gap-3 sm:gap-4">
        {onBack && (
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-surface-container-low flex items-center justify-center card-hover"
          >
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '22px' }}>arrow_back</span>
          </button>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </div>
  );
}
