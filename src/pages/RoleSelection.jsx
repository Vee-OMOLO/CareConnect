import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { setUserRole } = useAuth();

  function handleSelect(role) {
    setUserRole(role);
    if (role === 'parent') {
      navigate('/parent');
    } else {
      navigate('/caregiver');
    }
  }

  return (
    <div className="min-h-dvh flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 auth-gradient-bg">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px] animate-float-slow"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/15 blur-[100px] animate-float-slow-reverse"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Logo */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3.5 mb-3">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-[20px] flex items-center justify-center shadow-2xl shadow-primary/30 animate-logo-pulse">
              <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '34px' }}>health_and_safety</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-on-surface text-center tracking-tight">CareConnect</h1>
        </div>

        <div className="w-full max-w-sm">
          {/* Title */}
          <div className="text-center mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-[28px] font-bold text-on-surface mb-3">Who are you?</h2>
            <p className="text-on-surface-variant text-[15px]">Select your role to personalize your experience</p>
          </div>

          {/* Role Cards */}
          <div className="space-y-4 stagger-children">
            {/* Parent Card */}
            <button
              onClick={() => handleSelect('parent')}
              className="glass-card auth-card w-full p-6 rounded-[28px] flex items-center gap-5 text-left hover:scale-[1.02] transition-all duration-300 cursor-pointer group animate-fade-in-up"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>family_restroom</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-on-surface">Parent / Guardian</h3>
                <p className="text-sm text-on-surface-variant mt-1">Monitor activity, view reports, track visits</p>
              </div>
              <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors">
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors" style={{ fontSize: '22px' }}>chevron_right</span>
              </div>
            </button>

            {/* Caregiver Card */}
            <button
              onClick={() => handleSelect('caregiver')}
              className="glass-card auth-card w-full p-6 rounded-[28px] flex items-center gap-5 text-left hover:scale-[1.02] transition-all duration-300 cursor-pointer group animate-fade-in-up"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/15 to-secondary/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: '32px' }}>volunteer_activism</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-on-surface">Caregiver</h3>
                <p className="text-sm text-on-surface-variant mt-1">Log activities, manage tasks, send alerts</p>
              </div>
              <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/10 transition-colors">
                <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors" style={{ fontSize: '22px' }}>chevron_right</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
