import { Notification, ApiResponse, PaginatedResponse } from '@/types';
import { apiClient } from './apiClient';

class NotificationService {
  async getNotifications(limit: number = 50, offset: number = 0): Promise<Notification[]> {
    try {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<Notification>>>(
        `/notifications?limit=${limit}&offset=${offset}`
      );
      
      if (!response.data.success || !response.data.data) {
        throw new Error('Error al cargar notificaciones');
      }
      
      return response.data.data.data;
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      throw new Error('Error al cargar notificaciones');
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>(`/notifications/${notificationId}/read`);
      
      if (!response.data.success) {
        throw new Error('Error al marcar notificación como leída');
      }
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      throw new Error('Error al marcar notificación como leída');
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      const response = await apiClient.put<ApiResponse<void>>('/notifications/read-all');
      
      if (!response.data.success) {
        throw new Error('Error al marcar todas las notificaciones como leídas');
      }
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Error al marcar todas las notificaciones como leídas');
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`/notifications/${notificationId}`);
      
      if (!response.data.success) {
        throw new Error('Error al eliminar notificación');
      }
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      throw new Error('Error al eliminar notificación');
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
      
      if (!response.data.success || response.data.data === undefined) {
        throw new Error('Error al obtener contador de notificaciones');
      }
      
      return response.data.data.count;
    } catch (error: any) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }

  // Método para simular notificaciones en desarrollo
  async simulateNotification(type: 'new_ticket' | 'ticket_assigned' | 'ticket_updated' | 'ticket_closed'): Promise<Notification> {
    const mockNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: this.getNotificationTitle(type),
      message: this.getNotificationMessage(type),
      userId: 'current-user', // Se reemplazará con el ID real del usuario
      ticketId: 'SBDI/0001/2025',
      isRead: false,
      createdAt: new Date()
    };

    return mockNotification;
  }

  private getNotificationTitle(type: string): string {
    switch (type) {
      case 'new_ticket':
        return 'Nuevo ticket creado';
      case 'ticket_assigned':
        return 'Ticket asignado';
      case 'ticket_updated':
        return 'Ticket actualizado';
      case 'ticket_closed':
        return 'Ticket cerrado';
      default:
        return 'Notificación';
    }
  }

  private getNotificationMessage(type: string): string {
    switch (type) {
      case 'new_ticket':
        return 'Se ha creado un nuevo ticket que requiere atención';
      case 'ticket_assigned':
        return 'Se te ha asignado un nuevo ticket para resolver';
      case 'ticket_updated':
        return 'Un ticket ha sido actualizado con nueva información';
      case 'ticket_closed':
        return 'Un ticket ha sido cerrado exitosamente';
      default:
        return 'Tienes una nueva notificación';
    }
  }
}

export const notificationService = new NotificationService();