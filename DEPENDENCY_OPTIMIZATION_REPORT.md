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
