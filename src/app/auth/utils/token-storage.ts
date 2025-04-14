import { CookieOptions } from "../types/cookies/cookies-option.interface";
import { getCookie, removeCookie, setCookie } from "./cookies";
import { useRouter } from "next/router"; // Assuming you're using Next.js for routing

export const tokenStorage = {
  defaultOptions: {
    maxAge: 4 * 60 * 60, // Default to 4 hours for refresh token or others
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
      // Set access token with 1-hour expiration (3600 seconds)
      setCookie('accessToken', accessToken, {
        ...tokenOptions,
        maxAge: 300 * 60,
      });

      // Set refresh token with default maxAge (4 hours here, adjust as needed)
      setCookie('refreshToken', refreshToken, {
        ...tokenOptions,
        maxAge: tokenOptions.maxAge, // Using default or adjust this
      });
    } catch (error) {
      console.error('Error setting tokens:', error);
      throw new Error('Failed to set authentication tokens');
    }
  },

  getTokens() {
    try {
      const accessToken = getCookie('accessToken');
      const refreshToken = getCookie('refreshToken');
      
      // Check if the access token is expired (you can add more advanced expiry logic here)
      if (accessToken && this.isTokenExpired(accessToken)) {
        this.clearTokens(); // Clear expired tokens
        this.redirectToSignIn(); // Navigate to the sign-in page
        return { accessToken: null, refreshToken: null };
      }

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return { accessToken: null, refreshToken: null };
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

  isTokenExpired(token: string): boolean {
    try {
      // Decode the token and check the expiration (you can use a library like jwt-decode if the token is JWT)
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      const exp = decodedToken.exp * 1000; // Convert exp to milliseconds
      return Date.now() > exp; // Compare current time with token expiration time
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // If there's an error, treat the token as expired
    }
  },

  redirectToSignIn() {
    const router = useRouter();
    router.push('/auth/sign-in'); // Redirect to the sign-in page
  },
};
