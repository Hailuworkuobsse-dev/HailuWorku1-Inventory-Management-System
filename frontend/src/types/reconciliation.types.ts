import { Material } from './master-data.types';

export type ReconStatus = 'OPEN' | 'IN_PROGRESS' | 'COUNTED' | 'REVIEW' | 'COMPLETED' | 'CANCELLED';

export interface Reconciliation {
  id: string;
  reference: string;
  locationId: string;
  locationName: string;
  status: ReconStatus;
  scheduledDate: string;
  conductedBy: string;
  itemsCount: number;
  totalVarianceValue?: number;
  createdAt: string;
}

export interface ReconItem {
  id: string;
  material: Material;
  batchNumber: string;
  systemQty: number;
  physicalQty?: number;
  variance: number;
  costPerUnit: number;
  notes?: string;
}

export interface StockTransaction {
  id: string;
  type: 'INBOUND' | 'OUTBOUND' | 'TRANSFER' | 'ADJUSTMENT' | 'RETURN';
  date: string;
  quantity: number;
  reference: string;
  performedBy: string;
  notes?: string;
}
