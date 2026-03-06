/**
 * CyRide real-time bus tracking service.
 *
 * Tries the live CyRide API (https://www.mycyride.com) first.
 * If CORS or network blocks it, falls back to a realistic simulation
 * that moves buses smoothly along their route paths.
 */

const CYRIDE_API = 'https://www.mycyride.com';

// In dev, Vite proxies /cyride-api/* → mycyride.com/*
// In production, use the Express relay server URL from env, or fall back to direct
const API_BASE = import.meta.env.DEV
  ? '/cyride-api'
  : (import.meta.env.VITE_CYRIDE_PROXY || CYRIDE_API);

// Per-vehicle simulation state
const sim = new Map();

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Initialize simulation state for all vehicles across all routes */
function initSimulation(routes) {
  for (const route of routes) {
    if (route.status !== 'active' || !route.stops.length) continue;
    for (let i = 0; i < route.vehicles.length; i++) {
      const v = route.vehicles[i];
      if (!sim.has(v.id)) {
        // Distribute vehicles evenly along the route
        const progress = (i / route.vehicles.length) * (route.stops.length - 1);
        sim.set(v.id, {
          progress,
          speed: 0.06 + Math.random() * 0.06,
        });
      }
    }
  }
}

/** Advance all vehicles one tick and return updated routes array */
function tickSimulation(routes) {
  return routes.map(route => {
    if (route.status !== 'active' || !route.stops.length || !route.vehicles.length) return route;

    const vehicles = route.vehicles.map(v => {
      const s = sim.get(v.id);
      if (!s) return v;

      // Advance along route
      s.progress += s.speed;
      if (s.progress >= route.stops.length - 0.01) s.progress = 0;

      // Add slight speed variation for realism
      s.speed += (Math.random() - 0.5) * 0.008;
      s.speed = Math.max(0.04, Math.min(0.12, s.speed));

      // Interpolate position between surrounding stops
      const idx = Math.floor(s.progress);
      const frac = s.progress - idx;
      const from = route.stops[idx];
      const to = route.stops[Math.min(idx + 1, route.stops.length - 1)];

      const lat = lerp(from.lat, to.lat, frac);
      const lng = lerp(from.lng, to.lng, frac);
      const heading = Math.atan2(to.lng - from.lng, to.lat - from.lat) * (180 / Math.PI);

      return { ...v, lat, lng, heading, speed: Math.round(10 + Math.random() * 20) };
    });

    return { ...route, vehicles };
  });
}

/** Try to fetch from the real CyRide API */
async function apiFetch(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
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

/** Transform real API vehicle data to our format */
function transformVehicle(apiVehicle) {
  return {
    id: String(apiVehicle.ID ?? apiVehicle.VehicleId ?? apiVehicle.id),
    name: apiVehicle.Name || '',
    lat: apiVehicle.Latitude ?? apiVehicle.Coordinate?.Latitude ?? 0,
    lng: apiVehicle.Longitude ?? apiVehicle.Coordinate?.Longitude ?? 0,
    heading: parseHeading(apiVehicle.Heading),
    speed: apiVehicle.Speed ?? 0,
    occupancy: apiVehicle.APCPercentage ?? null,
    updatedAgo: apiVehicle.UpdatedAgo || '',
  };
}

const HEADING_MAP = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
function parseHeading(h) {
  if (typeof h === 'number') return h;
  return HEADING_MAP[h] ?? 0;
}

export const cyrideService = {
  _isLive: false,
  _apiRoutes: [],   // real CyRide route objects from API

  get isLive() { return this._isLive; },

  /** Attempt to connect to the real CyRide API and fetch route list */
  async tryConnect() {
    try {
      const routes = await apiFetch('/Region/0/Routes');
      this._apiRoutes = Array.isArray(routes) ? routes : [];
      this._isLive = true;
      return true;
    } catch {
      this._isLive = false;
      return false;
    }
  },

  /** Find the real API route ID that best matches a mock route number */
  _matchApiRoute(mockNumber) {
    return this._apiRoutes.find(r =>
      r.ShortName === mockNumber || r.Name?.startsWith(mockNumber + ' ')
    );
  },

  /** Fetch real vehicle positions for all active routes and merge into local state */
  async fetchAllLiveVehicles(routes) {
    if (!this._isLive) return null;
    try {
      const updated = await Promise.all(routes.map(async route => {
        if (route.status !== 'active') return route;
        const apiRoute = this._matchApiRoute(route.number);
        if (!apiRoute) return route;
        try {
          const data = await apiFetch(`/Route/${encodeURIComponent(apiRoute.ID)}/Vehicles`);
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

  /** Initialize simulation from mock route data */
  initSim(routes) {
    initSimulation(routes);
  },

  /** Tick: if live, fetch real data; otherwise advance simulation */
  async tick(routes) {
    if (this._isLive) {
      const live = await this.fetchAllLiveVehicles(routes);
      if (live) return live;
      // fell through — API failed, fall back to sim
    }
    return tickSimulation(routes);
  },
};
