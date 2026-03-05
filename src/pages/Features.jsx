import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/layout/AppHeader';
import './features.css';

const features = [
  { id: 'dashboard', label: 'Dashboard', path: '/', color: '#C8102E', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg> },
  { id: 'classes', label: 'Classes', path: '/classes', color: '#C8102E', isNew: true, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> },
  { id: 'cyride', label: 'CyRide', path: '/cyride', color: '#2196F3', isNew: true, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4S4 2.5 4 6v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg> },
  { id: 'dining', label: 'Dining & Meals', path: '/dining', color: null, gradient: 'linear-gradient(135deg, #4CAF50, #2E7D32)', isNew: true, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg> },
  { id: 'map', label: 'Map', path: '/map', color: '#9C27B0', isNew: true, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg> },
  { id: 'events', label: 'Events', path: '/events', color: '#FF9800', isNew: true, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg> },
  { id: 'directory', label: 'Directory', path: '/directory', color: '#607D8B', isNew: true, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg> },
  { id: 'library', label: 'Library', path: '/library', color: '#795548', isNew: true, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg> },
  { id: 'news', label: 'News', path: '/news', color: '#00BCD4', isNew: true, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M19 19H5V5h14m0-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2m-5.04 9.29l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/></svg> },
  { id: 'stuorgs', label: 'StuOrgs', path: '/stuorgs', color: '#E91E63', isNew: true, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg> },
  { id: 'laundry', label: 'Laundry', path: '/laundry', color: '#3F51B5', isNew: true, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M9.17 16.83a4.008 4.008 0 005.66 0 4.008 4.008 0 000-5.66l-5.66 5.66zM18 2.01L6 2c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V4c0-1.11-.89-1.99-2-1.99zM10 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM7 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg> },
  { id: 'fairs', label: 'Fairs', path: '/fairs', color: '#FF5722', isNew: true, icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg> },
  { id: 'makerspace', label: 'Makerspace', path: '/makerspace', color: null, gradient: 'linear-gradient(135deg, #C8102E, #F1BE48)', icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg> }
];

export default function Features() {
  const navigate = useNavigate();

  return (
    <div className="page-features">
      <AppHeader title="All Features" showSearch />
      <div className="scroll-content">
        <div className="features-grid">
          {features.map((f, i) => (
            <button
              key={f.id}
              className={`feature-tile tap-scale animate-in ${f.isNew ? 'feature-tile-new' : ''}`}
              style={{ animationDelay: `${i * 40}ms` }}
              onClick={() => navigate(f.path)}
            >
              <div className="feature-icon" style={{ background: f.gradient || f.color }}>
                {f.icon}
              </div>
              <span>{f.label}</span>
              {f.isNew && <div className="new-badge">NEW</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
