#!/usr/bin/env node

// Test script to verify auth endpoints are working
//const axios = require('axios');
import axios from "axios"
const API_BASE = 'http://localhost:7000';

async function testAuthEndpoints() {
  console.log('🧪 Testing Auth Endpoints...\n');

  try {
    // Test 1: Register endpoint (should work without auth)
    console.log('1. Testing /auth/register (should work without auth)...');
    try {
      const registerResponse = await axios.post(`${API_BASE}/auth/register`, {
        email: 'test10@example.com',
        password: 'testpassword123',
        firstName: 'Test',
        lastName: 'User'
      });
      console.log('✅ Register endpoint accessible:', registerResponse.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Register endpoint requires auth (should not)');
      } else {
        console.log('✅ Register endpoint accessible (other error expected):', error.response?.status || error.message);
      }
    }

    // Test 2: Login endpoint (should work without auth)
    console.log('\n2. Testing /auth/login (should work without auth)...');
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: 'test10@example.com',
        password: 'testpassword123'
      });
      console.log('✅ Login endpoint accessible:', loginResponse.status);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Login endpoint requires auth (should not)');
      } else {
        console.log('✅ Login endpoint accessible (other error expected):', error.response?.status || error.message);
      }
    }

    // Test 3: Protected endpoint (should require auth)
    console.log('\n3. Testing /auth/profile (should require auth)...');
    try {
      const profileResponse = await axios.get(`${API_BASE}/auth/profile`);
      console.log('❌ Profile endpoint accessible without auth (should not be)');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Profile endpoint correctly requires auth');
      } else {
        console.log('⚠️  Profile endpoint error (not 401):', error.response?.status || error.message);
      }
    }

    // Test 4: Protected service endpoint (should require auth)
    console.log('\n4. Testing /buyer (should require auth)...');
    try {
      const buyerResponse = await axios.get(`${API_BASE}/buyer`);
      console.log('❌ Buyer endpoint accessible without auth (should not be)');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Buyer endpoint correctly requires auth');
      } else {
        console.log('⚠️  Buyer endpoint error (not 401):', error.response?.status || error.message);
      }
    }

    console.log('\n🎉 Auth endpoint testing completed!');
    console.log('\n📋 Summary:');
    console.log('- Public routes (login/register) should be accessible without auth');
    console.log('- Protected routes should return 401 without auth');
    console.log('- If you see 401 errors on public routes, the global JWT middleware is still active');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAuthEndpoints();
