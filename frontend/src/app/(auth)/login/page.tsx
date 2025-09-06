'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/services/api-client';
import { useAuthStore } from '@/store/auth.store';
import { getPostLoginRedirect } from '@/utils/routes';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { useGetOAuthUrl, useOAuthLogin } from '@/services/auth.api';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const loginRes = await api.auth.login({ email, password });

      if (loginRes.success && loginRes.data) {
        // Store the token
        setToken(loginRes.data.token);

        // Fetch fresh user profile from API Gateway
        const profileRes = await api.user.getProfile();

        if (profileRes.success && profileRes.data) {
          setUser(profileRes.data);
          router.push(getPostLoginRedirect(profileRes.data));
        } else {
          setErrorMsg('Unable to load profile after login.');
        }
      } else {
        setErrorMsg(loginRes.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  // OAuth handlers
  const getOAuthUrl = useGetOAuthUrl();
  const oauthLogin = useOAuthLogin();
  
  const handleOAuthLogin = async (provider: string) => {
    try {
      setLoading(true);
      const response = await getOAuthUrl.mutateAsync(provider);
      
      if (response.success && response.data?.url) {
        // Open OAuth provider's authorization page
        const authWindow = window.open(response.data.url, '_blank', 'width=600,height=600');
        
        // Listen for the callback with the authorization code
        window.addEventListener('message', async (event) => {
          if (event.data?.type === 'oauth-callback' && event.data?.provider === provider) {
            const { code } = event.data;
            authWindow?.close();
            
            // Complete the OAuth login process
            const loginResponse = await oauthLogin.mutateAsync({ provider, code });
            
            if (loginResponse.success && loginResponse.data?.user) {
              setUser(loginResponse.data.user);
              router.push(getPostLoginRedirect(loginResponse.data.user));
            }
          }
        });
      }
    } catch (error: any) {
      setErrorMsg(error.message || `Failed to authenticate with ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to MSMEBazaar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              type="button" 
              disabled={loading} 
              onClick={() => handleOAuthLogin('google')}
              className="flex items-center justify-center gap-2"
            >
              <FaGoogle className="h-4 w-4" />
              Google
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              disabled={loading} 
              onClick={() => handleOAuthLogin('facebook')}
              className="flex items-center justify-center gap-2"
            >
              <FaFacebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              disabled={loading} 
              onClick={() => handleOAuthLogin('github')}
              className="flex items-center justify-center gap-2"
            >
              <FaGithub className="h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
