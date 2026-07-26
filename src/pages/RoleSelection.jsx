import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function RoleSelection() {
  const navigate = useNavigate();
  const { currentUser, setRole, setChild, setParentEmail } = useAuth();
  const [childName, setChildNameInput] = useState('');
  const [parentEmailInput, setParentEmailInput] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    if (!childName.trim()) {
      setError("Please enter your child's name");
      return;
    }
    if (selectedRole === 'caregiver' && !parentEmailInput.trim()) {
      setError("Please enter the parent's email");
      return;
    }
    if (selectedRole === 'caregiver' && parentEmailInput.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmailInput.trim())) {
      setError("Please enter a valid email address");
      return;
    }
    setError('');
    setSaving(true);
    try {
      const role = selectedRole;
      if (currentUser) {
        const profileData = {
          role,
          childName: childName.trim(),
          email: currentUser.email,
          createdAt: serverTimestamp(),
        };
        if (role === 'caregiver') {
          profileData.parentEmail = parentEmailInput.trim().toLowerCase();
        }
        await setDoc(doc(db, 'users', currentUser.uid), profileData, { merge: true });
      }
      setRole(role);
      setChild(childName.trim());
      if (role === 'caregiver') {
        setParentEmail(parentEmailInput.trim().toLowerCase());
      }
      navigate(role === 'parent' ? '/parent' : '/caregiver');
    } catch (e) {
      console.error('Failed to save profile:', e);
      setSaving(false);
    }
  }

  function handleSelectRole(role) {
    setSelectedRole(role);
    setError('');
  }

  return (
    <div className="auth-page bg-surface">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-on-primary text-[28px]">health_and_safety</span>
          </div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">CareConnect</h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-on-surface mb-1">Who are you?</h2>
          <p className="text-sm text-on-surface-variant">Select your role to get started</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-error-container text-on-error-container px-4 py-3 rounded-xl mb-4 text-sm font-medium animate-shake">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Child's Name</label>
          <input
            value={childName}
            onChange={(e) => setChildNameInput(e.target.value)}
            placeholder="e.g. Olivia"
            className="auth-input"
          />
        </div>

        {selectedRole === 'caregiver' && (
          <div className="mb-4 animate-fade-in-up">
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Parent's Email</label>
            <input
              value={parentEmailInput}
              onChange={(e) => setParentEmailInput(e.target.value)}
              placeholder="parent@example.com"
              type="email"
              className="auth-input"
            />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {!selectedRole ? (
            <>
              <button
                onClick={() => handleSelectRole('parent')}
                className="auth-card w-full p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-[24px]">family_restroom</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-on-surface">Parent / Guardian</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Monitor activity, view reports, track visits</p>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px] flex-shrink-0">chevron_right</span>
              </button>

              <button
                onClick={() => handleSelectRole('caregiver')}
                className="auth-card w-full p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[24px]">volunteer_activism</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-on-surface">Caregiver</h3>
                  <p className="text-xs text-on-surface-variant mt-0.5">Log activities, manage tasks, send alerts</p>
                </div>
                <span className="material-symbols-outlined text-outline text-[20px] flex-shrink-0">chevron_right</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleConfirm}
                disabled={saving}
                className="auth-button bg-primary text-on-primary"
              >
                {saving ? 'Saving...' : selectedRole === 'parent' ? 'Continue as Parent' : 'Continue as Caregiver'}
              </button>
              <button
                onClick={() => { setSelectedRole(null); setError(''); setParentEmailInput(''); }}
                className="auth-button bg-surface-container-low text-on-surface-variant"
              >
                Back
              </button>
            </>
          )}
        </div>

        <p className="text-center text-[11px] text-outline mt-8">
          Works offline — data syncs when connected
        </p>
      </div>
    </div>
  );
}
