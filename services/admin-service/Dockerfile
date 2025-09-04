# Multi-stage build for admin-service
FROM node:20-alpine AS base

# Common base setup
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ----------------------
# Install dependencies
# ----------------------
FROM base AS deps

# Copy only root-level deps first (better caching)
COPY package*.json pnpm-lock.yaml* tsconfig.json ./

# Workspace deps
COPY shared/package*.json ./shared/
COPY services/admin-service/package*.json ./services/admin-service/

# Install pnpm and deps
RUN npm install -g pnpm@latest && pnpm install --frozen-lockfile --recursive

# ----------------------
# Build shared lib
# ----------------------
FROM deps AS shared-builder
COPY shared ./shared
RUN cd shared && pnpm run build

# ----------------------
# Build admin-service
# ----------------------
FROM deps AS builder
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/admin-service ./services/admin-service
RUN cd services/admin-service && pnpm run build && \
    if [ -d "prisma" ]; then npx prisma generate; fi

# ----------------------
# Production runner
# ----------------------
FROM base AS runner

ENV NODE_ENV=production
ENV PORT=8009
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 admin-service

# Copy build artifacts
WORKDIR /app
COPY --from=builder --chown=admin-service:nodejs /app/services/admin-service/dist ./dist
COPY --from=builder --chown=admin-service:nodejs /app/services/admin-service/package*.json ./
COPY --from=deps --chown=admin-service:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=admin-service:nodejs /app/services/admin-service/prisma ./prisma

USER admin-service

EXPOSE 8009

CMD ["sh", "-c", "if [ -d './prisma' ]; then npx prisma migrate deploy; fi && node dist/index.js"]
