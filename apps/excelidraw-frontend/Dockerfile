# Frontend Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
WORKDIR /app

# Copy workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/excelidraw-frontend/package.json ./apps/excelidraw-frontend/
COPY packages/ui/package.json ./packages/ui/
COPY packages/common/package.json ./packages/common/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/excelidraw-frontend/node_modules ./apps/excelidraw-frontend/node_modules

# Copy source code
COPY . .

# Build the frontend
WORKDIR /app/apps/excelidraw-frontend
RUN pnpm build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files
COPY --from=builder /app/apps/excelidraw-frontend/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/excelidraw-frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/excelidraw-frontend/.next/static ./apps/excelidraw-frontend/.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/excelidraw-frontend/server.js"]
