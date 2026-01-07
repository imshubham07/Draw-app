# WebSocket Backend Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/ws-backend/package.json ./apps/ws-backend/
COPY packages/backend-common/package.json ./packages/backend-common/
COPY packages/common/package.json ./packages/common/
COPY packages/db/package.json ./packages/db/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/ws-backend/node_modules ./apps/ws-backend/node_modules

# Copy source code
COPY packages ./packages
COPY apps/ws-backend ./apps/ws-backend
COPY turbo.json ./
COPY package.json ./
COPY pnpm-workspace.yaml ./

# Build the backend
WORKDIR /app/apps/ws-backend
RUN pnpm build

# Generate Prisma client
WORKDIR /app/packages/db
RUN npx prisma generate

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NODE_PATH=/app/node_modules:/app/apps/ws-backend/node_modules

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 wsbackend

# Copy the entire workspace structure including node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/ws-backend/node_modules ./apps/ws-backend/node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/ws-backend/dist ./apps/ws-backend/dist
COPY --from=builder /app/apps/ws-backend/package.json ./apps/ws-backend/package.json

USER wsbackend

WORKDIR /app/apps/ws-backend

EXPOSE 8080

CMD ["node", "dist/index.js"]
