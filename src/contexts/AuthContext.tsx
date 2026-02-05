// Context de autenticación
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Tejedor } from '@/types/models';

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
    // Simular autenticación hardcoded temporal
    if (usuario === 'carlos_admin' && password === '1') {
      const adminUser: Tejedor = {
        cedulaTejedor: '11111111',
        nombreTejedor: 'Carlos',
        apellidoTejedor: 'Ramírez',
        fechaNacimiento: '1985-05-20',
        direccionTejedor: 'Av. Principal, Edificio Salud',
        telefonoTejedor: '0414-1111111',
        correoTejedor: 'carlos.ramirez@salud.gob.ve',
        profesionTejedor: 'Médico',
        fechaIngreso: '2020-01-10',
        tipoVoluntario: 'Permanente',
      };
      setUser(adminUser);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasRole = (roles: string[]): boolean => {
    return !!user;
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
