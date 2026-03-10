/**
 * CyRide real-time bus tracking service.
 *
 * Fetches real route/stop/shape data from the AmesRide backend,
 * and live vehicle positions from the CyRide API (via proxy).
 * Falls back to simulation if APIs are unreachable.
 */

const CYRIDE_API = 'https://www.mycyride.com';
const AMESRIDE_API = 'https://amesride.demerstech.com';

// Use proxy paths in both dev (Vite proxy) and production (Netlify proxy)
const API_BASE = '/cyride-api';
const AMESRIDE_BASE = '/amesride-api';

const AMESRIDE_DATA = AMESRIDE_BASE + '/data?hash=NONE&os=web';

// ── Simulation helpers ──

const sim = new Map();

function lerp(a, b, t) { return a + (b - a) * t; }

function initSimulation(routes) {
  for (const route of routes) {
    if (!route.stops.length) continue;
    for (let i = 0; i < route.vehicles.length; i++) {
      const v = route.vehicles[i];
      if (!sim.has(v.id)) {
        sim.set(v.id, {
          progress: (i / route.vehicles.length) * (route.stops.length - 1),
          speed: 0.06 + Math.random() * 0.06,
        });
      }
    }
  }
}

function tickSimulation(routes) {
  return routes.map(route => {
    if (!route.stops.length || !route.vehicles.length) return route;
    const vehicles = route.vehicles.map(v => {
      const s = sim.get(v.id);
      if (!s) return v;
      s.progress += s.speed;
      if (s.progress >= route.stops.length - 0.01) s.progress = 0;
      s.speed += (Math.random() - 0.5) * 0.008;
      s.speed = Math.max(0.04, Math.min(0.12, s.speed));
      const idx = Math.floor(s.progress);
      const frac = s.progress - idx;
      const from = route.stops[idx];
      const to = route.stops[Math.min(idx + 1, route.stops.length - 1)];
      return { ...v, lat: lerp(from.lat, to.lat, frac), lng: lerp(from.lng, to.lng, frac), speed: Math.round(10 + Math.random() * 20) };
    });
    return { ...route, vehicles };
  });
}

// ── Network helpers ──

async function apiFetch(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  try {
    const res = await fetch(API_BASE + path, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}

function transformVehicle(v) {
  return {
    id: String(v.ID ?? v.id),
    name: v.Name || '',
    lat: v.Latitude ?? v.Coordinate?.Latitude ?? 0,
    lng: v.Longitude ?? v.Coordinate?.Longitude ?? 0,
    heading: parseHeading(v.Heading),
    speed: v.Speed ?? 0,
    occupancy: v.APCPercentage ?? null,
  };
}

const HEADING_MAP = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
function parseHeading(h) {
  if (typeof h === 'number') return h;
  return HEADING_MAP[h] ?? 0;
}

// ── Build route objects from AmesRide backend data ──

function buildRoutesFromData(raw) {
  const { routes: routeMap, stops: stopMap, trips: tripMap, shapes: shapeMap } = raw;
  const built = [];

  for (const [routeId, route] of Object.entries(routeMap)) {
    if (!route.trips || !route.trips.length) continue;

    // Pick the first trip to get stops and shape
    const tripId = route.trips[0];
    const trip = tripMap[tripId];
    if (!trip) continue;

    // Build stop list with real coordinates
    const stops = (trip.stops || [])
      .map(sid => stopMap[sid])
      .filter(Boolean)
      .map(s => ({
        id: s.stop_id,
        name: s.stop_name,
        lat: parseFloat(s.stop_lat),
        lng: parseFloat(s.stop_lon),
      }));

    // Build shape polyline
    const shapePoints = (shapeMap[trip.shape_id] || [])
      .sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence)
      .map(p => [p.latitude, p.longitude]);

    built.push({
      id: routeId,
      number: route.route_short_name,
      name: route.route_long_name,
      color: '#' + (route.route_color || '666666'),
      stops,
      shape: shapePoints,
      vehicles: [],
      apiRouteId: parseInt(routeId, 10),
    });
  }

  // Sort by route number
  built.sort((a, b) => {
    const na = parseInt(a.number) || 999;
    const nb = parseInt(b.number) || 999;
    return na - nb || a.name.localeCompare(b.name);
  });

  return built;
}

// ── Exported service ──

export const cyrideService = {
  _isLive: false,
  _hasRealData: false,

  get isLive() { return this._isLive; },
  get hasRealData() { return this._hasRealData; },

  /**
   * Fetch real route/stop/shape data from the AmesRide backend.
   * Also fetches waypoints from mycyride.com for polylines.
   * Returns array of route objects, or null on failure.
   */
  async fetchRealRoutes() {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(AMESRIDE_DATA, {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const routes = buildRoutesFromData(json.data);
      this._hasRealData = routes.length > 0;

      // Fetch waypoints from mycyride.com for routes that are missing shapes
      if (routes.length > 0) {
        await Promise.allSettled(routes.map(async route => {
          if (route.shape.length > 0) return; // AmesRide shape already available
          try {
            const waypoints = await apiFetch(`/Route/${route.apiRouteId}/Waypoints`);
            if (Array.isArray(waypoints) && waypoints.length > 0) {
              const poly = Array.isArray(waypoints[0]) ? waypoints[0] : waypoints;
              route.shape = poly.map(p => [p.Latitude, p.Longitude]);
            }
          } catch { /* ignore */ }
        }));
      }

      return routes;
    } catch {
      this._hasRealData = false;
      return null;
    }
  },

  /** Try connecting to the live vehicle position API */
  async tryConnect() {
    try {
      await apiFetch('/Region/0/Routes');
      this._isLive = true;
      return true;
    } catch {
      this._isLive = false;
      return false;
    }
  },

  /** Fetch live vehicle positions for all routes */
  async fetchAllLiveVehicles(routes) {
    if (!this._isLive) return null;
    try {
      const updated = await Promise.all(routes.map(async route => {
        if (!route.apiRouteId) return route;
        try {
          const data = await apiFetch(`/Route/${route.apiRouteId}/Vehicles`);
          const vehicles = Array.isArray(data) ? data.map(transformVehicle) : route.vehicles;
          return { ...route, vehicles };
        } catch {
          return route;
        }
      }));
      return updated;
    } catch {
      this._isLive = false;
      return null;
    }
  },

  initSim(routes) { initSimulation(routes); },

  async tick(routes) {
    if (this._isLive) {
      const live = await this.fetchAllLiveVehicles(routes);
      if (live) return live;
    }
    return tickSimulation(routes);
  },

  /**
   * Fetch direction-based stops from mycyride.com for a route.
   * Returns array of { id, name, lat, lng, rtpiNumber } or null.
   */
  async fetchDirectionStops(apiRouteId) {
    try {
      const data = await apiFetch(`/Route/${apiRouteId}/Directions/`);
      if (!Array.isArray(data)) return null;
      const stops = [];
      const seen = new Set();
      for (const dir of data) {
        for (const s of (dir.Stops || [])) {
          if (!seen.has(s.ID)) {
            seen.add(s.ID);
            stops.push({
              id: String(s.ID),
              name: s.Name,
              lat: s.Latitude,
              lng: s.Longitude,
              rtpiNumber: s.RtpiNumber || 0,
            });
          }
        }
      }
      return stops;
    } catch {
      return null;
    }
  },

  /**
   * Fetch real-time arrival predictions for a stop.
   * customerID 187 = CyRide Ames.
   * Returns array of { routeName, vehicleName, arriveTime, minutes, secondsToArrival }.
   */
  async fetchStopArrivals(stopId) {
    try {
      const data = await apiFetch(`/Stop/${stopId}/Arrivals?customerID=187`);
      if (!Array.isArray(data)) return [];
      const arrivals = [];
      for (const group of data) {
        for (const a of (group.Arrivals || [])) {
          arrivals.push({
            routeName: a.RouteName || '',
            routeId: a.RouteID,
            vehicleName: a.VehicleName || a.BusName || '',
            arriveTime: a.ArriveTime || '',
            minutes: a.Minutes ?? Math.round((a.SecondsToArrival || 0) / 60),
            secondsToArrival: a.SecondsToArrival || 0,
            isScheduled: a.SchedulePrediction || false,
          });
        }
      }
      arrivals.sort((a, b) => a.secondsToArrival - b.secondsToArrival);
      return arrivals;
    } catch {
      return [];
    }
  },
};
