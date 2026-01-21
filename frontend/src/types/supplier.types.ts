import { PurchaseOrder } from './business.types';

export interface SupplierContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

export interface SupplierMetrics {
  onTimeDeliveryRate: number;
  qualityAcceptanceRate: number;
  totalSpend: number;
  activeContracts: number;
}

export interface SupplierDetail {
  id: string;
  name: string;
  code: string;
  address: string;
  taxId: string;
  status: 'ACTIVE' | 'BLACKLISTED' | 'PROBATION';
  contacts: SupplierContact[];
  metrics: SupplierMetrics;
  activeOrders: PurchaseOrder[];
  tags: string[];
}
