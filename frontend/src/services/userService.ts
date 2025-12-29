
import { User, CreateUserForm, Department } from '@/types';
import { apiClient } from './apiClient';

export const userService = {
  async getUsers(params: { page?: number; limit?: number; search?: string; role?: string; department?: string; isActive?: string } = {}): Promise<{ data: User[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.department) queryParams.append('department', params.department);
    if (params.isActive) queryParams.append('isActive', params.isActive);

    const res = await apiClient.get<{ success: boolean; data: User[]; pagination: any }>(`/users?${queryParams.toString()}`);
    return { data: res.data.data, pagination: res.data.pagination };
  },
  async getUserById(id: string): Promise<User | null> {
    const res = await apiClient.get<User>(`/users/${id}`);
    return res.data;
  },
  async createUser(data: CreateUserForm): Promise<User> {
    const res = await apiClient.post<User>('/users', data);
    return res.data;
  },
  async updateUser(id: string, data: Omit<CreateUserForm, 'password'>): Promise<User> {
    const res = await apiClient.put<User>(`/users/${id}`, data);
    return res.data;
  },
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
  async changePassword(id: string, newPassword: string): Promise<void> {
    await apiClient.post(`/users/${id}/password`, { password: newPassword });
  },
  async toggleUserStatus(id: string): Promise<User> {
    const res = await apiClient.patch<User>(`/users/${id}/toggle-status`);
    return res.data;
  },
  async searchUsers(query: string): Promise<User[]> {
    const res = await apiClient.get<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
  async getUsersByRole(role: string): Promise<User[]> {
    const res = await apiClient.get<User[]>(`/users/role/${role}`);
    return res.data;
  },
  async getUsersByDepartment(department: string): Promise<User[]> {
    const res = await apiClient.get<User[]>(`/users/department/${department}`);
    return res.data;
  },
  async getDepartments(): Promise<Department[]> {
    const res = await apiClient.get<{ success: boolean; data: Department[] }>(`/users/departments`);
    return res.data.data;
  },
};