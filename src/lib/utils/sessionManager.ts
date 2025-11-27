
// src/lib/utils/sessionManager.ts

export enum PersistenceType {
  Cookie = 'cookie',
  LocalStorage = 'localStorage',
}

interface SessionManagerOptions {
  persistenceType: PersistenceType;
  cookieName?: string; // Required if persistenceType is Cookie
}

const DEFAULT_COOKIE_NAME = 'session_token';

function setCookie(name: string, value: string, days: number) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/; Secure; SameSite=Lax';
}

function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name: string) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export class SessionManager {
  private persistenceType: PersistenceType;
  private cookieName: string;

  constructor(options: SessionManagerOptions) {
    this.persistenceType = options.persistenceType;
    this.cookieName = options.cookieName || DEFAULT_COOKIE_NAME;

    if (this.persistenceType === PersistenceType.Cookie && !options.cookieName) {
      console.warn(`No cookieName provided for PersistenceType.Cookie. Using default: ${DEFAULT_COOKIE_NAME}`);
    }
  }

  public setToken(token: string, expiresDays?: number): void {
    if (typeof window === 'undefined') {
      // Server-side, do nothing for now or consider alternative handling
      return;
    }

    if (this.persistenceType === PersistenceType.Cookie) {
      setCookie(this.cookieName, token, expiresDays || 7); // Default 7 days for cookies
    } else {
      localStorage.setItem('session_token', token);
    }
  }

  public getToken(): string | null {
    if (typeof window === 'undefined') {
      // Server-side, do nothing for now or consider alternative handling
      return null;
    }

    if (this.persistenceType === PersistenceType.Cookie) {
      return getCookie(this.cookieName);
    } else {
      return localStorage.getItem('session_token');
    }
  }

  public clearToken(): void {
    if (typeof window === 'undefined') {
      // Server-side, do nothing for now or consider alternative handling
      return;
    }

    if (this.persistenceType === PersistenceType.Cookie) {
      eraseCookie(this.cookieName);
    } else {
      localStorage.removeItem('session_token');
    }
  }
}
