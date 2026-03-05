import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AppHeader from '../components/layout/AppHeader';
import './map.css';

export default function CampusMap() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getMapLocations().then(setData);
  }, []);

  if (!data) return <div className="page-map"><AppHeader title="Campus Map" showBack /><div className="loading-state">Loading...</div></div>;

  let filtered = filter === 'all' ? data.locations : data.locations.filter(l => l.category === filter);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(l => l.name.toLowerCase().includes(q) || l.building.toLowerCase().includes(q));
  }

  const getCatColor = (cat) => {
    const c = data.categories.find(cc => cc.id === cat);
    return c ? c.color : '#607D8B';
  };

  return (
    <div className="page-map">
      <AppHeader title="Campus Map" showBack />
      <div className="scroll-content">
        {/* Map Placeholder */}
        <div className="map-placeholder">
          <div className="map-grid">
            {filtered.slice(0, 8).map(l => (
              <div className="map-pin" key={l.id} style={{ background: getCatColor(l.category) }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              </div>
            ))}
          </div>
          <div className="map-overlay">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--text-tertiary)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
            <span>Iowa State University Campus</span>
          </div>
        </div>

        {/* Search */}
        <div className="map-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text-tertiary)"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input type="text" placeholder="Search buildings..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Category Pills */}
        <div className="map-filters">
          {data.categories.map(c => (
            <button key={c.id} className={`map-filter ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)} style={filter === c.id ? { background: c.color, borderColor: c.color } : {}}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Location List */}
        <div className="map-locations">
          {filtered.map(l => (
            <div className="map-loc-card" key={l.id}>
              <div className="mlc-pin" style={{ background: getCatColor(l.category) }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              </div>
              <div className="mlc-info">
                <div className="mlc-name">{l.name}</div>
                <div className="mlc-building">{l.building}</div>
              </div>
              <div className="mlc-category" style={{ color: getCatColor(l.category) }}>
                {data.categories.find(c => c.id === l.category)?.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
