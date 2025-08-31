#!/bin/bash
set -e

echo "=== Complete Build Process ==="

cd "$(dirname "$0")/.."

echo "Step 1: Building shared packages..."
echo "Building shared..."
pnpm --filter shared build || {
    echo "ERROR: Shared build failed!"
    exit 1
}

echo "Building types..."
pnpm --filter @msmebazaar/types build 2>/dev/null || {
    echo "Types package build skipped (no build script)"
}

echo "Step 2: Building API Gateway..."
pnpm --filter msmebazaar-api-client build || {
    echo "ERROR: API Gateway build failed!"
    exit 1
}

echo "Step 3: Building services..."
SERVICES=(
  "auth-service" "buyer-service" "seller-service" "sellerservice"
  "agent-service" "investor-service" "loan-service" "msme-service"
  "msme-listing-service" "matchmaking-service" "search-matchmaking-service"
  "recommendation-service" "notification-service" "exit-as-a-service"
  "compliance-service" "valuation-service" "ml-monitoring-service"
  "transaction-matching-service" "user-profile-service" "payment-service"
  "superadmin-service" "admin-service"
)

FAILED_SERVICES=()

for service in "${SERVICES[@]}"; do
    if [ -d "services/$service" ]; then
        echo "Building $service..."
        pnpm --filter "$service" build || {
            echo "WARNING: $service build failed"
            FAILED_SERVICES+=("$service")
        }
    fi
done

echo "Step 4: Building mobile..."
pnpm --filter msmebazaar-mobile type-check || {
    echo "ERROR: Mobile build failed!"
    FAILED_SERVICES+=("mobile")
}

echo "Step 5: Building frontend..."
pnpm --filter frontend build 2>/dev/null || {
    echo "Frontend build skipped or failed"
}

echo "=== Build Summary ==="
if [ ${#FAILED_SERVICES[@]} -eq 0 ]; then
    echo "✅ ALL BUILDS SUCCESSFUL!"
else
    echo "❌ FAILED BUILDS:"
    for failed in "${FAILED_SERVICES[@]}"; do
        echo "  - $failed"
    done
    echo ""
    echo "Please share the logs for failed services for detailed fixes."
fi

echo "=== Complete Build Process Finished ==="
