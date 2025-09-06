'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/services/api-client';
import { useAuthStore } from '@/store/auth.store';
import { getPostLoginRedirect } from '@/utils/routes';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { useGetOAuthUrl, useOAuthRegister } from '@/services/auth.api';
import { Separator } from '@/components/ui/separator';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await api.auth.register(formData);
      if (response.success) {
        setUser(response.data.user);
        router.push(getPostLoginRedirect(response.data.user));
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // OAuth handlers
  const getOAuthUrl = useGetOAuthUrl();
  const oauthRegister = useOAuthRegister();
  
  const handleOAuthRegister = async (provider: string) => {
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
            
            // Complete the OAuth registration process
            // We'll pass basic user data that we already have
            const userData = {
              firstName: formData.firstName,
              lastName: formData.lastName,
            };
            
            const registerResponse = await oauthRegister.mutateAsync({ provider, code, userData });
            
            if (registerResponse.success && registerResponse.data?.user) {
              setUser(registerResponse.data.user);
              router.push(getPostLoginRedirect(registerResponse.data.user));
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
          <CardTitle>Create Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or register with
              </span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              type="button" 
              disabled={loading} 
              onClick={() => handleOAuthRegister('google')}
              className="flex items-center justify-center gap-2"
            >
              <FaGoogle className="h-4 w-4" />
              Google
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              disabled={loading} 
              onClick={() => handleOAuthRegister('facebook')}
              className="flex items-center justify-center gap-2"
            >
              <FaFacebook className="h-4 w-4" />
              Facebook
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              disabled={loading} 
              onClick={() => handleOAuthRegister('github')}
              className="flex items-center justify-center gap-2"
            >
              <FaGithub className="h-4 w-4" />
              GitHub
            </Button>
          </div>
          
          <div className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
