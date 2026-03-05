import './makerspace.css';

const BADGE_ICONS = {
  printer3d: <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M19 9h-2V3H7v6H5c-1.1 0-2 .9-2 2v5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5c0-1.1-.9-2-2-2zM9 5h6v4H9V5z"/></svg>,
  laser: <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/></svg>,
  electronics: <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>,
  cnc: <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>,
  lock: <svg width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
};

export default function Badges({ data }) {
  return (
    <div className="badges-section">
      {/* Progress */}
      <div className="section-label">Your Training Progress</div>
      <div className="widget-card badges-progress-card animate-in">
        <div className="badges-progress-bar">
          <div className="badges-progress-fill" style={{
            width: `${(data.totalEarned / data.totalAvailable) * 100}%`
          }} />
        </div>
        <div className="badges-progress-label">
          {data.totalEarned} of {data.totalAvailable} certifications earned
        </div>
      </div>

      {/* Earned */}
      <div className="section-label">Earned</div>
      <div className="badges-grid">
        {data.earned.map(b => (
          <div className="badge-card earned animate-in" key={b.id}>
            <div className="badge-icon-large">{BADGE_ICONS[b.icon]}</div>
            <div className="badge-earned-check">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <div className="badge-title">{b.name}</div>
            <div className="badge-date">{b.date}</div>
          </div>
        ))}
      </div>

      {/* In Progress */}
      {data.inProgress.length > 0 && (
        <>
          <div className="section-label">In Progress</div>
          <div className="badges-grid">
            {data.inProgress.map(b => (
              <div className="badge-card in-progress-badge animate-in" key={b.id}>
                <div className="badge-icon-large">{BADGE_ICONS[b.icon]}</div>
                <div className="badge-title">{b.name}</div>
                <div className="badge-date">{b.date}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Locked */}
      {data.locked.length > 0 && (
        <>
          <div className="section-label">Locked</div>
          <div className="badges-grid">
            {data.locked.map(b => (
              <div className="badge-card locked-badge animate-in" key={b.id}>
                <div className="badge-icon-large">{BADGE_ICONS[b.icon]}</div>
                <div className="badge-lock-icon">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/>
                  </svg>
                </div>
                <div className="badge-title">{b.name}</div>
                <div className="badge-date">Requires: {b.requires}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
