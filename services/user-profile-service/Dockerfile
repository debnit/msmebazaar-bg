# Multi-stage build for user-profile-service
FROM node:20-alpine AS base

# Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only package files first for caching
COPY package.json pnpm-lock.yaml ./
COPY services/user-profile-service/package*.json ./services/user-profile-service/
COPY shared/package*.json ./shared/

# Install deps with workspace support
RUN npm install -g pnpm@latest
RUN pnpm install --frozen-lockfile --recursive

# Copy source code
COPY . .

# Build shared lib
RUN cd shared && pnpm build

# Generate Prisma client
RUN if [ -d "services/user-profile-service/prisma" ]; then \
      cd services/user-profile-service && npx prisma generate; \
    fi

# Build service
RUN cd services/user-profile-service && pnpm build

# ---- Runner ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 user-profile-service

# Copy only what we need
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/shared/dist ./shared/dist
COPY --from=deps /app/services/user-profile-service/package*.json ./
COPY --from=deps /app/services/user-profile-service/prisma ./prisma
COPY --from=deps /app/services/user-profile-service/dist ./dist

# Remove dev dependencies
RUN pnpm prune --prod

USER user-profile-service

EXPOSE 8000
ENV PORT=8000
ENV HOSTNAME=0.0.0.0

# Start service (migrations recommended to run outside container)
CMD ["node", "dist/index.js"]
