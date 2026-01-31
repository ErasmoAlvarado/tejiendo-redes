// Context de autenticación
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Tejedor } from '@/types/models';
import { mockTejedores } from '@/lib/mock-data';

interface AuthContextType {
  user: Tejedor | null;
  login: (usuario: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Tejedor | null>(null);

  useEffect(() => {
    // Simular sesión persistente
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (usuario: string, password: string): Promise<boolean> => {
    // Simular autenticación (en producción sería API call)
    const foundUser = mockTejedores.find(
      t => t.usuario === usuario && t.activo
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user || !user.rol) return false;
    return roles.includes(user.rol);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
