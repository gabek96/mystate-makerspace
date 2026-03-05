import './dining.css';

export default function BalanceRing({ label, current, total, color, icon, isCurrency, subtitle }) {
  const percent = Math.min((current / total) * 100, 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const displayValue = isCurrency ? `$${current.toFixed(0)}` : current;

  return (
    <div className="balance-ring">
      <div className="br-circle-wrap">
        <svg className="br-svg" viewBox="0 0 88 88">
          <circle className="br-bg" cx="44" cy="44" r={radius} />
          <circle
            className="br-fill"
            cx="44"
            cy="44"
            r={radius}
            style={{
              stroke: color,
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            }}
          />
        </svg>
        <div className="br-center">
          <span className="br-icon">{icon}</span>
          <span className="br-value" style={{ color }}>{displayValue}</span>
        </div>
      </div>
      <span className="br-label">{label}</span>
      {subtitle && <span className="br-subtitle">{subtitle}</span>}
    </div>
  );
}
