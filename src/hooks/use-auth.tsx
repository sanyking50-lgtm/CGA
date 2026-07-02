"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  avatarUrl: string | null;
  role: string;
  level: string;
  points: number;
  ordersCount: number;
  streakCount: number;
  referralCode: string | null;
  countryCode: string;
  locale: string;
  currency: string;
  isVerified: boolean;
  isFreeTrialUsed: boolean;
  badges: unknown[];
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    referralCode?: string;
    countryCode?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Fetch current user on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setState({ user: data.user, isLoading: false, isAuthenticated: true });
          return;
        }
        const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
        if (cancelled) return;
        if (refreshRes.ok) {
          const meRes = await fetch("/api/auth/me");
          if (cancelled) return;
          if (meRes.ok) {
            const data = await meRes.json();
            if (!cancelled) setState({ user: data.user, isLoading: false, isAuthenticated: true });
            return;
          }
        }
        if (!cancelled) setState({ user: null, isLoading: false, isAuthenticated: false });
      } catch {
        if (!cancelled) setState({ user: null, isLoading: false, isAuthenticated: false });
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setState({ user: data.user, isLoading: false, isAuthenticated: true });
        return;
      }
      const refreshRes = await fetch("/api/auth/refresh", { method: "POST" });
      if (refreshRes.ok) {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const data = await meRes.json();
          setState({ user: data.user, isLoading: false, isAuthenticated: true });
          return;
        }
      }
      setState({ user: null, isLoading: false, isAuthenticated: false });
    } catch {
      setState({ user: null, isLoading: false, isAuthenticated: false });
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    setState({
      user: data.user,
      isLoading: false,
      isAuthenticated: true,
    });
  }, []);

  const register = useCallback(
    async (regData: {
      name: string;
      email: string;
      password: string;
      referralCode?: string;
      countryCode?: string;
    }) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setState({
        user: data.user,
        isLoading: false,
        isAuthenticated: true,
      });
    },
    []
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setState({ user: null, isLoading: false, isAuthenticated: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}