#!/bin/bash

# Setup Docker Network for MSME Bazaar
# This script configures Docker networking to resolve IPv4/IPv6 conflicts

set -e

echo "🔧 Setting up Docker network for MSME Bazaar..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Remove existing network if it exists
if docker network ls | grep -q "msmebazaar-network"; then
    echo "🗑️  Removing existing msmebazaar-network..."
    docker network rm msmebazaar-network
fi

# Create network with IPv4 configuration
echo "🌐 Creating msmebazaar-network with IPv4 configuration..."
docker network create \
    --driver bridge \
    --subnet=172.20.0.0/16 \
    --gateway=172.20.0.1 \
    --opt com.docker.network.bridge.name=msmebazaar-br0 \
    msmebazaar-network

# Verify network creation
echo "✅ Network created successfully:"
docker network inspect msmebazaar-network --format='{{.Name}}: {{.IPAM.Config}}'

# Set up IPv4 preference for Docker daemon
echo "🔧 Configuring IPv4 preference..."

# Create daemon.json directory if it doesn't exist
sudo mkdir -p /etc/docker

# Backup existing daemon.json if it exists
if [ -f /etc/docker/daemon.json ]; then
    echo "📋 Backing up existing daemon.json..."
    sudo cp /etc/docker/daemon.json /etc/docker/daemon.json.backup
fi

# Create daemon.json with IPv4 configuration
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "ipv6": false,
  "dns": ["8.8.8.8", "8.8.4.4"],
  "default-address-pools": [
    {
      "base": "172.20.0.0/16",
      "size": 24
    }
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF

echo "🔄 Restarting Docker daemon..."
sudo systemctl restart docker

# Wait for Docker to be ready
echo "⏳ Waiting for Docker to be ready..."
sleep 10

# Verify Docker is running
if docker info > /dev/null 2>&1; then
    echo "✅ Docker is running with new configuration"
else
    echo "❌ Docker failed to start. Restoring backup..."
    sudo cp /etc/docker/daemon.json.backup /etc/docker/daemon.json
    sudo systemctl restart docker
    exit 1
fi

# Test network connectivity
echo "🧪 Testing network connectivity..."
docker run --rm --network msmebazaar-network alpine:latest ping -c 3 8.8.8.8

echo "✅ Docker network setup completed successfully!"
echo ""
echo "📋 Summary:"
echo "  - Network: msmebazaar-network (172.20.0.0/16)"
echo "  - Gateway: 172.20.0.1"
echo "  - IPv6: Disabled"
echo "  - DNS: 8.8.8.8, 8.8.4.4"
echo ""
echo "🚀 You can now run: docker-compose up -d"
