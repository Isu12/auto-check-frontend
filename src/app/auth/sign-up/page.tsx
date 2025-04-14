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
import { Eye, EyeOff, Plus, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

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
    business: {
      name: '',
      type: '',
      registrationNumber: '',
      contactDetails: '',
      website: '',
    },
    branches: [
      {
        name: '',
        address: '',
        city: '',
        postalCode: '',
        contactDetails: '',
        servicesOffered: [''],
      },
    ],
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    business: {
      name: '',
      type: '',
      registrationNumber: '',
      contactDetails: '',
      website: '',
    },
    branches: [
      {
        name: '',
        address: '',
        city: '',
        postalCode: '',
        contactDetails: '',
      },
    ],
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

  const validateBusinessFields = () => {
    const newErrors = { ...errors };
    let isValid = true;

    // Validate business fields
    if (!formData.business.name.trim()) {
      newErrors.business.name = 'Business name is required';
      isValid = false;
    } else {
      newErrors.business.name = '';
    }

    if (!formData.business.type) {
      newErrors.business.type = 'Business type is required';
      isValid = false;
    } else {
      newErrors.business.type = '';
    }

    if (!formData.business.registrationNumber.trim()) {
      newErrors.business.registrationNumber = 'Registration number is required';
      isValid = false;
    } else {
      newErrors.business.registrationNumber = '';
    }

    if (!formData.business.contactDetails.trim()) {
      newErrors.business.contactDetails = 'Contact details are required';
      isValid = false;
    } else {
      newErrors.business.contactDetails = '';
    }

    if (!formData.business.website.trim()) {
      newErrors.business.website = 'Website is required';
      isValid = false;
    } else {
      newErrors.business.website = '';
    }

    // Validate branch fields
    formData.branches.forEach((branch, index) => {
      if (!branch.name.trim()) {
        newErrors.branches[index].name = 'Branch name is required';
        isValid = false;
      } else {
        newErrors.branches[index].name = '';
      }

      if (!branch.address.trim()) {
        newErrors.branches[index].address = 'Address is required';
        isValid = false;
      } else {
        newErrors.branches[index].address = '';
      }

      if (!branch.city.trim()) {
        newErrors.branches[index].city = 'City is required';
        isValid = false;
      } else {
        newErrors.branches[index].city = '';
      }

      if (!branch.postalCode.trim()) {
        newErrors.branches[index].postalCode = 'Postal code is required';
        isValid = false;
      } else {
        newErrors.branches[index].postalCode = '';
      }

      if (!branch.contactDetails.trim()) {
        newErrors.branches[index].contactDetails = 'Contact details are required';
        isValid = false;
      } else {
        newErrors.branches[index].contactDetails = '';
      }
    });

    setErrors(newErrors);
    return isValid;
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

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      business: {
        ...formData.business,
        [name]: value,
      },
    });
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const updatedBranches = [...formData.branches];
    updatedBranches[index] = {
      ...updatedBranches[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      branches: updatedBranches,
    });
  };

  const handleServiceChange = (value: string, branchIndex: number, serviceIndex: number) => {
    const updatedBranches = [...formData.branches];
    const updatedServices = [...updatedBranches[branchIndex].servicesOffered];
    updatedServices[serviceIndex] = value;
    updatedBranches[branchIndex].servicesOffered = updatedServices;
    setFormData({
      ...formData,
      branches: updatedBranches,
    });
  };

  const addBranch = () => {
    setFormData({
      ...formData,
      branches: [
        ...formData.branches,
        {
          name: '',
          address: '',
          city: '',
          postalCode: '',
          contactDetails: '',
          servicesOffered: [''],
        },
      ],
    });
    setErrors({
      ...errors,
      branches: [
        ...errors.branches,
        {
          name: '',
          address: '',
          city: '',
          postalCode: '',
          contactDetails: '',
        },
      ],
    });
  };

  const removeBranch = (index: number) => {
    if (formData.branches.length === 1) return;
    const updatedBranches = [...formData.branches];
    updatedBranches.splice(index, 1);
    setFormData({
      ...formData,
      branches: updatedBranches,
    });
  };

  const addService = (branchIndex: number) => {
    const updatedBranches = [...formData.branches];
    updatedBranches[branchIndex].servicesOffered.push('');
    setFormData({
      ...formData,
      branches: updatedBranches,
    });
  };

  const removeService = (branchIndex: number, serviceIndex: number) => {
    const updatedBranches = [...formData.branches];
    if (updatedBranches[branchIndex].servicesOffered.length === 1) return;
    updatedBranches[branchIndex].servicesOffered.splice(serviceIndex, 1);
    setFormData({
      ...formData,
      branches: updatedBranches,
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
        ...errors,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    if (!validateBusinessFields()) {
      return;
    }

    setLoading(true);

    try {
      // First register the user
      const fullRegistrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        business: {
          ...formData.business,
          branches: formData.branches,
        },
      };
      
      await authApi.register(fullRegistrationData);
      
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b to-white p-4 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Create your business account</CardTitle>
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
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
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
                    className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
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

            {/* Business Information Section */}
            <div className="space-y-4 rounded-lg border p-4">
              <h3 className="text-lg font-medium">Business Information</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    name="name"
                    type="text"
                    required
                    value={formData.business.name}
                    onChange={handleBusinessChange}
                    className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${
                      errors.business.name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.business.name && (
                    <p className="text-xs text-red-500">{errors.business.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-type">Business Type</Label>
                  <Select
                    onValueChange={(value: any) =>
                      setFormData({
                        ...formData,
                        business: { ...formData.business, type: value },
                      })
                    }
                    value={formData.business.type}
                  >
                    <SelectTrigger
                      className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${
                        errors.business.type ? 'border-red-500' : ''
                      }`}
                    >
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Insurance Company">Insurance Company</SelectItem>
                      <SelectItem value="Eco Test Center">Eco Test Center</SelectItem>
                      <SelectItem value="Service Center">Service Center</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.business.type && (
                    <p className="text-xs text-red-500">{errors.business.type}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration-number">Registration Number</Label>
                  <Input
                    id="registration-number"
                    name="registrationNumber"
                    type="text"
                    required
                    value={formData.business.registrationNumber}
                    onChange={handleBusinessChange}
                    className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${
                      errors.business.registrationNumber ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.business.registrationNumber && (
                    <p className="text-xs text-red-500">{errors.business.registrationNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-details">Contact Details</Label>
                  <Input
                    id="contact-details"
                    name="contactDetails"
                    type="text"
                    required
                    value={formData.business.contactDetails}
                    onChange={handleBusinessChange}
                    className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${
                      errors.business.contactDetails ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.business.contactDetails && (
                    <p className="text-xs text-red-500">{errors.business.contactDetails}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    required
                    value={formData.business.website}
                    onChange={handleBusinessChange}
                    className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${
                      errors.business.website ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.business.website && (
                    <p className="text-xs text-red-500">{errors.business.website}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Branches Section */}
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Branches</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addBranch}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Branch
                </Button>
              </div>

              {formData.branches.map((branch, branchIndex) => (
                <div
                  key={branchIndex}
                  className="space-y-4 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Branch {branchIndex + 1}</h4>
                    {formData.branches.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBranch(branchIndex)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`branch-name-${branchIndex}`}>Branch Name</Label>
                      <Input
                        id={`branch-name-${branchIndex}`}
                        name="name"
                        type="text"
                        required
                        value={branch.name}
                        onChange={(e) => handleBranchChange(e, branchIndex)}
                        className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${
                          errors.branches[branchIndex]?.name ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.branches[branchIndex]?.name && (
                        <p className="text-xs text-red-500">{errors.branches[branchIndex].name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`branch-address-${branchIndex}`}>Address</Label>
                      <Input
                        id={`branch-address-${branchIndex}`}
                        name="address"
                        type="text"
                        required
                        value={branch.address}
                        onChange={(e) => handleBranchChange(e, branchIndex)}
                        className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${
                          errors.branches[branchIndex]?.address ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.branches[branchIndex]?.address && (
                        <p className="text-xs text-red-500">{errors.branches[branchIndex].address}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`branch-city-${branchIndex}`}>City</Label>
                      <Input
                        id={`branch-city-${branchIndex}`}
                        name="city"
                        type="text"
                        required
                        value={branch.city}
                        onChange={(e) => handleBranchChange(e, branchIndex)}
                        className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${
                          errors.branches[branchIndex]?.city ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.branches[branchIndex]?.city && (
                        <p className="text-xs text-red-500">{errors.branches[branchIndex].city}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`branch-postalCode-${branchIndex}`}>Postal Code</Label>
                      <Input
                        id={`branch-postalCode-${branchIndex}`}
                        name="postalCode"
                        type="text"
                        required
                        value={branch.postalCode}
                        onChange={(e) => handleBranchChange(e, branchIndex)}
                        className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${
                          errors.branches[branchIndex]?.postalCode ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.branches[branchIndex]?.postalCode && (
                        <p className="text-xs text-red-500">
                          {errors.branches[branchIndex].postalCode}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`branch-contactDetails-${branchIndex}`}>
                        Contact Details
                      </Label>
                      <Input
                        id={`branch-contactDetails-${branchIndex}`}
                        name="contactDetails"
                        type="text"
                        required
                        value={branch.contactDetails}
                        onChange={(e) => handleBranchChange(e, branchIndex)}
                        className={`focus-visible:ring-emerald-500 focus-visible:ring-offset-0 ${
                          errors.branches[branchIndex]?.contactDetails ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.branches[branchIndex]?.contactDetails && (
                        <p className="text-xs text-red-500">
                          {errors.branches[branchIndex].contactDetails}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Services Offered */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Services Offered</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addService(branchIndex)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Service
                      </Button>
                    </div>

                    {branch.servicesOffered.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-center space-x-2">
                        <Input
                          value={service}
                          onChange={(e) =>
                            handleServiceChange(e.target.value, branchIndex, serviceIndex)
                          }
                          className="flex-1 focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
                          placeholder="Service name"
                        />
                        {branch.servicesOffered.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeService(branchIndex, serviceIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              disabled={
                loading ||
                !!errors.password ||
                !!errors.confirmPassword ||
                passwordStrength < 60
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