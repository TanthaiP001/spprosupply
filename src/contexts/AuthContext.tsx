"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from "react";
import { getCSRFToken, clearCSRFToken, getHeadersWithCSRF } from "@/lib/csrf-client";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User }>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // Load user from server on mount (cookies are httpOnly, so we fetch from API)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const headers = await getHeadersWithCSRF();
        const response = await fetch("/api/users/profile", {
          credentials: 'include',
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    try {
      // Get CSRF token first
      const token = await getCSRFToken();
      
      const response = await fetch("/api/users/login", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          ...(token && { "X-CSRF-Token": token }),
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        const userData = {
          ...data.user,
          role: data.user.role || "user",
        };
        setUser(userData);
        
        // Store CSRF token from response
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        }
        
        return { success: true, user: userData };
      }
      return { success: false };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false };
    }
  }, []);

  const register = useCallback(async (userData: RegisterData): Promise<boolean> => {
    try {
      // Get CSRF token first
      const token = await getCSRFToken();
      
      const response = await fetch("/api/users/register", {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          ...(token && { "X-CSRF-Token": token }),
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        // Auto login after register
        const registeredUser = {
          ...data.user,
          role: data.user.role || "user",
        };
        setUser(registeredUser);
        
        // Store CSRF token from response
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: 'include',
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      clearCSRFToken();
      setCsrfToken(null);
    }
  }, []);

  const updateProfile = useCallback(async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const headers = await getHeadersWithCSRF();
      
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        credentials: 'include',
        headers,
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Update profile error:", error);
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
    }),
    [user, login, register, logout, updateProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

