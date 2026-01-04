# HTTP Backend Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/http-backend/package.json ./apps/http-backend/
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
COPY --from=deps /app/apps/http-backend/node_modules ./apps/http-backend/node_modules

# Copy source code
COPY packages ./packages
COPY apps/http-backend ./apps/http-backend
COPY turbo.json ./

# Build the backend
WORKDIR /app/apps/http-backend
RUN pnpm build

# Generate Prisma client
WORKDIR /app/packages/db
RUN npx prisma generate

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 httpbackend

# Copy built files and dependencies from builder (which has all deps)
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/http-backend/dist ./dist
COPY --from=builder /app/apps/http-backend/package.json ./package.json

USER httpbackend

EXPOSE 3001

CMD ["node", "dist/index.js"]
