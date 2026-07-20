import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const caregiverIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="width:36px;height:36px;background:#041627;border-radius:12px;border:3px solid white;box-shadow:0 4px 16px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center">
    <span class="material-symbols-outlined" style="color:white;font-size:20px">person</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function LocationUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
}

export default function TrackingMap() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('map');
  const [position, setPosition] = useState(null);
  const [watching, setWatching] = useState(false);
  const [error, setError] = useState('');
  const [locationHistory, setLocationHistory] = useState([]);
  const watchIdRef = useRef(null);
  const defaultPosition = [-1.2921, 36.8219];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          setLocationHistory(prev => [...prev, { lat: pos.coords.latitude, lng: pos.coords.longitude, time: new Date().toLocaleTimeString(), label: 'Current Location' }]);
        },
        () => { setError('Location access denied. Using default.'); setPosition(defaultPosition); },
        { enableHighAccuracy: true }
      );
    } else { setPosition(defaultPosition); }
    return () => { if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current); };
  }, []);

  function toggleTracking() {
    if (watching) {
      if (watchIdRef.current) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
      setWatching(false);
    } else if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const newPos = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          setLocationHistory(prev => [...prev, { lat: pos.coords.latitude, lng: pos.coords.longitude, time: new Date().toLocaleTimeString(), label: `Update ${prev.length + 1}` }]);
        },
        () => setError('Could not track location'),
        { enableHighAccuracy: true, maximumAge: 10000, distanceFilter: 10 }
      );
      setWatching(true);
    }
  }

  function copyMapsLink() {
    if (position) navigator.clipboard.writeText(`https://www.google.com/maps?q=${position[0]},${position[1]}`);
  }

  const recentLocations = [
    { name: 'Home', address: '123 Oak Street', time: 'Current', status: 'active', icon: 'home', color: 'bg-on-tertiary-container' },
    { name: "Children's Hospital", address: '456 Medical Ave', time: 'Yesterday, 2:30 PM', status: 'visited', icon: 'local_hospital', color: 'bg-secondary' },
    { name: 'City Pharmacy', address: '789 Main St', time: 'Mar 13, 11:00 AM', status: 'visited', icon: 'local_pharmacy', color: 'bg-primary' },
    { name: 'Central Park', address: '101 Park Lane', time: 'Mar 12, 9:00 AM', status: 'visited', icon: 'park', color: 'bg-on-tertiary-container' },
  ];

  return (
    <div className="pb-28 pt-4 px-5 min-h-dvh">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7 animate-fade-in-up">
        <button onClick={() => navigate(-1)} className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center card-hover">
          <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-on-surface">GPS Tracking</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">Real-time location sharing</p>
        </div>
        <div className="flex gap-1.5">
          <button onClick={() => setViewMode('map')} className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${viewMode === 'map' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'glass-card text-on-surface-variant'}`}>Map</button>
          <button onClick={() => setViewMode('list')} className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${viewMode === 'list' ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'glass-card text-on-surface-variant'}`}>List</button>
        </div>
      </div>

      {/* Live Tracking Toggle */}
      <div className="glass-card rounded-3xl p-5 mb-6 flex items-center justify-between animate-fade-in-up card-hover" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center gap-4">
          <div className={`w-13 h-13 rounded-2xl flex items-center justify-center transition-all ${watching ? 'bg-on-tertiary-container' : 'bg-surface-container'}`}>
            <span className={`material-symbols-outlined ${watching ? 'text-on-tertiary' : 'text-outline'}`} style={{ fontSize: '24px' }}>location_on</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">Live GPS Tracking</p>
            <p className="text-[11px] text-outline mt-0.5">{watching ? 'Tracking active' : 'Tap to start sharing'}</p>
          </div>
        </div>
        <button onClick={toggleTracking} className={`w-14 h-8 rounded-full transition-all duration-300 relative ${watching ? 'bg-on-tertiary-container' : 'bg-outline-variant'}`}>
          <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-md ${watching ? 'left-7' : 'left-1'}`}></div>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-secondary-container/20 px-4 py-3 rounded-2xl mb-5 text-sm font-medium text-secondary animate-fade-in-up">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>info</span>
          {error}
        </div>
      )}

      {/* Map View */}
      {viewMode === 'map' && position && (
        <div className="glass-card rounded-3xl overflow-hidden mb-6 animate-scale-in" style={{ height: '340px' }}>
          <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} icon={caregiverIcon}>
              <Popup><div className="text-center"><strong>Caregiver Location</strong><br />{position[0].toFixed(6)}, {position[1].toFixed(6)}</div></Popup>
            </Marker>
            <LocationUpdater position={position} />
          </MapContainer>
        </div>
      )}

      {/* Coordinates */}
      {position && (
        <div className="glass-card rounded-2xl p-4 mb-6 flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div>
            <p className="text-[11px] text-outline font-medium">Current Coordinates</p>
            <p className="text-sm font-mono font-semibold text-on-surface mt-0.5">{position[0].toFixed(6)}, {position[1].toFixed(6)}</p>
          </div>
          <button onClick={copyMapsLink} className="glass-input px-3.5 py-2 rounded-xl text-xs font-semibold text-on-surface flex items-center gap-1.5 card-hover">
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>content_copy</span>
            Copy
          </button>
        </div>
      )}

      {/* Period Tabs */}
      <div className="flex gap-1.5 mb-5 bg-surface-container rounded-2xl p-1 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        {['Today', 'This Week', 'All'].map((period, i) => (
          <button key={period} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${i === 0 ? 'bg-white shadow-sm text-on-surface' : 'text-outline'}`}>
            {period}
          </button>
        ))}
      </div>

      {/* Location History */}
      <div className="space-y-3 stagger-children animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {recentLocations.map(loc => (
          <div key={loc.name} className="glass-card rounded-2xl p-4 flex items-center gap-3.5 card-hover animate-fade-in-up">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${loc.color}`}>
              <span className="material-symbols-outlined text-on-secondary" style={{ fontSize: '22px' }}>{loc.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface">{loc.name}</p>
              <p className="text-[11px] text-outline mt-0.5">{loc.address}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                loc.status === 'active' ? 'bg-on-tertiary-container/10 text-on-tertiary-container' : 'bg-surface-container text-outline'
              }`}>
                {loc.status === 'active' ? 'Active' : 'Visited'}
              </span>
              <p className="text-[10px] text-outline mt-1">{loc.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
