import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AppHeader from '../components/layout/AppHeader';
import './stuorgs.css';

export default function StuOrgs() {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.getStuOrgs().then(setData);
  }, []);

  if (!data) return <div className="page-stuorgs"><AppHeader title="Student Orgs" showBack /><div className="loading-state">Loading...</div></div>;

  let filtered = filter === 'all' ? data.organizations : data.organizations.filter(o => o.category === filter);
  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter(o => o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
  }

  const myOrgs = data.organizations.filter(o => o.isJoined);

  return (
    <div className="page-stuorgs">
      <AppHeader title="Student Orgs" showBack />
      <div className="scroll-content">
        {/* My Orgs */}
        {myOrgs.length > 0 && (
          <>
            <div className="section-label" style={{ padding: '0 var(--space-lg)', marginTop: 'var(--space-md)' }}>My Organizations</div>
            <div className="my-orgs">
              {myOrgs.map(o => (
                <div className="my-org-chip" key={o.id}>
                  <div className="moc-dot" style={{ background: o.color }} />
                  <span>{o.name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Search */}
        <div className="so-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text-tertiary)"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="so-filters">
          {data.categories.map(c => (
            <button key={c.id} className={`so-filter ${filter === c.id ? 'active' : ''}`} onClick={() => setFilter(c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Org List */}
        <div className="org-list">
          {filtered.map(o => (
            <div className="org-card" key={o.id}>
              <div className="oc-header">
                <div className="oc-avatar" style={{ background: o.color }}>
                  {o.name.charAt(0)}
                </div>
                <div className="oc-info">
                  <div className="oc-name">{o.name}</div>
                  <div className="oc-members">{o.members} members</div>
                </div>
                {o.isJoined && <div className="oc-joined-badge">Joined</div>}
              </div>
              <div className="oc-desc">{o.description}</div>
              <div className="oc-meeting">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                {o.meetingTime}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 8 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                {o.meetingLocation}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty-state">No organizations found</div>}
        </div>
      </div>
    </div>
  );
}
