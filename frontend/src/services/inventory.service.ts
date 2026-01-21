import api from '@/lib/axios';
import { StockBatch, CreateGRNPayload, GRNItemPayload, StockMovement } from '@/types/inventory.types';
import { PaginatedResponse } from './material.service';

export interface StockFilters {
  materialId?: string;
  warehouseId?: string;
  projectId?: string;
  belowReorderLevel?: boolean;
  page?: number;
  limit?: number;
}

export interface GRNFilters {
  poId?: string;
  supplierId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface StockAdjustment {
  materialId: string;
  warehouseId: string;
  quantity: number;
  reason: string;
  type: 'INCREASE' | 'DECREASE';
  referenceNumber?: string;
}

export interface GRN {
  id: string;
  grnNumber: string;
  poId: string;
  supplierId: string;
  receivedDate: string;
  status: 'PENDING' | 'INSPECTED' | 'APPROVED' | 'REJECTED';
  items: GRNItemPayload[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

class InventoryService {
  private readonly basePath = '/inventory';

  // Stock Operations
  async getStock(filters?: StockFilters): Promise<PaginatedResponse<StockBatch>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get<PaginatedResponse<StockBatch>>(
      `${this.basePath}/stock?${params.toString()}`
    );
    return response.data;
  }

  async getStockByMaterial(materialId: string): Promise<StockBatch[]> {
    const response = await api.get<StockBatch[]>(
      `${this.basePath}/stock/material/${materialId}`
    );
    return response.data;
  }

  async adjustStock(data: StockAdjustment): Promise<StockBatch> {
    const response = await api.post<StockBatch>(
      `${this.basePath}/stock/adjust`,
      data
    );
    return response.data;
  }

  async transferStock(
    fromWarehouseId: string,
    toWarehouseId: string,
    materialId: string,
    quantity: number,
    notes?: string
  ): Promise<void> {
    await api.post(`${this.basePath}/stock/transfer`, {
      fromWarehouseId,
      toWarehouseId,
      materialId,
      quantity,
      notes,
    });
  }

  async getStockMovements(
    materialId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<StockMovement[]> {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);

    const response = await api.get<StockMovement[]>(
      `${this.basePath}/stock/${materialId}/movements?${params.toString()}`
    );
    return response.data;
  }

  async getLowStockAlerts(): Promise<{
    materialId: string;
    materialName: string;
    currentStock: number;
    reorderLevel: number;
    deficit: number;
  }[]> {
    const response = await api.get(`${this.basePath}/stock/low-stock-alerts`);
    return response.data;
  }

  // GRN Operations
  async getGRNs(filters?: GRNFilters): Promise<PaginatedResponse<GRN>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get<PaginatedResponse<GRN>>(
      `${this.basePath}/grn?${params.toString()}`
    );
    return response.data;
  }

  async getGRNById(id: string): Promise<GRN> {
    const response = await api.get<GRN>(`${this.basePath}/grn/${id}`);
    return response.data;
  }

  async createGRN(data: CreateGRNPayload): Promise<GRN> {
    const response = await api.post<GRN>(`${this.basePath}/grn`, data);
    return response.data;
  }

  async approveGRN(id: string, notes?: string): Promise<GRN> {
    const response = await api.post<GRN>(`${this.basePath}/grn/${id}/approve`, { notes });
    return response.data;
  }

  async rejectGRN(id: string, reason: string): Promise<GRN> {
    const response = await api.post<GRN>(`${this.basePath}/grn/${id}/reject`, { reason });
    return response.data;
  }

  // Warehouse Operations
  async getWarehouses(): Promise<{
    id: string;
    name: string;
    location: string;
    capacity: number;
    currentUtilization: number;
  }[]> {
    const response = await api.get(`${this.basePath}/warehouses`);
    return response.data;
  }

  async getWarehouseStock(warehouseId: string): Promise<StockBatch[]> {
    const response = await api.get<StockBatch[]>(
      `${this.basePath}/warehouses/${warehouseId}/stock`
    );
    return response.data;
  }
}

export const inventoryService = new InventoryService();
