import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "@/lib/supabase";
import { Customer } from "@shared/schema";

interface AuthContextType {
  user: Customer | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: { firstName: string; lastName: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for Supabase session on mount
    const initializeAuth = async () => {
      try {
        const { data } = await authService.getSession();
        if (data.session?.user) {
          const userProfile = {
            id: data.session.user.id,
            email: data.session.user.email || '',
            firstName: data.session.user.user_metadata?.firstName || '',
            lastName: data.session.user.user_metadata?.lastName || '',
            phone: data.session.user.user_metadata?.phone || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Customer;
          setUser(userProfile);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userProfile = {
            id: session.user.id,
            email: session.user.email || '',
            firstName: session.user.user_metadata?.firstName || '',
            lastName: session.user.user_metadata?.lastName || '',
            phone: session.user.user_metadata?.phone || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } as Customer;
          setUser(userProfile);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await authService.signIn(email, password);
      
      if (error) {
        throw new Error(error.message || "Login failed");
      }

      if (data.user) {
        const userProfile = {
          id: data.user.id,
          email: data.user.email || '',
          firstName: data.user.user_metadata?.firstName || '',
          lastName: data.user.user_metadata?.lastName || '',
          phone: data.user.user_metadata?.phone || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Customer;
        setUser(userProfile);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
    phone?: string 
  }) => {
    setIsLoading(true);
    try {
      const { data, error } = await authService.signUp(userData.email, userData.password, userData);
      
      if (error) {
        throw new Error(error.message || "Signup failed");
      }

      if (data.user) {
        const userProfile = {
          id: data.user.id,
          email: data.user.email || '',
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Customer;
        setUser(userProfile);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if signOut fails
      setUser(null);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    isLoading,
  };

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