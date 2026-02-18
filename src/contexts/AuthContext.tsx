import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { supabase } from '@/lib/safeSupabaseClient';
import { User, Session } from '@supabase/supabase-js';

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
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initStarted = useRef(false);

  // Fetch user profile from database
  const fetchUserProfile = async (authUserId: string): Promise<AuthUser | null> => {
    try {
      // Get user from usuarios table
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .select(`
          id,
          email,
          nome,
          cliente_id,
          status,
          clientes (
            id,
            nome
          )
        `)
        .eq('auth_user_id', authUserId)
        .eq('status', 'ativo')
        .single();

      if (usuarioError || !usuario) {
        console.error('[Auth] User not found in usuarios table:', usuarioError);
        return null;
      }

      // Get user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', usuario.id);

      if (rolesError) {
        console.error('[Auth] Error fetching roles:', rolesError);
      }

      const userRoles = roles?.map(r => r.role) || ['user'];
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

  // Initialize auth state
  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;

    const initialize = async () => {
      try {
        console.info('[Auth] Checking existing session...');
        
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession?.user) {
          setSession(existingSession);
          const userProfile = await fetchUserProfile(existingSession.user.id);
          if (userProfile) {
            setUser(userProfile);
            console.info('[Auth] Session restored:', userProfile.email);
          } else {
            // User authenticated but not in usuarios table
            console.warn('[Auth] Authenticated user not found in usuarios table');
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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.info('[Auth] Auth state changed:', event);
        
        setSession(newSession);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'SIGNED_IN' && newSession?.user) {
          // Defer to avoid deadlock
          setTimeout(async () => {
            const userProfile = await fetchUserProfile(newSession.user.id);
            if (userProfile) {
              setUser(userProfile);
            }
          }, 0);
        } else if (event === 'PASSWORD_RECOVERY') {
          // User clicked password reset link
          console.info('[Auth] Password recovery mode');
        }
      }
    );

    return () => subscription.unsubscribe();
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
        console.error('[Auth] Login error:', authError);
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

      // Fetch user profile
      const userProfile = await fetchUserProfile(data.user.id);
      
      if (!userProfile) {
        await supabase.auth.signOut();
        const errorMessage = 'Usuário não cadastrado no sistema. Contate o administrador.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      setUser(userProfile);
      console.info('[Auth] Login successful:', userProfile.email);
      
      return { success: true };
    } catch (err) {
      console.error('[Auth] Login exception:', err);
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
      setSession(null);
      console.info('[Auth] Logout complete');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        console.error('[Auth] Password reset error:', resetError);
        return { success: false, error: 'Erro ao enviar email de recuperação' };
      }

      return { success: true };
    } catch (err) {
      console.error('[Auth] Password reset exception:', err);
      return { success: false, error: 'Erro ao enviar email de recuperação' };
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error('[Auth] Password update error:', updateError);
        return { success: false, error: 'Erro ao atualizar senha' };
      }

      return { success: true };
    } catch (err) {
      console.error('[Auth] Password update exception:', err);
      return { success: false, error: 'Erro ao atualizar senha' };
    }
  };

  const clearError = () => setError(null);

  const value: AuthContextType = {
    user,
    session,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin ?? false,
    isLoading,
    error,
    login,
    logout,
    resetPassword,
    updatePassword,
    clearError,
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
