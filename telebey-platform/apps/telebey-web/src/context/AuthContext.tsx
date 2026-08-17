import React, {
  createContext, useContext, useState,
  useEffect, useCallback, useRef,
} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  walletAddress?: string;
  walletName?: string;
  walletImage?: string;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  username?: string;
  bio?: string;
  bannerImage?: string;
  role: UserRole;
  isPublic?: boolean;
  createdAt?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => Promise<void>;
}

// ─── Axios Configuration ──────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: import.meta.env.VITE_SYLIUS_API_URL || 'http://localhost:8080/api/v2/shop/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ─── Context ──────────────────────────────────────────────────────────────────

const Ctx = createContext<AuthCtx | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tokenRef = useRef<string | null>(localStorage.getItem('telebey_auth_token'));

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    tokenRef.current = null;
    localStorage.removeItem('telebey_auth_token');
    localStorage.removeItem('telebey_wallet_user');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // ── Fetch Profile ──────────────────────────────────────────────────────────
  const fetchProfile = useCallback(async (token: string) => {
    try {
      const res = await api.get('customers/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const customer = res.data;
      const isAdminFlag = customer.user?.roles?.includes('ROLE_ADMIN') || customer.email.endsWith('@telebey.com');
      
      const syliusUser = {
        id: customer.id.toString(),
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phoneNumber,
        role: isAdminFlag ? 'admin' : 'user',
        createdAt: customer.createdAt,
      };

      // Merge with Firestore data for Telebey-specific fields
      const firestoreRef = doc(db, 'users', syliusUser.id);
      const firestoreSnap = await getDoc(firestoreRef);
      
      if (firestoreSnap.exists()) {
        const firestoreData = firestoreSnap.data();
        setUser({ ...syliusUser, ...firestoreData } as AuthUser);
      } else {
        setUser(syliusUser as AuthUser);
      }
    } catch (err) {
      console.error('Failed to fetch Sylius profile', err);
      logout();
    }
  }, [logout]);

  // Bootstrap on mount
  useEffect(() => {
    const walletUserStr = localStorage.getItem('telebey_wallet_user');
    if (walletUserStr) {
      try {
        const parsedWalletUser = JSON.parse(walletUserStr);
        setUser(parsedWalletUser);
        setIsLoading(false);
        return;
      } catch (e) {
        console.error("Failed to parse wallet user", e);
      }
    }

    if (tokenRef.current) {
      fetchProfile(tokenRef.current).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  // Sync user to Firestore and Heartbeat
  useEffect(() => {
    if (!user) return;

    // 1. Initial Sync
    const syncUser = async () => {
      try {
        await setDoc(doc(db, 'users', user.id), {
          ...user,
          usernameLowercase: user.username?.toLowerCase() || null,
          lastSeen: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.error("Error syncing user to Firestore:", e);
      }
    };
    syncUser();

    // 2. Heartbeat every 2 minutes
    const interval = setInterval(async () => {
      try {
        await setDoc(doc(db, 'users', user.id), {
          lastSeen: serverTimestamp()
        }, { merge: true });
      } catch (e) {
        console.error("Heartbeat failed:", e);
      }
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [user]);

  // Axios interceptors for global API usage
  useEffect(() => {
    const req = api.interceptors.request.use(cfg => {
      if (tokenRef.current) cfg.headers['Authorization'] = `Bearer ${tokenRef.current}`;
      return cfg;
    });
    
    const res = api.interceptors.response.use(r => r, async err => {
      if (err.response?.status === 401) {
        logout();
      }
      return Promise.reject(err);
    });
    
    return () => { 
      api.interceptors.request.eject(req); 
      api.interceptors.response.eject(res); 
    };
  }, [logout]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await api.post('customers/token', { email, password });
      const token = res.data.token;
      
      tokenRef.current = token;
      localStorage.setItem('telebey_auth_token', token);
      
      await fetchProfile(token);
      navigate('/account');
    } catch (err) {
      console.error('Sylius Login Failed', err);
      throw err;
    }
  }, [fetchProfile, navigate]);

  // ── Wallet Login ───────────────────────────────────────────────────────────
  const loginWithWallet = useCallback(async (address: string, name: string, image?: string) => {
    const walletUser: AuthUser = {
      id: address,
      email: `${address.substring(0, 6)}...${address.substring(address.length - 4)}@wallet.local`,
      walletAddress: address,
      walletName: name,
      walletImage: image,
      role: 'user',
      isPublic: true,
      createdAt: new Date().toISOString()
    };
    
    setUser(walletUser);
    localStorage.setItem('telebey_wallet_user', JSON.stringify(walletUser));
    // Clear regular token if any to avoid confusion
    localStorage.removeItem('telebey_auth_token');
    tokenRef.current = null;
    
    navigate('/account');
  }, [navigate]);

  // ── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      await api.post('customers', { 
        email, 
        password, 
        firstName, 
        lastName, 
        subscribedToNewsletter: false 
      });
      await login(email, password);
    } catch (err) {
      console.error('Registration Failed', err);
      throw err;
    }
  }, [login]);

  const updateUser = useCallback(async (updates: Partial<AuthUser>) => {
    if (!user) return;

    const newUser = { ...user, ...updates };
    
    // Update State
    setUser(newUser);
    
    // Update LocalStorage (for bootstrap)
    if (newUser.walletAddress) {
      localStorage.setItem('telebey_wallet_user', JSON.stringify(newUser));
    }
    
    // Sync to Firestore immediately
    try {
      await setDoc(doc(db, 'users', user.id), {
        ...newUser,
        usernameLowercase: newUser.username?.toLowerCase() || null,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.error("Error updating user in Firestore:", e);
    }
  }, [user]);

  const isAdmin = user?.role === 'admin';

  return (
    <Ctx.Provider value={{ user, isAuthenticated: !!user, isAdmin, isLoading, login, loginWithWallet, register, logout, updateUser }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
}
