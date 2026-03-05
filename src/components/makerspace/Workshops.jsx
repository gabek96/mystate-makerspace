import './makerspace.css';

export default function Workshops({ items }) {
  if (!items?.length) return null;

  return (
    <>
      <div className="section-label">Upcoming Workshops</div>
      <div className="widget-card upcoming-card animate-in">
        {items.map(item => (
          <div className="upcoming-item" key={item.id}>
            <div className="upcoming-date-badge event-badge">
              <div className="udb-month">{item.month}</div>
              <div className="udb-day">{item.day}</div>
            </div>
            <div className="upcoming-info">
              <div className="upcoming-title">{item.title}</div>
              <div className="upcoming-detail">{item.location}</div>
              <div className="upcoming-time">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--text-tertiary)">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
                {item.time} {item.spots > 0 ? `· ${item.spots} spots left` : item.enrolled ? '· Enrolled' : ''}
              </div>
            </div>
            {item.enrolled ? (
              <div className="upcoming-status-pill confirmed">Enrolled</div>
            ) : (
              <button className="upcoming-rsvp-btn">RSVP</button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
