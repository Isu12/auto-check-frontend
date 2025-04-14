import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useAuthToken = () => {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (!token) {
      window.location.href = '/auth/sign-in';  // Redirect if token is missing
    } else {
      setAccessToken(token);
    }
  }, []);

  return accessToken;
};