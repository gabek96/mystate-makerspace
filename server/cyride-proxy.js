/**
 * CyRide CORS relay server.
 *
 * Run this alongside your production build to proxy requests
 * from your frontend to https://www.mycyride.com, adding
 * the proper CORS headers so the browser allows them.
 *
 * Usage:
 *   npm install express cors
 *   node server/cyride-proxy.js
 *
 * Then set VITE_CYRIDE_PROXY=http://localhost:3001/cyride-api
 * in your .env file before building.
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;
const CYRIDE_TARGET = 'https://www.mycyride.com';
const AMESRIDE_TARGET = 'https://amesride.demerstech.com';

app.use(cors({ origin: true }));

// Proxy requests under /cyride-api/* → mycyride.com
app.get('/cyride-api/*', async (req, res) => {
  const apiPath = req.path.replace(/^\/cyride-api/, '');

  // Validate the path to prevent SSRF — only allow CyRide API paths
  if (!/^\/[/.a-zA-Z0-9-]+$/.test(apiPath)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const upstream = await fetch(CYRIDE_TARGET + apiPath, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Upstream ${upstream.status}` });
    }

    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach CyRide API' });
  }
});

// Proxy requests under /amesride-api/* → amesride.demerstech.com
app.get('/amesride-api/*', async (req, res) => {
  const apiPath = req.path.replace(/^\/amesride-api/, '');

  // Validate the path to prevent SSRF — only allow data endpoint
  if (!/^\/data(\?[a-zA-Z0-9=&_-]*)?$/.test(apiPath)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const upstream = await fetch(AMESRIDE_TARGET + apiPath, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Upstream ${upstream.status}` });
    }

    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach AmesRide API' });
  }
});

app.listen(PORT, () => {
  console.log(`CyRide proxy running on http://localhost:${PORT}`);
});
