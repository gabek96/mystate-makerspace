import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AppHeader from '../components/layout/AppHeader';
import './library.css';

export default function Library() {
  const [data, setData] = useState(null);
  const [view, setView] = useState('libraries');

  useEffect(() => {
    api.getLibrary().then(setData);
  }, []);

  if (!data) return <div className="page-library"><AppHeader title="Library" showBack /><div className="loading-state">Loading...</div></div>;

  const { libraries, myAccount, quickLinks } = data;

  return (
    <div className="page-library">
      <AppHeader title="Library" showBack />
      <div className="scroll-content">
        {/* Quick Links */}
        <div className="lib-quick-links">
          {quickLinks.map(ql => (
            <button className="lib-quick-link tap-scale" key={ql.id}>
              <div className="lql-icon">
                {ql.icon === 'room' && <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--cardinal)"><path d="M19 19V4h-4V3H5v16H3v2h12V6h2v15h4v-2h-2zm-6 0H7V5h6v14z"/></svg>}
                {ql.icon === 'loan' && <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--cardinal)"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>}
                {ql.icon === 'guide' && <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--cardinal)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>}
                {ql.icon === 'help' && <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--cardinal)"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>}
              </div>
              <span>{ql.label}</span>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="lib-tabs">
          <button className={`lib-tab ${view === 'libraries' ? 'active' : ''}`} onClick={() => setView('libraries')}>Libraries</button>
          <button className={`lib-tab ${view === 'account' ? 'active' : ''}`} onClick={() => setView('account')}>My Account</button>
        </div>

        {/* Libraries */}
        {view === 'libraries' && (
          <div className="lib-list">
            {libraries.map(lib => (
              <div className={`lib-card ${lib.isMain ? 'main' : ''}`} key={lib.id}>
                <div className="lib-card-header">
                  <div>
                    <div className="lib-card-name">{lib.name}</div>
                    <div className="lib-card-address">{lib.address}</div>
                  </div>
                  <div className={`lib-status-badge ${lib.status}`}>{lib.status === 'open' ? 'Open' : 'Closed'}</div>
                </div>
                <div className="lib-card-hours">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                  {lib.hours}
                </div>
                {lib.studyRooms.total > 0 && (
                  <div className="lib-card-resources">
                    <div className="lib-resource">
                      <span className="lib-res-label">Study Rooms</span>
                      <span className="lib-res-value">{lib.studyRooms.available}/{lib.studyRooms.total} available</span>
                    </div>
                    <div className="lib-resource">
                      <span className="lib-res-label">Computers</span>
                      <span className="lib-res-value">{lib.computers.available}/{lib.computers.total} available</span>
                    </div>
                  </div>
                )}
                <div className="lib-card-features">
                  {lib.features.map(f => (
                    <span className="lib-feature-chip" key={f}>{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Account */}
        {view === 'account' && (
          <div className="lib-account">
            {/* Print Balance */}
            <div className="lib-account-card">
              <div className="la-header">Print Balance</div>
              <div className="la-balance">${myAccount.printBalance.toFixed(2)}</div>
            </div>

            {/* Checked Out */}
            <div className="lib-account-card">
              <div className="la-header">Checked Out ({myAccount.checkedOut.length})</div>
              {myAccount.checkedOut.map(book => (
                <div className="la-book" key={book.id}>
                  <div className="la-book-title">{book.title}</div>
                  <div className="la-book-author">{book.author}</div>
                  <div className="la-book-due">Due: {new Date(book.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {book.renewals} renewals used</div>
                </div>
              ))}
            </div>

            {/* Holds */}
            <div className="lib-account-card">
              <div className="la-header">Holds ({myAccount.holds.length})</div>
              {myAccount.holds.map(book => (
                <div className="la-book" key={book.id}>
                  <div className="la-book-title">{book.title}</div>
                  <div className="la-book-author">{book.author}</div>
                  <div className="la-hold-status">{book.status} — {book.pickupLocation}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
