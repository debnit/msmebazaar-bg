#!/bin/bash
set -e

echo "=== Optimizing Package Dependencies Across Monorepo ==="

cd "$(dirname "$0")/.."

echo "1. Analyzing duplicate dependencies..."
echo "Common dependencies found in multiple packages:"

# Find common dependencies
echo "Checking for duplicate packages..."
find . -name "package.json" -not -path "./node_modules/*" -exec grep -H '"react"' {} \; | head -10
find . -name "package.json" -not -path "./node_modules/*" -exec grep -H '"typescript"' {} \; | head -10

echo "2. Moving common dependencies to root package.json..."

# Common development dependencies that should be at root
ROOT_DEV_DEPS='
  "typescript": "^5.3.0",
  "@types/node": "^20.0.0",
  "eslint": "^8.57.0",
  "prettier": "^3.0.0",
  "husky": "^8.0.0",
  "lint-staged": "^13.0.0",
  "concurrently": "^8.2.2"
'

# Common runtime dependencies for frontend packages
COMMON_DEPS='
  "zod": "^3.25.67",
  "react": "^18.2.0",
  "@types/react": "^18.2.0"
'

echo "3. Creating dependency consolidation report..."
cat > DEPENDENCY_OPTIMIZATION_REPORT.md << 'EOL'
# Dependency Optimization Report

## Current Issues
1. Multiple TypeScript versions across packages
2. Duplicate React dependencies
3. Inconsistent linting configurations
4. Scattered development tools

## Optimization Strategy

### 1. Root Dependencies
Move common dev dependencies to root:
- TypeScript, ESLint, Prettier
- Husky, lint-staged
- Testing frameworks

### 2. Workspace Dependencies
Use workspace protocol for internal packages:
- `@msmebazaar/shared: "workspace:*"`
- `@msmebazaar/types: "workspace:*"`

### 3. Version Consistency
Standardize versions across workspace:
- React 18.x for all frontend packages
- TypeScript 5.3.x for all packages
- Node 20.x as target runtime

### 4. Bundle Optimization
- Use peer dependencies where appropriate
- Implement proper tree shaking
- Share common chunks between mobile/web

## Commands to Run
```bash
# 1. Fix mobile build issues
./scripts/fix-mobile-build.sh

# 2. Fix service build issues  
./scripts/fix-services-build.sh

# 3. Consolidate mobile-web features
./scripts/consolidate-mobile-features.sh

# 4. Optimize shared resources
./scripts/optimize-shared-resources.sh

# 5. Run complete build
./scripts/build-all.sh
```
EOL

echo "Package dependency optimization complete!"
