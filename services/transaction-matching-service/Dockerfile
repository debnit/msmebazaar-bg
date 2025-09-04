# Multi-stage build for transaction-matching-service
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only package files first for caching
COPY package.json pnpm-lock.yaml ./
COPY services/transaction-matching-service/package*.json ./services/transaction-matching-service/
COPY shared/package*.json ./shared/

# Install deps (workspace aware)
RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile --recursive

# Copy rest of source code
COPY . .

# Build shared lib
RUN cd shared && pnpm build

# Generate Prisma client
RUN if [ -d "services/transaction-matching-service/prisma" ]; then \
      cd services/transaction-matching-service && npx prisma generate; \
    fi

# Build service
RUN cd services/transaction-matching-service && pnpm build

# ---- Runner ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 transaction-matching-service

# Copy built artifacts
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/shared/dist ./shared/dist
COPY --from=deps /app/services/transaction-matching-service/package*.json ./
COPY --from=deps /app/services/transaction-matching-service/prisma ./prisma
COPY --from=deps /app/services/transaction-matching-service/dist ./dist

# Prune dev dependencies
RUN pnpm prune --prod

USER transaction-matching-service

EXPOSE 8021
ENV PORT=8021
ENV HOSTNAME=0.0.0.0

# Prefer entrypoint.sh for migrations
CMD ["node", "dist/index.js"]
