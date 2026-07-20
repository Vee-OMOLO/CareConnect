import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function CaregiverHome() {
  const [showSOS, setShowSOS] = useState(false);
  const [showLinkParent, setShowLinkParent] = useState(false);
  const [childName, setChildName] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [linked, setLinked] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const quickActions = [
    { icon: 'restaurant', label: 'Feeding', color: 'bg-secondary-container text-on-secondary-container', type: 'feeding' },
    { icon: 'bedtime', label: 'Sleep', color: 'bg-primary-container text-on-primary-container', type: 'sleep' },
    { icon: 'child_care', label: 'Diaper', color: 'bg-on-tertiary-container/10 text-on-tertiary-container', type: 'diaper' },
    { icon: 'sports_esports', label: 'Play', color: 'bg-secondary-container text-on-secondary-container', type: 'play' },
    { icon: 'medication', label: 'Medicine', color: 'bg-primary-container text-on-primary-container', type: 'medicine' },
    { icon: 'favorite', label: 'Health', color: 'bg-on-tertiary-container/10 text-on-tertiary-container', type: 'health' },
  ];

  const todayTasks = [
    { title: 'Morning feeding', time: '8:00 AM', done: true },
    { title: 'Diaper change', time: '8:30 AM', done: true },
    { title: 'Morning nap', time: '9:00 AM', done: false },
    { title: 'Tummy time', time: '10:00 AM', done: false },
    { title: 'Afternoon feeding', time: '12:00 PM', done: false },
  ];

  const recentLogs = [
    { icon: 'restaurant', title: 'Bottle - 4oz formula', time: '8:15 AM', status: 'completed' },
    { icon: 'child_care', title: 'Diaper - wet', time: '8:00 AM', status: 'completed' },
    { icon: 'bedtime', title: 'Nap started', time: '9:30 AM', status: 'in-progress' },
  ];

  const greetingTime = new Date().getHours();
  const greeting = greetingTime < 12 ? 'Good morning' : greetingTime < 17 ? 'Good afternoon' : 'Good evening';
  const completedTasks = todayTasks.filter(t => t.done).length;

  function handleLink() {
    if (childName && parentEmail) {
      const key = `${parentEmail.trim().toLowerCase()}_${childName.trim().toLowerCase().replace(/\s+/g, ' ')}`;
      localStorage.setItem('careconnect-link-key', key);
      localStorage.setItem('careconnect-child-name', childName);
      setLinked(true);
      setShowLinkParent(false);
    }
  }

  return (
    <div className="pb-28 pt-4 px-5 min-h-dvh">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 animate-fade-in-up">
        <div>
          <p className="text-sm text-on-surface-variant mb-1">{greeting}</p>
          <h1 className="text-[26px] font-bold text-on-surface tracking-tight">Sarah</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSOS(true)} className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center sos-glow card-hover relative">
            <span className="material-symbols-outlined text-on-secondary" style={{ fontSize: '24px' }}>emergency</span>
            <div className="absolute inset-0 rounded-2xl ring-2 ring-secondary/40 animate-pulse-ring"></div>
          </button>
          <button onClick={() => navigate('/profile')} className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center card-hover">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>person</span>
          </button>
        </div>
      </div>

      {/* Link Parent Banner */}
      {!linked && !localStorage.getItem('careconnect-link-key') && (
        <button
          onClick={() => setShowLinkParent(true)}
          className="w-full glass-card rounded-2xl p-4 mb-6 flex items-center gap-3.5 border-2 border-dashed border-primary/25 hover:border-primary/40 transition-colors animate-fade-in-up card-hover"
        >
          <div className="w-13 h-13 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '26px' }}>link</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-on-surface">Link to Parent</p>
            <p className="text-xs text-on-surface-variant mt-0.5">Connect to sync activities in real-time</p>
          </div>
          <span className="material-symbols-outlined text-outline ml-auto" style={{ fontSize: '20px' }}>chevron_right</span>
        </button>
      )}

      {linked && (
        <div className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-3 bg-on-tertiary-container/5 animate-scale-in">
          <div className="w-10 h-10 bg-on-tertiary-container/15 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontSize: '22px' }}>check_circle</span>
          </div>
          <div>
            <p className="text-sm font-medium text-on-surface">Linked to {parentEmail}</p>
            <p className="text-xs text-on-surface-variant">Child: {childName}</p>
          </div>
        </div>
      )}

      {/* Today's Progress */}
      <div className="glass-card rounded-3xl p-5 mb-6 animate-fade-in-up card-hover" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-on-surface">Today's Progress</h3>
          <span className="text-sm font-bold text-primary">{completedTasks}/{todayTasks.length}</span>
        </div>
        <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(completedTasks / todayTasks.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-on-surface-variant">{completedTasks} of {todayTasks.length} tasks completed</p>
      </div>

      {/* Quick Log Grid */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Quick Log</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 stagger-children">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(`/caregiver/log?type=${action.type}`)}
              className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2.5 card-hover animate-scale-in"
            >
              <div className={`w-13 h-13 rounded-2xl flex items-center justify-center ${action.color}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>{action.icon}</span>
              </div>
              <span className="text-xs font-semibold text-on-surface">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="glass-card rounded-3xl p-5 mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Today's Tasks</h2>
          <span className="text-xs text-on-surface-variant font-medium px-3 py-1 bg-surface-container rounded-full">
            {completedTasks}/{todayTasks.length} done
          </span>
        </div>
        <div className="space-y-4">
          {todayTasks.map((task, i) => (
            <div key={i} className="flex items-center gap-3.5">
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                task.done
                  ? 'bg-on-tertiary-container border-on-tertiary-container'
                  : 'border-outline-variant hover:border-primary'
              }`}>
                {task.done && <span className="material-symbols-outlined text-on-tertiary" style={{ fontSize: '16px' }}>check</span>}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${task.done ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{task.title}</p>
                <p className="text-[11px] text-outline mt-0.5">{task.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Logs */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Recent Logs</h2>
        </div>
        <div className="space-y-3 stagger-children">
          {recentLogs.map((log, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-3.5 card-hover animate-fade-in-up">
              <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>{log.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface">{log.title}</p>
                <p className="text-[11px] text-outline mt-0.5">{log.time}</p>
              </div>
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                log.status === 'completed' ? 'bg-on-tertiary-container/10 text-on-tertiary-container' : 'bg-primary-container text-on-primary-container'
              }`}>
                {log.status === 'completed' ? 'Done' : 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSOS(false)}></div>
          <div className="relative glass-card rounded-[32px] w-full max-w-sm p-8 text-center animate-scale-in">
            <div className="w-20 h-20 bg-secondary/15 rounded-full flex items-center justify-center mx-auto mb-5 animate-breathe">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: '40px' }}>emergency</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface mb-2">Emergency SOS</h2>
            <p className="text-sm text-on-surface-variant mb-8">This will alert all emergency contacts and share your location.</p>
            <div className="space-y-3">
              <a
                href="tel:911"
                className="w-full bg-secondary text-on-secondary py-4 rounded-2xl font-semibold text-[16px] flex items-center justify-center gap-2.5 hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>call</span>
                Call 911
              </a>
              <button
                onClick={() => setShowSOS(false)}
                className="w-full glass-input py-4 rounded-2xl font-semibold text-on-surface text-[15px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Parent Modal */}
      {showLinkParent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLinkParent(false)}></div>
          <div className="relative glass-card rounded-t-[32px] w-full max-w-[430px] p-7 pb-10 animate-slide-up">
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-6"></div>
            <h2 className="text-xl font-bold text-on-surface mb-6">Link to Parent</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">Child's Name</label>
                <input
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g. Olivia Johnson"
                  className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface placeholder:text-outline text-[15px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-2">Parent's Email</label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="parent@email.com"
                  className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface placeholder:text-outline text-[15px]"
                />
              </div>
              <button
                onClick={handleLink}
                disabled={!childName || !parentEmail}
                className="w-full bg-primary text-on-primary py-4.5 rounded-2xl font-semibold text-[16px] hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
              >
                Link Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
