export interface SystemConfig {
  id: string;
  companyName: string;
  baseCurrency: string;
  dateFormat: string;
  grnTolerancePercentage: number;
  lowStockThresholdGlobal: number;
  autoLockAccountAfterFailedAttempts: number;
  sessionTimeoutMinutes: number;
}

export interface Permission {
  resource: string;
  actions: ('CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'APPROVE')[];
}

export interface RoleDefinition {
  role: string;
  description: string;
  permissions: Permission[];
}

export interface Alert {
  id: string;
  type: 'LOW_STOCK' | 'EXPIRY' | 'APPROVAL' | 'SYSTEM';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  entityId?: string;
  isRead: boolean;
  createdAt: string;
}
