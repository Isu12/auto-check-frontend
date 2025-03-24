'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '../../../Components/services/api/auth';
import { tokenStorage } from '../../../Components/Utils/token-storage';
import { Button } from '../../../Components/ui/button';
import { Input } from '../../../Components/ui/input';
import { Label } from '../../../Components/ui/label';
import { Checkbox } from '../../../Components/ui/checkbox';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../../Components/ui/card';
import { SocialAuth } from '../../../Components/auth/SocialAuth';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await authApi.login(formData.email, formData.password);

      if (!data.isEmailVerified) {
        router.replace(
          `/auth/verify-email?email=${encodeURIComponent(formData.email)}&accessToken=${data.accessToken}`
        );
        return;
      }

      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      await new Promise(resolve => setTimeout(resolve, 100));
      router.replace('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b  to-white p-4 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Sign in to your account</CardTitle>
          <CardDescription>
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/sign-up"
              className="font-medium text-blue-900 hover:text-emerald-500"
            >
              Sign up
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="focus-visible:ring-blue-900 focus-visible:ring-offset-0"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="focus-visible:ring-blue-900 focus-visible:ring-offset-0"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">


              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-blue-900 hover:text-emerald-500"
              >
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-900 hover:bg-emerald-500"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          
        </CardContent>
      </Card>
    </div>
  );
}
