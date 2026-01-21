import api from '@/lib/axios';
import { DashboardStats, ChartData, InventoryAlert, RecentActivity } from '@/types/dashboard.types';

export interface DashboardFilters {
  projectId?: string;
  warehouseId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface KPIData {
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  trend: number[];
}

class DashboardService {
  private readonly basePath = '/dashboard';

  async getStats(filters?: DashboardFilters): Promise<DashboardStats> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get<DashboardStats>(
      `${this.basePath}/stats?${params.toString()}`
    );
    return response.data;
  }

  async getInventoryTrends(
    period: 'daily' | 'weekly' | 'monthly' = 'weekly',
    filters?: DashboardFilters
  ): Promise<ChartData[]> {
    const params = new URLSearchParams({ period });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get<ChartData[]>(
      `${this.basePath}/inventory-trends?${params.toString()}`
    );
    return response.data;
  }

  async getStockValueByCategory(filters?: DashboardFilters): Promise<{
    category: string;
    value: number;
    percentage: number;
  }[]> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }

    const response = await api.get(`${this.basePath}/stock-value-by-category?${params.toString()}`);
    return response.data;
  }

  async getAlerts(): Promise<InventoryAlert[]> {
    const response = await api.get<InventoryAlert[]>(`${this.basePath}/alerts`);
    return response.data;
  }

  async dismissAlert(alertId: string): Promise<void> {
    await api.post(`${this.basePath}/alerts/${alertId}/dismiss`);
  }

  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    const response = await api.get<RecentActivity[]>(
      `${this.basePath}/activities?limit=${limit}`
    );
    return response.data;
  }

  async getPurchaseOrderStats(period: 'daily' | 'weekly' | 'monthly' = 'monthly'): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalValue: number;
    chartData: ChartData[];
  }> {
    const response = await api.get(`${this.basePath}/po-stats?period=${period}`);
    return response.data;
  }

  async getSupplierPerformance(limit: number = 5): Promise<{
    supplierId: string;
    supplierName: string;
    performanceScore: number;
    totalOrders: number;
    onTimeDeliveryRate: number;
  }[]> {
    const response = await api.get(`${this.basePath}/supplier-performance?limit=${limit}`);
    return response.data;
  }

  async getProjectBudgetUtilization(): Promise<{
    projectId: string;
    projectName: string;
    budget: number;
    spent: number;
    remaining: number;
    utilizationPercentage: number;
  }[]> {
    const response = await api.get(`${this.basePath}/project-budget-utilization`);
    return response.data;
  }

  async getKPIs(): Promise<KPIData[]> {
    const response = await api.get<KPIData[]>(`${this.basePath}/kpis`);
    return response.data;
  }
}

export const dashboardService = new DashboardService();
