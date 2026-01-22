export type MaterialStatus = 'ACTIVE' | 'DRAFT' | 'OBSOLETE' | 'PENDING_APPROVAL';

export type MaterialCategory =
  | 'CEMENT'
  | 'STEEL'
  | 'AGGREGATE'
  | 'TIMBER'
  | 'ELECTRICAL'
  | 'PLUMBING'
  | 'FINISHING'
  | 'HARDWARE'
  | 'SAFETY'
  | 'OTHER';

export interface Material {
  id: string;
  code: string;
  name: string;
  category: MaterialCategory;
  unit: string;
  unitPrice?: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  currentStock?: number;
  description?: string;
  specifications?: Record<string, string>;
  status: MaterialStatus;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  performanceScore: number;
  status: 'ACTIVE' | 'BLACKLISTED';
}

export interface CreateMaterialDTO extends Omit<Material, 'id' | 'code' | 'status' | 'version' | 'updatedAt'> {}
