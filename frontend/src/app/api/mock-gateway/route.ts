import { NextRequest, NextResponse } from 'next/server';

// Mock data for testing
const mockUsers = [
  { id: '1', email: 'test@example.com', name: 'Test User', role: 'buyer' }
];

const mockProducts = [
  { id: '1', name: 'Product 1', description: 'Test product 1', price: 100 },
  { id: '2', name: 'Product 2', description: 'Test product 2', price: 200 },
  { id: '3', name: 'Product 3', description: 'Test product 3', price: 300 }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '';

  // Health check
  if (path === 'health') {
    return NextResponse.json({ status: 'ok', message: 'Mock API Gateway is running' });
  }

  // Mock marketplace products
  if (path.startsWith('marketplace/products')) {
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    return NextResponse.json({
      success: true,
      data: mockProducts.slice(0, limit),
      meta: { total: mockProducts.length, limit }
    });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '';
  const body = await request.json();

  // Mock auth login
  if (path === 'auth/login') {
    const { email, password } = body;
    
    if (email === 'test@example.com' && password === 'password123') {
      return NextResponse.json({
        success: true,
        data: {
          user: mockUsers[0],
          token: 'mock-jwt-token-' + Date.now(),
          refreshToken: 'mock-refresh-token-' + Date.now()
        },
        message: 'Login successful'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }
  }

  // Mock auth register
  if (path === 'auth/register') {
    const { email, password, name, role } = body;
    
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      return NextResponse.json({
        success: false,
        error: 'User already exists'
      }, { status: 409 });
    }

    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      name,
      role
    };

    mockUsers.push(newUser);

    return NextResponse.json({
      success: true,
      data: {
        user: newUser,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      },
      message: 'Registration successful'
    });
  }

  // Mock auth logout
  if (path === 'auth/logout') {
    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

