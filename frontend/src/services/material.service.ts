import api from '@/lib/axios';
import { Material, MaterialStatus, MaterialCategory } from '@/types/master-data.types';

export interface MaterialFilters {
  search?: string;
  category?: MaterialCategory;
  status?: MaterialStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateMaterialData {
  name: string;
  code?: string;
  description?: string;
  category: MaterialCategory;
  unit: string;
  unitPrice?: number;
  reorderLevel?: number;
  status?: MaterialStatus;
}

export interface UpdateMaterialData extends Partial<CreateMaterialData> {
  id: string;
}

class MaterialService {
  private readonly basePath = '/materials';

  async getAll(filters?: MaterialFilters): Promise<PaginatedResponse<Material>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get<PaginatedResponse<Material>>(
      `${this.basePath}?${params.toString()}`
    );
    return response.data;
  }

  async getById(id: string): Promise<Material> {
    const response = await api.get<Material>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateMaterialData): Promise<Material> {
    const response = await api.post<Material>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: Partial<CreateMaterialData>): Promise<Material> {
    const response = await api.patch<Material>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.basePath}/${id}`);
  }

  async getCategories(): Promise<MaterialCategory[]> {
    const response = await api.get<MaterialCategory[]>(`${this.basePath}/categories`);
    return response.data;
  }

  async getStockLevel(id: string): Promise<{ current: number; reorderLevel: number }> {
    const response = await api.get<{ current: number; reorderLevel: number }>(
      `${this.basePath}/${id}/stock-level`
    );
    return response.data;
  }

  async getLowStockMaterials(): Promise<Material[]> {
    const response = await api.get<Material[]>(`${this.basePath}/low-stock`);
    return response.data;
  }

  async exportToExcel(filters?: MaterialFilters): Promise<Blob> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get(`${this.basePath}/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async importFromExcel(file: File): Promise<{ imported: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<{ imported: number; errors: string[] }>(
      `${this.basePath}/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }
}

export const materialService = new MaterialService();
