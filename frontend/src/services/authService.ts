import { User, LoginCredentials, ApiResponse } from '@/types';
import { apiClient } from './apiClient';


interface LoginResponse {
  user: User;
  token: string;
}

class AuthService {


  async login(credentials: LoginCredentials): Promise<LoginResponse> {


    try {
      const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Error al iniciar sesión');
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error de conexión. Verifique su internet.');
    }
  }

  async verifyToken(token: string): Promise<User> {


    try {
      const response = await apiClient.get<ApiResponse<User>>('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.data.success || !response.data.data) {
        throw new Error('Token inválido');
      }
      
      return response.data.data;
    } catch (error) {
      throw new Error('Token expirado o inválido');
    }
  }

  async changePassword(oldPassword: string, newPassword: string, userId?: string): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>('/auth/change-password', {
        oldPassword,
        newPassword,
        userId
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al cambiar contraseña');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al cambiar contraseña');
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>('/auth/reset-password', {
        email
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al enviar email de recuperación');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error al enviar email de recuperación');
    }
  }

  logout(): void {
    // Limpiar localStorage se maneja en el contexto de auth
    // Aquí podríamos hacer una llamada al servidor para invalidar el token
  }
}

export const authService = new AuthService();