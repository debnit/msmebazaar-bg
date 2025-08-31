// Test script for refactored auth service
const axios = require('axios');

const BASE_URL = 'http://localhost:7000'; // API Gateway port
const TEST_EMAIL = 'test10@example.com';
const TEST_PASSWORD = 'TestPass123';
const TEST_NAME = 'Test User';

let accessToken = '';
let refreshToken = '';

async function testAuthService() {
  console.log('🧪 Testing Refactored Auth Service...\n');

  try {
    // Test 1: User Registration
    console.log('1️⃣ Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      name: TEST_NAME,
      phone: '+1234567890'
    });
    
    console.log('✅ Registration successful:', {
      success: registerResponse.data.success,
      message: registerResponse.data.message,
      userId: registerResponse.data.data?.user?.id,
      roles: registerResponse.data.data?.user?.roles
    });

    // Test 2: User Login
    console.log('\n2️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    accessToken = loginResponse.data.data.accessToken;
    refreshToken = loginResponse.data.data.refreshToken;
    
    console.log('✅ Login successful:', {
      success: loginResponse.data.success,
      message: loginResponse.data.message,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      userRoles: loginResponse.data.data.user.roles
    });

    // Test 3: Get User Profile
    console.log('\n3️⃣ Testing Get User Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    console.log('✅ Profile retrieved:', {
      success: profileResponse.data.success,
      user: {
        id: profileResponse.data.data.user.id,
        email: profileResponse.data.data.user.email,
        name: profileResponse.data.data.user.name,
        isPro: profileResponse.data.data.user.isPro,
        roles: profileResponse.data.data.user.roles
      }
    });

    // Test 4: Upgrade to Pro
    console.log('\n4️⃣ Testing Upgrade to Pro...');
    const upgradeResponse = await axios.post(`${BASE_URL}/auth/upgrade-pro`, {}, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    console.log('✅ Pro upgrade successful:', {
      success: upgradeResponse.data.success,
      isPro: upgradeResponse.data.data.user.isPro,
      onboardedProAt: upgradeResponse.data.data.user.onboardedProAt
    });

    // Test 5: Get User Sessions
    console.log('\n5️⃣ Testing Get User Sessions...');
    const sessionsResponse = await axios.get(`${BASE_URL}/auth/sessions`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    console.log('✅ Sessions retrieved:', {
      success: sessionsResponse.data.success,
      sessionCount: sessionsResponse.data.data.sessions.length
    });

    // Test 6: Refresh Token
    console.log('\n6️⃣ Testing Token Refresh...');
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken
    });
    
    const newAccessToken = refreshResponse.data.data.accessToken;
    const newRefreshToken = refreshResponse.data.data.refreshToken;
    
    console.log('✅ Token refresh successful:', {
      success: refreshResponse.data.success,
      hasNewAccessToken: !!newAccessToken,
      hasNewRefreshToken: !!newRefreshToken
    });

    // Test 7: Change Password
    console.log('\n7️⃣ Testing Change Password...');
    const changePasswordResponse = await axios.post(`${BASE_URL}/auth/change-password`, {
      currentPassword: TEST_PASSWORD,
      newPassword: 'NewTestPass123'
    }, {
      headers: { Authorization: `Bearer ${newAccessToken}` }
    });
    
    console.log('✅ Password change successful:', {
      success: changePasswordResponse.data.success,
      message: changePasswordResponse.data.message
    });

    // Test 8: Login with New Password
    console.log('\n8️⃣ Testing Login with New Password...');
    const newLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: 'NewTestPass123'
    });
    
    console.log('✅ Login with new password successful:', {
      success: newLoginResponse.data.success,
      hasAccessToken: !!newLoginResponse.data.data.accessToken
    });

    // Test 9: Logout
    console.log('\n9️⃣ Testing Logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/auth/logout`, {
      refreshToken: newRefreshToken
    });
    
    console.log('✅ Logout successful:', {
      success: logoutResponse.data.success,
      message: logoutResponse.data.message
    });

    // Test 10: Verify Email (Mock)
    console.log('\n🔟 Testing Email Verification...');
    const verifyEmailResponse = await axios.post(`${BASE_URL}/auth/verify-email`, {
      token: 'mock-verification-token'
    });
    
    console.log('✅ Email verification response:', {
      success: verifyEmailResponse.data.success,
      message: verifyEmailResponse.data.message
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Registration with phone field');
    console.log('- ✅ Login with proper role assignment');
    console.log('- ✅ Profile retrieval with roles');
    console.log('- ✅ Pro upgrade with onboardedProAt tracking');
    console.log('- ✅ Session management');
    console.log('- ✅ Token refresh');
    console.log('- ✅ Password change');
    console.log('- ✅ Logout');
    console.log('- ✅ Email verification endpoint');

  } catch (error) {
    console.error('❌ Test failed:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      endpoint: error.config?.url
    });
    
    if (error.response?.data) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Test validation errors
async function testValidationErrors() {
  console.log('\n🧪 Testing Validation Errors...\n');

  const testCases = [
    {
      name: 'Invalid email format',
      endpoint: '/auth/register',
      data: { email: 'invalid-email', password: 'TestPass123', name: 'Test' }
    },
    {
      name: 'Weak password',
      endpoint: '/auth/register',
      data: { email: 'test@example.com', password: 'weak', name: 'Test' }
    },
    {
      name: 'Missing required fields',
      endpoint: '/auth/login',
      data: { email: 'test@example.com' }
    },
    {
      name: 'Invalid refresh token',
      endpoint: '/auth/refresh',
      data: { refreshToken: 'invalid-token' }
    }
  ];

  for (const testCase of testCases) {
    try {
      await axios.post(`${BASE_URL}${testCase.endpoint}`, testCase.data);
      console.log(`❌ ${testCase.name}: Expected validation error but got success`);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(`✅ ${testCase.name}: Validation error caught`);
      } else {
        console.log(`❌ ${testCase.name}: Unexpected error:`, error.response?.status);
      }
    }
  }
}

// Run tests
async function runAllTests() {
  await testAuthService();
  await testValidationErrors();
}

runAllTests().catch(console.error);
