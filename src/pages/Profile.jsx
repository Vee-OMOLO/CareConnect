import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, userRole, logout } = useAuth();
  const [showEditProfile, setShowEditProfile] = useState(false);

  const settingsItems = [
    { icon: 'notifications', label: 'Notifications', subtitle: 'Manage alert preferences' },
    { icon: 'lock', label: 'Privacy & Security', subtitle: 'Password, 2FA, data' },
    { icon: 'language', label: 'Language', subtitle: 'English' },
    { icon: 'dark_mode', label: 'Appearance', subtitle: 'System default' },
    { icon: 'help', label: 'Help & Support', subtitle: 'FAQ, contact us' },
    { icon: 'info', label: 'About', subtitle: 'Version 1.0.0' },
  ];

  const careTeam = [
    { name: 'Sarah M.', role: 'Primary Caregiver', avatar: '👩‍⚕️' },
    { name: 'James K.', role: 'Physiotherapist', avatar: '👨‍⚕️' },
    { name: 'Nurse Amy', role: 'Registered Nurse', avatar: '👩‍⚕️' },
  ];

  const userName = userRole === 'parent' ? 'Margaret Johnson' : 'Sarah Williams';

  return (
    <div className="pb-28 pt-4 px-5 min-h-dvh">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7 animate-fade-in-up">
        <button onClick={() => navigate(-1)} className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center card-hover">
          <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <h1 className="text-xl font-bold text-on-surface">Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="glass-card rounded-3xl p-7 mb-6 text-center animate-fade-in-up card-hover" style={{ animationDelay: '0.05s' }}>
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl shadow-primary/20">
          <span className="material-symbols-outlined text-on-primary" style={{ fontSize: '42px' }}>person</span>
        </div>
        <h2 className="text-xl font-bold text-on-surface">{userName}</h2>
        <p className="text-sm text-on-surface-variant capitalize mt-1 font-medium">{userRole}</p>
        <p className="text-xs text-outline mt-1">{currentUser?.email}</p>
        <button onClick={() => setShowEditProfile(true)} className="mt-5 glass-input px-6 py-2.5 rounded-full text-sm font-semibold text-on-surface card-hover">
          Edit Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3.5 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {[
          { label: 'Days Active', value: '45', icon: 'calendar_today' },
          { label: 'Logs', value: '128', icon: 'edit_note' },
          { label: 'Streak', value: '12d', icon: 'local_fire_department' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-2xl p-4 text-center card-hover animate-scale-in">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2.5">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>{stat.icon}</span>
            </div>
            <p className="text-xl font-bold text-on-surface">{stat.value}</p>
            <p className="text-[10px] text-outline mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Care Team */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Care Team</h2>
          <button className="text-sm font-medium text-primary">See All</button>
        </div>
        <div className="space-y-3 stagger-children">
          {careTeam.map((member, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-3.5 card-hover animate-fade-in-up">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0">{member.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">{member.name}</p>
                <p className="text-[11px] text-outline mt-0.5">{member.role}</p>
              </div>
              <button className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center card-hover">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>chat</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-lg font-semibold text-on-surface mb-4">Settings</h2>
        <div className="glass-card rounded-2xl overflow-hidden divide-y divide-outline-variant/20">
          {settingsItems.map((item, i) => (
            <button key={i} className="w-full px-5 py-4 flex items-center gap-3.5 hover:bg-white/40 transition-colors">
              <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '22px' }}>{item.icon}</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-on-surface">{item.label}</p>
                <p className="text-[11px] text-outline mt-0.5">{item.subtitle}</p>
              </div>
              <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>chevron_right</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button onClick={logout} className="w-full glass-card rounded-2xl py-4 text-secondary font-semibold text-[15px] flex items-center justify-center gap-2.5 hover:bg-secondary/5 transition-colors mb-6 card-hover animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>logout</span>
        Sign Out
      </button>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditProfile(false)}></div>
          <div className="relative glass-card rounded-t-[32px] w-full max-w-[430px] p-7 pb-10 animate-slide-up">
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-6"></div>
            <h2 className="text-xl font-bold text-on-surface mb-6">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">Full Name</label>
                <input defaultValue={userName} className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface text-[15px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">Email</label>
                <input defaultValue={currentUser?.email} className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface text-[15px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">Phone</label>
                <input placeholder="(555) 000-0000" className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface placeholder:text-outline text-[15px]" />
              </div>
              <button onClick={() => setShowEditProfile(false)} className="w-full bg-primary text-on-primary py-4.5 rounded-2xl font-semibold text-[16px] hover:opacity-90 transition-opacity mt-2">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
