import React, { createContext, useContext, useEffect, useState } from 'react';
import { saveUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage, UserData } from '@/lib/localStorage';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = getUserFromLocalStorage();
    setUser(savedUser);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simple validation - in a real app, this would be handled by a backend
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const userData: UserData = {
      email: user.email,
      name: user.name,
      uid: user.uid,
    };

    setUser(userData);
    saveUserToLocalStorage(userData);
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const existingUser = users.find((u: any) => u.email === email);

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const newUser = {
      email,
      password,
      name,
      uid: Date.now().toString(), // Simple UID generation
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    const userData: UserData = {
      email: newUser.email,
      name: newUser.name,
      uid: newUser.uid,
    };

    setUser(userData);
    saveUserToLocalStorage(userData);
  };

  const signOut = async () => {
    setUser(null);
    removeUserFromLocalStorage();
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};