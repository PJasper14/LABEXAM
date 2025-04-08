import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState } from '../types';

// Mock user data
const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    isLoggedIn: false
  },
  {
    id: 2,
    username: 'customer1',
    email: 'customer1@example.com',
    password: 'customer123',
    role: 'customer',
    isLoggedIn: false
  }
];

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isAdmin: false
  });

  const login = (email: string, password: string) => {
    const user = mockUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      setState({
        user: { ...user, isLoggedIn: true },
        isAuthenticated: true,
        isAdmin: user.role === 'admin'
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isAdmin: false
    });
  };

  const register = (username: string, email: string, password: string) => {
    // Check if user already exists
    const userExists = mockUsers.some(user => user.email === email);
    
    if (userExists) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: mockUsers.length + 1,
      username,
      email,
      password,
      role: 'customer',
      isLoggedIn: true
    };
    
    mockUsers.push(newUser);
    
    setState({
      user: newUser,
      isAuthenticated: true,
      isAdmin: false
    });
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}; 