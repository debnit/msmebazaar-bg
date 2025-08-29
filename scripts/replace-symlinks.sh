#!/bin/bash
echo "Copying shared Prisma schema to all services..."

SERVICES=(
  "auth-service" "buyer-service" "seller-service" "sellerservice"
  "agent-service" "investor-service" "loan-service" "msme-service"
  "msme-listing-service" "matchmaking-service" "search-matchmaking-service"
  "recommendation-service" "notification-service" "exit-as-a-service"
  "compliance-service" "valuation-service" "ml-monitoring-service"
  "transaction-matching-service" "user-profile-service" "payment-service"
  "superadmin-service" "admin-service"
)


for svc in services/*-service; do
  cd $svc
  pnpm install
  npx prisma generate
  cd ../../
done


for svc in services/*-service; do
  echo "$svc client version:"
  node -e "const { PrismaClient } = require('./$svc/node_modules/.pnpm/@prisma+client@*/node_modules/@prisma/client'); console.log(PrismaClient.prismaVersion);"
done
