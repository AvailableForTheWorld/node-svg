# Node SVG Project

A TypeScript monorepo for the Node SVG project, containing frontend, backend, and shared packages in a single repository.

## Project Structure

```bash
node-svg/
├── package.json         # Root package.json for the monorepo
├── pnpm-workspace.yaml  # pnpm workspace configuration
├── packages/
│   ├── backend/         # TypeScript Express API
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       └── config.ts
│   ├── shared/          # Shared TypeScript utilities
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── env.ts
│   └── frontend/        # React TypeScript frontend
│       ├── package.json
│       ├── vite.config.ts
│       ├── tsconfig.json
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

# Shared package in watch mode
pnpm --filter @node-svg/shared dev
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

The backend is a TypeScript Express API that automatically tries different ports if the default one (3002) is in use.

### Frontend

The frontend is a React application built with Vite, TypeScript, and CSS.

### Shared

The shared package contains common TypeScript utilities used by both frontend and backend, including environment configuration.
