import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AppHeader from '../components/layout/AppHeader';
import './events.css';

export default function Events() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getEvents().then(setData);
  }, []);

  if (!data) return <div className="page-events"><AppHeader title="Events" showBack /><div className="loading-state">Loading...</div></div>;

  const filtered = filter === 'all' ? data.upcoming : data.upcoming.filter(e => e.category === filter);
  const featured = data.upcoming.filter(e => e.isFeatured);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const categoryColors = {
    career: '#C8102E',
    entertainment: '#9C27B0',
    academic: '#2196F3',
    sports: '#F1BE48',
    social: '#4CAF50'
  };

  return (
    <div className="page-events">
      <AppHeader title="Events" showBack />
      <div className="scroll-content">
        {/* Featured Events */}
        {featured.length > 0 && (
          <>
            <div className="section-label" style={{ padding: '0 var(--space-lg)', marginTop: 'var(--space-md)' }}>Featured</div>
            <div className="featured-events">
              {featured.map(e => (
                <div className="featured-event-card" key={e.id}>
                  <div className="fe-banner" style={{ background: categoryColors[e.category] || '#607D8B' }}>
                    <div className="fe-date">{formatDate(e.date)}</div>
                    <div className="fe-category">{e.category}</div>
                  </div>
                  <div className="fe-content">
                    <div className="fe-title">{e.title}</div>
                    <div className="fe-meta">
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                        {e.time}
                      </span>
                      <span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        {e.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Filters */}
        <div className="event-filters">
          {data.categories.map(c => (
            <button key={c.id} className={`event-filter ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Event List */}
        <div className="event-list">
          {filtered.map(e => (
            <div className="event-card" key={e.id}>
              <div className="ec-date-block" style={{ borderColor: categoryColors[e.category] || '#607D8B' }}>
                <div className="ec-month">{new Date(e.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}</div>
                <div className="ec-day">{new Date(e.date + 'T00:00:00').getDate()}</div>
              </div>
              <div className="ec-content">
                <div className="ec-title">{e.title}</div>
                <div className="ec-time">{e.time}</div>
                <div className="ec-location">{e.location}</div>
                <div className="ec-organizer">{e.organizer}</div>
              </div>
              <div className="ec-category-dot" style={{ background: categoryColors[e.category] || '#607D8B' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
