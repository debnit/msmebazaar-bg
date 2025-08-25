# Multi-stage build for Node.js Investor Service
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

# Create a non-root user to run the application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 investor-service

# Copy the built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Set correct permissions for the investor-service user
RUN chown -R investor-service:nodejs /app
USER investor-service

# Expose the port that the app runs on
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL=""
ENV JWT_SECRET=""
ENV RAZORPAY_KEY_ID=""
ENV RAZORPAY_KEY_SECRET=""
ENV REDIS_URL=""
ENV EMAIL_SERVICE_URL=""
ENV NOTIFICATION_SERVICE_URL=""

# Start the application
CMD ["npm", "start"]

# Alternative Dockerfile for development
FROM base AS development
WORKDIR /app

# Install development dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn install; \
  elif [ -f package-lock.json ]; then npm install; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm install; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the port that the app runs on
EXPOSE 3001

# Environment variables for development
ENV NODE_ENV=development
ENV PORT=3001

# Start the development server with hot reload
CMD ["npm", "run", "dev"]

# Docker Compose Usage Example:
# 
# version: '3.8'
# services:
#   investor-service:
#     build:
#       context: ./services/investor-service
#       target: development
#     ports:
#       - "3001:3001"
#     volumes:
#       - ./services/investor-service:/app
#       - /app/node_modules
#     environment:
#       - DATABASE_URL=postgresql://user:password@postgres:5432/investor_db
#       - JWT_SECRET=your-jwt-secret
#       - RAZORPAY_KEY_ID=your-razorpay-key
#       - RAZORPAY_KEY_SECRET=your-razorpay-secret
#       - REDIS_URL=redis://redis:6379
#     depends_on:
#       - postgres
#       - redis
#     networks:
#       - investor-network
#   
#   postgres:
#     image: postgres:15-alpine
#     environment:
#       - POSTGRES_USER=user
#       - POSTGRES_PASSWORD=password
#       - POSTGRES_DB=investor_db
#     volumes:
#       - postgres_data:/var/lib/postgresql/data
#     ports:
#       - "5432:5432"
#     networks:
#       - investor-network
#   
#   redis:
#     image: redis:7-alpine
#     ports:
#       - "6379:6379"
#     networks:
#       - investor-network
# 
# volumes:
#   postgres_data:
# 
# networks:
#   investor-network:
#     driver: bridge