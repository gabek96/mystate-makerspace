import { useState, useEffect } from 'react';
import { api } from '../services/api';
import './profile.css';

const ACTIVITY_ICONS = {
  complete: '✅',
  reservation: '📅',
  print: '🖨️',
  badge: '🏅',
};

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfile().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="profile-page">
        <div className="profile-skeleton">
          <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%' }} />
          <div className="skeleton" style={{ width: 160, height: 20, borderRadius: 8 }} />
          <div className="skeleton" style={{ width: 120, height: 14, borderRadius: 8 }} />
        </div>
      </div>
    );
  }

  const { user, stats, semester, activity } = data;

  return (
    <div className="profile-page page-enter">
      {/* User Card */}
      <div className="profile-card">
        <div className="profile-avatar">{user.initials}</div>
        <h2 className="profile-name">{user.fullName}</h2>
        <p className="profile-handle">{user.username}</p>
        <div className="profile-meta">
          <span>{user.major}</span>
          <span className="profile-divider">·</span>
          <span>{user.year}</span>
          <span className="profile-divider">·</span>
          <span>Class of {user.classOf}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat-number">{stats.totalHours}</span>
          <span className="profile-stat-label">Hours</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-number">{stats.printJobs}</span>
          <span className="profile-stat-label">Prints</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-number">{stats.certifications}</span>
          <span className="profile-stat-label">Certs</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-number">{stats.reservations}</span>
          <span className="profile-stat-label">Reservations</span>
        </div>
      </div>

      {/* Semester Usage */}
      <div className="section-label" style={{ padding: '0 var(--space-lg)', marginTop: 'var(--space-lg)' }}>
        Semester Usage
      </div>
      <div className="widget-card" style={{ margin: 'var(--space-sm) var(--space-lg)' }}>
        <div className="usage-item">
          <div className="usage-header">
            <span className="usage-label">Lab Hours</span>
            <span className="usage-value">{semester.hours.current}/{semester.hours.max} hrs</span>
          </div>
          <div className="usage-bar-track">
            <div
              className="usage-bar-fill"
              style={{ width: `${(semester.hours.current / semester.hours.max) * 100}%` }}
            />
          </div>
        </div>
        <div className="usage-item">
          <div className="usage-header">
            <span className="usage-label">Filament Used</span>
            <span className="usage-value">{semester.filament.current}{semester.filament.unit}</span>
          </div>
          <div className="usage-bar-track">
            <div
              className="usage-bar-fill gold"
              style={{ width: `${Math.min((semester.filament.current / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>
        <div className="usage-item">
          <div className="usage-header">
            <span className="usage-label">Projects</span>
            <span className="usage-value">{semester.projects.current}/{semester.projects.max}</span>
          </div>
          <div className="usage-bar-track">
            <div
              className="usage-bar-fill purple"
              style={{ width: `${(semester.projects.current / semester.projects.max) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="section-label" style={{ padding: '0 var(--space-lg)', marginTop: 'var(--space-lg)' }}>
        Recent Activity
      </div>
      <div className="widget-card" style={{ margin: 'var(--space-sm) var(--space-lg)' }}>
        {activity.map((item) => (
          <div className="activity-item" key={item.id}>
            <div className="activity-icon" style={{ background: item.color + '22', color: item.color }}>
              {ACTIVITY_ICONS[item.type] || '📌'}
            </div>
            <div className="activity-info">
              <p className="activity-text">{item.text}</p>
              <p className="activity-detail">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ISU ID Card */}
      <div className="section-label" style={{ padding: '0 var(--space-lg)', marginTop: 'var(--space-lg)' }}>
        ISU Digital ID
      </div>
      <div className="isu-id-card">
        <div className="id-card-header">
          <span className="id-card-logo">🌪️</span>
          <span className="id-card-school">Iowa State University</span>
        </div>
        <div className="id-card-body">
          <div className="id-card-avatar">{user.initials}</div>
          <div className="id-card-info">
            <p className="id-card-name">{user.fullName}</p>
            <p className="id-card-detail">{user.major}</p>
            <p className="id-card-id">ISU ID: {user.isuId}</p>
          </div>
        </div>
        <div className="id-card-barcode">
          <div className="barcode-lines">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="barcode-line"
                style={{ width: Math.random() > 0.5 ? 2 : 1, height: 28 + Math.random() * 8 }}
              />
            ))}
          </div>
          <p className="barcode-number">{user.isuId}</p>
        </div>
      </div>

      {/* Settings */}
      <div className="section-label" style={{ padding: '0 var(--space-lg)', marginTop: 'var(--space-lg)' }}>
        Settings
      </div>
      <div className="widget-card" style={{ margin: 'var(--space-sm) var(--space-lg) var(--space-2xl)' }}>
        {[
          { icon: '🔔', label: 'Notifications', detail: 'Print alerts, reservations' },
          { icon: '🔒', label: 'Privacy', detail: 'Profile visibility, data' },
          { icon: '♿', label: 'Accessibility', detail: 'Text size, contrast' },
          { icon: '📱', label: 'App Preferences', detail: 'Default view, language' },
          { icon: '❓', label: 'Help & Support', detail: 'FAQ, contact, feedback' },
        ].map((s) => (
          <button className="settings-row" key={s.label}>
            <span className="settings-icon">{s.icon}</span>
            <div className="settings-info">
              <p className="settings-label">{s.label}</p>
              <p className="settings-detail">{s.detail}</p>
            </div>
            <span className="settings-arrow">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
