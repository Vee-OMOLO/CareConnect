import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);

  const userName = userRole === 'parent' ? 'Margaret Johnson' : 'Sarah Williams';

  const settingsItems = [
    { icon: 'notifications', label: 'Notifications', subtitle: 'Alert preferences' },
    { icon: 'lock', label: 'Privacy & Security', subtitle: 'Password, 2FA' },
    { icon: 'language', label: 'Language', subtitle: 'English' },
    { icon: 'help', label: 'Help & Support', subtitle: 'FAQ, contact' },
    { icon: 'info', label: 'About', subtitle: 'v1.0.0' },
  ];

  const careTeam = [
    { name: 'Sarah M.', role: 'Primary Caregiver', initials: 'SM' },
    { name: 'James K.', role: 'Physiotherapist', initials: 'JK' },
    { name: 'Nurse Amy', role: 'Registered Nurse', initials: 'NA' },
  ];

  return (
    <div className="pb-28 pt-6 px-4 sm:px-6 md:px-8 min-h-dvh">
      <PageHeader title="Profile" onBack />

      {/* Profile Card */}
      <Card className="mb-5 sm:mb-6 animate-fade-in-up text-center" padding="p-5 sm:p-6 md:p-8">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '36px' }}>person</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-on-surface">{userName}</h2>
        <p className="text-sm sm:text-base text-on-surface-variant capitalize mt-0.5">{userRole}</p>
        <p className="text-xs sm:text-sm text-outline mt-1">{currentUser?.email}</p>
        <button
          onClick={() => setShowEditProfile(true)}
          className="mt-4 sm:mt-5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-surface-container-low text-sm sm:text-base font-semibold text-on-surface card-hover"
        >
          Edit Profile
        </button>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        {[
          { label: 'Days Active', value: '45', type: 'feeding' },
          { label: 'Logs', value: '128', type: 'sleep' },
          { label: 'Streak', value: '12d', type: 'play' },
        ].map((stat, i) => (
          <div key={i} className="card p-3 sm:p-4 md:p-5 text-center">
            <p className="text-xl sm:text-2xl font-bold text-on-surface">{stat.value}</p>
            <p className="text-[11px] sm:text-xs text-outline mt-0.5 sm:mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Care Team */}
      <div className="mb-5 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xs sm:text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 sm:mb-4">Care Team</h2>
        <Card padding="p-0">
          <div className="divide-y divide-outline-variant/15">
            {careTeam.map((member, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/8 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-sm sm:text-base font-bold text-primary">{member.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-semibold text-on-surface">{member.name}</p>
                  <p className="text-xs sm:text-sm text-outline">{member.role}</p>
                </div>
                <button className="w-10 h-10 sm:w-11 sm:h-11 bg-surface-container-low rounded-lg flex items-center justify-center card-hover">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>chat</span>
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Settings */}
      <div className="mb-5 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <h2 className="text-xs sm:text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 sm:mb-4">Settings</h2>
        <Card padding="p-0">
          <div className="divide-y divide-outline-variant/15">
            {settingsItems.map((item, i) => (
              <button key={i} className="w-full px-4 sm:px-5 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-surface-container-low rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>{item.icon}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm sm:text-base font-medium text-on-surface">{item.label}</p>
                  <p className="text-xs sm:text-sm text-outline">{item.subtitle}</p>
                </div>
                <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>chevron_right</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full card py-3.5 sm:py-4 text-secondary font-semibold text-sm sm:text-base flex items-center justify-center gap-2 card-hover animate-fade-in-up min-h-[52px]"
        style={{ animationDelay: '0.2s' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
        Sign Out
      </button>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowEditProfile(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 sm:p-8 pb-8 sm:pb-10 animate-slide-up shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div className="w-10 h-1 bg-outline-variant/40 rounded-full mx-auto sm:mb-5 mb-5" />
            <h2 className="text-lg sm:text-xl font-bold text-on-surface mb-5 sm:mb-6">Edit Profile</h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5 sm:mb-2">Full Name</label>
                <input defaultValue={userName} className="glass-input" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5 sm:mb-2">Email</label>
                <input defaultValue={currentUser?.email} className="glass-input" />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-on-surface-variant mb-1.5 sm:mb-2">Phone</label>
                <input placeholder="(555) 000-0000" className="glass-input" />
              </div>
              <button onClick={() => setShowEditProfile(false)} className="w-full bg-primary text-on-primary py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg mt-1 min-h-[56px]">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
