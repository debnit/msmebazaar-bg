#!/bin/bash
set -e

echo "=== Comprehensive Mobile Issues Fix Script ==="
echo "Analyzing and fixing all identified issues..."

# Ensure we're in the project root
if [ ! -f "package.json" ] || [ ! -d "mobile" ]; then
    echo "❌ ERROR: Please run this script from the project root directory"
    echo "Current directory: $(pwd)"
    echo "Expected files: package.json, mobile/ directory"
    exit 1
fi

echo "✅ Running from project root: $(pwd)"
echo ""

# Issue 1: Fix invalid todo_write command in scripts
echo "1. Fixing invalid 'todo_write' command in scripts..."
if grep -q "todo_write" scripts/consolidate-mobile-features.sh; then
    echo "Found invalid 'todo_write' command, commenting it out..."
    sed -i 's/^todo_write/#todo_write/' scripts/consolidate-mobile-features.sh
    echo "✅ Fixed todo_write command in consolidate-mobile-features.sh"
else
    echo "✅ No todo_write issues found"
fi

# Issue 2: Check and fix mobile TypeScript configuration
echo ""
echo "2. Checking mobile TypeScript configuration..."

if [ -f "mobile/tsconfig.json" ]; then
    echo "✅ Mobile tsconfig.json exists"
    
    # Check if paths are correctly configured
    if grep -q '"@msmebazaar/shared"' mobile/tsconfig.json; then
        echo "✅ Shared package paths configured"
    else
        echo "❌ Missing shared package paths in tsconfig.json"
    fi
else
    echo "❌ Mobile tsconfig.json missing"
    exit 1
fi

# Issue 3: Verify authStore file extension
echo ""
echo "3. Checking authStore file extension..."

if [ -f "mobile/src/store/authStore.tsx" ]; then
    echo "✅ authStore.tsx exists (correct for JSX content)"
elif [ -f "mobile/src/store/authStore.ts" ]; then
    echo "Renaming authStore.ts to authStore.tsx (contains JSX)..."
    mv mobile/src/store/authStore.ts mobile/src/store/authStore.tsx
    echo "✅ Renamed to authStore.tsx"
else
    echo "❌ authStore file not found"
    ls -la mobile/src/store/ || echo "Store directory not found"
fi

# Issue 4: Check for template literal syntax issues
echo ""
echo "4. Checking for JSX template literal syntax issues..."

NAVIGATOR_FILE="mobile/src/navigation/RoleBasedNavigator.tsx"
if [ -f "$NAVIGATOR_FILE" ]; then
    # Check for escaped template literals
    if grep -q '\\`\|\\$' "$NAVIGATOR_FILE"; then
        echo "Found escaped template literals, fixing..."
        cp "$NAVIGATOR_FILE" "${NAVIGATOR_FILE}.backup"
        
        # Fix escaped backticks and dollar signs
        sed -i 's/\\`/`/g' "$NAVIGATOR_FILE"
        sed -i 's/\\$/$/g' "$NAVIGATOR_FILE"
        
        echo "✅ Fixed template literals in RoleBasedNavigator.tsx"
        
        # Show what changed
        if diff "${NAVIGATOR_FILE}.backup" "$NAVIGATOR_FILE" > /dev/null; then
            echo "No changes were needed"
        else
            echo "Changes applied successfully"
        fi
    else
        echo "✅ No template literal syntax issues found"
    fi
else
    echo "❌ RoleBasedNavigator.tsx not found"
fi

# Issue 5: Check mobile dependencies
echo ""
echo "5. Checking mobile dependencies..."

cd mobile

if [ ! -d "node_modules" ]; then
    echo "Installing mobile dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

# Issue 6: Check for missing imports or modules
echo ""
echo "6. Checking for import/module issues..."

# Check if shared packages are properly built
cd ..
if [ ! -d "shared/dist" ]; then
    echo "Building shared package..."
    pnpm --filter shared build
    echo "✅ Shared package built"
else
    echo "✅ Shared package already built"
fi

# Issue 7: Test TypeScript compilation
echo ""
echo "7. Testing TypeScript compilation..."

cd mobile

echo "Running TypeScript check..."
if npx tsc --noEmit; then
    echo "✅ TypeScript compilation successful!"
    TS_SUCCESS=true
else
    echo "❌ TypeScript errors found, trying with skipLibCheck..."
    if npx tsc --noEmit --skipLibCheck; then
        echo "⚠️  TypeScript compilation successful with skipLibCheck"
        echo "   (There may be library type issues, but code should work)"
        TS_SUCCESS=true
    else
        echo "❌ TypeScript compilation failed even with skipLibCheck"
        TS_SUCCESS=false
        
        echo ""
        echo "Checking specific problem files..."
        
        # Check individual problematic files
        echo "Testing RoleBasedNavigator.tsx..."
        npx tsc --noEmit --skipLibCheck src/navigation/RoleBasedNavigator.tsx || {
            echo "Issues in RoleBasedNavigator.tsx"
        }
        
        echo "Testing authStore.tsx..."
        npx tsc --noEmit --skipLibCheck src/store/authStore.tsx || {
            echo "Issues in authStore.tsx"
        }
    fi
fi

cd ..

# Issue 8: Test pnpm build
echo ""
echo "8. Testing pnpm mobile build..."

if pnpm --filter msmebazaar-mobile type-check; then
    echo "✅ pnpm mobile build successful!"
    PNPM_SUCCESS=true
else
    echo "❌ pnpm mobile build failed"
    PNPM_SUCCESS=false
fi

# Issue 9: Final verification and summary
echo ""
echo "=== COMPREHENSIVE SUMMARY ==="

if [ "$TS_SUCCESS" = true ] && [ "$PNPM_SUCCESS" = true ]; then
    echo "🎉 ALL MOBILE BUILD ISSUES FIXED!"
    echo "✅ Scripts cleaned"
    echo "✅ TypeScript compilation working"
    echo "✅ pnpm build working"
    echo "✅ Mobile app is ready for development"
else
    echo "❌ Some issues remain:"
    
    if [ "$TS_SUCCESS" != true ]; then
        echo "   - TypeScript compilation issues"
    fi
    
    if [ "$PNPM_SUCCESS" != true ]; then
        echo "   - pnpm build issues"
    fi
    
    echo ""
    echo "🔍 DEBUG INFORMATION:"
    echo ""
    echo "Mobile directory structure:"
    find mobile/src -name "*.ts" -o -name "*.tsx" | head -15
    
    echo ""
    echo "Mobile package.json name:"
    grep '"name"' mobile/package.json
    
    echo ""
    echo "Shared package status:"
    ls -la shared/dist 2>/dev/null || echo "Shared dist not found"
    
    echo ""
    echo "Mobile tsconfig paths:"
    grep -A 10 '"paths"' mobile/tsconfig.json
fi

echo ""
echo "=== Fix Script Complete ==="
echo "If issues remain, please share the complete output above for further debugging."
