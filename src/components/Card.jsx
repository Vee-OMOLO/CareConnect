export default function Card({ children, className = '', onClick, accent, padding = 'p-4' }) {
  const accentClass = accent ? `activity-${accent}-border` : '';
  const interactiveClass = onClick ? 'card-interactive' : '';

  return (
    <div
      className={`card ${accentClass} ${interactiveClass} ${padding} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
