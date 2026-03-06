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

app.use(cors({ origin: true }));

// Only proxy requests under /cyride-api/*
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

app.listen(PORT, () => {
  console.log(`CyRide proxy running on http://localhost:${PORT}`);
});
