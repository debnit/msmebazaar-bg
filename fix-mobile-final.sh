#!/bin/bash
set -e

echo "=== Final Mobile Build Fix Script ==="

# Get to the root directory
cd "$(dirname "$0")"

echo "Current directory: $(pwd)"
echo "Checking mobile directory..."

if [ ! -d "mobile" ]; then
    echo "ERROR: mobile directory not found!"
    echo "Make sure you're running this from the project root"
    exit 1
fi

echo "✅ Mobile directory found"

echo "1. Fixing JSX template literal syntax issues..."
cd mobile/src/navigation

if [ -f "RoleBasedNavigator.tsx" ]; then
    echo "Fixing RoleBasedNavigator.tsx..."
    
    # Create backup
    cp RoleBasedNavigator.tsx RoleBasedNavigator.tsx.backup
    
    # Fix all escaped template literals
    sed -i 's/\\`/`/g' RoleBasedNavigator.tsx
    sed -i 's/\\$/$/g' RoleBasedNavigator.tsx
    
    echo "✅ Fixed template literals"
    
    # Show what was changed
    echo "Changes made:"
    diff RoleBasedNavigator.tsx.backup RoleBasedNavigator.tsx || true
else
    echo "❌ RoleBasedNavigator.tsx not found"
fi

cd ../../..

echo "2. Ensuring authStore is .tsx (contains JSX)..."
if [ -f "mobile/src/store/authStore.ts" ]; then
    echo "Renaming authStore.ts to authStore.tsx..."
    mv mobile/src/store/authStore.ts mobile/src/store/authStore.tsx
    echo "✅ Renamed to .tsx"
elif [ -f "mobile/src/store/authStore.tsx" ]; then
    echo "✅ authStore.tsx already exists"
else
    echo "❌ authStore file not found"
fi

echo "3. Checking mobile package.json..."
if [ -f "mobile/package.json" ]; then
    echo "✅ Mobile package.json found"
    echo "Package name: $(grep '"name"' mobile/package.json)"
else
    echo "❌ Mobile package.json not found"
fi

echo "4. Testing TypeScript compilation..."
cd mobile

echo "Running TypeScript check..."
if npx tsc --noEmit --skipLibCheck; then
    echo "✅ TypeScript compilation successful!"
else
    echo "❌ TypeScript errors found. Checking specific issues..."
    
    echo "Checking RoleBasedNavigator specifically..."
    npx tsc --noEmit --skipLibCheck src/navigation/RoleBasedNavigator.tsx || {
        echo "Issues in RoleBasedNavigator.tsx:"
        # Show the specific lines with issues
        head -n 50 src/navigation/RoleBasedNavigator.tsx | nl -ba
    }
    
    echo "Checking authStore specifically..."
    npx tsc --noEmit --skipLibCheck src/store/authStore.tsx || {
        echo "Issues in authStore.tsx"
    }
fi

cd ..

echo "5. Quick dependency check..."
echo "Checking if mobile dependencies are installed..."
if [ -d "mobile/node_modules" ]; then
    echo "✅ Mobile node_modules exists"
else
    echo "Installing mobile dependencies..."
    cd mobile && npm install && cd ..
fi

echo "6. Final test build..."
echo "Testing mobile build with pnpm..."
if pnpm --filter msmebazaar-mobile type-check; then
    echo "🎉 MOBILE BUILD SUCCESSFUL!"
else
    echo "❌ Mobile build failed. Here's the debug info:"
    echo "Mobile directory structure:"
    find mobile/src -name "*.ts" -o -name "*.tsx" | head -20
    
    echo "Mobile tsconfig.json:"
    if [ -f "mobile/tsconfig.json" ]; then
        cat mobile/tsconfig.json
    fi
fi

echo "=== Mobile Fix Script Complete ==="
echo ""
echo "If the build still fails, please share:"
echo "1. The exact error messages"
echo "2. Output of: ls -la mobile/src/"
echo "3. Contents of problematic files shown in errors"
