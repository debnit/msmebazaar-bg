#!/bin/bash

# Test script for Auth Proxy
# This script tests the auth-proxy endpoints to ensure they're working correctly

set -e

echo "🧪 Testing Auth Proxy endpoints..."

# Configuration
API_GATEWAY_URL="http://localhost:7000"
AUTH_SERVICE_URL="http://localhost:8004"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "\n${YELLOW}Testing: $description${NC}"
    echo "Endpoint: $method $API_GATEWAY_URL$endpoint"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$API_GATEWAY_URL$endpoint" || echo -e "\n000")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_GATEWAY_URL$endpoint" || echo -e "\n000")
    fi
    
    # Extract status code (last line)
    status_code=$(echo "$response" | tail -n1)
    # Extract response body (all lines except last)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        echo -e "${GREEN}✅ Success (${status_code})${NC}"
        echo "Response: $body"
    elif [ "$status_code" -ge 400 ] && [ "$status_code" -lt 500 ]; then
        echo -e "${YELLOW}⚠️  Client Error (${status_code})${NC}"
        echo "Response: $body"
    elif [ "$status_code" -ge 500 ]; then
        echo -e "${RED}❌ Server Error (${status_code})${NC}"
        echo "Response: $body"
    else
        echo -e "${RED}❌ Connection Error (${status_code})${NC}"
        echo "Response: $body"
    fi
}

# Check if API Gateway is running
echo "🔍 Checking if API Gateway is running..."
if ! curl -s "$API_GATEWAY_URL" > /dev/null 2>&1; then
    echo -e "${RED}❌ API Gateway is not running on $API_GATEWAY_URL${NC}"
    echo "Please start the API Gateway first:"
    echo "  cd api-gateway && npm run dev"
    exit 1
fi

# Check if Auth Service is running
echo "🔍 Checking if Auth Service is running..."
if ! curl -s "$AUTH_SERVICE_URL/health" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Auth Service is not running on $AUTH_SERVICE_URL${NC}"
    echo "Please start the Auth Service first:"
    echo "  cd services/auth-service && npm run dev"
    echo "Continuing with tests anyway..."
fi

echo -e "\n${GREEN}✅ Services are accessible${NC}"

# Test public endpoints
echo -e "\n${YELLOW}📋 Testing Public Endpoints${NC}"

# Health check
test_endpoint "GET" "/auth/health" "" "Health Check"

# Register endpoint
test_endpoint "POST" "/auth/register" '{
  "email": "test@example.com",
  "password": "testpassword123",
  "firstName": "Test",
  "lastName": "User"
}' "User Registration"

# Login endpoint
test_endpoint "POST" "/auth/login" '{
  "email": "test@example.com",
  "password": "testpassword123"
}' "User Login"

# Refresh token endpoint
test_endpoint "POST" "/auth/refresh" '{
  "refreshToken": "test-refresh-token"
}' "Token Refresh"

# Logout endpoint
test_endpoint "POST" "/auth/logout" '{
  "refreshToken": "test-refresh-token"
}' "User Logout"

# Verify email endpoint
test_endpoint "POST" "/auth/verify-email" '{
  "token": "test-verification-token"
}' "Email Verification"

# Test protected endpoints (will fail without valid JWT)
echo -e "\n${YELLOW}📋 Testing Protected Endpoints (will fail without valid JWT)${NC}"

test_endpoint "GET" "/auth/profile" "" "Get User Profile"
test_endpoint "POST" "/auth/upgrade-pro" '{}' "Upgrade to Pro"
test_endpoint "POST" "/auth/change-password" '{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}' "Change Password"

# Test admin endpoints (will fail without valid JWT and admin role)
echo -e "\n${YELLOW}📋 Testing Admin Endpoints (will fail without valid JWT and admin role)${NC}"

test_endpoint "POST" "/auth/add-role" '{
  "userId": "test-user-id",
  "role": "BUYER"
}' "Add User Role"

test_endpoint "POST" "/auth/remove-role" '{
  "userId": "test-user-id",
  "role": "BUYER"
}' "Remove User Role"

# Test invalid endpoint
echo -e "\n${YELLOW}📋 Testing Invalid Endpoint${NC}"
test_endpoint "GET" "/auth/invalid-endpoint" "" "Invalid Endpoint"

echo -e "\n${GREEN}✅ Auth Proxy testing completed!${NC}"
echo ""
echo "📊 Summary:"
echo "  - Public endpoints should return 200 or 400 (expected for invalid data)"
echo "  - Protected endpoints should return 401 (unauthorized without JWT)"
echo "  - Admin endpoints should return 401 (unauthorized without admin role)"
echo "  - Invalid endpoints should return 404 (not found)"
echo ""
echo "🔧 If you see connection errors:"
echo "  1. Make sure API Gateway is running on port 7000"
echo "  2. Make sure Auth Service is running on port 8004"
echo "  3. Check the logs for any proxy errors"
