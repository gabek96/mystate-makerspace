# MyState — Iowa State University Campus App

A modern Progressive Web App (PWA) built for ISU students, featuring real-time CyRide bus tracking, dining info, class schedules, makerspace monitoring, and more — all wrapped in ISU Cardinal & Gold theming.

## Features

- **Home Dashboard** — Weather, quick actions, CyRide widget, classes, dining, and makerspace status at a glance
- **CyRide Bus Tracker** — Real-time bus positions on a Leaflet map powered by [AmesRide](https://amesride.demerstech.com) and [mycyride.com](https://www.mycyride.com) APIs
- **Dining** — Campus dining locations, hours, meal plan balance, and Get & Go markets
- **Classes** — Today's schedule, weekly view, assignments, and GPA tracker
- **Makerspace** — Live machine availability, active print jobs, and equipment status
- **Campus Map** — Interactive Leaflet map with campus points of interest
- **Student Orgs, Events, Library, Laundry, News, Career Fairs, Directory** — Dedicated pages for each campus service
- **ISU Themed** — Cardinal & Gold dark/light themes with warm, branded color palette
- **PWA** — Installable on any device, works offline with service worker caching

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool & dev server |
| React Router 6 | Client-side routing |
| Leaflet + React-Leaflet | Interactive maps |
| vite-plugin-pwa | PWA & service worker |
| AccuWeather API | Live weather data |
| AmesRide / mycyride.com | Real CyRide bus data |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)

## Installation

```bash
git clone https://github.com/gabek96/mystate-makerspace.git
cd mystate-makerspace
npm install
```

## Development

Start the local dev server with hot reload:

```bash
npm run dev
```

The app will be available at **http://localhost:5173/** (or the next available port).

The dev server automatically proxies CyRide API requests:
- `/cyride-api/*` → mycyride.com (vehicle positions)
- `/amesride-api/*` → amesride.demerstech.com (routes, stops, shapes)

## Environment Variables

| Variable | Description | Required |
|---|---|---|
| `VITE_ACCUWEATHER_KEY` | AccuWeather API key for live weather | No (falls back to mock data) |

## Production Build

Generate an optimized production build:

```bash
npm run build
```

Output is written to the `dist/` directory.

## Preview Production Build

Serve the production build locally to verify before deploying:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components (layout, home widgets, common)
├── context/          # React context providers (App, Theme)
├── data/             # Mock JSON data (cyride, dining, classes, etc.)
├── pages/            # Route page components (Home, CyRide, Dining, etc.)
├── services/         # API service layer (api.js, weather.js, cyride.js)
├── styles/           # Global CSS (theme.css, variables.css, global.css)
└── main.jsx          # App entry point
server/
└── cyride-proxy.js   # Production CORS proxy for CyRide APIs
```

## Scripts Reference

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview the production build locally |
