export default function Card({ children, className = '', padding = 'p-4', onClick }) {
  return (
    <div
      className={`card ${onClick ? 'card-interactive' : ''} ${className}`}
      style={{ padding: undefined }}
      onClick={onClick}
    >
      <div className={padding}>
        {children}
      </div>
    </div>
  );
}
