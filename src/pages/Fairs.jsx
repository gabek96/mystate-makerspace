import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AppHeader from '../components/layout/AppHeader';
import './fairs.css';

export default function Fairs() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.getFairs().then(setData);
  }, []);

  if (!data) return <div className="page-fairs"><AppHeader title="Fairs" showBack /><div className="loading-state">Loading...</div></div>;

  const filtered = filter === 'all' ? data.fairs : data.fairs.filter(f => f.type === filter);
  const featured = data.fairs.filter(f => f.isFeatured);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const daysUntil = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff < 0) return 'Past';
    return `In ${diff} days`;
  };

  return (
    <div className="page-fairs">
      <AppHeader title="Fairs" showBack />
      <div className="scroll-content">
        {/* Featured / Upcoming Big Ones */}
        {featured.length > 0 && (
          <>
            <div className="section-label" style={{ padding: '0 var(--space-lg)', marginTop: 'var(--space-md)' }}>Don't Miss</div>
            {featured.map(f => (
              <div className="fair-featured" key={f.id}>
                <div className="ff-countdown">{daysUntil(f.date)}</div>
                <div className="ff-title">{f.name}</div>
                <div className="ff-meta">
                  <span>{formatDate(f.date)}</span>
                  <span>{f.time}</span>
                </div>
                <div className="ff-location">{f.location}</div>
                <div className="ff-desc">{f.description}</div>
                {f.employers > 0 && <div className="ff-employers">{f.employers}+ employers attending</div>}
                <div className="ff-tags">
                  {f.tags.map(t => <span className="ff-tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Filters */}
        <div className="fair-filters">
          {data.types.map(t => (
            <button key={t.id} className={`fair-filter ${filter === t.id ? 'active' : ''}`} onClick={() => setFilter(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* All Fairs */}
        <div className="fair-list">
          {filtered.map(f => (
            <div className="fair-card" key={f.id}>
              <div className="fc-header">
                <div className="fc-title">{f.name}</div>
                <div className="fc-days">{daysUntil(f.date)}</div>
              </div>
              <div className="fc-date">{formatDate(f.date)} · {f.time}</div>
              <div className="fc-location">{f.location}</div>
              <div className="fc-desc">{f.description}</div>
              <div className="fc-tags">
                {f.tags.map(t => <span className="fc-tag" key={t}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
