export { authService } from './auth.service';
export { materialService } from './material.service';
export { supplierService } from './supplier.service';
export { inventoryService } from './inventory.service';
export { dashboardService } from './dashboard.service';
export { procurementService } from './procurement.service';
export { projectService } from './project.service';

// Re-export commonly used types
export type { PaginatedResponse, MaterialFilters, CreateMaterialData } from './material.service';
export type { SupplierFilters, CreateSupplierData } from './supplier.service';
export type { StockFilters, GRNFilters, StockAdjustment } from './inventory.service';
export type { DashboardFilters, KPIData } from './dashboard.service';
export type { POFilters, CreatePOData, CreatePOItem } from './procurement.service';
export type { ProjectFilters, CreateProjectData, BOQFilters, CreateBOQItemData } from './project.service';
