# Multi-stage build for MSMEBazaar Platform using pnpm

FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

# Copy top-level workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./

# Copy workspace folders
COPY shared/ ./shared/
COPY api-gateway/ ./api-gateway/
COPY frontend/ ./frontend/
COPY services/ ./services/

#
# Dependencies (with Prisma schema folders)
#
FROM base AS deps

# Copy all Prisma schemas for every service
COPY services/*/prisma/ ./services/
# Now each service's schema is at /app/services/<svc>/prisma/*

# Install dependencies (including dev)
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --recursive

# Generate Prisma Client for each service that uses Prisma
RUN for svc in ./services/*; do \
      if [ -d "$svc/prisma" ] && [ -f "$svc/package.json" ]; then \
        cd "$svc" && pnpm exec prisma generate || true ; \
        cd - > /dev/null ; \
      fi ; \
    done

#
# Build shared, gateway, frontend as before...
#

FROM base AS shared-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY shared/ ./shared/
COPY tsconfig.json ./
RUN pnpm --filter ./shared... build

FROM base AS gateway-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY api-gateway/ ./api-gateway/
COPY tsconfig.json ./
RUN pnpm --filter ./api-gateway... build

FROM base AS frontend-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY frontend/ ./frontend/
COPY tsconfig.json ./
RUN pnpm --filter ./frontend... build

# Build all Services in workspace
FROM base AS services-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/ ./services/
COPY tsconfig.json ./
RUN pnpm --filter ./services... build

#
# Production stages as before...
#

FROM base AS gateway-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=gateway-builder /app/api-gateway/dist ./dist
COPY --from=gateway-builder /app/api-gateway/package*.json ./
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/index.js"]

FROM base AS frontend-prod
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/.next/standalone ./
COPY --from=frontend-builder /app/frontend/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]

FROM base AS services-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=services-builder /app/services ./services
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3002-3021
CMD ["node", "services/auth-service/dist/index.js"]
