// Tipos de usuario y roles
export type UserRole = 'admin' | 'tecnico' | 'usuario' | 'inventario' | 'technician';

// Tipos de permisos
export type PermissionModule = 'dashboard' | 'users' | 'equipment' | 'tickets' | 'reports' | 'profile' | 'permissions' | 'supplies';
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'assign';

export interface Permission {
  id: string;
  name: string;
  module: PermissionModule;
  action: PermissionAction;
  description: string;
  isActive: boolean;
  createdAt: Date;
}

export interface UserPermission {
  id: string;
  userId: string;
  permissionId: string;
  permission?: Permission;
  grantedById: string;
  grantedBy?: User;
  grantedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  employeeNumber: string; // Número de empleado
  role: UserRole;
  department: string;
  departmentId?: string;
  isActive: boolean;
  permissions?: UserPermission[];
  permissionCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  display_name: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de equipo
export type EquipmentType = 'desktop' | 'laptop' | 'printer' | 'server' | 'monitor' | 'other';
export type EquipmentStatus = 'available' | 'assigned' | 'maintenance' | 'retired';

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  brand: string;
  model: string;
  serialNumber: string;
  inventoryNumber: string; // Número de inventario
  processor?: string; // Procesador
  ram?: string; // Memoria RAM
  hardDrive?: string; // Disco Duro
  operatingSystem?: string; // Sistema Operativo
  description?: string;
  notes?: string;
  requirement?: string;
  status: EquipmentStatus;
  location: string;
  assignedUserId?: string;
  assignedUser?: User;
  purchaseDate?: Date;
  warrantyExpiration?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de ticket
export type TicketStatus = 'nuevo' | 'en_proceso' | 'cerrado';
export type TicketPriority = 'baja' | 'media' | 'alta' | 'critica';
export type ServiceType = 'preventivo' | 'correctivo' | 'instalacion';

export interface Ticket {
  id: string;
  ticketNumber: string; // Format: SBDI/0001/2025
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  serviceType: ServiceType;
  reportedById: string;
  reportedBy: User;
  assignedToId?: string;
  assignedTo?: User;
  equipmentId?: string;
  equipment?: Equipment;
  diagnosis?: string;
  solution?: string;
  parts?: string; // JSON string of parts used
  timeSpent?: number; // en minutos
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

// Tipos de notificación
export type NotificationType = 'new_ticket' | 'ticket_assigned' | 'ticket_updated' | 'ticket_closed';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  ticketId?: string;
  isRead: boolean;
  createdAt: Date;
}

// Tipos de reporte
export interface ReportData {
  ticket: Ticket;
  technician: User;
  reportDate: Date;
  serviceType: string;
  proceduresPerformed: string[];
  partsReplaced: string[];
  recommendations: string;
  serviceDuration: number;
}

// Tipos de autenticación
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Tipos de formularios
export interface CreateUserForm {
  username: string;
  email: string;
  fullName: string;
  employeeNumber: string;
  role: UserRole;
  department: string;
  password: string;
}

export interface CreateEquipmentForm {
  name: string;
  type: EquipmentType;
  brand: string;
  model: string;
  serialNumber: string;
  inventoryNumber: string;
  processor?: string;
  ram?: string;
  hardDrive?: string;
  operatingSystem?: string;
  description?: string;
  notes?: string;
  requirement?: string;
  location: string;
  assignedUserId?: string;
  purchaseDate?: string;
  warrantyExpiration?: string;
  status: EquipmentStatus;
}

export interface CreateTicketForm {
  title: string;
  description: string;
  priority: TicketPriority;
  serviceType: ServiceType;
  equipmentId?: string;
}

// Tipos de filtros
export interface TicketFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  department?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface EquipmentFilters {
  status?: EquipmentStatus;
  type?: EquipmentType;
  location?: string;
  assignedTo?: string;
  brand?: string;
}

// Tipos de estadísticas
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  closedTickets: number;
  totalEquipment: number;
  operationalEquipment: number;
  equipmentInRepair: number;
  totalUsers: number;
  activeUsers: number;
  averageResolutionTime: number; // en horas
}

// Tipos de respuesta API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos de configuración
export interface AppConfig {
  apiUrl: string;
  socketUrl: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  ticketNumberFormat: string;
  companyInfo: {
    name: string;
    fullName: string;
    address: string;
    phone: string;
    email: string;
  };
}