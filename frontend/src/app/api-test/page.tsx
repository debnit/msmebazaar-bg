'use client';

import { useState } from 'react';
import { api } from '@/services/api-client';
import { mockApi } from '@/services/api-client-mock';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ApiTestPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Test mock API connection
      const response = await fetch('/api/mock-gateway?path=health');
      const data = await response.json();
      setResult({ type: 'health_check', data, status: response.status });
    } catch (err: any) {
      setError(`Connection failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuthLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await mockApi.auth.login({ email, password });
      setResult({ type: 'auth_login', data: response });
    } catch (err: any) {
      setError(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuthRegister = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await mockApi.auth.register({ 
        email, 
        password, 
        name: 'Test User',
        role: 'buyer'
      });
      setResult({ type: 'auth_register', data: response });
    } catch (err: any) {
      setError(`Registration failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testMarketplaceProducts = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await mockApi.marketplace.getProducts({ limit: 5 });
      setResult({ type: 'marketplace_products', data: response });
    } catch (err: any) {
      setError(`Marketplace API failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">API Client Test Page</h1>
        <p className="text-gray-600">
          Test the frontend API client connections to the API gateway
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>API Base URL</Label>
              <Input 
                value={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>Environment</Label>
              <Input 
                value={process.env.NODE_ENV || 'development'} 
                readOnly 
                className="bg-gray-50"
              />
            </div>
            <Button onClick={testApiConnection} disabled={loading}>
              {loading ? 'Testing...' : 'Test API Connection'}
            </Button>
          </CardContent>
        </Card>

        {/* Auth Test */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password123"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={testAuthLogin} disabled={loading} variant="outline">
                Test Login
              </Button>
              <Button onClick={testAuthRegister} disabled={loading}>
                Test Register
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketplace Test */}
      <Card>
        <CardHeader>
          <CardTitle>Marketplace API Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testMarketplaceProducts} disabled={loading}>
            {loading ? 'Loading...' : 'Get Products'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Type: {result.type}</h4>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Client Info */}
      <Card>
        <CardHeader>
          <CardTitle>API Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Available API Endpoints:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><code>api.auth.login()</code> - User authentication</li>
              <li><code>api.auth.register()</code> - User registration</li>
              <li><code>api.auth.logout()</code> - User logout</li>
              <li><code>api.marketplace.getProducts()</code> - Get marketplace products</li>
              <li><code>api.user.getProfile()</code> - Get user profile</li>
              <li><code>api.loans.apply()</code> - Apply for loan</li>
              <li><code>api.payments.createOrder()</code> - Create payment order</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Automatic retry on network failures</li>
              <li>JWT token management</li>
              <li>Request/response logging</li>
              <li>Error handling with toast notifications</li>
              <li>Automatic redirect on authentication failure</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
