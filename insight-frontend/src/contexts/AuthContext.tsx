import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
  cliente_id: string;
  cliente_nome?: string;
  roles: string[];
  is_admin: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initStarted = useRef(false);

  const fetchUserProfile = async (authUserId: string): Promise<AuthUser | null> => {
    try {
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .select(`id, email, nome, cliente_id, status, clientes (id, nome)`)
        .eq('auth_user_id', authUserId)
        .eq('status', 'ativo')
        .single();

      if (usuarioError || !usuario) {
        console.error('[Auth] User not found in usuarios table:', usuarioError);
        return null;
      }

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', usuario.id);

      if (rolesError) {
        console.error('[Auth] Error fetching roles:', rolesError);
      }

      const userRoles = roles?.map((r: { role: string }) => r.role) || ['user'];
      const isAdmin = userRoles.includes('admin');
      const clienteData = usuario.clientes as { id: string; nome: string } | null;

      return {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        cliente_id: usuario.cliente_id,
        cliente_nome: clienteData?.nome,
        roles: userRoles,
        is_admin: isAdmin,
      };
    } catch (err) {
      console.error('[Auth] Error fetching user profile:', err);
      return null;
    }
  };

  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;

    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          if (userProfile) {
            setUser(userProfile);
          } else {
            await supabase.auth.signOut();
          }
        }
      } catch (err) {
        console.error('[Auth] Initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'SIGNED_IN' && newSession?.user) {
          const userProfile = await fetchUserProfile(newSession.user.id);
          if (userProfile) setUser(userProfile);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        let errorMessage = 'Credenciais inválidas';
        if (authError.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos';
        } else if (authError.message.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
        }
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (!data.user) {
        const errorMessage = 'Erro ao autenticar usuário';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      const userProfile = await fetchUserProfile(data.user.id);
      if (!userProfile) {
        await supabase.auth.signOut();
        const errorMessage = 'Usuário não cadastrado no sistema. Contate o administrador.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      setUser(userProfile);
      return { success: true };
    } catch (err) {
      const errorMessage = 'Erro ao fazer login. Tente novamente.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.is_admin ?? false,
      isLoading,
      error,
      login,
      logout,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
