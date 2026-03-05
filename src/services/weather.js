/**
 * AccuWeather API integration for real-time weather.
 * Falls back to mock data if API key is missing or request fails.
 *
 * Get a free API key at: https://developer.accuweather.com/
 * Set VITE_ACCUWEATHER_API_KEY in your .env file.
 */

import weatherFallback from '../data/weather.json';

// Ames, Iowa location key for AccuWeather
const AMES_LOCATION_KEY = '328796';
const BASE_URL = 'https://dataservice.accuweather.com';

function getApiKey() {
  return import.meta.env.VITE_ACCUWEATHER_API_KEY || '';
}

/**
 * Fetch current conditions from AccuWeather and normalize to our app format.
 * Returns { temp, high, low, condition, wind, location }
 */
export async function fetchWeather() {
  const apiKey = getApiKey();
  if (!apiKey) {
    return fallback();
  }

  try {
    const url = `${BASE_URL}/currentconditions/v1/${AMES_LOCATION_KEY}?details=true`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    if (!res.ok) {
      console.warn(`AccuWeather API returned ${res.status}, using fallback`);
      return fallback();
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return fallback();
    }

    const current = data[0];
    const temp = Math.round(current.Temperature?.Imperial?.Value ?? 0);
    const condition = current.WeatherText || 'Unknown';
    const windSpeed = Math.round(current.Wind?.Speed?.Imperial?.Value ?? 0);
    const windDir = current.Wind?.Direction?.English || '';

    // TemperatureSummary gives past 24h range for hi/lo
    const hiLo = current.TemperatureSummary?.Past24HourRange;
    const high = Math.round(hiLo?.Maximum?.Imperial?.Value ?? temp + 5);
    const low = Math.round(hiLo?.Minimum?.Imperial?.Value ?? temp - 5);

    return {
      temp,
      high,
      low,
      condition,
      wind: `${windSpeed} mph ${windDir}`,
      location: 'Ames, Iowa',
      live: true
    };
  } catch (err) {
    console.warn('AccuWeather fetch failed, using fallback:', err.message);
    return fallback();
  }
}

function fallback() {
  return { ...weatherFallback.current, live: false };
}
