# Multi-stage build for Shared Library
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

# Upgrade npm for workspace support
RUN npm install -g npm@latest

# Install dependencies with workspace support
RUN npm install --workspaces --omit=dev

# Build shared library
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY shared/ ./shared/
COPY tsconfig.json ./

# Build the shared library
RUN cd shared && npm run build

# Production image for shared library
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy the built shared library
COPY --from=builder --chown=nodejs:nodejs /app/shared/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/shared/package*.json ./
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules

USER nodejs

# This image is primarily used as a base for other services
# but can also be used standalone if needed
CMD ["node", "-e", "console.log('Shared library built successfully')"]
