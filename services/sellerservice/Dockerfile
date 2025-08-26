# Multi-stage build for sellerservice
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
COPY services/sellerservice/ ./services/sellerservice/

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

# Build sellerservice
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/sellerservice/ ./services/sellerservice/
COPY tsconfig.json ./

# Generate Prisma client if prisma directory exists
RUN if [ -d "services/sellerservice/prisma" ]; then cd services/sellerservice && npx prisma generate; fi

# Build the service
RUN cd services/sellerservice && npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sellerservice

# Copy the built application
COPY --from=builder --chown=sellerservice:nodejs /app/services/sellerservice/dist ./dist
COPY --from=builder --chown=sellerservice:nodejs /app/services/sellerservice/package*.json ./
COPY --from=deps --chown=sellerservice:nodejs /app/node_modules ./node_modules

# Copy Prisma files if they exist
RUN if [ -d "/app/services/sellerservice/prisma" ]; then       cp -r /app/services/sellerservice/prisma ./prisma;     fi

USER sellerservice

EXPOSE 3010

ENV PORT 3010
ENV HOSTNAME "0.0.0.0"

# Run database migrations and start the service
CMD ["sh", "-c", "if [ -d './prisma' ]; then npx prisma migrate deploy; fi && node dist/index.js"]