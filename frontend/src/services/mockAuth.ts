// Mock server para desarrollo del frontend
// Este archivo simula las respuestas de la API para poder desarrollar sin backend

import { User } from '@/types';

// Datos simulados
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@bienestar.sonora.gob.mx',
    fullName: 'Administrador del Sistema',
    employeeNumber: 'EMP001',
    role: 'admin',
    department: 'Sistemas',
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '2',
    username: 'tecnico1',
    email: 'tecnico1@bienestar.sonora.gob.mx',
    fullName: 'Juan Carlos Técnico',
    employeeNumber: 'EMP002',
    role: 'tecnico',
    department: 'Soporte Técnico',
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  },
  {
    id: '3',
    username: 'usuario1',
    email: 'usuario1@bienestar.sonora.gob.mx',
    fullName: 'María López Usuario',
    employeeNumber: 'EMP003',
    role: 'usuario',
    department: 'Recursos Humanos',
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01')
  }
];

// Simular autenticación
export const mockAuth = {
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.username === username);
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // Simular validación de contraseña (en desarrollo todas son válidas)
    const validPasswords: Record<string, string> = {
      'admin': 'admin123',
      'tecnico1': 'tecnico123',
      'usuario1': 'usuario123'
    };
    
    if (validPasswords[username] !== password) {
      throw new Error('Contraseña incorrecta');
    }
    
    return {
      user,
      token: `mock-token-${user.id}-${Date.now()}`
    };
  },
  
  verifyToken: async (token: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Extraer ID del token mock
    const userId = token.split('-')[2];
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('Token inválido');
    }
    
    return user;
  }
};

export default mockAuth;