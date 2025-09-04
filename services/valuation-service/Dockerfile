# Multi-stage build for valuation-service
FROM node:20-alpine AS base

# Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only package files for better caching
COPY package.json pnpm-lock.yaml ./
COPY shared/package*.json ./shared/
COPY services/valuation-service/package*.json ./services/valuation-service/

# Install deps with workspace support
RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile --recursive

# Copy full source
COPY . .

# Build shared lib
RUN cd shared && pnpm build

# Generate Prisma client
RUN if [ -d "services/valuation-service/prisma" ]; then \
      cd services/valuation-service && npx prisma generate; \
    fi

# Build service
RUN cd services/valuation-service && pnpm build

# ---- Runner ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 valuation-service

# Copy only what's needed
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/shared/dist ./shared/dist
COPY --from=deps /app/services/valuation-service/package*.json ./
COPY --from=deps /app/services/valuation-service/prisma ./prisma
COPY --from=deps /app/services/valuation-service/dist ./dist

# Remove dev dependencies
RUN pnpm prune --prod

USER valuation-service

EXPOSE 8000
ENV PORT=8000
ENV HOSTNAME=0.0.0.0

# Start service (migrations recommended outside container)
CMD ["node", "dist/index.js"]
