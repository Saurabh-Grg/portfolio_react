import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authService.getMe();
          setUser(response.user);
        } catch (err) {
          console.error('Failed to verify token:', err);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    console.log('🔐 AuthContext: Attempting login for', email);
    try {
      const response = await authService.login(email, password);
      const { token, user } = response;

      console.log('✅ AuthContext: Login successful, storing token');
      localStorage.setItem('authToken', token);
      setUser(user);

      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      console.error('❌ AuthContext: Login failed -', errorMessage);
      console.error('🔍 Full error:', err);
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register(email, password);
      const { token, user } = response;

      localStorage.setItem('authToken', token);
      setUser(user);

      toast({
        title: 'Registration successful',
        description: 'Welcome to your portfolio!',
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'See you next time!',
    });
  }, [toast]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
