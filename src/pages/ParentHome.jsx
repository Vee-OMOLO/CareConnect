import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToActivities } from '../services/firestoreService';

const activityIcons = {
  feeding: 'restaurant',
  sleep: 'bedtime',
  diaper: 'child_care',
  play: 'sports_esports',
  medicine: 'medication',
  health: 'favorite',
};

export default function ParentHome() {
  const navigate = useNavigate();
  const { currentUser, linkKey, childName } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!linkKey) { setLoading(false); return; }
    const unsub = subscribeToActivities(linkKey, (data) => {
      setActivities(data);
      setLoading(false);
    });
    return unsub;
  }, [linkKey]);

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  const today = new Date().toDateString();
  const todayActivities = activities.filter(a => {
    if (!a.timestamp) return false;
    const d = a.timestamp.seconds ? new Date(a.timestamp.seconds * 1000) : new Date(a.createdAt);
    return d.toDateString() === today;
  });

  const todayByType = {
    feeding: todayActivities.filter(a => a.activityType === 'feeding'),
    sleep: todayActivities.filter(a => a.activityType === 'sleep'),
    diaper: todayActivities.filter(a => a.activityType === 'diaper'),
  };

  function timeAgo(date) {
    if (!date) return '';
    const d = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
    const mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  const displayActivities = todayActivities.slice(0, 5);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="min-w-0">
          <p className="text-sm text-on-surface-variant">{greeting}</p>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">{childName || 'Your Child'}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center card-interactive">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
          </button>
        </div>
      </div>

      {/* Today Status */}
      <div className="card p-4 animate-fade-in-up" style={{ animationDelay: '0.03s' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-health-bg flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-health text-[20px]">child_care</span>
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-on-surface">{childName || 'Child'}'s Day</h3>
            <p className="text-xs text-on-surface-variant">{todayActivities.length} activities logged</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { type: 'feeding', label: 'Feedings', data: todayByType.feeding },
            { type: 'sleep', label: 'Naps', data: todayByType.sleep },
            { type: 'diaper', label: 'Changes', data: todayByType.diaper },
          ].map((m) => (
            <div key={m.type} className={`rounded-xl p-3 activity-${m.type}-bg text-center`}>
              <span className={`material-symbols-outlined text-${m.type} text-[18px]`}>{activityIcons[m.type]}</span>
              <p className="text-lg font-bold text-on-surface mt-1">{m.data.length}</p>
              <p className="text-[10px] text-on-surface-variant">{m.label}</p>
              {m.data.length > 0 && (
                <p className={`text-[10px] font-medium text-${m.type} mt-0.5`}>{timeAgo(m.data[0].timestamp)}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.06s' }}>
        {[
          { icon: 'calendar_month', label: 'Calendar', color: 'bg-primary-container text-on-primary-container', path: '/parent/calendar' },
          { icon: 'location_on', label: 'Track', color: 'bg-play-bg text-play', path: '/parent/tracking' },
          { icon: 'shield', label: 'Safety', color: 'bg-medicine-bg text-medicine', path: '/safety-vault' },
        ].map((action, i) => (
          <button key={i} onClick={() => navigate(action.path)} className="flex-1 card p-3 flex flex-col items-center gap-2 card-interactive">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
              <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
            </div>
            <span className="text-xs font-semibold text-on-surface">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.09s' }}>
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Today</h2>
        {loading ? (
          <div className="card p-4 text-center text-sm text-outline">Loading...</div>
        ) : displayActivities.length === 0 ? (
          <div className="card p-4 text-center text-sm text-outline">No activities logged today</div>
        ) : (
          <div className="card overflow-hidden">
            <div className="divide-y divide-outline-variant/15">
              {displayActivities.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-8 h-8 rounded-lg activity-${item.activityType}-bg flex items-center justify-center flex-shrink-0`}>
                    <span className={`material-symbols-outlined text-${item.activityType} text-[16px]`}>
                      {activityIcons[item.activityType] || 'circle'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface truncate">
                      {item.activityType} — {item.details?.option || 'logged'}
                      {item.details?.quantity ? ` (${item.details.quantity})` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-outline flex-shrink-0">
                    {item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
