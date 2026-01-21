import api from '@/lib/axios';
import { PurchaseOrder, POStatus } from '@/types/business.types';
import { PaginatedResponse } from './material.service';

export interface POFilters {
  status?: POStatus;
  supplierId?: string;
  projectId?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreatePOItem {
  materialId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface CreatePOData {
  supplierId: string;
  projectId?: string;
  expectedDeliveryDate: string;
  items: CreatePOItem[];
  notes?: string;
  termsAndConditions?: string;
  shippingAddress?: string;
}

export interface POApprovalData {
  approved: boolean;
  comments?: string;
}

class ProcurementService {
  private readonly basePath = '/procurement';

  // Purchase Order Operations
  async getPurchaseOrders(filters?: POFilters): Promise<PaginatedResponse<PurchaseOrder>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get<PaginatedResponse<PurchaseOrder>>(
      `${this.basePath}/purchase-orders?${params.toString()}`
    );
    return response.data;
  }

  async getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
    const response = await api.get<PurchaseOrder>(`${this.basePath}/purchase-orders/${id}`);
    return response.data;
  }

  async createPurchaseOrder(data: CreatePOData): Promise<PurchaseOrder> {
    const response = await api.post<PurchaseOrder>(`${this.basePath}/purchase-orders`, data);
    return response.data;
  }

  async updatePurchaseOrder(id: string, data: Partial<CreatePOData>): Promise<PurchaseOrder> {
    const response = await api.patch<PurchaseOrder>(
      `${this.basePath}/purchase-orders/${id}`,
      data
    );
    return response.data;
  }

  async deletePurchaseOrder(id: string): Promise<void> {
    await api.delete(`${this.basePath}/purchase-orders/${id}`);
  }

  async submitForApproval(id: string): Promise<PurchaseOrder> {
    const response = await api.post<PurchaseOrder>(
      `${this.basePath}/purchase-orders/${id}/submit`
    );
    return response.data;
  }

  async approvePurchaseOrder(id: string, data: POApprovalData): Promise<PurchaseOrder> {
    const response = await api.post<PurchaseOrder>(
      `${this.basePath}/purchase-orders/${id}/approve`,
      data
    );
    return response.data;
  }

  async rejectPurchaseOrder(id: string, reason: string): Promise<PurchaseOrder> {
    const response = await api.post<PurchaseOrder>(
      `${this.basePath}/purchase-orders/${id}/reject`,
      { reason }
    );
    return response.data;
  }

  async cancelPurchaseOrder(id: string, reason: string): Promise<PurchaseOrder> {
    const response = await api.post<PurchaseOrder>(
      `${this.basePath}/purchase-orders/${id}/cancel`,
      { reason }
    );
    return response.data;
  }

  async generatePOPdf(id: string): Promise<Blob> {
    const response = await api.get(`${this.basePath}/purchase-orders/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async sendPOToSupplier(id: string, email?: string): Promise<void> {
    await api.post(`${this.basePath}/purchase-orders/${id}/send`, { email });
  }

  // Material Requisition Operations
  async getRequisitions(filters?: {
    status?: string;
    projectId?: string;
    requestedBy?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<{
    id: string;
    requisitionNumber: string;
    projectId: string;
    projectName: string;
    status: string;
    requestedBy: { id: string; name: string };
    items: { materialId: string; materialName: string; quantity: number }[];
    createdAt: string;
  }>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get(`${this.basePath}/requisitions?${params.toString()}`);
    return response.data;
  }

  async createRequisition(data: {
    projectId: string;
    items: { materialId: string; quantity: number; notes?: string }[];
    urgency: 'LOW' | 'MEDIUM' | 'HIGH';
    notes?: string;
  }): Promise<{ id: string; requisitionNumber: string }> {
    const response = await api.post(`${this.basePath}/requisitions`, data);
    return response.data;
  }

  async approveRequisition(id: string, comments?: string): Promise<void> {
    await api.post(`${this.basePath}/requisitions/${id}/approve`, { comments });
  }

  async rejectRequisition(id: string, reason: string): Promise<void> {
    await api.post(`${this.basePath}/requisitions/${id}/reject`, { reason });
  }

  async convertRequisitionToPO(requisitionId: string, supplierId: string): Promise<PurchaseOrder> {
    const response = await api.post<PurchaseOrder>(
      `${this.basePath}/requisitions/${requisitionId}/convert-to-po`,
      { supplierId }
    );
    return response.data;
  }
}

export const procurementService = new ProcurementService();
