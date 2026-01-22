import { PurchaseOrder } from './business.types';

export interface POAuditLog {
  id: string;
  action: 'CREATED' | 'UPDATED' | 'APPROVED' | 'REJECTED' | 'ISSUED' | 'CANCELLED';
  performedBy: { name: string; role: string };
  timestamp: string;
  comment?: string;
}

export interface ExtendedPO extends PurchaseOrder {
  termsAndConditions: string;
  deliveryDate: string;
  approvalHistory: POAuditLog[];
  grnHistory: {
    id: string;
    date: string;
    receivedBy: string;
    status: string;
  }[];
}
