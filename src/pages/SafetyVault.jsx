import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const defaultContacts = [
  { name: 'Dr. Sarah Smith', role: 'Primary Care Physician', phone: '(555) 123-4567', isPrimary: true },
  { name: 'Robert (Son)', role: 'Family Contact', phone: '(555) 234-5678', isPrimary: false },
  { name: '911 Emergency', role: 'Emergency Services', phone: '911', isPrimary: false },
];

const medicalInfo = [
  { label: 'Blood Type', value: 'O+', icon: 'bloodtype' },
  { label: 'Allergies', value: 'Penicillin, Sulfa drugs', icon: 'warning' },
  { label: 'Conditions', value: 'Hypertension, Type 2 Diabetes', icon: 'medical_information' },
  { label: 'Medications', value: 'Lisinopril 10mg, Metformin 500mg', icon: 'medication' },
];

export default function SafetyVault() {
  const navigate = useNavigate();
  const [showAddContact, setShowAddContact] = useState(false);
  const [contacts, setContacts] = useState(defaultContacts);
  const [newContact, setNewContact] = useState({ name: '', role: '', phone: '' });
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  function saveContactsOffline(data) {
    try { localStorage.setItem('careconnect-emergency-contacts', JSON.stringify(data)); } catch (e) { console.error('Save offline failed:', e); }
  }

  function loadContactsOffline() {
    try { const saved = localStorage.getItem('careconnect-emergency-contacts'); if (saved) return JSON.parse(saved); } catch (e) { console.error('Load offline failed:', e); }
    return defaultContacts;
  }

  useEffect(() => {
    setContacts(loadContactsOffline());
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);

  async function addContact() {
    if (!newContact.name || !newContact.phone) return;
    const contact = { ...newContact, isPrimary: false, id: Date.now().toString() };
    const updated = [...contacts, contact];
    setContacts(updated);
    saveContactsOffline(updated);
    if (isOnline) {
      try {
        const linkKey = localStorage.getItem('careconnect-link-key');
        await addDoc(collection(db, 'emergencyContacts'), { ...contact, childId: linkKey, createdAt: new Date().toISOString() });
      } catch (e) { console.log('Firestore sync pending'); }
    }
    setNewContact({ name: '', role: '', phone: '' });
    setShowAddContact(false);
  }

  function removeContact(index) {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
    saveContactsOffline(updated);
  }

  return (
    <div className="pb-28 pt-4 px-5 min-h-dvh">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7 animate-fade-in-up">
        <button onClick={() => navigate(-1)} className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center card-hover">
          <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-on-surface">Safety Vault</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">Emergency contacts & medical info</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card">
          <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-on-tertiary-container' : 'bg-secondary'}`}></div>
          <span className="text-[10px] font-semibold text-outline">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* SOS Button */}
      <button className="w-full bg-secondary text-on-secondary py-5 rounded-2xl font-bold text-[17px] flex items-center justify-center gap-3 mb-7 sos-glow hover:opacity-90 transition-opacity animate-fade-in-up card-hover" style={{ animationDelay: '0.05s' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>emergency</span>
        Emergency SOS
      </button>

      {/* Emergency Contacts */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-on-surface">Emergency Contacts</h2>
          <button onClick={() => setShowAddContact(true)} className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center card-hover">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '22px' }}>add</span>
          </button>
        </div>
        <div className="space-y-3 stagger-children">
          {contacts.map((contact, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-3.5 card-hover animate-fade-in-up">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${contact.isPrimary ? 'bg-secondary-container' : 'bg-primary-container'}`}>
                <span className={`material-symbols-outlined ${contact.isPrimary ? 'text-on-secondary-container' : 'text-on-primary-container'}`} style={{ fontSize: '22px' }}>person</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-on-surface truncate">{contact.name}</p>
                  {contact.isPrimary && <span className="text-[9px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-semibold">Primary</span>}
                </div>
                <p className="text-[11px] text-outline mt-0.5">{contact.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <a href={`tel:${contact.phone}`} className="w-10 h-10 bg-on-tertiary-container/10 rounded-xl flex items-center justify-center card-hover">
                  <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontSize: '20px' }}>call</span>
                </a>
                {!contact.isPrimary && (
                  <button onClick={() => removeContact(i)} className="w-10 h-10 bg-error-container/30 rounded-xl flex items-center justify-center card-hover">
                    <span className="material-symbols-outlined text-error" style={{ fontSize: '20px' }}>delete</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Information */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <h2 className="text-lg font-semibold text-on-surface mb-4">Medical Information</h2>
        <div className="glass-card rounded-2xl overflow-hidden">
          {medicalInfo.map((info, i) => (
            <div key={i} className={`flex items-center gap-3.5 px-5 py-4 ${i < medicalInfo.length - 1 ? 'border-b border-outline-variant/20' : ''}`}>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>{info.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-outline font-medium">{info.label}</p>
                <p className="text-sm font-semibold text-on-surface mt-0.5">{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Documents */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-lg font-semibold text-on-surface mb-4">Medical Documents</h2>
        <div className="space-y-3 stagger-children">
          {[
            { name: 'Insurance Card', icon: 'credit_card', color: 'bg-primary-container text-on-primary-container' },
            { name: 'Advance Directive', icon: 'description', color: 'bg-on-tertiary-container/10 text-on-tertiary-container' },
            { name: 'Recent Lab Results', icon: 'lab', color: 'bg-secondary-container text-on-secondary-container' },
          ].map((doc, i) => (
            <button key={i} className="glass-card rounded-2xl p-4 flex items-center gap-3.5 w-full text-left card-hover animate-fade-in-up">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${doc.color}`}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{doc.icon}</span>
              </div>
              <span className="text-sm font-semibold text-on-surface flex-1">{doc.name}</span>
              <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>chevron_right</span>
            </button>
          ))}
        </div>
      </div>

      {/* Offline Notice */}
      {!isOnline && (
        <div className="glass-card rounded-2xl p-4 bg-secondary-container/10 border border-secondary/20 animate-fade-in-up mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-secondary" style={{ fontSize: '22px' }}>cloud_off</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Offline Mode</p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">Contacts saved locally. Will sync when online.</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddContact(false)}></div>
          <div className="relative glass-card rounded-t-[32px] w-full max-w-[430px] p-7 pb-10 animate-slide-up">
            <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mb-6"></div>
            <h2 className="text-xl font-bold text-on-surface mb-6">Add Emergency Contact</h2>
            <div className="space-y-4">
              <input value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} placeholder="Contact name" className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface placeholder:text-outline text-[15px]" />
              <input value={newContact.role} onChange={(e) => setNewContact({ ...newContact, role: e.target.value })} placeholder="Relationship (e.g. Son, Doctor)" className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface placeholder:text-outline text-[15px]" />
              <input type="tel" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} placeholder="Phone number" className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface placeholder:text-outline text-[15px]" />
              <button onClick={addContact} disabled={!newContact.name || !newContact.phone} className="w-full bg-primary text-on-primary py-4.5 rounded-2xl font-semibold text-[16px] hover:opacity-90 transition-opacity disabled:opacity-50 mt-2">
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
