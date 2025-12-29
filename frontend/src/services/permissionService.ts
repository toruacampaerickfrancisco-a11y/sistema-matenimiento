import { Permission, UserPermission, PermissionModule, PermissionAction } from '@/types';
import { apiClient } from './apiClient';

class PermissionService {
  async getPermissions(): Promise<Permission[]> {
    const res = await apiClient.get<{success: boolean, data: Permission[]}>('/permissions');
    return res.data.data;
  }
  async getPermissionsByModule(module: PermissionModule): Promise<Permission[]> {
    const res = await apiClient.get<{success: boolean, data: Permission[]}>(`/permissions?module=${module}`);
    return res.data.data;
  }
  async getUserPermissions(userId: string): Promise<UserPermission[]> {
    const res = await apiClient.get<UserPermission[]>(`/users/${userId}/permissions`);
    return res.data;
  }
  async hasPermission(userId: string, module: PermissionModule, action: PermissionAction): Promise<boolean> {
    const res = await apiClient.get(`/users/${userId}/permissions/check`, {
      params: { module, action }
    });
    return res.data.hasPermission;
  }
  async hasPermissions(userId: string, permissions: Array<{module: PermissionModule, action: PermissionAction}>): Promise<boolean> {
    const res = await apiClient.post(`/users/${userId}/permissions/check-multiple`, { permissions });
    return res.data.hasAllPermissions;
  }
  async getUserModuleAccess(userId: string): Promise<PermissionModule[]> {
    const res = await apiClient.get(`/users/${userId}/modules`);
    return res.data;
  }
  async assignPermission(userId: string, permissionId: string): Promise<void> {
    await apiClient.post(`/users/${userId}/permissions`, { permissionId });
  }
  
  async assignMultiplePermissions(userId: string, permissionIds: string[], grantedById?: string): Promise<void> {
    await Promise.all(permissionIds.map(permissionId => this.assignPermission(userId, permissionId)));
  }

  async revokePermission(userId: string, permissionId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}/permissions/${permissionId}`);
  }
  async getAllUsersWithPermissions(): Promise<any[]> {
    const res = await apiClient.get<{success: boolean, data: any[]}>('/users/permissions/all');
    return res.data.data;
  }
}

export const permissionService = new PermissionService();