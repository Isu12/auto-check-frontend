// app/auth/actions/logout.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authApi } from '../services/auth/auth';

export async function logout() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  try {
    if (!accessToken?.value) throw new Error('No access token');
    await authApi.logout(accessToken.value);
  } catch (error) {
    console.error('Logout error:', error);
  }

  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('userId');
  redirect('/auth/sign-in');
}
