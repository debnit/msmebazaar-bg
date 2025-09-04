# Multi-stage build for search-matchmaking-service
FROM node:20-alpine AS base

# -----------------------------
# 1. Dependencies stage
# -----------------------------
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only package files for caching
COPY package.json pnpm-lock.yaml ./
COPY shared/package*.json ./shared/
COPY services/search-matchmaking-service/package*.json ./services/search-matchmaking-service/

# Install deps with workspace support
RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile --recursive

# -----------------------------
# 2. Build stage
# -----------------------------
FROM deps AS build
WORKDIR /app

# Copy all sources
COPY . .

# Build shared lib
RUN cd shared && pnpm build

# Generate Prisma client (if exists)
RUN if [ -d "services/search-matchmaking-service/prisma" ]; then \
      cd services/search-matchmaking-service && npx prisma generate; \
    fi

# Build the service
RUN cd services/search-matchmaking-service && pnpm build

# -----------------------------
# 3. Runtime stage
# -----------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 search-matchmaking-service

# Copy only necessary files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/shared/dist ./shared/dist
COPY --from=build /app/services/search-matchmaking-service/package*.json ./
COPY --from=build /app/services/search-matchmaking-service/prisma ./prisma
COPY --from=build /app/services/search-matchmaking-service/dist ./dist

# Prune dev dependencies
RUN pnpm prune --prod

USER search-matchmaking-service

EXPOSE 8019
ENV PORT=8019
ENV HOSTNAME=0.0.0.0

# Start service (migrations should be run outside container)
CMD ["node", "dist/index.js"]
