import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';

const todayMetrics = [
  { type: 'feeding', icon: 'restaurant', label: 'Feedings', value: '5', last: '23 min ago' },
  { type: 'sleep', icon: 'bedtime', label: 'Naps', value: '2', last: '1h ago' },
  { type: 'diaper', icon: 'child_care', label: 'Changes', value: '3', last: '45 min ago' },
];

const quickActions = [
  { icon: 'calendar_month', label: 'Calendar', color: 'bg-primary-container text-on-primary-container', path: '/parent/calendar' },
  { icon: 'location_on', label: 'Track', color: 'bg-play-bg text-play', path: '/parent/tracking' },
  { icon: 'shield', label: 'Safety', color: 'bg-medicine-bg text-medicine', path: '/safety-vault' },
];

const timeline = [
  { id: 1, type: 'feeding', icon: 'restaurant', text: 'Sarah fed bottle — 4oz formula', time: '8:15 AM' },
  { id: 2, type: 'play', icon: 'sports_esports', text: 'James — tummy time 15 min', time: '9:30 AM' },
  { id: 3, type: 'medicine', icon: 'medication', text: 'Sarah — vitamin drops', time: '10:00 AM' },
  { id: 4, type: 'diaper', icon: 'child_care', text: 'Sarah — diaper changed', time: '10:30 AM' },
  { id: 5, type: 'sleep', icon: 'bedtime', text: 'Sarah — nap started', time: '11:00 AM' },
];

function timeSince(minutes) {
  if (minutes < 60) return `${minutes}m ago`;
  const h = Math.floor(minutes / 60);
  return `${h}h ago`;
}

export default function ParentHome() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const greetingTime = new Date().getHours();
  const greeting = greetingTime < 12 ? 'Good morning' : greetingTime < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="pb-28 pt-5 px-5 min-h-dvh">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <p className="text-sm text-on-surface-variant">{greeting}</p>
          <h1 className="text-[22px] font-bold text-on-surface tracking-tight">Margaret</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center relative card-hover">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '22px' }}>notifications</span>
            <div className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full" />
          </button>
          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center card-hover">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>person</span>
          </button>
        </div>
      </div>

      {/* Olivia's Day — Today Status */}
      <Card className="mb-5 animate-fade-in-up" padding="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-health-bg flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-health" style={{ fontSize: '24px' }}>child_care</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">Olivia's Day</h3>
            <p className="text-xs text-on-surface-variant">Doing well — 3 activities logged</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {todayMetrics.map((m) => (
            <div key={m.type} className={`rounded-xl p-3 activity-${m.type}-bg text-center`}>
              <span className={`material-symbols-outlined text-${m.type}`} style={{ fontSize: '20px' }}>{m.icon}</span>
              <p className="text-lg font-bold text-on-surface mt-1">{m.value}</p>
              <p className="text-[10px] text-on-surface-variant">{m.label}</p>
              <p className={`text-[10px] font-medium text-${m.type} mt-0.5`}>{m.last}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="mb-5 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex gap-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.path)}
              className="flex-1 card card-interactive p-3 flex flex-col items-center gap-2"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${action.color}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{action.icon}</span>
              </div>
              <span className="text-xs font-semibold text-on-surface">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Timeline */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">Today</h2>
        <Card padding="p-0">
          <div className="divide-y divide-outline-variant/15">
            {timeline.map((item, i) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-9 h-9 rounded-lg activity-${item.type}-bg flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined text-${item.type}`} style={{ fontSize: '18px' }}>{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-on-surface truncate">{item.text}</p>
                </div>
                <span className="text-xs text-outline flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
