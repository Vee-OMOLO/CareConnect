import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToActivities, createSOSAlert } from '../services/firestoreService';
import Toggle from '../components/Toggle';
import { activityColors, activityTypes } from '../constants/activityData';

export default function CaregiverHome() {
  const navigate = useNavigate();
  const { currentUser, linkKey, childName } = useAuth();
  const [showSOS, setShowSOS] = useState(false);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sosLoading, setSosLoading] = useState(false);

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

  const displayLogs = todayActivities.slice(0, 4);

  async function handleSOS() {
    if (!linkKey) return;
    setSosLoading(true);
    try {
      let position = null;
      try {
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            reject,
            { enableHighAccuracy: true, timeout: 10000 }
          );
        });
      } catch { /* location unavailable */ }

      await createSOSAlert(linkKey, position);
      setShowSOS(false);
      alert('SOS alert sent to emergency contacts.');
    } catch (e) {
      console.error('SOS failed:', e);
      alert('Failed to send SOS. Please call emergency services directly.');
    } finally {
      setSosLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div className="min-w-0">
          <p className="text-sm text-on-surface-variant">{greeting}</p>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">{childName || 'Child'}</h1>
        </div>
        <button
          onClick={() => setShowSOS(true)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-xl font-semibold text-sm sos-glow card-interactive"
        >
          <span className="material-symbols-outlined text-[18px]">emergency_share</span>
          SOS
        </button>
      </div>

      {/* Quick Log */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.03s' }}>
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Quick Log</h2>
        <div className="grid grid-cols-3 gap-2">
          {activityTypes.map((a) => (
            <button
              key={a.type}
              onClick={() => navigate(`/caregiver/log?type=${a.type}`)}
              className="card p-3 flex flex-col items-center gap-2 card-interactive"
              style={{ backgroundColor: activityColors[a.type]?.bg }}
            >
              <span className="material-symbols-outlined text-[24px]" style={{ color: activityColors[a.type]?.text }}>{a.icon}</span>
              <span className="text-xs font-semibold text-on-surface">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Logs */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.06s' }}>
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Today's Log</h2>
        {loading ? (
          <div className="card p-4 text-center text-sm text-outline">Loading...</div>
        ) : displayLogs.length === 0 ? (
          <div className="card p-4 text-center text-sm text-outline">No activities logged today. Tap a category above to log one.</div>
        ) : (
          <div className="card overflow-hidden">
            <div className="divide-y divide-outline-variant/15">
              {displayLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: activityColors[log.activityType]?.bg || '#edeeef' }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: activityColors[log.activityType]?.text || '#44474c' }}>
                      {activityTypes.find(a => a.type === log.activityType)?.icon || 'circle'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface truncate">
                      {log.details?.option || log.activityType}
                      {log.details?.quantity ? ` — ${log.details.quantity}` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-outline flex-shrink-0">
                    {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SOS Modal */}
      {showSOS && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSOS(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm p-6 text-center animate-scale-in shadow-lg">
            <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-secondary text-[28px]">emergency</span>
            </div>
            <h2 className="text-lg font-bold text-on-surface mb-1">Emergency SOS</h2>
            <p className="text-sm text-on-surface-variant mb-5">This will alert all emergency contacts with your location.</p>
            <a href="tel:911" className="block w-full py-3 bg-secondary text-on-secondary rounded-xl font-semibold text-base mb-2">Call 911</a>
            <button
              onClick={handleSOS}
              disabled={sosLoading}
              className="w-full py-3 bg-red-100 text-secondary rounded-xl font-semibold text-sm mb-2"
            >
              {sosLoading ? 'Sending alert...' : 'Alert Emergency Contacts'}
            </button>
            <button onClick={() => setShowSOS(false)} className="w-full py-3 bg-surface-container-low text-on-surface-variant rounded-xl font-medium text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
