#!/bin/bash

# Start Local Development Environment
# This script helps start the API Gateway and Auth Service for local development

set -e

echo "🚀 Starting Local Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    local service_name=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Port $port is already in use by $service_name${NC}"
        return 0
    else
        echo -e "${GREEN}✅ Port $port is available${NC}"
        return 1
    fi
}

# Function to start service
start_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    local command=$4
    
    echo -e "\n${BLUE}🔧 Starting $service_name...${NC}"
    
    if check_port $port $service_name; then
        echo -e "${YELLOW}Skipping $service_name (already running)${NC}"
        return
    fi
    
    cd "$service_path"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}📦 Installing dependencies for $service_name...${NC}"
        npm install
    fi
    
    # Start the service in background
    echo -e "${GREEN}🚀 Starting $service_name on port $port...${NC}"
    if [ "$command" = "dev" ]; then
        npm run dev &
    else
        npm start &
    fi
    
    # Store the PID
    echo $! > "/tmp/${service_name}.pid"
    
    # Wait a moment for the service to start
    sleep 3
    
    # Check if service started successfully
    if check_port $port $service_name; then
        echo -e "${GREEN}✅ $service_name started successfully on port $port${NC}"
    else
        echo -e "${RED}❌ Failed to start $service_name on port $port${NC}"
    fi
    
    cd - > /dev/null
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

# Create necessary directories
mkdir -p /tmp

# Kill any existing processes
echo -e "${YELLOW}🧹 Cleaning up existing processes...${NC}"
pkill -f "api-gateway" || true
pkill -f "auth-service" || true

# Start Auth Service first
start_service "Auth Service" "services/auth-service" 8004 "dev"

# Wait a moment for auth service to fully start
sleep 5

# Start API Gateway
start_service "API Gateway" "api-gateway" 7000 "dev"

# Wait for services to be ready
echo -e "\n${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Test the services
echo -e "\n${BLUE}🧪 Testing services...${NC}"

# Test Auth Service
if curl -s "http://localhost:8004/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Auth Service is responding${NC}"
else
    echo -e "${RED}❌ Auth Service is not responding${NC}"
fi

# Test API Gateway
if curl -s "http://localhost:7000" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ API Gateway is responding${NC}"
else
    echo -e "${RED}❌ API Gateway is not responding${NC}"
fi

# Test Auth Proxy
if curl -s "http://localhost:7000/auth/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Auth Proxy is working${NC}"
else
    echo -e "${YELLOW}⚠️  Auth Proxy test failed (this might be expected if auth service is not fully ready)${NC}"
fi

echo -e "\n${GREEN}🎉 Local development environment started!${NC}"
echo ""
echo "📋 Service URLs:"
echo "  - API Gateway: http://localhost:7000"
echo "  - Auth Service: http://localhost:8004"
echo "  - Auth Proxy: http://localhost:7000/auth"
echo ""
echo "🧪 Test the auth proxy:"
echo "  ./scripts/test-auth-proxy.sh"
echo ""
echo "📊 Monitor logs:"
echo "  - API Gateway: tail -f api-gateway/logs/app.log"
echo "  - Auth Service: tail -f services/auth-service/logs/app.log"
echo ""
echo "🛑 To stop services:"
echo "  pkill -f 'api-gateway'"
echo "  pkill -f 'auth-service'"
echo ""
echo "🔧 Troubleshooting:"
echo "  - Check if ports 7000 and 8004 are available"
echo "  - Ensure all dependencies are installed"
echo "  - Check service logs for errors"
