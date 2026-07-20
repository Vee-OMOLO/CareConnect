import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const activityTypes = [
  { type: 'feeding', icon: 'restaurant', label: 'Feeding', options: ['Bottle', 'Solids', 'Breastfeeding', 'Skipped'] },
  { type: 'sleep', icon: 'bedtime', label: 'Sleep', options: ['Nap', 'Night Sleep', 'Nursery', 'Other'] },
  { type: 'diaper', icon: 'child_care', label: 'Diaper', options: ['Wet', 'Dirty', 'Both', 'Dry'] },
  { type: 'play', icon: 'sports_esports', label: 'Play', options: ['Tummy Time', 'Floor Play', 'Outdoor', 'Sensory'] },
  { type: 'medicine', icon: 'medication', label: 'Medicine', options: ['Drops', 'Syrup', 'Pill', 'Inhaler'] },
  { type: 'health', icon: 'favorite', label: 'Health', options: ['Temperature', 'Doctor Visit', 'Vaccination', 'Other'] },
];

export default function LogActivity() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'feeding';

  const [selectedType, setSelectedType] = useState(initialType);
  const [selectedOption, setSelectedOption] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const currentType = activityTypes.find(a => a.type === selectedType);
  const showQuantity = selectedType === 'feeding' || selectedType === 'medicine';

  function handleSave() {
    setSaved(true);
    setTimeout(() => navigate('/caregiver'), 1200);
  }

  if (saved) {
    return (
      <div className="pb-28 pt-5 px-5 min-h-dvh flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className={`w-16 h-16 rounded-2xl activity-${selectedType}-bg flex items-center justify-center mx-auto mb-4`}>
            <span className={`material-symbols-outlined text-${selectedType}`} style={{ fontSize: '32px' }}>check</span>
          </div>
          <h2 className="text-lg font-bold text-on-surface">Logged!</h2>
          <p className="text-sm text-on-surface-variant mt-1">{currentType?.label} activity saved</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-28 pt-5 px-5 min-h-dvh">
      <PageHeader title="Log Activity" onBack />

      {/* Activity Type Grid */}
      <div className="mb-5 animate-fade-in-up">
        <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">What did you do?</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {activityTypes.map((a) => (
            <button
              key={a.type}
              onClick={() => { setSelectedType(a.type); setSelectedOption(''); }}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-150 touch-target ${
                selectedType === a.type
                  ? `activity-${a.type}`
                  : 'bg-surface-container-low text-on-surface-variant border border-outline-variant/20'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{a.icon}</span>
              <span className="text-xs font-semibold">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub-options */}
      <div className="mb-5 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">Details</h2>
        <div className="card p-3">
          <div className="grid grid-cols-2 gap-2">
            {currentType?.options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedOption(opt)}
                className={`py-3 px-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  selectedOption === opt
                    ? `activity-${selectedType}`
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quantity */}
      {showQuantity && (
        <div className="mb-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">Amount</h2>
          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g. 4 oz"
            className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface"
          />
        </div>
      )}

      {/* Notes */}
      <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.12s' }}>
        <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">Notes <span className="font-normal text-outline">(optional)</span></h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any notes..."
          rows={3}
          className="glass-input w-full px-4 py-3.5 rounded-xl text-on-surface resize-none"
        />
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={!selectedOption}
        className={`w-full py-4 rounded-xl font-semibold text-base text-on-primary transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed`}
        style={{ backgroundColor: selectedType ? `var(--color-${selectedType})` : '#041627' }}
      >
        Save Log
      </button>
    </div>
  );
}
