import axios from 'axios';
import { UserDetails } from '../../types/user/user-details.interface';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
});

export const authApi = {
  async login(email: string, password: string) {
    const { data } = await api.post('/api/auth/login', { email, password });

    if (!data.success) {
      throw new Error(data.message || 'Failed to sign in');
    }

    return data.data;
  },

  async register(name: string, email: string, password: string) {
    const { data } = await api.post('/api/auth/register', { name, email, password });

    return data;
  },

  async getUserDetails(accessToken: string): Promise<UserDetails> {
    const { data } = await api.get('/api/auth/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      name: data.data.name,
      email: data.data.email,
      profilePicture: data.data.profilePicture,
      registrationType: data.data.registrationType,
      emailVerified: data.data.isEmailVerified,
    };
  },

  async logout(accessToken: string): Promise<void> {
    await api.post('/api/auth/logout', null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  async resendVerification(email: string, accessToken: string) {
    const { data } = await api.post(
      '/api/auth/resend-verification',
      { email },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return data;
  },

  async verifyEmail(token: string) {
    const { data } = await api.get(`/api/auth/verify-email/${token}`);

    return {
      success: data.success,
      message: data.message,
      accessToken: data.data?.accessToken,
      refreshToken: data.data?.refreshToken,
    };
  },

  async refreshToken(refreshToken: string) {
    const { data } = await api.post('/api/auth/refresh', { refreshToken });

    return data;
  },
};
