
import { Equipment, CreateEquipmentForm } from '@/types';
import { apiClient } from './apiClient';

export const equipmentService = {
  async getEquipment(params: { page?: number; limit?: number; search?: string; type?: string; status?: string; location?: string } = {}): Promise<{ data: Equipment[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.type) queryParams.append('type', params.type);
    if (params.status) queryParams.append('status', params.status);
    if (params.location) queryParams.append('location', params.location);

    const res = await apiClient.get<{ success: boolean; data: Equipment[]; pagination: any }>(`/equipment?${queryParams.toString()}`);
    return { data: res.data.data, pagination: res.data.pagination };
  },
  async getEquipmentById(id: string): Promise<Equipment | null> {
    const res = await apiClient.get<Equipment>(`/equipment/${id}`);
    return res.data;
  },
  async createEquipment(data: CreateEquipmentForm): Promise<Equipment> {
    const res = await apiClient.post<Equipment>('/equipment', data);
    return res.data;
  },
  async updateEquipment(id: string, data: CreateEquipmentForm): Promise<Equipment> {
    const res = await apiClient.put<Equipment>(`/equipment/${id}`, data);
    return res.data;
  },
  async deleteEquipment(id: string): Promise<void> {
    await apiClient.delete(`/equipment/${id}`);
  },
  async assignEquipment(equipmentId: string, userId: string): Promise<Equipment> {
    const res = await apiClient.post<Equipment>(`/equipment/${equipmentId}/assign`, { userId });
    return res.data;
  },
  async unassignEquipment(equipmentId: string): Promise<Equipment> {
    const res = await apiClient.post<Equipment>(`/equipment/${equipmentId}/unassign`);
    return res.data;
  },
  async changeEquipmentStatus(equipmentId: string, status: Equipment['status']): Promise<Equipment> {
    const res = await apiClient.patch<Equipment>(`/equipment/${equipmentId}/status`, { status });
    return res.data;
  },
  async searchEquipment(query: string): Promise<Equipment[]> {
    const res = await apiClient.get<Equipment[]>(`/equipment/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
  async getEquipmentByType(type: string): Promise<Equipment[]> {
    const res = await apiClient.get<Equipment[]>(`/equipment/type/${type}`);
    return res.data;
  },
  async getEquipmentByStatus(status: string): Promise<Equipment[]> {
    const res = await apiClient.get<Equipment[]>(`/equipment/status/${status}`);
    return res.data;
  },
  async getEquipmentByLocation(location: string): Promise<Equipment[]> {
    const res = await apiClient.get<Equipment[]>(`/equipment/location/${location}`);
    return res.data;
  },
  async getEquipmentByUser(userId: string): Promise<Equipment[]> {
    const res = await apiClient.get<Equipment[]>(`/equipment/user/${userId}`);
    return res.data;
  },
  async getEquipmentWithExpiringWarranty(): Promise<Equipment[]> {
    const res = await apiClient.get<Equipment[]>('/equipment/warranty/expiring');
    return res.data;
  },
  async getEquipmentStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    warrantyExpiring: number;
    warrantyExpired: number;
  }> {
    const res = await apiClient.get('/equipment/statistics');
    return res.data;
  }
};