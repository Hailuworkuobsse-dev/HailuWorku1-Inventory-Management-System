export type ReportType = 'INVENTORY_VALUATION' | 'STOCK_MOVEMENT' | 'PROJECT_CONSUMPTION' | 'SUPPLIER_PERFORMANCE' | 'LOW_STOCK';

export interface ReportFilter {
  type: ReportType;
  startDate?: string;
  endDate?: string;
  projectId?: string;
  locationId?: string;
  format: 'PDF' | 'CSV';
}

export interface ReportPreviewData {
  headers: string[];
  rows: any[][];
  summary?: Record<string, number | string>;
}
