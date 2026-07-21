import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';

const activityTypes = [
  { type: 'feeding', icon: 'restaurant', label: 'Feeding' },
  { type: 'sleep', icon: 'bedtime', label: 'Sleep' },
  { type: 'diaper', icon: 'child_care', label: 'Diaper' },
  { type: 'play', icon: 'sports_esports', label: 'Play' },
  { type: 'medicine', icon: 'medication', label: 'Medicine' },
  { type: 'health', icon: 'favorite', label: 'Health' },
];

const todayTasks = [
  { id: 1, text: 'Morning feeding', done: true },
  { id: 2, text: 'Diaper change', done: true },
  { id: 3, text: 'Nap time', done: true },
  { id: 4, text: 'Afternoon feeding', done: false },
  { id: 5, text: 'Play session', done: false },
];

const recentLogs = [
  { id: 1, type: 'feeding', text: 'Bottle — 4oz formula', time: '8:15 AM', done: true },
  { id: 2, type: 'sleep', text: 'Nap — 9:00 AM', time: '9:00 AM', done: true },
  { id: 3, type: 'diaper', text: 'Wet diaper changed', time: '10:30 AM', done: true },
  { id: 4, type: 'play', text: 'Tummy time — pending', time: 'Now', done: false },
];

export default function CaregiverHome() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showSOS, setShowSOS] = useState(false);

  const completedTasks = todayTasks.filter(t => t.done).length;
  const progressPercent = (completedTasks / todayTasks.length) * 100;
  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference - (progressPercent / 100) * circumference;

  const greetingTime = new Date().getHours();
  const greeting = greetingTime < 12 ? 'Good morning' : greetingTime < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="pb-28 pt-6 px-4 sm:px-6 md:px-8 min-h-dvh">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 animate-fade-in-up">
        <div>
          <p className="text-sm sm:text-base text-on-surface-variant">{greeting}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Sarah</h1>
        </div>
        <button
          onClick={() => setShowSOS(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-secondary text-on-secondary rounded-xl font-semibold text-sm sm:text-base sos-glow card-hover"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>emergency_share</span>
          SOS
        </button>
      </div>

      {/* Progress Ring */}
      <Card className="mb-5 sm:mb-6 animate-fade-in-up" padding="p-5 sm:p-6">
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="42" fill="none" stroke="#edeeef" strokeWidth="6" />
              <circle
                cx="48" cy="48" r="42" fill="none"
                stroke="#041627" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={dashOffset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl sm:text-2xl font-bold text-on-surface">{completedTasks}/{todayTasks.length}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-on-surface">Today's Tasks</h3>
            <p className="text-sm sm:text-base text-on-surface-variant mt-0.5">{todayTasks.length - completedTasks} remaining</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
              {todayTasks.map((t) => (
                <span
                  key={t.id}
                  className={`text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${
                    t.done ? 'bg-health-bg text-health' : 'bg-surface-container-low text-outline'
                  }`}
                >
                  {t.done ? '✓' : '○'} {t.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Log Grid */}
      <div className="mb-5 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <h2 className="text-xs sm:text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 sm:mb-4">Quick Log</h2>
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {activityTypes.map((a) => (
            <button
              key={a.type}
              onClick={() => navigate(`/caregiver/log?type=${a.type}`)}
              className={`card card-interactive p-4 sm:p-5 flex flex-col items-center gap-2 sm:gap-3 activity-${a.type}-bg`}
            >
              <span className={`material-symbols-outlined text-${a.type}`} style={{ fontSize: '28px' }}>{a.icon}</span>
              <span className="text-xs sm:text-sm font-semibold text-on-surface">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Logs */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xs sm:text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 sm:mb-4">Today's Log</h2>
        <Card padding="p-0">
          <div className="divide-y divide-outline-variant/15">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg activity-${log.type}-bg flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined text-${log.type}`} style={{ fontSize: '18px' }}>
                    {activityTypes.find(a => a.type === log.type)?.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-on-surface truncate">{log.text}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs sm:text-sm text-outline">{log.time}</span>
                  <span className={`w-2.5 h-2.5 rounded-full ${log.done ? 'bg-health' : 'bg-outline-variant'}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5 sm:px-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSOS(false)} />
          <div className="relative card-elevated bg-white rounded-2xl w-full max-w-sm sm:max-w-md p-7 sm:p-8 text-center animate-scale-in">
            <div className="w-16 h-16 sm:w-18 sm:h-18 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: '32px' }}>emergency</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-on-surface mb-2">Emergency SOS</h2>
            <p className="text-sm sm:text-base text-on-surface-variant mb-6">This will alert all emergency contacts with your location.</p>
            <a
              href="tel:911"
              className="block w-full py-3.5 sm:py-4 bg-secondary text-on-secondary rounded-xl font-semibold text-base sm:text-lg mb-3"
            >
              Call 911
            </a>
            <button
              onClick={() => setShowSOS(false)}
              className="w-full py-3 sm:py-3.5 bg-surface-container-low text-on-surface-variant rounded-xl font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
