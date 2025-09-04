# Multi-stage build for API Gateway
FROM node:20-alpine AS base

# Install libc6-compat for Alpine musl compatibility
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

# Copy root workspace files for pnpm workspace install
COPY package*.json ./
COPY pnpm-lock.yaml pnpm-workspace.yaml ./      # Ensure pnpm workspace files copied
COPY tsconfig.json ./

# Copy entire workspace structure for proper workspace dependency resolution
COPY shared/ ./shared/
COPY api-gateway/ ./api-gateway/

# Install latest pnpm globally
RUN npm install -g pnpm@latest

# Install dependencies with workspace support and frozen lockfile
RUN pnpm install --frozen-lockfile --recursive

# Build shared library
FROM base AS shared-builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY shared/ ./shared/
COPY tsconfig.json ./

RUN cd shared && pnpm run build

# Build API Gateway
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY api-gateway/ ./api-gateway/
COPY tsconfig.json ./

# Build the API Gateway using pnpm
RUN cd api-gateway && pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy the built application with correct ownership
COPY --from=builder --chown=nodejs:nodejs /app/api-gateway/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/api-gateway/package*.json ./
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

USER nodejs

EXPOSE 3001

ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

CMD ["node", "dist/index.js"]
