# MSME Bazaar Platform

A comprehensive marketplace platform for Micro, Small, and Medium Enterprises (MSMEs) with web frontend, mobile app, and microservices backend.

## 🏗️ Architecture Overview

- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS, and Radix UI
- **Mobile**: React Native with Expo 50
- **Backend**: Node.js microservices with Express, Prisma ORM, and PostgreSQL
- **API Gateway**: Centralized routing and authentication
- **Shared**: Common utilities, types, and configurations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- PostgreSQL 14+
- Docker & Docker Compose (for production)
- Expo CLI (for mobile development)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd msmebazaar-bg

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install mobile dependencies  
cd mobile && npm install && cd ..

# Install shared dependencies
cd shared && npm install && cd ..

# Install API gateway dependencies
cd api-gateway && npm install && cd ..

# Install all microservices dependencies
cd services
for service in */; do
  cd "$service" && npm install && cd ..
done
cd ..
```

### 2. Environment Setup

Create the following `.env` files:

#### Root `.env`
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/msmebazaar"
DATABASE_URL_TEST="postgresql://username:password@localhost:5432/msmebazaar_test"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Redis (for caching and sessions)
REDIS_URL="redis://localhost:6379"

# External Services
SENDGRID_API_KEY="your-sendgrid-key"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="msmebazaar-assets"

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true
```

#### Frontend `.env.local`
```bash
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
```

#### Mobile `.env`
```bash
EXPO_PUBLIC_API_URL="http://localhost:3001"
EXPO_PUBLIC_APP_URL="http://localhost:3000"
EXPO_PUBLIC_SENTRY_DSN="your-sentry-dsn"
```

### 3. Database Setup

```bash
# Start PostgreSQL (if using Docker)
docker run --name msmebazaar-postgres \
  -e POSTGRES_DB=msmebazaar \
  -e POSTGRES_USER=msmebazaar \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:14

# Run Prisma migrations for each service
cd services/auth-service && npx prisma migrate dev && cd ../..
cd services/loan-service && npx prisma migrate dev && cd ../..
cd services/buyer-service && npx prisma migrate dev && cd ../..
# ... repeat for all services
```

### 4. Start Development Servers

```bash
# Terminal 1: Start API Gateway
cd api-gateway && npm run dev

# Terminal 2: Start Frontend
cd frontend && npm run dev

# Terminal 3: Start Mobile (if needed)
cd mobile && npm start

# Terminal 4: Start Microservices (in parallel)
cd services/auth-service && npm run dev &
cd services/loan-service && npm run dev &
cd services/buyer-service && npm run dev &
# ... start other services as needed
```

## 📁 Project Structure

```
msmebazaar-bg/
├── frontend/                 # Next.js web application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── modules/         # Feature modules
│   │   ├── services/        # API clients
│   │   ├── store/           # Zustand state management
│   │   └── types/           # TypeScript definitions
│   └── package.json
├── mobile/                   # React Native app
│   ├── src/
│   │   ├── components/      # Mobile components
│   │   ├── screens/         # App screens
│   │   ├── navigation/      # Navigation setup
│   │   └── services/        # API integration
│   └── package.json
├── services/                 # Microservices
│   ├── auth-service/        # Authentication & authorization
│   ├── loan-service/        # Loan management
│   ├── buyer-service/       # Buyer operations
│   ├── seller-service/      # Seller operations
│   └── ...                  # Other domain services
├── api-gateway/             # API routing & middleware
├── shared/                  # Shared utilities & types
└── scripts/                 # Build & deployment scripts
```

## 🛠️ Development Commands

### Frontend
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test         # Run tests
```

### Mobile
```bash
cd mobile
npm start            # Start Expo development server
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run test         # Run tests
npm run test:e2e     # Run E2E tests
```

### Backend Services
```bash
cd services/[service-name]
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run test         # Run tests
npx prisma migrate dev  # Run database migrations
npx prisma studio     # Open Prisma Studio
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test         # Unit tests
npm run test:e2e     # E2E tests with Playwright
npm run test:coverage # Coverage report
```

### Backend Testing
```bash
cd services/[service-name]
npm run test         # Unit & integration tests
npm run test:coverage # Coverage report
```

### Mobile Testing
```bash
cd mobile
npm run test         # Unit tests
npm run test:e2e     # E2E tests with Detox
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Contributing Guidelines](./docs/CONTRIBUTING.md)
- [Testing Guide](./docs/TESTING.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

