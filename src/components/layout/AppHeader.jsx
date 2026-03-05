import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function AppHeader({ title, subtitle, showBack, onBack, showSearch, showNotif, gradient }) {
  const navigate = useNavigate();
  const { unreadCount } = useApp();

  return (
    <header className={`app-header ${gradient ? 'header-gradient' : ''}`}>
      <div className="header-inner">
        {showBack ? (
          <button className="header-back" onClick={onBack || (() => navigate(-1))} aria-label="Go back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
        ) : (
          <div className="header-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="var(--cardinal)"/>
              <text x="14" y="19" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif">I</text>
            </svg>
          </div>
        )}

        <div className="header-content">
          {subtitle && <div className="header-subtitle">{subtitle}</div>}
          <div className="header-title">{title}</div>
        </div>

        <div className="header-actions">
          {showSearch && (
            <button className="header-btn" onClick={() => navigate('/search')} aria-label="Search">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          )}
          {showNotif && (
            <button className="header-btn" aria-label="Notifications">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
