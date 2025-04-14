"use client"
import { useState } from 'react';
import ConfirmationDialog from '@/components/UserConfirmationDialog';
import { UserDetails } from '../../auth/types/user/user-details.interface';
import { authApi } from '../../auth/services/auth/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../auth/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useAuthToken } from "@/app/auth/hooks/accessHook";
import { toast } from 'react-toastify';
import axios from 'axios';

interface DashboardCardsProps {
  user: UserDetails;
  business: any; // replace with correct type
  userId: string;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ user, business, userId }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const accessToken = useAuthToken();

  const handleDeleteAccount = async () => {
    if (!accessToken) {
      toast.error('Authentication token is missing');
      return;
    }

    setIsDeleting(true);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/delete-account/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      toast.success('Account deleted successfully');
      
      await authApi.logout(accessToken);
      router.push('/profile/goodbye');
      
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* User Profile Card */}
      <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
              <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">User Profile</CardTitle>
              <CardDescription className="text-sm">Your personal account information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {user ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DetailItem label="Full Name" value={user.name} />
                <DetailItem label="Email" value={user.email} />
                <DetailItem label="Role" value={user.role || 'Not specified'} />
                <div className="space-y-1.5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Status</p>
                  <span className="inline-flex items-center gap-x-1.5 py-1 px-3 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Active
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  className="mt-6"
                  disabled={isDeleting}
                  onClick={() => setIsDialogOpen(true)}
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              Error loading user details. Please try refreshing the page.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost."
        confirmText={isDeleting ? "Deleting..." : "Delete Account"}
        cancelText="Cancel"
        isProcessing={isDeleting}
        confirmButtonVariant="destructive"
      />

      {/* Business Information Card */}
      {business && (
        <>
          <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30">
                  <BuildingIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Business Information</CardTitle>
                  <CardDescription className="text-sm">Your company details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DetailItem label="Business Name" value={business.name} />
                <DetailItem label="Industry" value={business.type} />
                <DetailItem label="Business Registration Number" value={business.registrationNumber} />
                <DetailItem label="Contact Email" value={business.email} />
                <DetailItem label="Phone" value={business.contactDetails} />
                <DetailItem label="Website" value={business.website || 'Not specified'} />
              </div>
            </CardContent>
          </Card>

          {/* Business Branches Card */}
          {business.branches?.length > 0 && (
            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30">
                    <MapPinIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">Business Branches</CardTitle>
                    <CardDescription className="text-sm">Your company locations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {business.branches.map((branch: any, index: number) => (
                    <div
                      key={index}
                      className="border rounded-xl p-5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <DetailItem label="Branch Name" value={branch.name} highlight />
                        <DetailItem label="Contact" value={branch.contactDetails} />
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                          <div className="text-gray-900 dark:text-white">
                            <p>{branch.address}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{`${branch.city}, ${branch.postalCode}`}</p>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Services Offered</p>
                          <div className="flex flex-wrap gap-2">
                            {branch.servicesOffered?.length > 0 ? (
                              branch.servicesOffered.map((service: string, i: number) => (
                                <span
                                  key={i}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                >
                                  {service}
                                </span>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400">No services specified</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

// Reusable detail component
const DetailItem = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="space-y-1.5">
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <p className={`${highlight ? 'font-medium' : ''} text-gray-900 dark:text-white`}>{value}</p>
  </div>
);

// Icons
const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default DashboardCards;