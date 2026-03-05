import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AppHeader from '../components/layout/AppHeader';
import './classes.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function Classes() {
  const [data, setData] = useState(null);
  const [view, setView] = useState('today');
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() - 1] || 'Monday');

  useEffect(() => {
    api.getClassesFull().then(setData);
  }, []);

  if (!data) return <div className="page-classes"><AppHeader title="Classes" showBack /><div className="loading-state">Loading...</div></div>;

  const todayClasses = data.today || [];
  const weekClasses = data.week || {};
  const assignments = data.assignments || [];
  const gpa = data.gpa;

  return (
    <div className="page-classes">
      <AppHeader title="Classes" showBack />
      <div className="scroll-content">
        {/* GPA Card */}
        <div className="gpa-card">
          <div className="gpa-item">
            <div className="gpa-value">{gpa.current}</div>
            <div className="gpa-label">Cumulative</div>
          </div>
          <div className="gpa-divider" />
          <div className="gpa-item">
            <div className="gpa-value">{gpa.semester}</div>
            <div className="gpa-label">Semester</div>
          </div>
          <div className="gpa-divider" />
          <div className="gpa-item">
            <div className="gpa-value">{gpa.credits}</div>
            <div className="gpa-label">Credits</div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="class-tabs">
          {['today', 'week', 'assignments'].map(v => (
            <button key={v} className={`class-tab ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>
              {v === 'today' ? 'Today' : v === 'week' ? 'Week' : 'Assignments'}
            </button>
          ))}
        </div>

        {/* Today View */}
        {view === 'today' && (
          <div className="class-list">
            {todayClasses.length === 0 ? (
              <div className="empty-state">No classes today!</div>
            ) : todayClasses.map(c => (
              <div className="class-card" key={c.id}>
                <div className="class-color-bar" style={{ background: c.color }} />
                <div className="class-card-content">
                  <div className="class-card-header">
                    <div className="class-card-name">{c.name}</div>
                    <span className="class-type-badge" style={{ background: c.color + '22', color: c.color }}>{c.type}</span>
                  </div>
                  <div className="class-card-meta">
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                      {c.time}
                    </span>
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                      {c.room}
                    </span>
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      {c.instructor}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Week View */}
        {view === 'week' && (
          <>
            <div className="day-selector">
              {DAYS.map(d => (
                <button key={d} className={`day-btn ${selectedDay === d ? 'active' : ''}`} onClick={() => setSelectedDay(d)}>
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
            <div className="class-list">
              {(weekClasses[selectedDay] || []).length === 0 ? (
                <div className="empty-state">No classes on {selectedDay}</div>
              ) : (weekClasses[selectedDay] || []).map(c => (
                <div className="class-card" key={c.id + selectedDay}>
                  <div className="class-color-bar" style={{ background: c.color }} />
                  <div className="class-card-content">
                    <div className="class-card-header">
                      <div className="class-card-name">{c.name}</div>
                      <span className="class-type-badge" style={{ background: c.color + '22', color: c.color }}>{c.type}</span>
                    </div>
                    <div className="class-card-meta">
                      <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                        {c.time}
                      </span>
                      <span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        {c.room}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Assignments View */}
        {view === 'assignments' && (
          <div className="assignments-list">
            {assignments.map(a => {
              const dueDate = new Date(a.due);
              const now = new Date();
              const daysUntil = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
              const urgent = daysUntil <= 2;
              return (
                <div className={`assignment-card ${urgent ? 'urgent' : ''}`} key={a.id}>
                  <div className="assignment-color" style={{ background: a.color }} />
                  <div className="assignment-content">
                    <div className="assignment-class">{a.class}</div>
                    <div className="assignment-title">{a.title}</div>
                    <div className="assignment-due">
                      Due {dueDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {urgent && <span className="due-soon-badge">Due Soon</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
