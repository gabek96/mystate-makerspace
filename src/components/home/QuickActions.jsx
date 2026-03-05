import './home.css';

const actions = [
  { id: 'classes', label: 'Classes', path: '/classes', color: '#C8102E', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg> },
  { id: 'cyride', label: 'CyRide', path: '/cyride', color: '#2196F3', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4S4 2.5 4 6v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg> },
  { id: 'dining', label: 'Dining', path: '/dining', color: '#4CAF50', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg> },
  { id: 'maker', label: 'Makerspace', path: '/makerspace', color: null, gradient: 'linear-gradient(135deg, #C8102E, #F1BE48)', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg> }
];

export default function QuickActions({ onNavigate }) {
  return (
    <>
      <div className="section-label">Quick Actions</div>
      <div className="quick-actions animate-in">
        {actions.map(a => (
          <button key={a.id} className="quick-action tap-scale" onClick={() => onNavigate(a.path)}>
            <div className="qa-icon" style={{ background: a.gradient || a.color }}>
              {a.icon}
            </div>
            <span>{a.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
