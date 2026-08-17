'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { AxiosInstance } from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  created_at?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  api: AxiosInstance;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ref for the refresh timer
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Refresh the access token using the httpOnly refresh_token cookie ──────
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      // The refresh_token is sent automatically as an httpOnly cookie
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // sends cookies
      });

      if (!res.ok) {
        clearAuth();
        return null;
      }

      const data = await res.json() as { access_token: string };
      setAccessToken(data.access_token);
      scheduleTokenRefresh(data.access_token);
      return data.access_token;
    } catch {
      clearAuth();
      return null;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Schedule auto-refresh ~60s before the AT expires ─────────────────────
  const scheduleTokenRefresh = useCallback((token: string) => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);

    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { exp: number };
      const expiresAt = payload.exp * 1000; // ms
      const now = Date.now();
      const refreshIn = Math.max(expiresAt - now - 60_000, 0); // 60s buffer
      refreshTimerRef.current = setTimeout(refreshAccessToken, refreshIn);
    } catch {
      // Token unparseable — don't schedule
    }
  }, [refreshAccessToken]);

  // ── Initial mount: try to restore session via refresh cookie ─────────────
  useEffect(() => {
    refreshAccessToken().finally(() => setIsLoading(false));
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [refreshAccessToken]);

  // ── Attach Bearer token to every Axios request ───────────────────────────
  useEffect(() => {
    const reqInterceptor = apiClient.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    });

    // Response interceptor: on 401, attempt refresh then retry once
    const resInterceptor = apiClient.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalReq = error.config as typeof error.config & { _retry?: boolean };
        if (error.response?.status === 401 && !originalReq._retry) {
          originalReq._retry = true;
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalReq.headers['Authorization'] = `Bearer ${newToken}`;
            return apiClient(originalReq);
          } else {
            router.push('/login');
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      apiClient.interceptors.request.eject(reqInterceptor);
      apiClient.interceptors.response.eject(resInterceptor);
    };
  }, [accessToken, refreshAccessToken, router]);

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const res = await apiClient.post<{
      access_token: string;
      refresh_token: string;
      user: AuthUser;
    }>('/auth/login', { email, password }, { withCredentials: true });

    const { access_token, user: authUser } = res.data;
    setAccessToken(access_token);
    setUser(authUser);
    scheduleTokenRefresh(access_token);
    router.push('/dashboard');
  }, [router, scheduleTokenRefresh]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout', {}, { withCredentials: true });
    } finally {
      clearAuth();
      router.push('/login');
    }
  }, [router]);

  function clearAuth() {
    setUser(null);
    setAccessToken(null);
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        logout,
        api: apiClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
