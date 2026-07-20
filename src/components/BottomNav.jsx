import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const parentTabs = [
  { path: '/parent', icon: 'home', label: 'Home' },
  { path: '/parent/calendar', icon: 'calendar_month', label: 'Calendar' },
  { path: '/parent/tracking', icon: 'location_on', label: 'Track' },
  { path: '/safety-vault', icon: 'shield', label: 'Safety' },
  { path: '/profile', icon: 'person', label: 'Profile' },
];

const caregiverTabs = [
  { path: '/caregiver', icon: 'home', label: 'Home' },
  { path: '/caregiver/log', icon: 'edit_note', label: 'Log' },
  { path: '/safety-vault', icon: 'shield', label: 'Safety' },
  { path: '/profile', icon: 'person', label: 'Profile' },
];

export default function BottomNav() {
  const { userRole } = useAuth();
  const location = useLocation();
  const tabs = userRole === 'parent' ? parentTabs : caregiverTabs;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-50">
      <div className="max-w-[480px] mx-auto px-3 pb-3">
        <div className="bg-white rounded-2xl border border-black/[0.04] shadow-[0_-1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-around py-1.5">
          {tabs.map(tab => {
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-150 active:scale-95"
              >
                <div className={`transition-all duration-150 ${
                  isActive ? 'text-primary' : 'text-outline'
                }`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
                    {tab.icon}
                  </span>
                </div>
                <span className={`text-[11px] font-semibold transition-all duration-150 ${
                  isActive ? 'text-primary' : 'text-outline'
                }`}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="w-5 h-0.5 bg-primary rounded-full -mt-0.5" />
                )}
              </NavLink>
            );
          })}
          </div>
        </div>
      </div>
    </nav>
  );
}
