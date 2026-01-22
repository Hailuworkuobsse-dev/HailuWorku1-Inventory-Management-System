import api from '@/lib/axios';
import { Supplier } from '@/types/master-data.types';
import { SupplierDetail, SupplierMetrics } from '@/types/supplier.types';
import { PaginatedResponse } from './material.service';

export interface SupplierFilters {
  search?: string;
  status?: 'ACTIVE' | 'BLACKLISTED';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateSupplierData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

class SupplierService {
  private readonly basePath = '/suppliers';

  async getAll(filters?: SupplierFilters): Promise<PaginatedResponse<Supplier>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get<PaginatedResponse<Supplier>>(
      `${this.basePath}?${params.toString()}`
    );
    return response.data;
  }

  async getById(id: string): Promise<SupplierDetail> {
    const response = await api.get<SupplierDetail>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateSupplierData): Promise<Supplier> {
    const response = await api.post<Supplier>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: Partial<CreateSupplierData>): Promise<Supplier> {
    const response = await api.patch<Supplier>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.basePath}/${id}`);
  }

  async getMetrics(id: string): Promise<SupplierMetrics> {
    const response = await api.get<SupplierMetrics>(`${this.basePath}/${id}/metrics`);
    return response.data;
  }

  async blacklist(id: string, reason: string): Promise<Supplier> {
    const response = await api.post<Supplier>(`${this.basePath}/${id}/blacklist`, { reason });
    return response.data;
  }

  async activate(id: string): Promise<Supplier> {
    const response = await api.post<Supplier>(`${this.basePath}/${id}/activate`);
    return response.data;
  }

  async getPerformanceHistory(id: string, period: 'monthly' | 'quarterly' | 'yearly'): Promise<{
    date: string;
    score: number;
    deliveryOnTime: number;
    qualityScore: number;
  }[]> {
    const response = await api.get(`${this.basePath}/${id}/performance-history`, {
      params: { period },
    });
    return response.data;
  }
}

export const supplierService = new SupplierService();
