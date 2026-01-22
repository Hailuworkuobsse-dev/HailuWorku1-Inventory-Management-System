import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Search, Filter, Download, Upload, Edit, Trash2, Eye } from 'lucide-react';
import { Button, Input, Card, DataTable, Badge, StatusBadge, Modal, Select } from '@/components/ui';
import { materialService, MaterialFilters } from '@/services/material.service';
import { Material } from '@/types/master-data.types';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/stores/notification.store';

export const MaterialsListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState<MaterialFilters>({
    page: 1,
    limit: 10,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['materials', filters],
    queryFn: () => materialService.getAll(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => materialService.delete(id),
    onSuccess: () => {
      toast.success('Material deleted', 'The material has been successfully deleted.');
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      setDeleteModalOpen(false);
      setSelectedMaterial(null);
    },
    onError: () => {
      toast.error('Delete failed', 'Failed to delete the material. Please try again.');
    },
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key: keyof MaterialFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1,
    }));
  };

  const handleDelete = (material: Material) => {
    setSelectedMaterial(material);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMaterial) {
      deleteMutation.mutate(selectedMaterial.id);
    }
  };

  const columns: ColumnDef<Material>[] = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => (
          <span className="font-mono text-sm text-gray-600">{row.original.code}</span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-gray-900">{row.original.name}</p>
            {row.original.description && (
              <p className="text-sm text-gray-500 truncate max-w-xs">
                {row.original.description}
              </p>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <Badge variant="info" size="sm">
            {row.original.category}
          </Badge>
        ),
      },
      {
        accessorKey: 'unit',
        header: 'Unit',
      },
      {
        accessorKey: 'unitPrice',
        header: 'Unit Price',
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.unitPrice ? formatCurrency(row.original.unitPrice) : '-'}
          </span>
        ),
      },
      {
        accessorKey: 'currentStock',
        header: 'Current Stock',
        cell: ({ row }) => {
          const current = row.original.currentStock || 0;
          const reorder = row.original.reorderPoint || 0;
          const isLow = current <= reorder;
          return (
            <span className={isLow ? 'text-red-600 font-medium' : ''}>
              {current} {row.original.unit}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/materials/${row.original.id}`)}
              className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate(`/materials/${row.original.id}/edit`)}
              className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row.original)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'CEMENT', label: 'Cement' },
    { value: 'STEEL', label: 'Steel' },
    { value: 'AGGREGATE', label: 'Aggregate' },
    { value: 'TIMBER', label: 'Timber' },
    { value: 'ELECTRICAL', label: 'Electrical' },
    { value: 'PLUMBING', label: 'Plumbing' },
    { value: 'FINISHING', label: 'Finishing' },
    { value: 'HARDWARE', label: 'Hardware' },
    { value: 'SAFETY', label: 'Safety' },
    { value: 'OTHER', label: 'Other' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'OBSOLETE', label: 'Obsolete' },
    { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Materials</h1>
          <p className="text-gray-500 mt-1">Manage your material inventory</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button variant="outline" leftIcon={<Upload className="w-4 h-4" />}>
            Import
          </Button>
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/materials/new')}>
            Add Material
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search materials by name or code..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<Filter className="w-4 h-4" />}
          >
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Category"
              value={filters.category || ''}
              onChange={(value) => handleFilterChange('category', value)}
              options={categoryOptions}
            />
            <Select
              label="Status"
              value={filters.status || ''}
              onChange={(value) => handleFilterChange('status', value)}
              options={statusOptions}
            />
            <div className="flex items-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setFilters({ page: 1, limit: 10 });
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Data table */}
      <Card>
        <DataTable
          data={data?.data || []}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No materials found. Create your first material to get started."
          onRowClick={(row) => navigate(`/materials/${row.id}`)}
        />
      </Card>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Material"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{' '}
            <span className="font-medium text-gray-900">{selectedMaterial?.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              isLoading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

MaterialsListPage.displayName = 'MaterialsListPage';
