# Node SVG Project

A monorepo for the Node SVG project, containing both frontend and backend implementations in a single repository.

## Project Structure

```bash
node-svg/
├── package.json         # Root package.json for the monorepo
├── pnpm-workspace.yaml  # pnpm workspace configuration
├── packages/
│   ├── backend/         # Backend Node.js API
│   │   ├── package.json
│   │   └── src/
│   │       └── index.js
│   └── frontend/        # React frontend
│       ├── package.json
│       ├── vite.config.ts
│       └── src/
│           ├── App.tsx
│           ├── App.css
│           ├── main.tsx
│           └── index.css
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v10+)

### Installation

1. Install dependencies for all packages:

```bash
pnpm install
```

### Development

Run both frontend and backend in development mode:

```bash
pnpm dev
```

Or run them individually:

```bash
# Backend only
pnpm --filter @node-svg/backend dev

# Frontend only
pnpm --filter @node-svg/frontend dev
```

### Production

Build all packages:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

## Package-Specific Information

### Backend

The backend is a Node.js Express API running on port 3000 by default.

### Frontend

The frontend is a React application built with Vite, TypeScript, and CSS.
