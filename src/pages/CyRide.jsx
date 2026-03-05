import { useState, useEffect } from 'react';
import { api } from '../services/api';
import AppHeader from '../components/layout/AppHeader';
import './cyride.css';

export default function CyRide() {
  const [data, setData] = useState(null);
  const [view, setView] = useState('routes');
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    api.getCyRideFull().then(setData);
  }, []);

  if (!data) return <div className="page-cyride"><AppHeader title="CyRide" showBack /><div className="loading-state">Loading...</div></div>;

  const { routes, alerts, favorites, nearby } = data;

  return (
    <div className="page-cyride">
      <AppHeader title="CyRide" showBack />
      <div className="scroll-content">
        {/* Alerts Banner */}
        {alerts.length > 0 && (
          <div className="cyride-alerts">
            {alerts.map(a => (
              <div className={`cyride-alert ${a.type}`} key={a.id}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                <div>
                  <div className="alert-route">{a.route}</div>
                  <div className="alert-msg">{a.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nearby Buses */}
        <div className="section-header">
          <div className="section-label" style={{ padding: '0 var(--space-lg)' }}>Nearby Stops</div>
        </div>
        <div className="nearby-buses">
          {nearby.map(r => (
            <div className="nearby-bus-card" key={r.id}>
              <div className="nb-badge" style={{ background: r.color }}>{r.number}</div>
              <div className="nb-info">
                <div className="nb-name">{r.name}</div>
                <div className="nb-stop">{r.stop}</div>
              </div>
              <div className="nb-eta">
                <div className="nb-eta-num">{r.eta}</div>
                <div className="nb-eta-label">min</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="cyride-tabs">
          <button className={`cyride-tab ${view === 'routes' ? 'active' : ''}`} onClick={() => setView('routes')}>All Routes</button>
          <button className={`cyride-tab ${view === 'favorites' ? 'active' : ''}`} onClick={() => setView('favorites')}>Favorites</button>
        </div>

        {/* Route List */}
        <div className="route-list">
          {(view === 'favorites' ? routes.filter(r => favorites.includes(r.id)) : routes).map(route => (
            <div key={route.id}>
              <button className={`route-card ${selectedRoute === route.id ? 'expanded' : ''}`} onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}>
                <div className="rc-badge" style={{ background: route.color }}>{route.number}</div>
                <div className="rc-info">
                  <div className="rc-name">{route.name}</div>
                  <div className="rc-freq">Every {route.frequency}</div>
                </div>
                <div className={`rc-status ${route.status}`}>
                  {route.status === 'active' ? 'Active' : 'Inactive'}
                </div>
                <svg className={`rc-chevron ${selectedRoute === route.id ? 'open' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="var(--text-tertiary)"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
              </button>
              {selectedRoute === route.id && (
                <div className="route-stops">
                  {route.stops.map((stop, i) => (
                    <div className="route-stop" key={i}>
                      <div className="stop-dot" style={{ background: route.color }} />
                      {i < route.stops.length - 1 && <div className="stop-line" style={{ background: route.color + '40' }} />}
                      <span>{stop}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
