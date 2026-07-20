import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const parentTabs = [
  { path: '/parent', icon: 'home', label: 'Home' },
  { path: '/parent/calendar', icon: 'calendar_month', label: 'Calendar' },
  { path: '/parent/tracking', icon: 'location_on', label: 'Tracking' },
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
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-panel mx-3 mb-3 rounded-[20px] border border-white/50 shadow-xl shadow-black/5">
        <div className="flex items-center justify-around px-1 py-1.5">
          {tabs.map(tab => {
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className="flex flex-col items-center gap-1 py-2 px-3.5 rounded-2xl transition-all duration-300"
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-primary text-on-primary shadow-lg shadow-primary/25 scale-105' : 'text-outline hover:text-on-surface-variant'
                }`}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                    {tab.icon}
                  </span>
                </div>
                <span className={`text-[10px] font-semibold transition-all duration-300 ${
                  isActive ? 'text-primary' : 'text-outline'
                }`}>
                  {tab.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
