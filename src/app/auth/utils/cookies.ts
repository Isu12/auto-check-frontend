import Cookies from 'js-cookie';
import { CookieOptions } from '../types/cookies/cookies-option.interface';

export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cookie = Cookies.get(name);
    return cookie ?? null;
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return null;
  }
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const { maxAge, secure, sameSite = 'lax', path = '/' } = options;

    Cookies.set(name, value, {
      expires: maxAge ? maxAge / (60 * 60 * 24) : undefined,
      secure,
      sameSite,
      path,
    });
  } catch (error) {
    console.error(`Error setting cookie ${name}:`, error);
  }
}

export function removeCookie(name: string, path = '/') {
  Cookies.remove(name, { path });
}
