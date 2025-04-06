import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserDetails } from '../auth/types/user/user-details.interface';
import { authApi } from '../auth/services/auth/auth';
import UserDetailsDialog from './userDetailsDialog';

export default async function Dashboard() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  let user: UserDetails | null = null;

  try {
    user = await authApi.getUserDetails(accessToken!.value);
  } catch (error) {
    console.error('Error fetching user details:', error);
    redirect('/auth/sign-in');
  }

  async function logout() {
    'use server';

    try {
      if (!accessToken?.value) throw new Error('No access token');
      await authApi.logout(accessToken.value);
    } catch (error) {
      console.error('Logout error:', error);
    }

    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    cookieStore.delete('userId');
    redirect('/auth/sign-in');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <div className="flex gap-4">
      
              <form action={logout}>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:ring-offset-gray-900"
                >
                  <svg
                    className="-ml-0.5 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="py-6">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            {user ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h2>
                </div>
    
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                Error loading user details. Please try refreshing the page.
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}