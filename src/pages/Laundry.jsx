import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AppHeader from '../components/layout/AppHeader';
import './laundry.css';

export default function Laundry() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getLaundry().then(setData);
  }, []);

  if (!data) return <div className="page-laundry"><AppHeader title="Laundry" showBack /><div className="loading-state">Loading...</div></div>;

  const myBuilding = data.buildings.find(b => b.id === data.myBuilding);
  const otherBuildings = data.buildings.filter(b => b.id !== data.myBuilding);

  const getAvailColor = (avail, total) => {
    const ratio = avail / total;
    if (ratio === 0) return '#E53935';
    if (ratio < 0.3) return '#FF9800';
    return '#4CAF50';
  };

  return (
    <div className="page-laundry">
      <AppHeader title="Laundry" showBack />
      <div className="scroll-content">
        {/* My Building */}
        {myBuilding && (
          <>
            <div className="section-label" style={{ padding: '0 var(--space-lg)', marginTop: 'var(--space-md)' }}>My Building</div>
            <div className="laundry-my">
              <div className="laundry-my-card">
                <div className="lmc-header">
                  <div className="lmc-name">{myBuilding.name}</div>
                  <div className="lmc-floor">{myBuilding.floor}</div>
                </div>
                <div className="lmc-machines">
                  <div className="lmc-group">
                    <div className="lmc-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--text-primary)"><path d="M9.17 16.83a4.008 4.008 0 005.66 0 4.008 4.008 0 000-5.66l-5.66 5.66zM18 2.01L6 2c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V4c0-1.11-.89-1.99-2-1.99zM10 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM7 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
                    </div>
                    <div className="lmc-label">Washers</div>
                    <div className="lmc-count" style={{ color: getAvailColor(myBuilding.machines.washers.available, myBuilding.machines.washers.total) }}>
                      {myBuilding.machines.washers.available}/{myBuilding.machines.washers.total}
                    </div>
                    <div className="lmc-bar">
                      <div className="lmc-bar-fill" style={{ width: `${(myBuilding.machines.washers.available / myBuilding.machines.washers.total) * 100}%`, background: getAvailColor(myBuilding.machines.washers.available, myBuilding.machines.washers.total) }} />
                    </div>
                    {myBuilding.machines.washers.estimatedWait && (
                      <div className="lmc-wait">~{myBuilding.machines.washers.estimatedWait} wait</div>
                    )}
                  </div>
                  <div className="lmc-group">
                    <div className="lmc-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--text-primary)"><path d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H4V4h16v16zM6 6h4v4H6zm0 6h4v4H6zm6-6h4v4h-4zm6 0h4v4h-4zm-6 6h4v4h-4z"/></svg>
                    </div>
                    <div className="lmc-label">Dryers</div>
                    <div className="lmc-count" style={{ color: getAvailColor(myBuilding.machines.dryers.available, myBuilding.machines.dryers.total) }}>
                      {myBuilding.machines.dryers.available}/{myBuilding.machines.dryers.total}
                    </div>
                    <div className="lmc-bar">
                      <div className="lmc-bar-fill" style={{ width: `${(myBuilding.machines.dryers.available / myBuilding.machines.dryers.total) * 100}%`, background: getAvailColor(myBuilding.machines.dryers.available, myBuilding.machines.dryers.total) }} />
                    </div>
                    {myBuilding.machines.dryers.estimatedWait && (
                      <div className="lmc-wait">~{myBuilding.machines.dryers.estimatedWait} wait</div>
                    )}
                  </div>
                </div>
                <div className="lmc-updated">Updated {myBuilding.lastUpdated}</div>
              </div>
            </div>
          </>
        )}

        {/* All Buildings */}
        <div className="section-label" style={{ padding: '0 var(--space-lg)' }}>All Residence Halls</div>
        <div className="laundry-list">
          {otherBuildings.map(b => (
            <div className="laundry-card" key={b.id}>
              <div className="lc-name">{b.name}</div>
              <div className="lc-machines">
                <div className="lc-machine">
                  <span className="lc-type">Washers</span>
                  <span className="lc-avail" style={{ color: getAvailColor(b.machines.washers.available, b.machines.washers.total) }}>
                    {b.machines.washers.available}/{b.machines.washers.total}
                  </span>
                </div>
                <div className="lc-machine">
                  <span className="lc-type">Dryers</span>
                  <span className="lc-avail" style={{ color: getAvailColor(b.machines.dryers.available, b.machines.dryers.total) }}>
                    {b.machines.dryers.available}/{b.machines.dryers.total}
                  </span>
                </div>
              </div>
              {(b.machines.washers.estimatedWait || b.machines.dryers.estimatedWait) && (
                <div className="lc-wait-info">
                  {b.machines.washers.estimatedWait && <span>Washer wait: {b.machines.washers.estimatedWait}</span>}
                  {b.machines.dryers.estimatedWait && <span>Dryer wait: {b.machines.dryers.estimatedWait}</span>}
                </div>
              )}
              <div className="lc-updated">Updated {b.lastUpdated}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
