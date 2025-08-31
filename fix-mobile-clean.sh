#!/bin/bash
set -e

echo "=== Clean Mobile Build Fix Script ==="

# Ensure we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "mobile" ]; then
    echo "ERROR: Please run this script from the project root directory"
    echo "Current directory: $(pwd)"
    exit 1
fi

echo "✅ Running from project root: $(pwd)"

echo ""
echo "1. Fixing JSX template literal syntax in RoleBasedNavigator..."

if [ -f "mobile/src/navigation/RoleBasedNavigator.tsx" ]; then
    echo "Creating backup..."
    cp mobile/src/navigation/RoleBasedNavigator.tsx mobile/src/navigation/RoleBasedNavigator.tsx.backup
    
    echo "Fixing escaped template literals..."
    # Fix escaped backticks and dollar signs
    sed -i 's/\\`/`/g' mobile/src/navigation/RoleBasedNavigator.tsx
    sed -i 's/\\$/$/g' mobile/src/navigation/RoleBasedNavigator.tsx
    
    echo "✅ Fixed template literals in RoleBasedNavigator.tsx"
    
    # Show what changed
    echo "Changes made:"
    if diff mobile/src/navigation/RoleBasedNavigator.tsx.backup mobile/src/navigation/RoleBasedNavigator.tsx; then
        echo "No changes needed - file was already correct"
    else
        echo "Template literals fixed successfully"
    fi
else
    echo "❌ RoleBasedNavigator.tsx not found at mobile/src/navigation/"
    exit 1
fi

echo ""
echo "2. Ensuring authStore has correct extension (.tsx for JSX)..."

if [ -f "mobile/src/store/authStore.ts" ]; then
    echo "Renaming authStore.ts to authStore.tsx (contains JSX)..."
    mv mobile/src/store/authStore.ts mobile/src/store/authStore.tsx
    echo "✅ Renamed authStore.ts to authStore.tsx"
elif [ -f "mobile/src/store/authStore.tsx" ]; then
    echo "✅ authStore.tsx already exists"
else
    echo "❌ Neither authStore.ts nor authStore.tsx found"
    echo "Looking for auth store files..."
    find mobile/src -name "*auth*" -type f
fi

echo ""
echo "3. Checking mobile package configuration..."

if [ -f "mobile/package.json" ]; then
    MOBILE_PACKAGE_NAME=$(grep '"name"' mobile/package.json | cut -d'"' -f4)
    echo "✅ Mobile package name: $MOBILE_PACKAGE_NAME"
else
    echo "❌ mobile/package.json not found"
    exit 1
fi

echo ""
echo "4. Installing dependencies if needed..."

if [ ! -d "mobile/node_modules" ]; then
    echo "Installing mobile dependencies..."
    cd mobile
    npm install
    cd ..
    echo "✅ Dependencies installed"
else
    echo "✅ Mobile dependencies already installed"
fi

echo ""
echo "5. Testing TypeScript compilation..."

cd mobile

echo "Running TypeScript check with skipLibCheck..."
if npx tsc --noEmit --skipLibCheck; then
    echo "✅ TypeScript compilation successful!"
    TYPESCRIPT_SUCCESS=true
else
    echo "❌ TypeScript errors found"
    TYPESCRIPT_SUCCESS=false
    
    echo ""
    echo "Checking specific files for issues..."
    
    echo "Testing RoleBasedNavigator.tsx..."
    if npx tsc --noEmit --skipLibCheck src/navigation/RoleBasedNavigator.tsx; then
        echo "✅ RoleBasedNavigator.tsx is OK"
    else
        echo "❌ Issues in RoleBasedNavigator.tsx"
        echo "First 60 lines of the file:"
        head -n 60 src/navigation/RoleBasedNavigator.tsx | nl -ba
    fi
    
    echo ""
    echo "Testing authStore.tsx..."
    if npx tsc --noEmit --skipLibCheck src/store/authStore.tsx; then
        echo "✅ authStore.tsx is OK"
    else
        echo "❌ Issues in authStore.tsx"
        echo "Content around JSX section:"
        grep -n -A 5 -B 5 "AuthContext.Provider\|return (" src/store/authStore.tsx || echo "No JSX found"
    fi
fi

cd ..

echo ""
echo "6. Final build test with pnpm..."

if pnpm --filter "$MOBILE_PACKAGE_NAME" type-check; then
    echo "🎉 MOBILE BUILD SUCCESSFUL!"
    BUILD_SUCCESS=true
else
    echo "❌ pnpm build failed"
    BUILD_SUCCESS=false
fi

echo ""
echo "=== SUMMARY ==="
if [ "$TYPESCRIPT_SUCCESS" = true ] && [ "$BUILD_SUCCESS" = true ]; then
    echo "🎉 ALL TESTS PASSED - Mobile build is working!"
else
    echo "❌ Issues found. Debug information:"
    echo ""
    echo "Mobile directory structure:"
    find mobile/src -name "*.ts" -o -name "*.tsx" | head -20
    echo ""
    echo "Mobile tsconfig.json:"
    cat mobile/tsconfig.json 2>/dev/null || echo "tsconfig.json not found"
    echo ""
    echo "Please share this output for further debugging."
fi

echo ""
echo "=== Fix Script Complete ==="
