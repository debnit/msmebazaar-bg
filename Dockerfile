# Multi-stage build for MSMEBazaar Platform
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY tsconfig.json ./

# Copy entire workspace structure for proper workspace dependency resolution
COPY shared/ ./shared/
COPY api-gateway/ ./api-gateway/
COPY frontend/ ./frontend/
COPY services/ ./services/

# Upgrade npm for workspace support
RUN npm install -g npm@latest

# Install dependencies with workspace support
RUN npm install --workspaces --omit=dev

# Build shared library
FROM base AS shared-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY shared/ ./shared/
COPY tsconfig.json ./
RUN cd shared && npm run build

# Build API Gateway
FROM base AS gateway-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY api-gateway/ ./api-gateway/
COPY tsconfig.json ./

# Build the API Gateway
RUN cd api-gateway && npm run build

# Build Frontend
FROM base AS frontend-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY frontend/ ./frontend/
COPY tsconfig.json ./
RUN cd frontend && npm run build

# Build Services
FROM base AS services-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/ ./services/
COPY tsconfig.json ./
RUN cd services && for service in */; do cd "$service" && npm run build && cd ..; done

# Production image for API Gateway
FROM base AS gateway-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=gateway-builder /app/api-gateway/dist ./dist
COPY --from=gateway-builder /app/api-gateway/package*.json ./
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/index.js"]

# Production image for Frontend
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

# Production image for Services
FROM base AS services-prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=services-builder /app/services ./services
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3002-3021
CMD ["node", "services/auth-service/dist/index.js"]

