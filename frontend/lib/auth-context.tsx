"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, AuthResponse } from "@/types/user";
import { api, ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    roomNumber: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("laundry_token");
      const storedUser = localStorage.getItem("laundry_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to restore authentication state:", e);
      localStorage.removeItem("laundry_token");
      localStorage.removeItem("laundry_user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("laundry_token", data.token);
    localStorage.setItem("laundry_user", JSON.stringify(data.user));
  };

  const login = async (email: string, password: string) => {
    const data = await api.auth.login({ email, password });
    handleAuthSuccess(data);
    router.push("/dashboard");
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    roomNumber: string;
  }) => {
    const data = await api.auth.register(payload);
    handleAuthSuccess(data);
    router.push("/dashboard");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("laundry_token");
    localStorage.removeItem("laundry_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === "ADMIN",
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
