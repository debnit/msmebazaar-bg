#!/bin/bash

# MSME Bazaar Development Setup Script
set -e

echo "🚀 Setting up MSME Bazaar development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        print_success "Docker is installed"
    else
        print_warning "Docker is not installed. You'll need it for production deployment"
    fi
    
    # Check Docker Compose (optional)
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is installed"
    else
        print_warning "Docker Compose is not installed. You'll need it for local development with containers"
    fi
}

# Install dependencies for all packages
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    
    # Mobile dependencies
    print_status "Installing mobile dependencies..."
    cd mobile && npm install && cd ..
    
    # Shared dependencies
    print_status "Installing shared dependencies..."
    cd shared && npm install && cd ..
    
    # API Gateway dependencies
    print_status "Installing API Gateway dependencies..."
    cd api-gateway && npm install && cd ..
    
    # Microservices dependencies
    print_status "Installing microservices dependencies..."
    cd services
    for service in */; do
        if [ -d "$service" ]; then
            print_status "Installing dependencies for $service"
            cd "$service" && npm install && cd ..
        fi
    done
    cd ..
    
    print_success "All dependencies installed successfully"
}

# Setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Root .env
    if [ ! -f .env ]; then
        cat > .env << EOF
# Database
DATABASE_URL="postgresql://msmebazaar:password@localhost:5432/msmebazaar"
DATABASE_URL_TEST="postgresql://msmebazaar:password@localhost:5432/msmebazaar_test"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Redis (for caching and sessions)
REDIS_URL="redis://localhost:6379"

# External Services
SENDGRID_API_KEY="your-sendgrid-key"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="msmebazaar-assets"

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true
EOF
        print_success "Created root .env file"
    else
        print_warning "Root .env file already exists"
    fi
    
    # Frontend .env.local
    if [ ! -f frontend/.env.local ]; then
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL="http://localhost:6000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_GA_ID="your-google-analytics-id"
EOF
        print_success "Created frontend .env.local file"
    else
        print_warning "Frontend .env.local file already exists"
    fi
    
    # Mobile .env
    if [ ! -f mobile/.env ]; then
        cat > mobile/.env << EOF
EXPO_PUBLIC_API_URL="http://localhost:3001"
EXPO_PUBLIC_APP_URL="http://localhost:3000"
EXPO_PUBLIC_SENTRY_DSN="your-sentry-dsn"
EOF
        print_success "Created mobile .env file"
    else
        print_warning "Mobile .env file already exists"
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if PostgreSQL is running
    if command -v docker &> /dev/null; then
        print_status "Starting PostgreSQL with Docker..."
        docker run --name msmebazaar-postgres \
            -e POSTGRES_DB=msmebazaar \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres \
            -p 5432:5432 \
            -d postgres:14
        
        # Wait for database to be ready
        print_status "Waiting for database to be ready..."
        sleep 10
        
        print_success "PostgreSQL started successfully"
    else
        print_warning "Docker not available. Please ensure PostgreSQL is running on localhost:5432"
    fi
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    cd services
    for service in */; do
        if [ -d "$service" ] && [ -f "$service/prisma/schema.prisma" ]; then
            print_status "Running migrations for $service"
            cd "$service"
            npx prisma generate
            npx prisma migrate dev --name init || true
            cd ..
        fi
    done
    cd ..
    
    print_success "Database migrations completed"
}

# Setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    if [ -d .git ]; then
        # Create pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Run linting
npm run lint:all || exit 1

# Run type checking
npm run type-check || exit 1

echo "Pre-commit checks passed!"
EOF
        
        chmod +x .git/hooks/pre-commit
        print_success "Git hooks configured"
    else
        print_warning "Not a Git repository. Skipping Git hooks setup"
    fi
}

# Build shared packages
build_shared() {
    print_status "Building shared packages..."
    
    cd shared && npm run build && cd ..
    print_success "Shared packages built successfully"
}

# Main setup function
main() {
    print_status "Starting MSME Bazaar development setup..."
    
    check_requirements
    install_dependencies
    setup_environment
    setup_database
    run_migrations
    setup_git_hooks
    build_shared
    
    print_success "🎉 Development setup completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Update environment variables in .env files with your actual values"
    echo "2. Start the development servers:"
    echo "   - API Gateway: cd api-gateway && npm run dev"
    echo "   - Frontend: cd frontend && npm run dev"
    echo "   - Mobile: cd mobile && npm start"
    echo "3. Run tests: npm run test:all"
    echo "4. Check the README.md for more detailed instructions"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function
main "$@"

