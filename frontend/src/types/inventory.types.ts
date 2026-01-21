import { Material } from './master-data.types';

export interface StockBatch {
  id: string;
  material: Material;
  location: { id: string; name: string };
  batchNumber: string;
  quantity: number;
  expiryDate?: string;
  receivedDate: string;
}

export interface PurchaseOrderItem {
  id: string;
  materialId: string;
  material: Material;
  quantity: number;
  receivedQty: number;
  unitPrice: number;
}

export interface GRNItemPayload {
  poItemId: string;
  quantity: number;
  acceptedQty: number;
  rejectedQty: number;
  batchNumber?: string;
  expiryDate?: string;
}

export interface CreateGRNPayload {
  purchaseOrderId: string;
  evidenceUrl?: string;
  items: GRNItemPayload[];
}

export type StockMovementType =
  | 'RECEIPT'
  | 'ISSUE'
  | 'TRANSFER_IN'
  | 'TRANSFER_OUT'
  | 'ADJUSTMENT'
  | 'RETURN';

export interface StockMovement {
  id: string;
  materialId: string;
  materialName: string;
  warehouseId: string;
  warehouseName: string;
  type: StockMovementType;
  quantity: number;
  balanceAfter: number;
  referenceNumber: string;
  referenceType: 'GRN' | 'PO' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT';
  notes?: string;
  performedBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  location: string;
  address?: string;
  capacity: number;
  currentUtilization: number;
  isActive: boolean;
  managerId?: string;
  managerName?: string;
  createdAt: string;
  updatedAt: string;
}
