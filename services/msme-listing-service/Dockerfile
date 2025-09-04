# Multi-stage build for msme-listing-service
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# -----------------------
# Dependencies
# -----------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY shared/ ./shared/
COPY services/msme-listing-service/package.json ./services/msme-listing-service/
RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile --recursive

# -----------------------
# Build shared libs
# -----------------------
FROM base AS shared-builder
COPY --from=deps /app/node_modules ./node_modules
COPY shared/ ./shared/
COPY tsconfig.json ./
RUN cd shared && pnpm run build

# -----------------------
# Build msme-listing-service
# -----------------------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/msme-listing-service ./services/msme-listing-service
COPY tsconfig.json ./
WORKDIR /app/services/msme-listing-service
RUN npx prisma generate || echo "No prisma schema"
RUN pnpm run build

# -----------------------
# Production image
# -----------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8015
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 msme-listing-service

# Copy build output
COPY --from=builder /app/services/msme-listing-service/dist ./dist
COPY --from=builder /app/services/msme-listing-service/package*.json ./
COPY --from=builder /app/services/msme-listing-service/prisma ./prisma

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

USER msme-listing-service
EXPOSE 8015

# Run DB migrations & start service
CMD ["sh", "-c", "if [ -d './prisma' ]; then npx prisma migrate deploy; fi && node dist/index.js"]
