import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import BottomNav from './components/BottomNav';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const RoleSelection = lazy(() => import('./pages/RoleSelection'));
const ParentHome = lazy(() => import('./pages/ParentHome'));
const CaregiverHome = lazy(() => import('./pages/CaregiverHome'));
const LogActivity = lazy(() => import('./pages/LogActivity'));
const Calendar = lazy(() => import('./pages/Calendar'));
const TrackingMap = lazy(() => import('./pages/TrackingMap'));
const SafetyVault = lazy(() => import('./pages/SafetyVault'));
const Profile = lazy(() => import('./pages/Profile'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
    </div>
  );
}

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
  const { currentUser, userRole, accountVersion } = useAuth();

  const isAuthPage = !currentUser || !userRole;

  if (isAuthPage) {
    return (
      <div className="app-shell-auth">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes key={`auth-${accountVersion}`}>
              <Route path="/login" element={
                currentUser ? <Navigate to={userRole === 'parent' ? '/parent' : userRole === 'caregiver' ? '/caregiver' : '/role-selection'} /> : <Login />
              } />
              <Route path="/register" element={
                currentUser ? <Navigate to="/role-selection" /> : <Register />
              } />
              <Route path="/role-selection" element={
                <ProtectedRoute><RoleSelection /></ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        <div className="app-content">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes key={`app-${accountVersion}`}>
                <Route path="/parent" element={
                  <RoleGate><ParentHome /></RoleGate>
                } />
                <Route path="/caregiver" element={
                  <RoleGate><CaregiverHome /></RoleGate>
                } />
                <Route path="/caregiver/log" element={
                  <RoleGate><LogActivity /></RoleGate>
                } />
                <Route path="/parent/calendar" element={
                  <RoleGate><Calendar /></RoleGate>
                } />
                <Route path="/parent/tracking" element={
                  <RoleGate><TrackingMap /></RoleGate>
                } />
                <Route path="/safety-vault" element={
                  <RoleGate><SafetyVault /></RoleGate>
                } />
                <Route path="/profile" element={
                  <RoleGate><Profile /></RoleGate>
                } />
                <Route path="*" element={<Navigate to={userRole === 'parent' ? '/parent' : '/caregiver'} />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
