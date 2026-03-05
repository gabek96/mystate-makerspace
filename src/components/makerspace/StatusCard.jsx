import './makerspace.css';

export default function StatusCard({ location, summary }) {
  return (
    <div className="makerspace-status-card animate-in">
      <div className="status-header">
        <div className="status-title">{location.name}</div>
        <div className="status-live"><span className="live-dot"></span>Live</div>
      </div>
      <div className="status-summary">
        <div className="status-stat">
          <div className="stat-number status-available">{summary.available}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="status-stat">
          <div className="stat-number status-in-use">{summary.inUse}</div>
          <div className="stat-label">In Use</div>
        </div>
        <div className="status-stat">
          <div className="stat-number status-maintenance">{summary.maintenance}</div>
          <div className="stat-label">Maintenance</div>
        </div>
      </div>
      <div className="hours-info">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-tertiary)">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
        <span>Open today: {location.hours}</span>
      </div>
    </div>
  );
}
