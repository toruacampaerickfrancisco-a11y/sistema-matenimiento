import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState, LoginCredentials } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Verificar si hay un token guardado al iniciar la aplicación
    const initAuth = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        if (token) {
          const user = await authService.verifyToken(token);
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        // Token inválido o expirado
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.login(credentials);
      
      // Guardar token y usuario en sessionStorage
      sessionStorage.setItem('authToken', response.token);
      sessionStorage.setItem('user', JSON.stringify(response.user));
      
      setState({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return response.user;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    // Limpiar sessionStorage
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (user: User) => {
    sessionStorage.setItem('user', JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};