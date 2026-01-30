import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario } from '@/types';

interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Usuario[] = [
  {
    id_usuario: '1',
    id_cliente: 'client-1',
    email: 'admin@analyticspro.com',
    nome: 'Administrador',
    status: 'ativo',
    data_criacao: new Date().toISOString(),
    role: 'admin',
  },
  {
    id_usuario: '2',
    id_cliente: 'client-1',
    email: 'user@empresa.com',
    nome: 'João Silva',
    status: 'ativo',
    data_criacao: new Date().toISOString(),
    role: 'user',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate Azure AD B2C authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password.length >= 6) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
