"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { authService } from "../lib/firebase/auth-service";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      return userData;
    } catch (error: any) {
      throw new Error(error.message || "Email hoặc mật khẩu không đúng");
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const userData = await authService.register(email, password, name);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.message || "Đăng ký thất bại");
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    if (user?.id) {
      try {
        // Get current Firebase user
        const firebaseUser = authService.getCurrentFirebaseUser()
        if (firebaseUser) {
          const userData = await authService.getCurrentUser(firebaseUser)
          if (userData) {
            setUser(userData)
          }
        }
      } catch (error) {
        console.error("Error refreshing user:", error)
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
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
