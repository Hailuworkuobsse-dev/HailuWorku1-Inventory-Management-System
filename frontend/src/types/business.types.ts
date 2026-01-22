import { Material, Supplier } from './master-data.types';

export type POStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ISSUED' | 'COMPLETED';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: Supplier;
  totalAmount: number;
  status: POStatus;
  createdAt: string;
  items: {
    id: string;
    material: Material;
    quantity: number;
    unitPrice: number;
    receivedQty: number;
  }[];
  notes?: string;
  deliveryAddress?: string;
  deliveryDate?: string;
  termsAndConditions?: string;
  approvalHistory?: any[];
}

export interface BOQItem {
  id: string;
  material: Material;
  plannedQty: number;
  consumedQty: number;
  usagePercent: string;
  isCritical: boolean;
}

export interface Project {
  id: string;
  name: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PLANNING';
  startDate: string;
  endDate?: string;
  location: string;
  budget: number;
  spent: number;
  tags?: string[];
  clientName?: string;
  clientContact?: string;
  boqItems?: BOQItem[];
}
