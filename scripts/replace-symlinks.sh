#!/bin/bash
echo "Copying shared Prisma schema to all services and generating clients..."

# List of services
SERVICES=(
  "auth-service" "buyer-service" "seller-service" "sellerservice"
  "agent-service" "investor-service" "loan-service" "msme-service"
  "msme-listing-service" "matchmaking-service" "search-matchmaking-service"
  "recommendation-service" "notification-service" "exit-as-a-service"
  "compliance-service" "valuation-service" "ml-monitoring-service"
  "transaction-matching-service" "user-profile-service" "payment-service"
  "superadmin-service" "admin-service"
)

BASE_DIR=$(pwd)

# Generate Prisma client for each service
for svc in "${SERVICES[@]}"; do
  if [ -d "$BASE_DIR/services/$svc" ]; then
    echo "Processing $svc..."
    cd "$BASE_DIR/services/$svc" || exit
    pnpm install
    npx prisma generate
  else
    echo "Warning: $svc directory not found"
  fi
done

cd "$BASE_DIR"

# Check Prisma version for each service
echo
echo "Checking Prisma versions..."
for svc in "${SERVICES[@]}"; do
  if [ -f "$BASE_DIR/services/$svc/node_modules/@prisma/client/package.json" ]; then
    version=$(node -p "require('$BASE_DIR/services/$svc/node_modules/@prisma/client/package.json').version")
    echo "$svc Prisma Client version: $version"
  else
    echo "$svc Prisma Client not found"
  fi
done
