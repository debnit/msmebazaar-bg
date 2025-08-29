#!/bin/bash

# MSMEBazaar Mobile Monorepo Setup Script
# This script sets up the mobile app with full monorepo integration

set -e

echo "🚀 Setting up MSMEBazaar Mobile with Monorepo Integration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MOBILE_DIR="$PROJECT_ROOT/mobile"

echo -e "${BLUE}📱 Project root: $PROJECT_ROOT${NC}"
echo -e "${BLUE}📱 Mobile directory: $MOBILE_DIR${NC}"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "$PROJECT_ROOT/package.json" ]; then
    print_error "Not in project root directory. Please run from the monorepo root."
    exit 1
fi

# Step 1: Install root dependencies
echo -e "${BLUE}📦 Installing root dependencies...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm install --ignore-scripts
    print_status "Root dependencies installed with pnpm"
else
    npm install --ignore-scripts
    print_status "Root dependencies installed with npm"
fi

# Step 2: Build shared packages
echo -e "${BLUE}🔧 Building shared packages...${NC}"
cd "$PROJECT_ROOT/shared"
npm run build
print_status "Shared packages built"

# Step 3: Setup mobile directory
echo -e "${BLUE}📱 Setting up mobile app...${NC}"
cd "$MOBILE_DIR"

# Install mobile dependencies
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi
print_status "Mobile dependencies installed"

# Step 4: Run the enhanced mobile development script
echo -e "${BLUE}🛠️  Running enhanced mobile development script...${NC}"
cd "$PROJECT_ROOT"
npx ts-node script/mobile/enhanced-mobile-dev.ts
print_status "Enhanced mobile app structure created"

# Step 5: Setup Metro config for monorepo
echo -e "${BLUE}⚙️  Configuring Metro for monorepo...${NC}"
cd "$MOBILE_DIR"

# Create metro.config.js if it doesn't exist
if [ ! -f "metro.config.js" ]; then
    cat > metro.config.js << 'EOF'
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
EOF
    print_status "Metro config created"
fi

# Step 6: Setup TypeScript paths
echo -e "${BLUE}📝 Configuring TypeScript paths...${NC}"

# Update tsconfig.json to include monorepo paths
if [ -f "tsconfig.json" ]; then
    # Backup existing tsconfig
    cp tsconfig.json tsconfig.json.backup
fi

cat > tsconfig.json << 'EOF'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@mobile/*": ["./src/*"],
      "@shared/*": ["../shared/*"],
      "@msmebazaar/shared": ["../shared"],
      "@shared/types": ["../shared/types"],
      "@shared/auth": ["../shared/auth"],
      "@shared/services": ["../shared/services"],
      "@shared/middleware": ["../shared/middleware"]
    },
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    "../shared/**/*.ts",
    "../shared/**/*.tsx"
  ],
  "exclude": [
    "node_modules",
    "../shared/node_modules"
  ]
}
EOF
print_status "TypeScript configuration updated"

# Step 7: Create development scripts
echo -e "${BLUE}📜 Creating development scripts...${NC}"

# Create a development script
cat > dev-mobile.sh << 'EOF'
#!/bin/bash

# Development script for mobile app with monorepo
echo "🚀 Starting MSMEBazaar Mobile Development..."

# Start shared package watcher in background
echo "📦 Starting shared package watcher..."
cd ../shared && npm run dev &
SHARED_PID=$!

# Start mobile app
echo "📱 Starting mobile app..."
cd ../mobile
expo start

# Cleanup on exit
cleanup() {
    echo "🧹 Cleaning up..."
    kill $SHARED_PID 2>/dev/null || true
    exit
}

trap cleanup INT TERM
EOF

chmod +x dev-mobile.sh
print_status "Development scripts created"

# Step 8: Setup environment files
echo -e "${BLUE}🔧 Setting up environment configuration...${NC}"

if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# MSMEBazaar Mobile App Environment Configuration

# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_WEBSOCKET_URL=ws://localhost:3000

# Payment Configuration
EXPO_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Firebase Configuration (optional)
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id

# Development flags
EXPO_PUBLIC_DEBUG=true
EXPO_PUBLIC_LOG_LEVEL=debug
EOF
    print_status "Environment file created"
fi

# Step 9: Final verification
echo -e "${BLUE}🔍 Verifying setup...${NC}"

# Check if all required files exist
required_files=(
    "package.json"
    "tsconfig.json"
    "metro.config.js"
    "src/App.tsx"
    "src/services/api-client.ts"
    "src/services/auth.mobile.ts"
    "src/services/payment.mobile.ts"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file exists"
    else
        print_warning "$file missing"
    fi
done

echo ""
echo -e "${GREEN}🎉 Mobile app setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. cd mobile"
echo "2. ./dev-mobile.sh  (or 'expo start' for simple start)"
echo "3. Press 'i' for iOS simulator or 'a' for Android emulator"
echo ""
echo -e "${BLUE}🔧 Features configured:${NC}"
echo "✅ Shared types and services from monorepo"
echo "✅ Payment integration with Razorpay"
echo "✅ Authentication with secure storage"
echo "✅ Feature gating and Pro upgrade flows"
echo "✅ Onboarding with payment processing"
echo "✅ Component library optimized for mobile"
echo "✅ Metro bundler configured for monorepo"
echo "✅ TypeScript paths configured"
echo "✅ Development scripts created"
echo ""
echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
echo "• Update .env with your actual API keys"
echo "• Configure Firebase if using push notifications"
echo "• Test on both iOS and Android devices"
echo "• Run 'npm run type-check' to verify TypeScript setup"

cd "$PROJECT_ROOT"
print_status "Setup completed successfully!"
