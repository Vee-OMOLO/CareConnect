import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';

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
    <div className="pb-28 pt-6 px-4 sm:px-6 md:px-8 min-h-dvh">
      <PageHeader
        title="Safety Vault"
        subtitle="Emergency contacts & medical info"
        onBack
        rightAction={
          <span className={`text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full ${isOnline ? 'bg-health-bg text-health' : 'bg-medicine-bg text-medicine'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        }
      />

      {/* SOS */}
      <button className="w-full bg-secondary text-on-secondary py-4 sm:py-[18px] rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 mb-5 sm:mb-6 sos-glow card-hover animate-fade-in-up min-h-[56px] sm:min-h-[60px]">
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>emergency</span>
        Emergency SOS
      </button>

      {/* Emergency Contacts */}
      <div className="mb-5 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-xs sm:text-sm font-bold text-on-surface-variant uppercase tracking-wider">Contacts</h2>
          <button onClick={() => setShowAddContact(true)} className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/8 rounded-lg flex items-center justify-center card-hover">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>add</span>
          </button>
        </div>
        <Card padding="p-0">
          <div className="divide-y divide-outline-variant/15">
            {contacts.map((contact, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4">
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${contact.isPrimary ? 'bg-medicine-bg' : 'bg-primary-container'}`}>
                  <span className={`material-symbols-outlined ${contact.isPrimary ? 'text-medicine' : 'text-on-primary-container'}`} style={{ fontSize: '20px' }}>person</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm sm:text-base font-semibold text-on-surface truncate">{contact.name}</p>
                    {contact.isPrimary && <span className="text-[9px] sm:text-[10px] bg-medicine-bg text-medicine px-1.5 sm:px-2 py-0.5 rounded-full font-semibold">Primary</span>}
                  </div>
                  <p className="text-xs sm:text-sm text-outline mt-0.5">{contact.role}</p>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <a href={`tel:${contact.phone}`} className="w-10 h-10 sm:w-11 sm:h-11 bg-health-bg rounded-lg flex items-center justify-center card-hover">
                    <span className="material-symbols-outlined text-health" style={{ fontSize: '18px' }}>call</span>
                  </a>
                  {!contact.isPrimary && (
                    <button onClick={() => removeContact(i)} className="w-10 h-10 sm:w-11 sm:h-11 bg-surface-container-low rounded-lg flex items-center justify-center card-hover">
                      <span className="material-symbols-outlined text-outline" style={{ fontSize: '18px' }}>close</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Medical Information */}
      <div className="mb-5 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xs sm:text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 sm:mb-4">Medical Info</h2>
        <Card padding="p-0">
          <div className="divide-y divide-outline-variant/15">
            {medicalInfo.map((info, i) => (
              <div key={i} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 bg-surface-container-low rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '20px' }}>{info.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] sm:text-xs text-outline font-medium">{info.label}</p>
                  <p className="text-sm sm:text-base font-semibold text-on-surface">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Medical Documents */}
      <div className="mb-5 sm:mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <h2 className="text-xs sm:text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 sm:mb-4">Documents</h2>
        <div className="space-y-2 sm:space-y-3">
          {[
            { name: 'Insurance Card', icon: 'credit_card', type: 'primary' },
            { name: 'Advance Directive', icon: 'description', type: 'play' },
            { name: 'Recent Lab Results', icon: 'lab', type: 'medicine' },
          ].map((doc, i) => (
            <Card key={i} className={`activity-${doc.type}-border`} padding="p-3.5 sm:p-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg activity-${doc.type}-bg flex items-center justify-center flex-shrink-0`}>
                  <span className={`material-symbols-outlined text-${doc.type}`} style={{ fontSize: '20px' }}>{doc.icon}</span>
                </div>
                <span className="text-sm sm:text-base font-semibold text-on-surface flex-1">{doc.name}</span>
                <span className="material-symbols-outlined text-outline" style={{ fontSize: '20px' }}>chevron_right</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Offline Notice */}
      {!isOnline && (
        <Card className="mb-5 sm:mb-6 bg-medicine-bg/30 border border-medicine/15 animate-fade-in-up" padding="p-3.5 sm:p-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-medicine" style={{ fontSize: '20px' }}>cloud_off</span>
            <p className="text-sm sm:text-base text-on-surface">Offline — contacts saved locally</p>
          </div>
        </Card>
      )}

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowAddContact(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md p-6 sm:p-8 pb-8 sm:pb-10 animate-slide-up shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <div className="w-10 h-1 bg-outline-variant/40 rounded-full mx-auto sm:mb-5 mb-5" />
            <h2 className="text-lg sm:text-xl font-bold text-on-surface mb-5 sm:mb-6">Add Contact</h2>
            <div className="space-y-3 sm:space-y-4">
              <input value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} placeholder="Contact name" className="glass-input" />
              <input value={newContact.role} onChange={(e) => setNewContact({ ...newContact, role: e.target.value })} placeholder="Relationship" className="glass-input" />
              <input type="tel" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} placeholder="Phone number" className="glass-input" />
              <button onClick={addContact} disabled={!newContact.name || !newContact.phone} className="w-full bg-primary text-on-primary py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg disabled:opacity-40 mt-1 min-h-[56px]">
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
