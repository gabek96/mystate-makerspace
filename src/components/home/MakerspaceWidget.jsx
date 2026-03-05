import './home.css';

export default function MakerspaceWidget({ data, onClick }) {
  if (!data) return <div className="widget-card skeleton" style={{ height: 140 }} />;

  const { location, summary, areas } = data;

  return (
    <div className="widget-card makerspace-widget tap-scale animate-in" onClick={onClick} role="button" tabIndex={0}>
      <div className="mw-header">
        <div className="mw-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--cardinal)">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
          </svg>
          {location.name}
        </div>
        <div className="mw-live"><span className="live-dot"></span>Live</div>
      </div>
      <div className="mw-bars">
        {areas.map(a => (
          <div className="mw-bar-group" key={a.name}>
            <div className="mw-bar-label">{a.name}</div>
            <div className="mw-bar-track">
              <div className="mw-bar-fill bg-available" style={{ width: `${(a.avail / a.total) * 100}%` }} />
              <div className="mw-bar-fill bg-in-use" style={{ width: `${((a.total - a.avail) / a.total) * 100}%` }} />
            </div>
            <div className="mw-bar-count">{a.avail}/{a.total}</div>
          </div>
        ))}
      </div>
      <div className="mw-footer">
        <span className="mw-open-count">{summary.available} machines available</span>
        <span className="mw-link">View all →</span>
      </div>
    </div>
  );
}
