import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserDetails } from '../auth/types/user/user-details.interface';
import { authApi } from '../auth/services/auth/auth';
import ServiceStationForm from '../ServiceStation/Component/ServiceStationForm';
import DashboardCards from './component/profileDashboard';
import "bootstrap/dist/css/bootstrap.min.css";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    redirect('/auth/sign-in');
  }

  let user: UserDetails;
  try {
    user = await authApi.getUserDetails(accessToken.value);

    // Add validation for user ID
    if (!user?._id) {
      throw new Error('User ID not found');
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    redirect('/auth/sign-in');
  }

  const business = user?.business || null;

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="py-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <div className="flex gap-4">
                {/* Pass user.id as a prop to ServiceStationForm */}
                <ServiceStationForm user={user} />
              </div>
            </div>
          </header>

          <main className="py-6 space-y-6">
            <DashboardCards
              user={user}
              business={user.business || null}
              userId={user._id} // Directly pass the _id
            />

            {/* Delete Account button at the bottom */}
            {/* <div className="flex justify-end">
              <Button variant="outline" className="mt-6">Delete Account</Button>
            </div> */}
          </main>
        </div>
      </div>
    </div>
  );
}
