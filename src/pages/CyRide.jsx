import { useState, useEffect, useMemo, useRef } from 'react';
import { api } from '../services/api';
import { cyrideService } from '../services/cyride';
import AppHeader from '../components/layout/AppHeader';
import './cyride.css';

/* SVG map bounds for Ames area */
const MAP = { minLat: 42.001, maxLat: 42.055, minLng: -93.675, maxLng: -93.598 };
const toX = lng => ((lng - MAP.minLng) / (MAP.maxLng - MAP.minLng)) * 100;
const toY = lat => ((MAP.maxLat - lat) / (MAP.maxLat - MAP.minLat)) * 100;

export default function CyRide() {
  const [data, setData] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const simReady = useRef(false);
  const routesRef = useRef([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [favRoutes, setFavRoutes] = useState(new Set());
  const [favStops, setFavStops] = useState(new Set());

  useEffect(() => {
    api.getCyRideFull().then(d => {
      setData(d);
      setRoutes(d.routes);
      routesRef.current = d.routes;
      setFavRoutes(new Set(d.favoriteRoutes));
      setFavStops(new Set(d.favoriteStops));
      if (d.favoriteRoutes.length) setSelectedRoute(d.favoriteRoutes[0]);
      // Initialize simulation and try live API
      cyrideService.initSim(d.routes);
      simReady.current = true;
      cyrideService.tryConnect().then(live => setIsLive(live));
    });
  }, []);

  // Tick bus positions every 3s (live API) or 3s (simulation)
  useEffect(() => {
    if (!simReady.current) return;
    let active = true;
    const poll = async () => {
      const updated = await cyrideService.tick(routesRef.current);
      if (active) {
        routesRef.current = updated;
        setRoutes(updated);
        setIsLive(cyrideService.isLive);
      }
    };
    const id = setInterval(poll, 3000);
    return () => { active = false; clearInterval(id); };
  }, [routes.length > 0]);

  const route = useMemo(() => routes.find(r => r.id === selectedRoute), [routes, selectedRoute]);

  const toggleFavRoute = id => setFavRoutes(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleFavStop = id => setFavStops(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  if (!data) return <div className="page-cyride"><AppHeader title="CyRide" showBack /><div className="loading-state">Loading...</div></div>;

  const { alerts } = data;
  const activeRoutes = routes.filter(r => r.status === 'active');
  const totalBuses = activeRoutes.reduce((sum, r) => sum + r.vehicles.length, 0);

  return (
    <div className="page-cyride">
      <AppHeader title="CyRide" showBack />

      <div className="cyride-layout">
        {/* === MAP AREA === */}
        <div className="cyride-map-container">
          <svg className="cyride-map" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {/* Grid */}
            <defs>
              <pattern id="mapGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="var(--map-grid)" strokeWidth="0.15"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="var(--map-bg)" />
            <rect width="100" height="100" fill="url(#mapGrid)" />

            {/* Road hints */}
            <line x1="0" y1={toY(42.0219)} x2="100" y2={toY(42.0219)} stroke="var(--map-road)" strokeWidth="0.6" />
            <line x1={toX(-93.6465)} y1="0" x2={toX(-93.6465)} y2="100" stroke="var(--map-road)" strokeWidth="0.6" />

            {/* Route path polyline */}
            {route && (
              <polyline
                points={route.stops.map(s => `${toX(s.lng)},${toY(s.lat)}`).join(' ')}
                fill="none"
                stroke={route.color}
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.6"
              />
            )}

            {/* All stops for selected route (small dots when no route selected show all) */}
            {(route ? route.stops : []).map(stop => (
              <g key={stop.id} onClick={() => setSelectedStop(selectedStop?.id === stop.id ? null : stop)} style={{ cursor: 'pointer' }}>
                <circle cx={toX(stop.lng)} cy={toY(stop.lat)} r={selectedStop?.id === stop.id ? 2 : 1.3} fill="white" stroke={route?.color || '#666'} strokeWidth="0.5" />
                {selectedStop?.id === stop.id && (
                  <text x={toX(stop.lng)} y={toY(stop.lat) - 3} textAnchor="middle" fontSize="2.2" fill="var(--text-primary)" fontWeight="700">{stop.name}</text>
                )}
              </g>
            ))}

            {/* Bus vehicle markers — selected route */}
            {route?.vehicles.map(v => (
              <g key={v.id}>
                <circle className="bus-dot" cx={toX(v.lng)} cy={toY(v.lat)} r="2.4" fill={route.color} stroke="white" strokeWidth="0.6" />
                <text className="bus-label" x={toX(v.lng)} y={toY(v.lat) + 0.8} textAnchor="middle" fontSize="1.8" fill="white" fontWeight="800">
                  {route.number}
                </text>
              </g>
            ))}

            {/* All buses across all routes when no specific route selected */}
            {!route && activeRoutes.flatMap(r => r.vehicles.map(v => (
              <g key={v.id}>
                <circle className="bus-dot" cx={toX(v.lng)} cy={toY(v.lat)} r="1.8" fill={r.color} stroke="white" strokeWidth="0.4" />
                <text className="bus-label" x={toX(v.lng)} y={toY(v.lat) + 0.6} textAnchor="middle" fontSize="1.4" fill="white" fontWeight="800">
                  {r.number}
                </text>
              </g>
            )))}
          </svg>

          {/* Live status indicator */}
          <div className={`cyride-status-badge ${isLive ? 'is-live' : ''}`}>
            <span className="csb-dot" />
            {isLive ? 'Live' : 'Simulated'}
          </div>

          {/* Map overlay label */}
          <div className="map-route-label">
            {route ? (
              <>
                <span className="mrl-dot" style={{ background: route.color }} />
                <span className="mrl-name">{route.number} {route.name}</span>
                <span className="mrl-freq">Every {route.frequency}</span>
                {route.vehicles.length > 0 && <span className="mrl-buses">{route.vehicles.length} bus{route.vehicles.length > 1 ? 'es' : ''} active</span>}
              </>
            ) : (
              <>
                <span className="mrl-name">All Routes</span>
                <span className="mrl-buses">{totalBuses} buses active</span>
              </>
            )}
          </div>
        </div>

        {/* === ROUTE SELECTOR BAR === */}
        <div className="route-selector-bar">
          <div className="rsb-scroll">
            <button className={`rsb-pill ${!selectedRoute ? 'active' : ''}`} onClick={() => { setSelectedRoute(null); setSelectedStop(null); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>
              All
            </button>
            {/* Favorite routes first, then rest */}
            {[...activeRoutes.filter(r => favRoutes.has(r.id)), ...activeRoutes.filter(r => !favRoutes.has(r.id))].map(r => (
              <button
                key={r.id}
                className={`rsb-pill ${selectedRoute === r.id ? 'active' : ''}`}
                onClick={() => { setSelectedRoute(r.id); setSelectedStop(null); }}
                style={selectedRoute === r.id ? { background: r.color, borderColor: r.color } : {}}
              >
                <span className="rsb-dot" style={{ background: r.color }} />
                {r.number} {r.name.split(' ')[0]}
                {favRoutes.has(r.id) && <svg className="rsb-star" width="10" height="10" viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>}
              </button>
            ))}
          </div>
        </div>

        {/* === ALERTS === */}
        {alerts.length > 0 && (
          <div className="cyride-alerts">
            {alerts.map(a => (
              <div className={`cyride-alert ${a.type}`} key={a.id}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                <div>
                  <strong>{a.route}</strong>
                  <span>{a.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* === STOP BOTTOM SHEET (when a stop is selected) === */}
        {selectedStop && (
          <div className="stop-sheet">
            <div className="ss-header">
              <div className="ss-handle" />
              <div className="ss-title-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill={route?.color || 'var(--text-primary)'}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <div className="ss-title">{selectedStop.name}</div>
                <button className="ss-fav" onClick={() => toggleFavStop(selectedStop.id)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={favStops.has(selectedStop.id) ? 'var(--gold)' : 'none'} stroke={favStops.has(selectedStop.id) ? 'var(--gold)' : 'var(--text-tertiary)'} strokeWidth="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </button>
                <button className="ss-close" onClick={() => setSelectedStop(null)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--text-secondary)"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>
            </div>
            <div className="ss-arrivals">
              <div className="ss-arrivals-title">Upcoming Arrivals</div>
              {selectedStop.arrivals.length > 0 ? (
                selectedStop.arrivals.map((time, i) => {
                  const mins = i === 0 ? Math.floor(Math.random() * 4) + 1 : i === 1 ? Math.floor(Math.random() * 8) + 8 : Math.floor(Math.random() * 10) + 18;
                  return (
                    <div className="ss-arrival-row" key={i}>
                      <div className="ss-ar-left">
                        <span className="ss-ar-dot" style={{ background: route?.color || '#666' }} />
                        <span className="ss-ar-route">{route?.number} {route?.name}</span>
                      </div>
                      <div className="ss-ar-right">
                        <span className="ss-ar-time">{time}</span>
                        <span className="ss-ar-eta">{mins === 1 ? 'arriving' : `${mins} min`}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="ss-no-arrivals">No upcoming arrivals.</div>
              )}
            </div>
          </div>
        )}

        {/* === STOP LIST (when route selected, no stop tapped) === */}
        {route && !selectedStop && (
          <div className="cyride-stop-list">
            <div className="csl-header">
              <span>Stops on {route.number} {route.name}</span>
              <button className="csl-fav-btn" onClick={() => toggleFavRoute(route.id)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={favRoutes.has(route.id) ? 'var(--gold)' : 'none'} stroke={favRoutes.has(route.id) ? 'var(--gold)' : 'var(--text-tertiary)'} strokeWidth="2"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </button>
            </div>
            {route.stops.map((stop, i) => (
              <button className="csl-stop" key={stop.id} onClick={() => setSelectedStop(stop)}>
                <div className="csl-timeline">
                  <div className="csl-dot" style={{ background: route.color }} />
                  {i < route.stops.length - 1 && <div className="csl-line" style={{ background: route.color + '30' }} />}
                </div>
                <div className="csl-info">
                  <div className="csl-name">{stop.name}</div>
                  {stop.arrivals[0] && <div className="csl-next">Next: {stop.arrivals[0]}</div>}
                </div>
                {favStops.has(stop.id) && <svg className="csl-star" width="14" height="14" viewBox="0 0 24 24" fill="var(--gold)"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-tertiary)"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </button>
            ))}
          </div>
        )}

        {/* === ALL ROUTES GRID (when no route selected) === */}
        {!selectedRoute && (
          <div className="cyride-all-routes">
            <div className="car-section-label">All Routes</div>
            {activeRoutes.map(r => (
              <button className="car-route" key={r.id} onClick={() => { setSelectedRoute(r.id); setSelectedStop(null); }}>
                <div className="car-badge" style={{ background: r.color }}>{r.number}</div>
                <div className="car-info">
                  <div className="car-name">{r.name}</div>
                  <div className="car-freq">Every {r.frequency} · {r.stops.length} stops</div>
                </div>
                <div className="car-vehicle-count">
                  {r.vehicles.length > 0 ? (
                    <><span className="car-vc-dot" />{r.vehicles.length}</>
                  ) : (
                    <span className="car-inactive-label">No buses</span>
                  )}
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--text-tertiary)"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </button>
            ))}

            {routes.filter(r => r.status === 'inactive').length > 0 && (
              <>
                <div className="car-section-label" style={{ marginTop: 'var(--space-md)' }}>Inactive</div>
                {routes.filter(r => r.status === 'inactive').map(r => (
                  <div className="car-route car-route-inactive" key={r.id}>
                    <div className="car-badge" style={{ background: r.color, opacity: 0.4 }}>{r.number}</div>
                    <div className="car-info">
                      <div className="car-name" style={{ opacity: 0.5 }}>{r.name}</div>
                      <div className="car-freq" style={{ opacity: 0.4 }}>Service suspended</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
