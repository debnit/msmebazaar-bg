# API Gateway Routes Summary

## **Overview**

This document summarizes all the API gateway proxy routes that have been added for the refactored MSMEBazaar services. Each service follows the same pattern with authentication, feature gating, and proper routing.

## **Refactored Services Added to API Gateway**

### **1. Auth Service Proxy** ✅
- **File**: `api-gateway/src/routes/auth-proxy.ts`
- **Base URL**: `/auth`
- **Target**: `http://localhost:8000`
- **Features**:
  - Public routes for login/register (no auth required)
  - Protected routes for authenticated users
  - JWT token validation
- **Environment Variable**: `AUTH_SERVICE_URL`

### **2. Buyer Service Proxy** ✅
- **File**: `api-gateway/src/routes/buyer-proxy.ts`
- **Base URL**: `/buyer`
- **Target**: `http://localhost:8001`
- **Features**:
  - Authentication required
  - Feature gating with `BUYER_SERVICES`
  - Role-based access control
- **Environment Variable**: `BUYER_SERVICE_URL`

### **3. Seller Service Proxy** ✅
- **File**: `api-gateway/src/routes/seller-proxy.ts`
- **Base URL**: `/seller`
- **Target**: `http://localhost:8014`
- **Features**:
  - Authentication required
  - Feature gating with `SELLER_SERVICES`
  - Role-based access control
- **Environment Variable**: `SELLER_SERVICE_URL`

### **4. Admin Service Proxy** ✅
- **File**: `api-gateway/src/routes/admin-proxy.ts`
- **Base URL**: `/admin`
- **Target**: `http://localhost:8016`
- **Features**:
  - Authentication required
  - Feature gating with `ADMIN_SERVICES`
  - Admin role validation
- **Environment Variable**: `ADMIN_SERVICE_URL`

### **5. Super Admin Service Proxy** ✅
- **File**: `api-gateway/src/routes/superadmin-proxy.ts`
- **Base URL**: `/superadmin`
- **Target**: `http://localhost:8017`
- **Features**:
  - Authentication required
  - Feature gating with `SUPER_ADMIN_SERVICES`
  - Super admin role validation
- **Environment Variable**: `SUPERADMIN_SERVICE_URL`

### **6. Investor Service Proxy** ✅
- **File**: `api-gateway/src/routes/investor-proxy.ts`
- **Base URL**: `/investor`
- **Target**: `http://localhost:8018`
- **Features**:
  - Authentication required
  - Feature gating with `INVESTOR_SERVICES`
  - Role-based access control
- **Environment Variable**: `INVESTOR_SERVICE_URL`

### **7. Payment Service Proxy** ✅ (Already existed)
- **File**: `api-gateway/src/routes/payment-proxy.ts`
- **Base URL**: `/payments`
- **Target**: `http://localhost:4004`
- **Features**:
  - Authentication required
  - Feature gating with `PAYMENTS`
  - Razorpay webhook support
- **Environment Variable**: `PAYMENT_SERVICE_URL`

## **Updated Configuration Files**

### **1. Services Configuration** ✅
- **File**: `api-gateway/src/config/services.ts`
- **Updates**:
  - Added all refactored services with correct ports
  - Updated existing service URLs to match refactored ports
  - Added environment variable mappings

### **2. Feature Flag Types** ✅
- **File**: `shared/config/featureFlagTypes.ts`
- **Updates**:
  - Added new features for each refactored service
  - Maintained consistency with existing feature structure

### **3. Main API Gateway** ✅
- **File**: `api-gateway/src/index.ts`
- **Updates**:
  - Imported all new proxy routers
  - Added routes to the main application
  - Maintained existing middleware chain

## **Service Ports Mapping**

| Service | Port | Environment Variable | Status |
|---------|------|---------------------|---------|
| Auth Service | 8000 | `AUTH_SERVICE_URL` | ✅ Added |
| Buyer Service | 8001 | `BUYER_SERVICE_URL` | ✅ Added |
| Seller Service | 8014 | `SELLER_SERVICE_URL` | ✅ Added |
| Admin Service | 8016 | `ADMIN_SERVICE_URL` | ✅ Added |
| Super Admin Service | 8017 | `SUPERADMIN_SERVICE_URL` | ✅ Added |
| Investor Service | 8018 | `INVESTOR_SERVICE_URL` | ✅ Added |
| Agent Service | 8015 | `AGENT_SERVICE_URL` | ✅ Added |
| Loan Service | 8013 | `LOAN_SERVICE_URL` | ✅ Added |
| Payment Service | 8017 | `PAYMENT_SERVICE_URL` | ✅ Updated |

## **API Endpoints Available**

### **Auth Service** (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `POST /auth/upgrade` - Pro subscription upgrade
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile

### **Buyer Service** (`/buyer`)
- `GET /buyer/listings` - Browse listings
- `GET /buyer/search` - Search MSMEs
- `POST /buyer/contact/:sellerId` - Contact seller
- `GET /buyer/messages` - Message history
- `GET /buyer/saved-searches` - Saved searches (Pro)
- `GET /buyer/analytics` - Analytics dashboard (Pro)

### **Seller Service** (`/seller`)
- `GET /seller/profile` - Get seller profile
- `PUT /seller/profile` - Update seller profile
- `POST /seller/listings` - Create listing
- `GET /seller/listings` - Get seller listings
- `PUT /seller/listings/:listingId` - Update listing
- `POST /seller/listings/:listingId/boost` - Boost listing (Pro)
- `GET /seller/analytics` - Analytics (Pro)
- `POST /seller/inquiries/:inquiryId/respond` - Respond to inquiry

### **Admin Service** (`/admin`)
- `GET /admin/dashboard` - Dashboard summary
- `GET /admin/users` - User management
- `PUT /admin/users/:userId/status` - Update user status
- `GET /admin/analytics` - Basic analytics
- `GET /admin/analytics/advanced` - Advanced analytics (Pro)
- `GET /admin/feature-flags` - Feature flags (Pro)
- `PUT /admin/feature-flags/:flagId` - Update feature flag (Pro)
- `GET /admin/system-health` - System health (Pro)

### **Super Admin Service** (`/superadmin`)
- `GET /superadmin/dashboard` - Dashboard summary
- `GET /superadmin/analytics` - System-wide analytics
- `GET /superadmin/users/roles` - User role management
- `PUT /superadmin/users/:userId/roles` - Update user roles
- `GET /superadmin/configuration` - System configuration
- `PUT /superadmin/configuration/:configId` - Update configuration
- `GET /superadmin/health` - System health overview
- `GET /superadmin/audit-logs` - Audit logs
- `POST /superadmin/admins` - Create super admin

### **Investor Service** (`/investor`)
- `GET /investor/profile` - Get investor profile
- `PUT /investor/profile` - Update investor profile
- `GET /investor/opportunities` - Browse opportunities
- `GET /investor/opportunities/early-access` - Early access opportunities (Pro)
- `GET /investor/opportunities/:opportunityId` - Opportunity details
- `POST /investor/opportunities/:opportunityId/interest` - Express interest
- `GET /investor/analytics` - Analytics (Pro)
- `GET /investor/chats` - Direct chats (Pro)
- `GET /investor/investments` - Investment history

## **Security Features**

### **Authentication**
- JWT token validation on all protected routes
- Token refresh mechanism
- Role-based access control

### **Feature Gating**
- Service-level feature flags
- Pro subscription validation
- Role-based feature access

### **Rate Limiting**
- Request rate limiting
- IP-based throttling
- Service-specific limits

### **Logging & Monitoring**
- Request/response logging
- Error tracking
- Performance monitoring
- Health checks

## **Environment Variables Required**

```bash
# Service URLs
AUTH_SERVICE_URL=http://localhost:8000
BUYER_SERVICE_URL=http://localhost:8001
SELLER_SERVICE_URL=http://localhost:8014
ADMIN_SERVICE_URL=http://localhost:8016
SUPERADMIN_SERVICE_URL=http://localhost:8017
INVESTOR_SERVICE_URL=http://localhost:8018
AGENT_SERVICE_URL=http://localhost:8015
LOAN_SERVICE_URL=http://localhost:8013
PAYMENT_SERVICE_URL=http://localhost:8017

# Gateway Configuration
GATEWAY_PORT=3000
JWT_SECRET=your-jwt-secret
```

## **Deployment Notes**

1. **Service Discovery**: All services are configured with localhost URLs for development
2. **Docker Integration**: Update docker-compose.yml to include new services
3. **Kubernetes**: Create service definitions for each refactored service
4. **Load Balancing**: Consider adding load balancers for production
5. **Monitoring**: Add health checks and metrics for all services

## **Testing**

### **Health Check Endpoints**
- `GET /auth/health` - Auth service health
- `GET /buyer/health` - Buyer service health
- `GET /seller/health` - Seller service health
- `GET /admin/health` - Admin service health
- `GET /superadmin/health` - Super admin service health
- `GET /investor/health` - Investor service health

### **Integration Testing**
- Test all proxy routes with authentication
- Verify feature gating works correctly
- Test Pro subscription validation
- Validate role-based access control

## **Next Steps**

1. **Update docker-compose.yml** to include all refactored services
2. **Create Kubernetes manifests** for production deployment
3. **Add monitoring and alerting** for all services
4. **Implement service mesh** for advanced routing
5. **Add API documentation** using OpenAPI/Swagger
6. **Performance testing** of all proxy routes

---

**Status**: ✅ **COMPLETE**  
**Services Added**: 6 new proxy routes  
**Configuration Updated**: 3 files  
**Features Added**: 9 new feature flags
