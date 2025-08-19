#!/bin/bash

BASE_DIR="/home/deb/projects/msmebazaar-bg/msmebazaar-bg/frontend/src"

# Helper: create folder if missing
mkdir_if_missing() {
  [ ! -d "$1" ] && mkdir -p "$1" && echo "Created folder: $1"
}

# Helper: create file if missing
touch_if_missing() {
  [ ! -f "$1" ] && touch "$1" && echo "Created file: $1"
}

# ======================
# 1) Roles Folder Setup
# ======================
ROLES=(buyer seller agent investor msmeowner founder superadmin)

for role in "${ROLES[@]}"; do
  # free and pro variants under (roles)
  mkdir_if_missing "$BASE_DIR/app/(roles)/${role}/free"
  mkdir_if_missing "$BASE_DIR/app/(roles)/${role}/pro"

  # basic page.tsx for each free/pro if missing
  touch_if_missing "$BASE_DIR/app/(roles)/${role}/free/page.tsx"
  touch_if_missing "$BASE_DIR/app/(roles)/${role}/pro/page.tsx"
done

# loan-only role group with subpages
mkdir_if_missing "$BASE_DIR/app/(roles)/loan-only"
mkdir_if_missing "$BASE_DIR/app/(roles)/loan-only/apply"
mkdir_if_missing "$BASE_DIR/app/(roles)/loan-only/status"
mkdir_if_missing "$BASE_DIR/app/(roles)/loan-only/success"

touch_if_missing "$BASE_DIR/app/(roles)/loan-only/page.tsx"
touch_if_missing "$BASE_DIR/app/(roles)/loan-only/apply/application-page.tsx"
touch_if_missing "$BASE_DIR/app/(roles)/loan-only/status/status-page.tsx"
touch_if_missing "$BASE_DIR/app/(roles)/loan-only/success/success-page.tsx"

# ======================
# 2) Auth folder pages
# ======================
mkdir_if_missing "$BASE_DIR/app/(auth)/login"
mkdir_if_missing "$BASE_DIR/app/(auth)/register"
mkdir_if_missing "$BASE_DIR/app/(auth)/forgot-password"
mkdir_if_missing "$BASE_DIR/app/(auth)/reset-password"
mkdir_if_missing "$BASE_DIR/app/(auth)/logout"

touch_if_missing "$BASE_DIR/app/(auth)/login/page.tsx"
touch_if_missing "$BASE_DIR/app/(auth)/register/page.tsx"
touch_if_missing "$BASE_DIR/app/(auth)/forgot-password/page.tsx"
touch_if_missing "$BASE_DIR/app/(auth)/reset-password/page.tsx"
touch_if_missing "$BASE_DIR/app/(auth)/logout/page.tsx"

# ======================
# 3) Payment Module Setup
# ======================
mkdir_if_missing "$BASE_DIR/modules/payment"

PAYMENT_MODULE_FILES=(
  "PaymentCheckout.tsx"
  "PaymentStatus.tsx"
  "PaymentHistory.tsx"
  "PaymentMethods.tsx"
  "useRazorpayCheckout.ts"
  "useCreatePayment.ts"
)

for file in "${PAYMENT_MODULE_FILES[@]}"; do
  touch_if_missing "$BASE_DIR/modules/payment/$file"
done

# Ensure services folder exists and payment.api.ts file exists
mkdir_if_missing "$BASE_DIR/services"
touch_if_missing "$BASE_DIR/services/payment.api.ts"

# ======================
# 4) Resolve utils, config, hooks & types folders presence
# ======================
mkdir_if_missing "$BASE_DIR/utils"
mkdir_if_missing "$BASE_DIR/config"
mkdir_if_missing "$BASE_DIR/hooks"
mkdir_if_missing "$BASE_DIR/types"
mkdir_if_missing "$BASE_DIR/store"
mkdir_if_missing "$BASE_DIR/components"
mkdir_if_missing "$BASE_DIR/tests"
mkdir_if_missing "$BASE_DIR/public/assets"

# You can add touch_if_missing once you identify specific missing files needed for import fixes

echo "Frontend scaffold updated successfully with Pro roles and payment modules without overwriting existing files."

