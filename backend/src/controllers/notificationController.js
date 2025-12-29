import { Ticket, ReadNotification } from '../models/index.js';
import { Op } from 'sequelize';

const getNotificationsForUser = async (user) => {
  const notifications = [];
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Historial de 7 días para usuarios

  // 1. Lógica para Técnicos y Administradores
  if (user.rol === 'tecnico' || user.rol === 'admin' || user.role === 'tecnico' || user.role === 'admin' || user.role === 'technician') {
    
    // A. Recordatorio de Tickets Pendientes/Nuevos Antiguos (> 12 horas)
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const oldTickets = await Ticket.findAll({
      where: {
        status: {
          [Op.in]: ['nuevo', 'pendiente']
        },
        created_at: {
          [Op.lt]: twelveHoursAgo
        }
      },
      order: [['created_at', 'ASC']]
    });

    oldTickets.forEach(ticket => {
      notifications.push({
        id: `reminder-${ticket.id}`,
        type: 'ticket_reminder',
        title: `⚠️ Ticket Pendiente: ${ticket.ticket_number}`,
        message: `El ticket "${ticket.title}" lleva más de 12 horas en estado ${ticket.status}.`,
        userId: user.id,
        ticketId: ticket.id,
        isRead: false,
        createdAt: new Date()
      });
    });

    // B. Alerta de Nuevos Tickets (< 24 horas)
    const newTickets = await Ticket.findAll({
      where: {
        status: 'nuevo',
        created_at: { [Op.gte]: twentyFourHoursAgo }
      },
      order: [['created_at', 'DESC']]
    });

    newTickets.forEach(ticket => {
      notifications.push({
        id: `new-${ticket.id}`,
        type: 'ticket_new',
        title: `🆕 Nuevo Ticket: ${ticket.ticket_number}`,
        message: `Se ha reportado un nuevo ticket: "${ticket.title}".`,
        userId: user.id,
        ticketId: ticket.id,
        isRead: false,
        createdAt: ticket.created_at || new Date()
      });
    });
  }

  // 2. Lógica para Usuarios (Reportantes)
  const role = (user.rol || user.role || '').toLowerCase().trim();
  if (['usuario', 'user', 'inventario'].includes(role)) {
    const updatedTickets = await Ticket.findAll({
      where: {
        reported_by_id: user.id,
        // status: { [Op.ne]: 'nuevo' }, // Eliminamos esta restricción para que vean sus tickets nuevos
        updated_at: { [Op.gte]: sevenDaysAgo } // Usamos ventana de 7 días para historial
      },
      order: [['updated_at', 'DESC']]
    });

    updatedTickets.forEach(ticket => {
      let statusText = ticket.status;
      // Formatear estatus para lectura amigable
      if (statusText === 'nuevo') statusText = 'Nuevo (Recibido)';
      else if (statusText === 'en_proceso') statusText = 'En Proceso';
      else if (statusText === 'resuelto') statusText = 'Resuelto';
      else if (statusText === 'cerrado') statusText = 'Cerrado';
      else if (statusText === 'pendiente') statusText = 'Pendiente';
      else statusText = statusText.charAt(0).toUpperCase() + statusText.slice(1);

      // Si es nuevo, el mensaje es diferente
      const isNew = ticket.status === 'nuevo';
      const title = isNew ? `✅ Ticket Recibido: ${ticket.ticket_number}` : `🛠️ Ticket Atendido: ${ticket.ticket_number}`;
      const message = isNew 
        ? `Su ticket "${ticket.title}" ha sido recibido exitosamente.`
        : `Su ticket "${ticket.title}" está siendo atendido. Nuevo estado: ${statusText}.`;

      notifications.push({
        id: `update-${ticket.id}-${new Date(ticket.updated_at).getTime()}`,
        type: isNew ? 'ticket_created' : 'ticket_update',
        title: title,
        message: message,
        userId: user.id,
        ticketId: ticket.id,
        isRead: false,
        createdAt: ticket.updated_at || new Date()
      });
    });
  }
  
  return notifications;
};

const notificationController = {
  async getAllNotifications(ctx) {
    try {
      const user = ctx.state.user;
      console.log(`[Notifications] Fetching for user: ${user.id} (${user.rol})`);
      
      const notifications = await getNotificationsForUser(user);
      console.log(`[Notifications] Generated ${notifications.length} raw notifications`);

      // Obtener notificaciones leídas
      const readNotifications = await ReadNotification.findAll({
        where: { user_id: user.id },
        attributes: ['notification_id']
      });
      const readIds = new Set(readNotifications.map(rn => rn.notification_id));
      console.log(`[Notifications] Found ${readIds.size} read notifications`);

      // Combinar estado de lectura (en lugar de filtrar)
      const finalNotifications = notifications.map(n => ({
        ...n,
        isRead: readIds.has(n.id)
      }));
      console.log(`[Notifications] Returning ${finalNotifications.length} notifications (including read ones)`);

      // Ordenar todas las notificaciones por fecha (más reciente primero)
      finalNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      ctx.body = {
        success: true,
        data: {
          data: finalNotifications,
          pagination: {
            total: finalNotifications.length,
            page: 1,
            limit: 50,
            totalPages: 1
          }
        }
      };
    } catch (error) {
      console.error('Error generating notifications:', error);
      ctx.status = 500;
      ctx.body = { success: false, message: 'Error al generar notificaciones' };
    }
  },

  async markAsRead(ctx) {
    try {
      const { id } = ctx.params;
      const user = ctx.state.user;

      await ReadNotification.findOrCreate({
        where: {
          user_id: user.id,
          notification_id: id
        }
      });

      ctx.body = { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      ctx.status = 500;
      ctx.body = { success: false, message: 'Error al marcar notificación como leída' };
    }
  },

  async markAllAsRead(ctx) {
    try {
      const user = ctx.state.user;
      const notifications = await getNotificationsForUser(user);
      
      const notificationIds = notifications.map(n => n.id);

      for (const id of notificationIds) {
        await ReadNotification.findOrCreate({
          where: {
            user_id: user.id,
            notification_id: id
          }
        });
      }

      ctx.body = { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      ctx.status = 500;
      ctx.body = { success: false, message: 'Error al marcar todas como leídas' };
    }
  },

  async deleteNotification(ctx) {
    return notificationController.markAsRead(ctx);
  }
};

export default notificationController;
