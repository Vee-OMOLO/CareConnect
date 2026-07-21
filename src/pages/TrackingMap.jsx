import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const caregiverIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="width:36px;height:36px;background:#041627;border-radius:12px;border:2.5px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center">
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
    { name: 'Home', address: '123 Oak Street', time: 'Current', status: 'active', icon: 'home', type: 'play' },
    { name: "Children's Hospital", address: '456 Medical Ave', time: 'Yesterday', status: 'visited', icon: 'local_hospital', type: 'medicine' },
    { name: 'City Pharmacy', address: '789 Main St', time: 'Mar 13', status: 'visited', icon: 'local_pharmacy', type: 'feeding' },
    { name: 'Central Park', address: '101 Park Lane', time: 'Mar 12', status: 'visited', icon: 'park', type: 'play' },
  ];

  return (
    <div className="pb-28 pt-6 px-4 sm:px-6 md:px-8 min-h-dvh">
      <PageHeader title="GPS Tracking" subtitle="Real-time location" onBack />

      {/* Live Tracking Toggle */}
      <Card className="mb-4 sm:mb-5 animate-fade-in-up" padding="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${watching ? 'bg-health-bg' : 'bg-surface-container-low'}`}>
              <span className={`material-symbols-outlined text-${watching ? 'health' : 'outline'}`} style={{ fontSize: '22px' }}>location_on</span>
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-on-surface">Live Tracking</p>
              <p className="text-xs sm:text-sm text-outline">{watching ? 'Active' : 'Tap to start'}</p>
            </div>
          </div>
          <button onClick={toggleTracking} className={`w-13 h-7 sm:w-14 sm:h-7 rounded-full transition-all duration-200 relative ${watching ? 'bg-health' : 'bg-outline-variant'}`}>
            <div className={`w-5.5 h-5.5 bg-white rounded-full absolute top-[3px] transition-all duration-200 shadow-sm ${watching ? 'left-[26px]' : 'left-[3px]'}`} style={{ width: '22px', height: '22px' }} />
          </button>
        </div>
      </Card>

      {error && (
        <div className="flex items-center gap-2 bg-medicine-bg px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl mb-4 sm:mb-5 text-sm sm:text-base font-medium text-medicine animate-fade-in-up">
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>info</span>
          {error}
        </div>
      )}

      {/* Map */}
      {position && (
        <div className="rounded-2xl overflow-hidden mb-4 sm:mb-5 animate-scale-in" style={{ height: 'min(300px, 50vw)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} icon={caregiverIcon}>
              <Popup><div className="text-center text-sm"><strong>Caregiver</strong><br />{position[0].toFixed(6)}, {position[1].toFixed(6)}</div></Popup>
            </Marker>
            <LocationUpdater position={position} />
          </MapContainer>
        </div>
      )}

      {/* Coordinates */}
      {position && (
        <Card className="mb-4 sm:mb-5 animate-fade-in-up" padding="p-3.5 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] sm:text-xs text-outline font-medium">Coordinates</p>
              <p className="text-sm sm:text-base font-mono font-semibold text-on-surface">{position[0].toFixed(6)}, {position[1].toFixed(6)}</p>
            </div>
            <button onClick={copyMapsLink} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-surface-container-low text-xs sm:text-sm font-semibold text-on-surface card-hover">
              Copy
            </button>
          </div>
        </Card>
      )}

      {/* Location History */}
      <h2 className="text-xs sm:text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 sm:mb-4">History</h2>
      <div className="space-y-2 sm:space-y-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {recentLocations.map(loc => (
          <Card key={loc.name} className={`activity-${loc.type}-border`} padding="p-3.5 sm:p-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg activity-${loc.type}-bg flex items-center justify-center flex-shrink-0`}>
                <span className={`material-symbols-outlined text-${loc.type}`} style={{ fontSize: '20px' }}>{loc.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-semibold text-on-surface">{loc.name}</p>
                <p className="text-xs sm:text-sm text-outline">{loc.address}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${loc.status === 'active' ? 'bg-health-bg text-health' : 'bg-surface-container-low text-outline'}`}>
                  {loc.status === 'active' ? 'Active' : 'Visited'}
                </span>
                <p className="text-[10px] sm:text-xs text-outline mt-0.5">{loc.time}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
