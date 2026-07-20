import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const activityTypes = {
  feeding: { icon: 'restaurant', label: 'Feeding', color: 'bg-secondary-container text-on-secondary-container', options: ['Bottle', 'Solids', 'Breastfeeding', 'Skipped'] },
  sleep: { icon: 'bedtime', label: 'Sleep', color: 'bg-primary-container text-on-primary-container', options: ['Started', 'Woke Up', 'Nap', 'Night Sleep'] },
  diaper: { icon: 'child_care', label: 'Diaper', color: 'bg-on-tertiary-container/10 text-on-tertiary-container', options: ['Wet', 'Dirty', 'Both', 'Dry'] },
  play: { icon: 'sports_esports', label: 'Play', color: 'bg-secondary-container text-on-secondary-container', options: ['Indoor', 'Outdoor', 'Tummy Time', 'Sensory'] },
  medicine: { icon: 'medication', label: 'Medicine', color: 'bg-primary-container text-on-primary-container', options: ['Given', 'Skipped', 'Dose Adjusted'] },
  health: { icon: 'favorite', label: 'Health', color: 'bg-on-tertiary-container/10 text-on-tertiary-container', options: ['Temperature', 'Vitals Check', 'Symptom', 'Normal'] },
};

export default function LogActivity() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'feeding';

  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedOption, setSelectedOption] = useState('');
  const [notes, setNotes] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [saved, setSaved] = useState(false);

  const currentActivity = activityTypes[selectedType];

  function handleSave() {
    setSaved(true);
    setTimeout(() => {
      navigate('/caregiver');
    }, 1200);
  }

  if (saved) {
    return (
      <div className="pb-24 pt-4 px-5 min-h-dvh flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="w-20 h-20 bg-on-tertiary-container/15 rounded-full flex items-center justify-center mx-auto mb-5 animate-breathe">
            <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontSize: '40px' }}>check_circle</span>
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Logged!</h2>
          <p className="text-sm text-on-surface-variant">{currentActivity.label} activity recorded successfully</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28 pt-4 px-5 min-h-dvh">
      {/* Header */}
      <div className="flex items-center gap-3 mb-7 animate-fade-in-up">
        <button onClick={() => navigate(-1)} className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center card-hover">
          <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        <div>
          <h1 className="text-xl font-bold text-on-surface">Log {currentActivity.label}</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">Record activity details</p>
        </div>
      </div>

      {/* Activity Type Selector */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
          {Object.entries(activityTypes).map(([key, act]) => (
            <button
              key={key}
              onClick={() => { setSelectedType(key); setSelectedOption(''); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                selectedType === key
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                  : 'glass-card text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{act.icon}</span>
              {act.label}
            </button>
          ))}
        </div>
      </div>

      {/* Options Grid */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm font-semibold text-on-surface mb-3">Select Type</h3>
        <div className="grid grid-cols-2 gap-3 stagger-children">
          {currentActivity.options.map((option, i) => (
            <button
              key={i}
              onClick={() => setSelectedOption(option)}
              className={`glass-card rounded-2xl p-4 text-center font-medium text-sm transition-all card-hover animate-scale-in ${
                selectedOption === option
                  ? 'bg-primary text-on-primary border-2 border-primary shadow-lg shadow-primary/15'
                  : 'text-on-surface border-2 border-transparent'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity (for feeding/medicine) */}
      {(selectedType === 'feeding' || selectedType === 'medicine') && (
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <h3 className="text-sm font-semibold text-on-surface mb-3">Quantity</h3>
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={selectedType === 'feeding' ? 'e.g. 4oz, 120ml' : 'e.g. 5ml, 1 tablet'}
            className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface placeholder:text-outline text-[15px]"
          />
        </div>
      )}

      {/* Photo Attachment */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <h3 className="text-sm font-semibold text-on-surface mb-3">Photo (optional)</h3>
        <button
          onClick={() => setHasPhoto(!hasPhoto)}
          className={`w-full glass-card rounded-2xl p-5 flex items-center gap-4 transition-all card-hover ${
            hasPhoto ? 'border-2 border-primary bg-primary/5' : 'border-2 border-dashed border-outline-variant/50'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${hasPhoto ? 'bg-primary/15' : 'bg-surface-container'}`}>
            <span className={`material-symbols-outlined ${hasPhoto ? 'text-primary' : 'text-outline'}`} style={{ fontSize: '24px' }}>
              {hasPhoto ? 'photo_camera' : 'add_a_photo'}
            </span>
          </div>
          <div className="text-left">
            <p className={`text-sm font-medium ${hasPhoto ? 'text-on-surface' : 'text-on-surface-variant'}`}>
              {hasPhoto ? 'Photo attached' : 'Add a photo'}
            </p>
            <p className="text-[11px] text-outline mt-0.5">Optional documentation</p>
          </div>
        </button>
      </div>

      {/* Notes */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-sm font-semibold text-on-surface mb-3">Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional details..."
          rows={3}
          className="glass-input w-full px-5 py-4 rounded-2xl text-on-surface placeholder:text-outline text-[15px] resize-none"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!selectedOption}
        className="w-full bg-primary text-on-primary py-4.5 rounded-2xl font-semibold text-[16px] hover:opacity-90 transition-opacity disabled:opacity-50 card-hover"
      >
        Save Activity
      </button>
    </div>
  );
}
