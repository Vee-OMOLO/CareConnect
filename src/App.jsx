import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import ParentHome from './pages/ParentHome';
import CaregiverHome from './pages/CaregiverHome';
import LogActivity from './pages/LogActivity';
import Calendar from './pages/Calendar';
import TrackingMap from './pages/TrackingMap';
import SafetyVault from './pages/SafetyVault';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function RoleGate({ children }) {
  const { currentUser, userRole } = useAuth();
  if (!currentUser) return <Navigate to="/login" />;
  if (!userRole) return <Navigate to="/role-selection" />;
  return children;
}

export default function App() {
  const { currentUser, userRole } = useAuth();

  return (
    <div className="min-h-dvh bg-surface">
      {/* App Shell - mobile-width container */}
      <div className="app-shell">
        <Routes>
          <Route path="/login" element={
            currentUser ? <Navigate to={userRole === 'parent' ? '/parent' : userRole === 'caregiver' ? '/caregiver' : '/role-selection'} /> : <Login />
          } />
          <Route path="/register" element={
            currentUser ? <Navigate to="/role-selection" /> : <Register />
          } />
          <Route path="/role-selection" element={
            <ProtectedRoute><RoleSelection /></ProtectedRoute>
          } />

          {/* Parent Routes */}
          <Route path="/parent" element={<RoleGate><ParentHome /></RoleGate>} />
          <Route path="/parent/calendar" element={<RoleGate><Calendar /></RoleGate>} />
          <Route path="/parent/tracking" element={<RoleGate><TrackingMap /></RoleGate>} />

          {/* Caregiver Routes */}
          <Route path="/caregiver" element={<RoleGate><CaregiverHome /></RoleGate>} />
          <Route path="/caregiver/log" element={<RoleGate><LogActivity /></RoleGate>} />

          {/* Common Routes */}
          <Route path="/safety-vault" element={<RoleGate><SafetyVault /></RoleGate>} />
          <Route path="/profile" element={<RoleGate><Profile /></RoleGate>} />

          <Route path="*" element={<Navigate to={currentUser ? (userRole === 'parent' ? '/parent' : userRole === 'caregiver' ? '/caregiver' : '/role-selection') : '/login'} />} />
        </Routes>

        {currentUser && userRole && <BottomNav />}
      </div>
    </div>
  );
}
