# MyState — Setup & Running Guide

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

The app will be available at **http://localhost:5173/**.

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

## Scripts Reference

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR       |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview the production build locally |
