# 🎨 Excalidraw Clone - Collaborative Drawing App

A modern full-stack web application for real-time collaborative drawing. Built with Next.js, TypeScript, WebSockets, and PostgreSQL.

![Node](https://img.shields.io/badge/Node-20.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Development](#development)
- [Scripts](#scripts)
- [Docker Deployment](#docker-deployment)
- [Database](#database)
- [Architecture](#architecture)
- [Contributing](#contributing)

## ✨ Features

- 🎯 **Real-time Collaborative Drawing** - Multiple users can draw simultaneously with WebSocket synchronization
- 🔐 **User Authentication** - Secure JWT-based authentication with password hashing
- 💾 **Persistent Storage** - Save drawings to PostgreSQL database
- 📱 **Responsive UI** - Modern Next.js 15 frontend with Tailwind CSS
- 🚀 **Monorepo Architecture** - Organized with pnpm workspaces and Turbo
- 🐳 **Docker Ready** - Containerized services with docker-compose
- 📝 **Type Safe** - 100% TypeScript codebase
- ⚡ **Fast Builds** - Optimized with Turbo caching

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5** - React framework with SSR
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Socket.io Client** - WebSocket communication

### Backend
- **Node.js 20** - Runtime
- **Express.js** - REST API framework
- **WebSocket (ws)** - Real-time communication
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Database
- **PostgreSQL 16** - Primary database
- **Prisma** - ORM and migrations

### DevOps
- **Docker & Docker Compose** - Containerization
- **pnpm** - Package manager
- **Turbo** - Monorepo build system
- **TypeScript** - Static typing

## 📁 Project Structure

```
Excalidraw/
├── apps/
│   ├── excelidraw-frontend/     # Next.js 15 React app
│   │   ├── app/                 # App directory structure
│   │   ├── Components/          # React components
│   │   ├── public/              # Static assets
│   │   └── package.json
│   ├── http-backend/            # Express REST API
│   │   ├── src/
│   │   │   ├── index.ts         # Server entry point
│   │   │   └── middleware.ts    # Custom middleware
│   │   └── package.json
│   └── ws-backend/              # WebSocket server
│       ├── src/
│       │   └── index.ts         # WS server entry
│       └── package.json
├── packages/
│   ├── db/                      # Prisma ORM & migrations
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Database schema
│   │   │   └── migrations/      # DB migrations
│   │   └── package.json
│   ├── common/                  # Shared TypeScript types
│   ├── backend-common/          # Backend utilities
│   ├── ui/                      # Shared React components
│   ├── typescript-config/       # Shared tsconfig
│   └── eslint-config/           # Shared ESLint config
├── docker-compose.yml           # Service orchestration
├── pnpm-workspace.yaml          # Workspace config
├── turbo.json                   # Build configuration
├── package.json                 # Root package
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **pnpm** 9.0+ 
  ```bash
  npm install -g pnpm@9.0.0
  ```
- **PostgreSQL** 16+ (for local development)
- **Docker & Docker Compose** (for containerized setup)

### Option 1: Local Development

1. **Clone and setup**
   ```bash
   git clone <repo-url>
   cd Excalidraw
   pnpm install
   ```

2. **Configure environment**
   ```bash
   # Create .env in root
   echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/excalidraw" > .env
   echo "JWT_SECRET=your-secret-key" >> .env
   ```

3. **Setup database**
   ```bash
   cd packages/db
   npx prisma migrate dev
   npx prisma generate
   cd ../..
   ```

4. **Start development**
   ```bash
   pnpm dev
   ```

   Services will start:
   - Frontend: http://localhost:3000
   - HTTP API: http://localhost:3001
   - WebSocket: ws://localhost:8080

### Option 2: Docker (Recommended)

```bash
git clone <repo-url>
cd Excalidraw
docker compose up -d --build
```

Access at http://localhost:3000

See [README.docker.md](README.docker.md) for detailed Docker guide.

## 💻 Development

### Install Dependencies
```bash
pnpm install
```

### Start Dev Server
```bash
pnpm dev
```

### Build for Production
```bash
pnpm build
```

### Type Checking
```bash
pnpm check-types
```

### Linting & Formatting
```bash
pnpm lint          # Run ESLint
pnpm format        # Format with Prettier
```

### Run Specific App
```bash
pnpm dev --filter=excelidraw-frontend
pnpm dev --filter=http-backend
pnpm dev --filter=ws-backend
```

## 📋 Scripts

All scripts run via `pnpm` in the root directory:

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Start all services in dev mode |
| `pnpm build` | Build all apps & packages for production |
| `pnpm lint` | Run ESLint on all code |
| `pnpm format` | Format code with Prettier |
| `pnpm check-types` | TypeScript type checking |

Database scripts (from `packages/db`):
```bash
npx prisma migrate dev     # Create & apply migrations
npx prisma generate        # Generate Prisma client
npx prisma studio         # Open database GUI
```

## 🐳 Docker Deployment

Quick start with Docker:
```bash
docker compose up -d --build
```

**Services:**
- Frontend: http://localhost:3000
- API: http://localhost:3001
- WebSocket: ws://localhost:8080
- Database: localhost:5432

**Useful Docker Commands:**
```bash
# View logs
docker compose logs -f http-backend
docker compose logs -f ws-backend

# Stop services
docker compose down

# Rebuild specific service
docker compose up -d --build http-backend
```

See [README.docker.md](README.docker.md) for complete Docker documentation.

## 🗄️ Database

### Schema Overview

The database includes tables for:
- **Users** - User accounts with hashed passwords
- **Drawings** - Persisted drawing data
- **Sessions** - User session management

### Migrations

Migrations are in `packages/db/prisma/migrations/`. To create a new migration:

```bash
cd packages/db
npx prisma migrate dev --name your_migration_name
```

### Access Database

Local PostgreSQL:
```bash
psql postgresql://postgres:postgres@localhost:5432/excalidraw
```

Docker:
```bash
docker compose exec db psql -U postgres -d excalidraw
```

## 🏗️ Architecture

### Monorepo Structure
- Uses **pnpm workspaces** for dependency management
- Uses **Turbo** for intelligent build caching
- Shared packages reduce code duplication

### Service Architecture
```
┌─────────────────────────────────────┐
│      Next.js Frontend (3000)         │
│  - User Interface                    │
│  - Drawing Canvas                    │
│  - Real-time Sync via WebSocket      │
└──────────────┬──────────────────────┘
               │
     ┌─────────┴─────────┐
     │                   │
┌────▼────────┐    ┌────▼────────┐
│ HTTP API    │    │  WebSocket   │
│ (3001)      │    │  (8080)      │
│ - Auth      │    │ - Real-time  │
│ - CRUD      │    │ - Drawing    │
│ - JWT       │    │ - Sync       │
└────┬────────┘    └────┬────────┘
     │                   │
     └─────────┬─────────┘
               │
        ┌──────▼──────┐
        │ PostgreSQL   │
        │ (5432)       │
        │ - Users      │
        │ - Drawings   │
        └──────────────┘
```

## 🤝 Contributing

1. Create a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```

3. Run checks before pushing
   ```bash
   pnpm lint
   pnpm format
   pnpm check-types
   pnpm build
   ```

4. Push and create pull request
   ```bash
   git push origin feature/amazing-feature
   ```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Troubleshooting

**Port Already in Use?**
```bash
# Kill process on port 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

**Database Connection Issues?**
```bash
# Verify PostgreSQL is running
psql --version
psql postgresql://postgres:postgres@localhost:5432/excalidraw
```

**Node Modules Issues?**
```bash
# Clean install
pnpm store prune
rm -rf node_modules packages/*/node_modules
pnpm install
```

For more help, see [README.docker.md](README.docker.md) for Docker-specific issues.

---

**Happy Drawing! 🎨**
