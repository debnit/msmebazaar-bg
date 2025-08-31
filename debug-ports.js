// Debug script to check port configurations and connectivity
const axios = require('axios');
const net = require('net');

const PORTS = {
  API_GATEWAY: 7000,
  AUTH_SERVICE: 8004,
  FRONTEND: 3000
};

async function checkPort(host, port, serviceName) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 2000;
    
    socket.setTimeout(timeout);
    
    socket.on('connect', () => {
      console.log(`✅ ${serviceName} is running on ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      console.log(`❌ ${serviceName} is NOT running on ${host}:${port} (timeout)`);
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', (err) => {
      console.log(`❌ ${serviceName} is NOT running on ${host}:${port} (${err.code})`);
      socket.destroy();
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

async function testAuthServiceDirect() {
  console.log('\n🔍 Testing Auth Service Direct Access...');
  
  try {
    const response = await axios.get(`http://localhost:${PORTS.AUTH_SERVICE}/health`, {
      timeout: 5000
    });
    console.log('✅ Auth service health check successful:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Auth service health check failed:', error.message);
    return false;
  }
}

async function testApiGatewayDirect() {
  console.log('\n🔍 Testing API Gateway Direct Access...');
  
  try {
    const response = await axios.get(`http://localhost:${PORTS.API_GATEWAY}/health`, {
      timeout: 5000
    });
    console.log('✅ API Gateway health check successful:', response.data);
    return true;
  } catch (error) {
    console.log('❌ API Gateway health check failed:', error.message);
    return false;
  }
}

async function testAuthThroughGateway() {
  console.log('\n🔍 Testing Auth Service through API Gateway...');
  
  try {
    const response = await axios.get(`http://localhost:${PORTS.API_GATEWAY}/auth/profile`, {
      timeout: 5000,
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    console.log('✅ Auth service through gateway successful:', response.data);
    return true;
  } catch (error) {
    if (error.response) {
      console.log('❌ Auth service through gateway failed:', {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      console.log('❌ Auth service through gateway failed:', error.message);
    }
    return false;
  }
}

async function testRegistrationThroughGateway() {
  console.log('\n🔍 Testing Registration through API Gateway...');
  
  try {
    const response = await axios.post(`http://localhost:${PORTS.API_GATEWAY}/auth/register`, {
      email: 'test@example.com',
      password: 'TestPass123',
      name: 'Test User'
    }, {
      timeout: 5000
    });
    console.log('✅ Registration through gateway successful:', response.data);
    return true;
  } catch (error) {
    if (error.response) {
      console.log('❌ Registration through gateway failed:', {
        status: error.response.status,
        data: error.response.data
      });
    } else {
      console.log('❌ Registration through gateway failed:', error.message);
    }
    return false;
  }
}

async function main() {
  console.log('🚀 MSMEBazaar Port Configuration Debug Tool\n');
  
  // Check if services are running on expected ports
  console.log('📋 Checking service ports...');
  await checkPort('localhost', PORTS.API_GATEWAY, 'API Gateway');
  await checkPort('localhost', PORTS.AUTH_SERVICE, 'Auth Service');
  await checkPort('localhost', PORTS.FRONTEND, 'Frontend');
  
  // Test direct service access
  const authDirect = await testAuthServiceDirect();
  const gatewayDirect = await testApiGatewayDirect();
  
  // Test through gateway
  if (authDirect && gatewayDirect) {
    await testAuthThroughGateway();
    await testRegistrationThroughGateway();
  }
  
  console.log('\n📋 Configuration Summary:');
  console.log(`API Gateway: http://localhost:${PORTS.API_GATEWAY}`);
  console.log(`Auth Service: http://localhost:${PORTS.AUTH_SERVICE}`);
  console.log(`Frontend: http://localhost:${PORTS.FRONTEND}`);
  
  console.log('\n🔧 Troubleshooting Tips:');
  console.log('1. Make sure all services are running in separate terminals');
  console.log('2. Check that ports are not being used by other processes');
  console.log('3. Verify environment variables are set correctly');
  console.log('4. Check service logs for any startup errors');
  
  console.log('\n📝 Expected Startup Commands:');
  console.log('Terminal 1 (API Gateway): cd api-gateway && npm run dev');
  console.log('Terminal 2 (Auth Service): cd services/auth-service && npm run dev');
  console.log('Terminal 3 (Frontend): cd frontend && npm run dev');
}

main().catch(console.error);
