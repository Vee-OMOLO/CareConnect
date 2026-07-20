import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const weeklyData = [
  { day: 'M', sleep: 7, feeding: 5, diaper: 6, play: 8 },
  { day: 'T', sleep: 8, feeding: 6, diaper: 7, play: 7 },
  { day: 'W', sleep: 6, feeding: 7, diaper: 5, play: 6 },
  { day: 'T', sleep: 7, feeding: 5, diaper: 8, play: 9 },
  { day: 'F', sleep: 9, feeding: 6, diaper: 7, play: 8 },
  { day: 'S', sleep: 8, feeding: 8, diaper: 6, play: 7 },
  { day: 'S', sleep: 7, feeding: 7, diaper: 7, play: 8 },
];

const activityFeed = [
  { id: 1, icon: 'restaurant', color: 'bg-secondary-container text-on-secondary-container', title: 'Feeding logged', subtitle: 'Bottle - 4oz formula', time: '8:15 AM', caregiver: 'Sarah M.' },
  { id: 2, icon: 'sports_esports', color: 'bg-on-tertiary-container/10 text-on-tertiary-container', title: 'Play time', subtitle: 'Tummy time - 15 minutes', time: '9:30 AM', caregiver: 'James K.' },
  { id: 3, icon: 'medication', color: 'bg-primary-container text-on-primary-container', title: 'Medicine given', subtitle: 'Vitamin drops', time: '10:00 AM', caregiver: 'Sarah M.' },
  { id: 4, icon: 'child_care', color: 'bg-secondary-container text-on-secondary-container', title: 'Diaper change', subtitle: 'Wet diaper changed', time: '10:30 AM', caregiver: 'Sarah M.' },
  { id: 5, icon: 'bedtime', color: 'bg-primary-container text-on-primary-container', title: 'Nap started', subtitle: 'Fell asleep at 11:00 AM', time: '11:00 AM', caregiver: 'Sarah M.' },
];

export default function ParentHome() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');

  const maxVal = 10;
  const greetingTime = new Date().getHours();
  const greeting = greetingTime < 12 ? 'Good morning' : greetingTime < 17 ? 'Good afternoon' : 'Good evening';

  function handleAddEvent() {
    if (eventTitle && eventDate) {
      setShowAddEvent(false);
      setEventTitle('');
      setEventDate('');
      setEventTime('');
    }
  }

  return (
    <div className="pb-28 pt-4 px-5 min-h-dvh">
      {/* Header */}
      <div className="flex items-center justify-between mb-7 animate-fade-in-up">
        <div>
          <p className="text-sm text-on-surface-variant mb-1">{greeting}</p>
          <h1 className="text-[26px] font-bold text-on-surface tracking-tight">Margaret</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center relative card-hover">
            <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '24px' }}>notifications</span>
            <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-white"></div>
          </button>
          <button onClick={() => navigate('/profile')} className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center card-hover">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '24px' }}>person</span>
          </button>
        </div>
      </div>

      {/* Status Card */}
      <div className="glass-card rounded-3xl p-5 mb-6 animate-fade-in-up card-hover" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-on-tertiary-container/15 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontSize: '28px' }}>child_care</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-on-surface">Olivia is doing well</h3>
              <span className="text-lg">✨</span>
            </div>
            <p className="text-sm text-on-surface-variant truncate">3 activities logged today by caregivers</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-outline-variant/20">
          <div className="text-center">
            <p className="text-lg font-bold text-on-surface">5</p>
            <p className="text-[11px] text-outline mt-0.5">Feedings</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-on-surface">2</p>
            <p className="text-[11px] text-outline mt-0.5">Naps</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-on-surface">3</p>
            <p className="text-[11px] text-outline mt-0.5">Changes</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-3 gap-3 stagger-children">
          {[
            { icon: 'calendar_month', label: 'Calendar', color: 'bg-primary-container text-on-primary-container', path: '/parent/calendar' },
            { icon: 'location_on', label: 'GPS Track', color: 'bg-on-tertiary-container/10 text-on-tertiary-container', path: '/parent/tracking' },
            { icon: 'shield', label: 'Safety', color: 'bg-secondary-container text-on-secondary-container', path: '/safety-vault' },
            { icon: 'bar_chart', label: 'Reports', color: 'bg-primary-container text-on-primary-container', path: '#' },
            { icon: 'chat', label: 'Messages', color: 'bg-on-tertiary-container/10 text-on-tertiary-container', path: '#' },
            { icon: 'settings', label: 'Settings', color: 'bg-surface-container text-on-surface-variant', path: '/profile' },
          ].map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2.5 card-hover animate-scale-in"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{action.icon}</span>
              </div>
              <span className="text-xs font-medium text-on-surface">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">This Week</h2>
          <button className="text-sm font-medium text-primary">View All</button>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-end justify-between h-32 mb-3">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '100px' }}>
                  <div className="w-5 rounded-full bg-primary/10 relative overflow-hidden" style={{ height: `${(d.sleep / maxVal) * 100}%` }}>
                    <div className="absolute bottom-0 w-full rounded-full bg-primary transition-all duration-500" style={{ height: '100%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3">
            {weeklyData.map((d, i) => (
              <span key={i} className="text-[11px] font-medium text-outline flex-1 text-center">{d.day}</span>
            ))}
          </div>
          <div className="flex items-center justify-center gap-5 mt-3">
            {[
              { label: 'Sleep', color: 'bg-primary' },
              { label: 'Feed', color: 'bg-secondary' },
              { label: 'Play', color: 'bg-on-tertiary-container' },
            ].map((l, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${l.color}`}></div>
                <span className="text-[11px] text-outline">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Recent Activity</h2>
          <button className="text-sm font-medium text-primary">See All</button>
        </div>
        <div className="space-y-3 stagger-children">
          {activityFeed.map(activity => (
            <div key={activity.id} className="glass-card rounded-2xl p-4 flex items-center gap-3.5 card-hover animate-fade-in-up">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{activity.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface">{activity.title}</p>
                <p className="text-xs text-on-surface-variant mt-0.5 truncate">{activity.subtitle}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-medium text-on-surface">{activity.time}</p>
                <p className="text-[11px] text-outline mt-0.5">{activity.caregiver}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event FAB */}
      <button
        onClick={() => setShowAddEvent(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 z-40 card-hover"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>add</span>
      </button>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddEvent(false)}></div>
          <div className="relative glass-card rounded-t-[32px] w-full max-w-[430px] p-7 pb-10 animate-slide-up">
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-6"></div>
            <h2 className="text-xl font-bold text-on-surface mb-6">Add Event</h2>
            <div className="space-y-4">
              <input
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Event title"
                className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface placeholder:text-outline text-[15px]"
              />
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface text-[15px]"
              />
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface text-[15px]"
              />
              <button
                onClick={handleAddEvent}
                disabled={!eventTitle || !eventDate}
                className="w-full bg-primary text-on-primary py-4.5 rounded-2xl font-semibold text-[16px] hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
