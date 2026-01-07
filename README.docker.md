# Docker Deployment Guide

This guide covers containerizing and deploying the Excalidraw application using Docker and Docker Compose.

## 📋 Prerequisites

- **Docker Desktop** or **Docker Engine** 20.10+
  - [Install Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - [Install Docker Engine (Linux)](https://docs.docker.com/engine/install/)
- **Docker Compose** 2.0+
  - Usually included with Docker Desktop
  - [Install Docker Compose (Linux)](https://docs.docker.com/compose/install/)
- **Git** for cloning the repository

### Verify Installation

```bash
docker --version
docker compose version
```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Excalidraw
```

### 2. Build and Start All Services

```bash
# Build images and start containers in foreground
docker compose up --build

# Or run in background (recommended for development)
docker compose up -d --build
```

This will:
- Build Docker images for all services
- Start PostgreSQL, HTTP Backend, WebSocket Backend, and Frontend
- Wait for database to be healthy before starting backends

### 3. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| HTTP Backend API | http://localhost:3001 |
| WebSocket | ws://localhost:8080 |
| Database | localhost:5432 |

### 4. Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v

# View running services
docker compose ps
```

## 📊 Service Architecture

The `docker-compose.yml` defines four services:

### PostgreSQL Database
```yaml
service: db
- Image: postgres:16-alpine
- Port: 5432
- Healthcheck: Every 10 seconds
- Volume: Persists to `excalidraw-db-data`
```

**Environment:**
- `POSTGRES_USER`: postgres
- `POSTGRES_PASSWORD`: postgres
- `POSTGRES_DB`: excalidraw

### HTTP Backend
```yaml
service: http-backend
- Port: 3001
- Depends on: PostgreSQL (health check)
- Auto-migrates Prisma schema on startup
```

**Environment:**
- `DATABASE_URL`: postgresql://postgres:postgres@db:5432/excalidraw
- `JWT_SECRET`: your-secret-key-change-in-production
- `PORT`: 3001

### WebSocket Backend
```yaml
service: ws-backend
- Port: 8080
- Depends on: PostgreSQL (health check)
```

**Environment:**
- `PORT`: 8080

### Next.js Frontend
```yaml
service: frontend
- Port: 3000
- Built for production
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory to override defaults:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/excalidraw

# Security
JWT_SECRET=your-super-secret-key-change-this-in-production

# Service Ports (optional, edit docker-compose.yml if you need to change)
# PORT_FRONTEND=3000
# PORT_HTTP_BACKEND=3001
# PORT_WS_BACKEND=8080
# PORT_DB=5432
```

### Modifying docker-compose.yml

#### Change Database Credentials
```yaml
db:
  environment:
    POSTGRES_USER: myuser
    POSTGRES_PASSWORD: mypassword
    POSTGRES_DB: mydatabase
```

#### Change Service Ports
```yaml
http-backend:
  ports:
    - "4001:3001"  # Maps container:host, change 4001 to desired port
```

#### Change JWT Secret
```yaml
http-backend:
  environment:
    JWT_SECRET: your-new-secret-key
```

## 📈 Monitoring

### View Logs

```bash
# View all service logs
docker compose logs

# View specific service logs
docker compose logs frontend
docker compose logs http-backend
docker compose logs ws-backend
docker compose logs db

# Follow logs in real-time
docker compose logs -f

# View last 50 lines
docker compose logs --tail=50

# View logs from the last hour
docker compose logs --since=1h
```

### Check Service Status

```bash
# View running services
docker compose ps

# View detailed service info
docker compose ps -a

# Check specific container details
docker inspect excalidraw-db
```

### Database Inspection

```bash
# Connect to PostgreSQL database
docker compose exec db psql -U postgres -d excalidraw

# View tables
\dt

# View schema
\d

# Exit
\q
```

## 🛠️ Development Workflow

### Rebuild Specific Service

```bash
# Rebuild frontend after code changes
docker compose up -d --build frontend

# Rebuild backend after code changes
docker compose up -d --build http-backend
docker compose up -d --build ws-backend
```

### View Container Shell

```bash
# Access frontend container
docker compose exec frontend sh

# Access backend container
docker compose exec http-backend sh

# Access database container
docker compose exec db bash
```

### Restart Services

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart http-backend

# Hard restart (stop and start)
docker compose down && docker compose up -d
```

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process on macOS/Linux
kill -9 <PID>

# Or change the port in docker-compose.yml
```

### Container Won't Start

```bash
# Check logs for error messages
docker compose logs <service-name>

# Verify image built correctly
docker images | grep excalidraw

# Rebuild with no cache
docker compose build --no-cache
```

### Database Connection Issues

```bash
# Check if database is healthy
docker compose ps db

# Check database logs
docker compose logs db

# Reset database (WARNING: deletes data)
docker compose down -v
docker compose up -d db
```

### Out of Disk Space

```bash
# Remove unused Docker resources
docker system prune

# Remove unused volumes
docker volume prune

# Remove unused images
docker image prune
```

## 📦 Building for Production

### Build Optimized Images

```bash
# Build with production flag
docker compose -f docker-compose.prod.yml up -d --build

# Or manually build images
docker build -t excalidraw-frontend:1.0.0 -f apps/excelidraw-frontend/Dockerfile .
docker build -t excalidraw-http:1.0.0 -f apps/http-backend/Dockerfile .
docker build -t excalidraw-ws:1.0.0 -f apps/ws-backend/Dockerfile .
```

### Push to Container Registry

```bash
# Tag images for Docker Hub
docker tag excalidraw-frontend:latest <your-username>/excalidraw-frontend:latest
docker tag excalidraw-http:latest <your-username>/excalidraw-http:latest
docker tag excalidraw-ws:latest <your-username>/excalidraw-ws:latest

# Push to Docker Hub
docker push <your-username>/excalidraw-frontend:latest
docker push <your-username>/excalidraw-http:latest
docker push <your-username>/excalidraw-ws:latest
```

## 🔐 Security Considerations

### Change Default Credentials

1. **Database Password**: Update `POSTGRES_PASSWORD` in docker-compose.yml
2. **JWT Secret**: Set a strong `JWT_SECRET` environment variable
3. **Production**: Never commit `.env` files with real secrets to git

### Network Security

```bash
# Create isolated network (optional)
docker network create excalidraw-network

# Update docker-compose.yml to use the network
# networks:
#   - excalidraw-network
```

## 📊 Performance Tuning

### Increase Container Resources

Edit `docker-compose.yml`:

```yaml
services:
  http-backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Database Optimization

```bash
# Access database shell
docker compose exec db psql -U postgres -d excalidraw

# Create indexes (example)
CREATE INDEX idx_user_email ON users(email);

# Analyze table performance
ANALYZE;

\q
```

## 🚀 Deployment to Cloud

### Docker Hub

```bash
# Build and push
docker compose build
docker tag excalidraw-frontend <account>/excalidraw-frontend
docker push <account>/excalidraw-frontend
```

### AWS ECR

```bash
# Authenticate with AWS
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push images
docker tag excalidraw-frontend <account>.dkr.ecr.us-east-1.amazonaws.com/excalidraw-frontend
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/excalidraw-frontend
```

### Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml excalidraw
```

### Kubernetes

```bash
# Convert docker-compose to Kubernetes manifests
kompose convert -f docker-compose.yml -o kubernetes/

# Deploy to Kubernetes
kubectl apply -f kubernetes/
```

## 📝 Maintenance

### Backup Database

```bash
# Dump database to file
docker compose exec db pg_dump -U postgres excalidraw > backup.sql

# Restore from backup
docker compose exec -T db psql -U postgres excalidraw < backup.sql
```

### Clean Up

```bash
# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune

# Full cleanup (WARNING: removes everything)
docker system prune -a --volumes
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Node.js Best Practices in Docker](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## 🆘 Getting Help

For issues related to:
- **Docker/Compose**: Check [Docker docs](https://docs.docker.com/)
- **Database**: See [PostgreSQL docs](https://www.postgresql.org/docs/)
- **Application**: Check main [README.md](README.md)

## 📄 License

MIT

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
