#!/bin/bash
set -e

echo "=== Fixing Services Build Issues ==="

cd "$(dirname "$0")/.."

SERVICES=(
  "auth-service" "buyer-service" "seller-service" "sellerservice"
  "agent-service" "investor-service" "loan-service" "msme-service"
  "msme-listing-service" "matchmaking-service" "search-matchmaking-service"
  "recommendation-service" "notification-service" "exit-as-a-service"
  "compliance-service" "valuation-service" "ml-monitoring-service"
  "transaction-matching-service" "user-profile-service" "payment-service"
  "superadmin-service" "admin-service"
)

echo "1. Standardizing Express and TypeScript versions across all services..."

for service in "${SERVICES[@]}"; do
    if [ -d "services/$service" ]; then
        echo "Updating $service dependencies..."
        cd "services/$service"
        
        # Update package.json with consistent versions
        if [ -f "package.json" ]; then
            # Fix Express types to v4 for compatibility
            sed -i 's/"@types\/express": "[^"]*"/"@types\/express": "^4.17.21"/g' package.json
            
            # Fix express-rate-limit version
            sed -i 's/"express-rate-limit": "[^"]*"/"express-rate-limit": "^6.10.0"/g' package.json
            
            # Ensure TypeScript is consistent
            sed -i 's/"typescript": "[^"]*"/"typescript": "^5.3.0"/g' package.json
            
            # Fix jsonwebtoken types
            sed -i 's/"@types\/jsonwebtoken": "[^"]*"/"@types\/jsonwebtoken": "^9.0.6"/g' package.json
        fi
        
        cd ../..
    fi
done

echo "2. Installing updated dependencies..."
pnpm install

echo "3. Regenerating Prisma clients for all services..."
for service in "${SERVICES[@]}"; do
    if [ -d "services/$service" ] && [ -f "services/$service/prisma/schema.prisma" ]; then
        echo "Generating Prisma client for $service..."
        cd "services/$service"
        npx prisma generate || {
            echo "Warning: Prisma generate failed for $service"
        }
        cd ../..
    fi
done

echo "4. Testing service builds..."
echo "Building shared package first..."
pnpm --filter shared build

echo "Testing individual service builds..."
for service in "${SERVICES[@]}"; do
    if [ -d "services/$service" ]; then
        echo "Testing build for $service..."
        cd "services/$service"
        npx tsc --noEmit --skipLibCheck || {
            echo "Build issues found in $service - detailed check needed"
        }
        cd ../..
    fi
done

echo "=== Services Build Fix Complete ==="
echo "Please run this script and share the output for any failing services!"
