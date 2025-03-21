import { setCookie, removeCookie, getCookie } from '../Utils/cookies';
import { CookieOptions } from '../../Components/types/cookies/cookies-options.interface';

export const tokenStorage = {
  defaultOptions: {
    maxAge: 4 * 60 * 60,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  },

  setTokens(accessToken: string, refreshToken: string, options: CookieOptions = {}) {
    if (!accessToken || !refreshToken) {
      throw new Error('Missing authentication tokens');
    }

    const tokenOptions = {
      ...this.defaultOptions,
      ...options,
    };

    try {
      setCookie('accessToken', accessToken, {
        ...tokenOptions,
        maxAge: 5 * 60,
      });

      setCookie('refreshToken', refreshToken, {
        ...tokenOptions,
        maxAge: tokenOptions.maxAge,
      });
    } catch (error) {
      console.error('Error setting tokens:', error);
      throw new Error('Failed to set authentication tokens');
    }
  },

  getTokens() {
    try {
      return {
        accessToken: getCookie('accessToken'),
        refreshToken: getCookie('refreshToken'),
      };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return {
        accessToken: null,
        refreshToken: null,
      };
    }
  },

  clearTokens() {
    try {
      removeCookie('accessToken');
      removeCookie('refreshToken');
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw new Error('Failed to clear authentication tokens');
    }
  },

  hasValidTokens(): boolean {
    const { accessToken, refreshToken } = this.getTokens();
    return Boolean(accessToken && refreshToken);
  },
};
