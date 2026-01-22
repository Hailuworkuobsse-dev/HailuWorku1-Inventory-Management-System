export interface DashboardStats {
  totalInventoryValue: number;
  totalMaterials: number;
  lowStockCount: number;
  pendingRequests: number;
  activeProjects: number;
  materialsCount?: number;
  pendingOrders?: number;
  lowStockDetails?: any[];
}

export interface ChartData {
  name: string;
  value: number;
  secondaryValue?: number;
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface DashboardData {
  stats: DashboardStats;
  inventoryTrend: ChartData[];
  categoryDistribution: ChartData[];
  recentActivities: RecentActivity[];
}

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertType =
  | 'LOW_STOCK'
  | 'EXPIRING_SOON'
  | 'PENDING_APPROVAL'
  | 'OVERDUE_DELIVERY'
  | 'BUDGET_EXCEEDED'
  | 'QUALITY_ISSUE';

export interface InventoryAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  materialId?: string;
  materialName?: string;
  projectId?: string;
  projectName?: string;
  createdAt: string;
  isRead: boolean;
  isDismissed: boolean;
  actionUrl?: string;
}

export interface WidgetConfig {
  id: string;
  type: 'stat' | 'chart' | 'table' | 'list';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  config: Record<string, unknown>;
}

export interface DashboardConfig {
  userId: string;
  widgets: WidgetConfig[];
  refreshInterval: number;
  theme: 'light' | 'dark' | 'system';
}
