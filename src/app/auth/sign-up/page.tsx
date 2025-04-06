'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '../services/auth/auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card';
import { toast } from 'sonner';
import { Progress } from '../ui/progress';
import { Eye, EyeOff } from 'lucide-react';

const isPasswordValid = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }

  return { isValid: true, message: 'Password is valid' };
};

const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;

  let strength = 0;

  if (password.length > 6) strength += 20;
  if (password.length > 8) strength += 10;

  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 15;
  if (/\d/.test(password)) strength += 20;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 15;

  return Math.min(100, strength);
};

const getStrengthColor = (strength: number): string => {
  if (strength < 30) return 'bg-red-500';
  if (strength < 60) return 'bg-yellow-500';
  if (strength < 80) return 'bg-blue-500';
  return 'bg-green-500';
};

const getStrengthLabel = (strength: number): string => {
  if (strength < 30) return 'Weak';
  if (strength < 60) return 'Fair';
  if (strength < 80) return 'Good';
  return 'Strong';
};

const getStrengthTextColor = (strength: number): string => {
  if (strength < 30) return 'text-red-500';
  if (strength < 60) return 'text-yellow-500';
  if (strength < 80) return 'text-blue-500';
  return 'text-green-500';
};

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    if (!password) return '';

    const validationResult = isPasswordValid(password);
    return validationResult.isValid ? '' : validationResult.message;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
    setErrors({
      ...errors,
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, formData.confirmPassword),
    });
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPassword = e.target.value;
    setFormData({ ...formData, confirmPassword });
    setErrors({
      ...errors,
      confirmPassword: validateConfirmPassword(formData.password, confirmPassword),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    if (passwordError || confirmPasswordError) {
      setErrors({
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register(formData.name, formData.email, formData.password);
      
      // Show success message
      toast.success('Registration successful! Please sign in.');
      
      // Redirect to login page after successful registration
      router.push('/auth/sign-in');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b  to-white p-4 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Create your account</CardTitle>
          <CardDescription>
            Already have an account?{' '}
            <Link
              href="/auth/sign-in"
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Sign in
            </Link>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name / Busness Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
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
                    onChange={handlePasswordChange}
                    className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${errors.password ? 'border-red-500' : ''}`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Password strength:</span>
                      <span className={`font-medium ${getStrengthTextColor(passwordStrength)}`}>
                        {getStrengthLabel(passwordStrength)}
                      </span>
                    </div>
                    <Progress
                      value={passwordStrength}
                      className="h-1.5"
                      indicatorClassName={getStrengthColor(passwordStrength)}
                    />
                  </div>
                )}
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={
                loading || !!errors.password || !!errors.confirmPassword || passwordStrength < 60
              }
              className="w-full bg-blue-600 hover:bg-emerald-500"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
}
