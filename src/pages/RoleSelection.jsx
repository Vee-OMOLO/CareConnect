import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { setRole } = useAuth();

  function handleSelect(role) {
    setRole(role);
    navigate(role === 'parent' ? '/parent' : '/caregiver');
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 sm:px-8 py-12 sm:py-16 bg-surface">
      {/* Logo */}
      <div className="mb-8 sm:mb-10 animate-fade-in-up">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '30px' }}>health_and_safety</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-on-surface text-center tracking-tight">CareConnect</h1>
      </div>

      <div className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-8 sm:mb-10 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-2 sm:mb-3">Who are you?</h2>
          <p className="text-sm sm:text-base text-on-surface-variant">Select your role to get started</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => handleSelect('parent')}
            className="auth-card w-full p-5 sm:p-6 flex items-center gap-4 sm:gap-5 text-left active:scale-[0.98] transition-transform animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/8 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>family_restroom</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-on-surface">Parent / Guardian</h3>
              <p className="text-sm sm:text-base text-on-surface-variant mt-0.5">Monitor activity, view reports, track visits</p>
            </div>
            <span className="material-symbols-outlined text-outline" style={{ fontSize: '24px' }}>chevron_right</span>
          </button>

          <button
            onClick={() => handleSelect('caregiver')}
            className="auth-card w-full p-5 sm:p-6 flex items-center gap-4 sm:gap-5 text-left active:scale-[0.98] transition-transform animate-fade-in-up"
            style={{ animationDelay: '0.15s' }}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-secondary/8 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: '28px' }}>volunteer_activism</span>
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-on-surface">Caregiver</h3>
              <p className="text-sm sm:text-base text-on-surface-variant mt-0.5">Log activities, manage tasks, send alerts</p>
            </div>
            <span className="material-symbols-outlined text-outline" style={{ fontSize: '24px' }}>chevron_right</span>
          </button>
        </div>

        <p className="text-center text-[11px] sm:text-xs text-outline mt-8 sm:mt-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Works offline — data syncs when connected
        </p>
      </div>
    </div>
  );
}
