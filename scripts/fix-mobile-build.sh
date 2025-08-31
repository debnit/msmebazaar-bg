#!/bin/bash
set -e

echo "=== Fixing Mobile Build Issues ==="

cd "$(dirname "$0")/.."

echo "1. Fixing JSX template literal syntax in RoleBasedNavigator..."
# Fix remaining escaped template literals in mobile navigation
cd mobile/src/navigation
if [ -f "RoleBasedNavigator.tsx" ]; then
    # Check if there are any remaining escaped template literals
    if grep -q '\\`' RoleBasedNavigator.tsx; then
        echo "Found escaped template literals, fixing..."
        sed -i 's/\\`/`/g' RoleBasedNavigator.tsx
        sed -i 's/\\$/$/g' RoleBasedNavigator.tsx
        echo "Fixed template literals in RoleBasedNavigator.tsx"
    else
        echo "No escaped template literals found"
    fi
fi

cd ../../..

echo "2. Ensuring authStore.tsx exists (not .ts)..."
if [ -f "mobile/src/store/authStore.ts" ]; then
    mv mobile/src/store/authStore.ts mobile/src/store/authStore.tsx
    echo "Renamed authStore.ts to authStore.tsx"
fi

echo "3. Testing mobile TypeScript compilation..."
cd mobile
echo "Running type check..."
npx tsc --noEmit --skipLibCheck || {
    echo "TypeScript errors found. Checking specific files..."
    # Check each problematic file individually
    echo "Checking RoleBasedNavigator.tsx..."
    npx tsc --noEmit --skipLibCheck src/navigation/RoleBasedNavigator.tsx || true
    echo "Checking authStore.tsx..."
    npx tsc --noEmit --skipLibCheck src/store/authStore.tsx || true
}

cd ..
echo "=== Mobile Build Fix Complete ==="
echo "Please run this script and share the output!"
