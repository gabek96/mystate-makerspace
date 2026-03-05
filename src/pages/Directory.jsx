import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AppHeader from '../components/layout/AppHeader';
import './directory.css';

export default function Directory() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.getDirectory().then(setData);
  }, []);

  if (!data) return <div className="page-directory"><AppHeader title="Directory" showBack /><div className="loading-state">Loading...</div></div>;

  let filtered = filter === 'all' ? data.contacts : data.contacts.filter(c => c.category === filter);
  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.building.toLowerCase().includes(q));
  }

  return (
    <div className="page-directory">
      <AppHeader title="Directory" showBack />
      <div className="scroll-content">
        {/* Search */}
        <div className="dir-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text-tertiary)"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input
            type="text"
            placeholder="Search offices, departments..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="dir-filters">
          {data.categories.map(c => (
            <button key={c.id} className={`dir-filter ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Contact List */}
        <div className="dir-list">
          {filtered.map(c => (
            <div className="dir-card" key={c.id}>
              <div className="dc-name">{c.name}</div>
              <div className="dc-details">
                <div className="dc-detail">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                  {c.building}
                </div>
                <div className="dc-detail">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  {c.phone}
                </div>
                {c.email && (
                  <div className="dc-detail">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    {c.email}
                  </div>
                )}
                <div className="dc-detail">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                  {c.hours}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty-state">No results found</div>}
        </div>
      </div>
    </div>
  );
}
