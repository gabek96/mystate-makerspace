import { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { api } from '../services/api';
import { cyrideService } from '../services/cyride';
import AppHeader from '../components/layout/AppHeader';
import './cyride.css';

/* Ames, IA center */
const AMES_CENTER = [42.026, -93.646];
const DEFAULT_ZOOM = 14;

/** Build a colored circle DivIcon for bus markers */
function busIcon(color, label) {
  return L.divIcon({
    className: 'bus-marker',
    html: `<div class="bus-marker-inner" style="background:${color}"><span>${label}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

/** Recenter map when selected route changes */
function FitRoute({ route, allRoutes }) {
  const map = useMap();
  useEffect(() => {
    if (route && route.stops.length) {
      const bounds = L.latLngBounds(route.stops.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 });
    } else if (allRoutes.length) {
      const allStops = allRoutes.flatMap(r => r.stops.map(s => [s.lat, s.lng]));
      if (allStops.length) {
        map.fitBounds(L.latLngBounds(allStops), { padding: [30, 30], maxZoom: 14 });
      }
    }
  }, [route?.id]);
  return null;
}

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

  // Arrival state
  const [arrivals, setArrivals] = useState([]);
  const [arrivalsLoading, setArrivalsLoading] = useState(false);
  // Map of apiRouteId -> mycyride direction stops (for stop ID lookup)
  const dirStopsCache = useRef({});

  useEffect(() => {
    async function loadData() {
      // Try fetching real route/stop/shape data
      const realRoutes = await cyrideService.fetchRealRoutes();
      const mockData = await api.getCyRideFull();
      setData(mockData);
      setFavRoutes(new Set(mockData.favoriteRoutes));
      setFavStops(new Set(mockData.favoriteStops));

      const initialRoutes = realRoutes || mockData.routes;
      setRoutes(initialRoutes);
      routesRef.current = initialRoutes;

      // Try live vehicle positions
      const live = await cyrideService.tryConnect();
      setIsLive(live);

      if (live) {
        // Immediately fetch live vehicles
        const updated = await cyrideService.tick(initialRoutes);
        setRoutes(updated);
        routesRef.current = updated;
      } else {
        cyrideService.initSim(initialRoutes);
      }
      simReady.current = true;
    }
    loadData();
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

  // Fetch mycyride direction stops when a route is selected (for stop ID mapping)
  useEffect(() => {
    if (!route?.apiRouteId || dirStopsCache.current[route.apiRouteId]) return;
    cyrideService.fetchDirectionStops(route.apiRouteId).then(stops => {
      if (stops) dirStopsCache.current[route.apiRouteId] = stops;
    });
  }, [route?.apiRouteId]);

  // Find the mycyride stop ID that matches the selected AmesRide stop (by proximity)
  const findMycyrideStopId = (stop, apiRouteId) => {
    const dirStops = dirStopsCache.current[apiRouteId];
    if (!dirStops || !stop) return null;
    let best = null, bestDist = Infinity;
    for (const ds of dirStops) {
      const d = Math.abs(ds.lat - stop.lat) + Math.abs(ds.lng - stop.lng);
      if (d < bestDist) { bestDist = d; best = ds; }
    }
    return bestDist < 0.002 ? best?.id : null; // ~200m threshold
  };

  // Fetch arrivals when a stop is selected
  useEffect(() => {
    if (!selectedStop || !route?.apiRouteId) { setArrivals([]); return; }
    let active = true;

    const load = async () => {
      setArrivalsLoading(true);
      // Ensure direction stops are loaded
      if (!dirStopsCache.current[route.apiRouteId]) {
        const ds = await cyrideService.fetchDirectionStops(route.apiRouteId);
        if (ds) dirStopsCache.current[route.apiRouteId] = ds;
      }
      const mycyrideStopId = findMycyrideStopId(selectedStop, route.apiRouteId);
      if (mycyrideStopId && active) {
        const arr = await cyrideService.fetchStopArrivals(mycyrideStopId);
        if (active) setArrivals(arr);
      } else if (active) {
        setArrivals([]);
      }
      if (active) setArrivalsLoading(false);
    };

    load();
    const id = setInterval(load, 15000);
    return () => { active = false; clearInterval(id); };
  }, [selectedStop?.id, route?.apiRouteId]);

  const toggleFavRoute = id => setFavRoutes(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleFavStop = id => setFavStops(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  if (!data) return <div className="page-cyride"><AppHeader title="CyRide" showBack /><div className="loading-state">Loading...</div></div>;

  const alerts = data?.alerts || [];
  const totalBuses = routes.reduce((sum, r) => sum + r.vehicles.length, 0);

  return (
    <div className="page-cyride">
      <AppHeader title="CyRide" showBack />

      <div className="cyride-layout">
        {/* === MAP AREA === */}
        <div className="cyride-map-container">
          <MapContainer center={AMES_CENTER} zoom={DEFAULT_ZOOM} className="cyride-map" zoomControl={false} attributionControl={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FitRoute route={route} allRoutes={routes} />

            {/* Route polyline — use shape (real waypoints) if available, else connect stops */}
            {route && (
              <Polyline
                positions={route.shape?.length ? route.shape : route.stops.map(s => [s.lat, s.lng])}
                pathOptions={{ color: route.color, weight: 4, opacity: 0.7 }}
              />
            )}

            {/* When no route selected, show all route polylines faintly */}
            {!route && routes.map(r => (
              <Polyline
                key={r.id}
                positions={r.shape?.length ? r.shape : r.stops.map(s => [s.lat, s.lng])}
                pathOptions={{ color: r.color, weight: 3, opacity: 0.35 }}
              />
            ))}

            {/* Stops for selected route */}
            {(route ? route.stops : []).map(stop => (
              <CircleMarker
                key={stop.id}
                center={[stop.lat, stop.lng]}
                radius={selectedStop?.id === stop.id ? 8 : 5}
                pathOptions={{ fillColor: 'white', color: route?.color || '#666', weight: 2, fillOpacity: 1 }}
                eventHandlers={{ click: () => setSelectedStop(selectedStop?.id === stop.id ? null : stop) }}
              >
                <Popup>{stop.name}</Popup>
              </CircleMarker>
            ))}

            {/* Bus markers — selected route */}
            {route?.vehicles.map(v => (
              <Marker key={v.id} position={[v.lat, v.lng]} icon={busIcon(route.color, route.number)} />
            ))}

            {/* Bus markers — all routes (when none selected) */}
            {!route && routes.flatMap(r => r.vehicles.map(v => (
              <Marker key={v.id} position={[v.lat, v.lng]} icon={busIcon(r.color, r.number)} />
            )))}
          </MapContainer>

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
                <span className="mrl-freq">{route.stops.length} stops</span>
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
            {[...routes.filter(r => favRoutes.has(r.id)), ...routes.filter(r => !favRoutes.has(r.id))].map(r => (
              <button
                key={r.id}
                className={`rsb-pill ${selectedRoute === r.id ? 'active' : ''}`}
                onClick={() => { setSelectedRoute(r.id); setSelectedStop(null); }}
                style={selectedRoute === r.id ? { background: r.color, borderColor: r.color } : {}}
              >
                <span className="rsb-dot" style={{ background: r.color }} />
                {r.number} {r.name.replace(/^\d+\s*/, '').split(' ')[0]}
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
              {arrivalsLoading && arrivals.length === 0 && (
                <div className="ss-loading">Loading arrivals…</div>
              )}
              {!arrivalsLoading && arrivals.length === 0 && (
                <div className="ss-no-arrivals">No upcoming arrivals.</div>
              )}
              {arrivals.map((a, i) => (
                <div className="ss-arrival-row" key={i}>
                  <div className="ss-ar-left">
                    <span className="ss-ar-dot" style={{ background: route?.color || '#666' }} />
                    <span className="ss-ar-route">{a.routeName}</span>
                    {a.vehicleName && <span className="ss-ar-bus">Bus {a.vehicleName}</span>}
                  </div>
                  <div className="ss-ar-right">
                    <span className="ss-ar-time">{a.arriveTime}</span>
                    <span className="ss-ar-eta">{a.minutes <= 1 ? 'Arriving' : `${a.minutes} min`}</span>
                  </div>
                </div>
              ))}
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
                  {stop.arrivals?.[0] && <div className="csl-next">Next: {stop.arrivals[0]}</div>}
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
            {routes.map(r => (
              <button className="car-route" key={r.id} onClick={() => { setSelectedRoute(r.id); setSelectedStop(null); }}>
                <div className="car-badge" style={{ background: r.color }}>{r.number}</div>
                <div className="car-info">
                  <div className="car-name">{r.name}</div>
                  <div className="car-freq">{r.stops.length} stops</div>
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
          </div>
        )}
      </div>
    </div>
  );
}
