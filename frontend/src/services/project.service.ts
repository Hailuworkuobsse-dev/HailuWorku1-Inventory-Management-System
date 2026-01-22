import api from '@/lib/axios';
import { Project, BOQItem } from '@/types/business.types';
import { PaginatedResponse } from './material.service';

export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export interface ProjectFilters {
  status?: ProjectStatus;
  managerId?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProjectData {
  name: string;
  code?: string;
  description?: string;
  location: string;
  startDate: string;
  expectedEndDate: string;
  budget: number;
  managerId: string;
  clientName?: string;
  clientContact?: string;
}

export interface BOQFilters {
  projectId: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateBOQItemData {
  projectId: string;
  materialId: string;
  description?: string;
  quantity: number;
  unit: string;
  unitRate: number;
  category?: string;
  specifications?: string;
}

class ProjectService {
  private readonly basePath = '/projects';

  // Project Operations
  async getAll(filters?: ProjectFilters): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get<PaginatedResponse<Project>>(
      `${this.basePath}?${params.toString()}`
    );
    return response.data;
  }

  async getById(id: string): Promise<Project> {
    const response = await api.get<Project>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(data: CreateProjectData): Promise<Project> {
    const response = await api.post<Project>(this.basePath, data);
    return response.data;
  }

  async update(id: string, data: Partial<CreateProjectData>): Promise<Project> {
    const response = await api.patch<Project>(`${this.basePath}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.basePath}/${id}`);
  }

  async updateStatus(id: string, status: ProjectStatus, reason?: string): Promise<Project> {
    const response = await api.patch<Project>(`${this.basePath}/${id}/status`, {
      status,
      reason,
    });
    return response.data;
  }

  async getProjectStats(id: string): Promise<{
    totalBudget: number;
    spentAmount: number;
    remainingBudget: number;
    budgetUtilization: number;
    materialsIssued: number;
    pendingRequisitions: number;
    completionPercentage: number;
  }> {
    const response = await api.get(`${this.basePath}/${id}/stats`);
    return response.data;
  }

  async getProjectTimeline(id: string): Promise<{
    date: string;
    event: string;
    type: 'milestone' | 'activity' | 'issue';
    description?: string;
  }[]> {
    const response = await api.get(`${this.basePath}/${id}/timeline`);
    return response.data;
  }

  // BOQ Operations
  async getBOQItems(filters: BOQFilters): Promise<PaginatedResponse<BOQItem>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });

    const response = await api.get<PaginatedResponse<BOQItem>>(
      `${this.basePath}/${filters.projectId}/boq?${params.toString()}`
    );
    return response.data;
  }

  async getBOQItemById(projectId: string, itemId: string): Promise<BOQItem> {
    const response = await api.get<BOQItem>(
      `${this.basePath}/${projectId}/boq/${itemId}`
    );
    return response.data;
  }

  async createBOQItem(data: CreateBOQItemData): Promise<BOQItem> {
    const response = await api.post<BOQItem>(
      `${this.basePath}/${data.projectId}/boq`,
      data
    );
    return response.data;
  }

  async updateBOQItem(
    projectId: string,
    itemId: string,
    data: Partial<CreateBOQItemData>
  ): Promise<BOQItem> {
    const response = await api.patch<BOQItem>(
      `${this.basePath}/${projectId}/boq/${itemId}`,
      data
    );
    return response.data;
  }

  async deleteBOQItem(projectId: string, itemId: string): Promise<void> {
    await api.delete(`${this.basePath}/${projectId}/boq/${itemId}`);
  }

  async importBOQ(projectId: string, file: File): Promise<{
    imported: number;
    errors: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(
      `${this.basePath}/${projectId}/boq/import`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async exportBOQ(projectId: string, format: 'excel' | 'pdf'): Promise<Blob> {
    const response = await api.get(
      `${this.basePath}/${projectId}/boq/export?format=${format}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }

  async getBOQSummary(projectId: string): Promise<{
    totalItems: number;
    totalAmount: number;
    byCategory: { category: string; count: number; amount: number }[];
  }> {
    const response = await api.get(`${this.basePath}/${projectId}/boq/summary`);
    return response.data;
  }
}

export const projectService = new ProjectService();
