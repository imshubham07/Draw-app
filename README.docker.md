# Docker Setup for DrawApp

This project includes Docker configuration for easy deployment.

## Prerequisites

- Docker Desktop or Docker Engine (20.10+)
- Docker Compose (2.0+)

## Quick Start

### 1. Build and Run All Services

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **HTTP Backend**: http://localhost:3001
- **WebSocket Backend**: ws://localhost:8080
- **Database**: localhost:5432

## Individual Services

### Build Individual Service

```bash
# Frontend
docker build -t excalidraw-frontend -f apps/excelidraw-frontend/Dockerfile .

# HTTP Backend
docker build -t excalidraw-http -f apps/http-backend/Dockerfile .

# WebSocket Backend
docker build -t excalidraw-ws -f apps/ws-backend/Dockerfile .
```

### Run Individual Service

```bash
# Frontend
docker run -p 3000:3000 excalidraw-frontend

# HTTP Backend
docker run -p 3001:3001 excalidraw-http

# WebSocket Backend
docker run -p 8080:8080 excalidraw-ws
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/excalidraw
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=excalidraw

# Backend
JWT_SECRET=your-secret-key-change-in-production

# Frontend
NEXT_PUBLIC_HTTP_BACKEND=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:8080
```

## Docker Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f frontend

# Rebuild specific service
docker-compose up -d --build frontend

# Run database migrations
docker-compose exec http-backend npx prisma migrate deploy

# Access database
docker-compose exec db psql -U postgres -d excalidraw
```

## Production Deployment

### 1. Update Environment Variables

Edit `docker-compose.yml` or create `docker-compose.prod.yml`:

```yaml
environment:
  DATABASE_URL: postgresql://user:password@production-db:5432/excalidraw
  JWT_SECRET: strong-random-secret-key
  NEXT_PUBLIC_HTTP_BACKEND: https://api.yourdomain.com
  NEXT_PUBLIC_WS_URL: wss://ws.yourdomain.com
```

### 2. Use Production Compose File

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 3. Enable SSL/TLS

Use a reverse proxy like Nginx or Traefik for SSL termination.

## Troubleshooting

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps db

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Port Conflicts

If ports are already in use, modify `docker-compose.yml`:

```yaml
ports:
  - "3001:3001"  # Change to "3002:3001" for example
```

### Clear Everything and Rebuild

```bash
# Stop all containers
docker-compose down -v

# Remove all images
docker-compose rm -f

# Rebuild from scratch
docker-compose up --build --force-recreate
```

## Development vs Production

### Development Mode

```bash
# Mount volumes for hot reload
docker-compose -f docker-compose.dev.yml up
```

### Production Mode

```bash
# Use optimized production build
docker-compose up -d
```

## Health Checks

The database includes health checks. Backend services wait for the database to be ready before starting.

## Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect excalidraw_postgres_data

# Backup database
docker-compose exec db pg_dump -U postgres excalidraw > backup.sql

# Restore database
docker-compose exec -T db psql -U postgres excalidraw < backup.sql
```

## Scaling

```bash
# Scale WebSocket backend
docker-compose up -d --scale ws-backend=3
```

## Multi-Stage Builds

All Dockerfiles use multi-stage builds for:
- Smaller image sizes
- Better caching
- Security (production images don't include dev dependencies)

## Best Practices

1. **Never commit sensitive data** - Use `.env` files and add them to `.gitignore`
2. **Use specific versions** - Pin Node.js and package versions
3. **Regular updates** - Keep base images updated
4. **Monitor logs** - Use `docker-compose logs` to monitor application health
5. **Backup data** - Regularly backup the PostgreSQL volume

## Support

For issues or questions, check the main README.md or open an issue on GitHub.
