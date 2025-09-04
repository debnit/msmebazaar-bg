# Multi-stage build for payment-service
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# -----------------------
# Install dependencies
# -----------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml tsconfig.json ./
COPY shared/package.json ./shared/
COPY services/payment-service/package.json ./services/payment-service/
RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile --recursive

# -----------------------
# Build shared libraries
# -----------------------
FROM deps AS shared-builder
COPY shared ./shared
RUN cd shared && pnpm run build

# -----------------------
# Build payment-service
# -----------------------
FROM deps AS builder
COPY --from=shared-builder /app/shared/dist ./shared/dist
COPY services/payment-service ./services/payment-service
WORKDIR /app/services/payment-service
RUN if [ -d "prisma" ]; then npx prisma generate; fi
RUN pnpm run build
# prune to production deps
RUN pnpm prune --prod

# -----------------------
# Production image
# -----------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8017
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 payment-service

# Copy artifacts
COPY --from=builder --chown=payment-service:nodejs /app/services/payment-service/dist ./dist
COPY --from=builder --chown=payment-service:nodejs /app/services/payment-service/package*.json ./
COPY --from=builder --chown=payment-service:nodejs /app/services/payment-service/prisma ./prisma
COPY --from=builder --chown=payment-service:nodejs /app/node_modules ./node_modules

USER payment-service
EXPOSE 8017

CMD ["sh", "-c", "if [ -d './prisma' ]; then npx prisma migrate deploy; fi && node dist/index.js"]
