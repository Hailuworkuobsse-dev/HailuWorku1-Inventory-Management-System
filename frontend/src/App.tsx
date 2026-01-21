import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout, AuthLayout } from '@/components/layout';

// Lazy-loaded pages for code splitting
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const MaterialsListPage = lazy(() => import('@/pages/materials/MaterialsListPage').then(m => ({ default: m.MaterialsListPage })));

// Placeholder pages for routes that will be implemented
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-500 mt-2">This page is under construction</p>
    </div>
  </div>
);

// Loading component for suspense
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<PlaceholderPage title="Register" />} />
              <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" />} />
              <Route path="/reset-password" element={<PlaceholderPage title="Reset Password" />} />
            </Route>

            {/* Protected routes */}
            <Route element={<MainLayout />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Materials */}
              <Route path="/materials" element={<MaterialsListPage />} />
              <Route path="/materials/new" element={<PlaceholderPage title="New Material" />} />
              <Route path="/materials/:id" element={<PlaceholderPage title="Material Details" />} />
              <Route path="/materials/:id/edit" element={<PlaceholderPage title="Edit Material" />} />

              {/* Suppliers */}
              <Route path="/suppliers" element={<PlaceholderPage title="Suppliers" />} />
              <Route path="/suppliers/new" element={<PlaceholderPage title="New Supplier" />} />
              <Route path="/suppliers/:id" element={<PlaceholderPage title="Supplier Details" />} />
              <Route path="/suppliers/:id/edit" element={<PlaceholderPage title="Edit Supplier" />} />

              {/* Procurement */}
              <Route path="/procurement/purchase-orders" element={<PlaceholderPage title="Purchase Orders" />} />
              <Route path="/procurement/purchase-orders/new" element={<PlaceholderPage title="New Purchase Order" />} />
              <Route path="/procurement/purchase-orders/:id" element={<PlaceholderPage title="Purchase Order Details" />} />
              <Route path="/procurement/grn" element={<PlaceholderPage title="Goods Received Notes" />} />
              <Route path="/procurement/grn/new" element={<PlaceholderPage title="New GRN" />} />
              <Route path="/procurement/grn/:id" element={<PlaceholderPage title="GRN Details" />} />

              {/* Projects */}
              <Route path="/projects" element={<PlaceholderPage title="Projects" />} />
              <Route path="/projects/new" element={<PlaceholderPage title="New Project" />} />
              <Route path="/projects/:id" element={<PlaceholderPage title="Project Details" />} />
              <Route path="/projects/:id/boq" element={<PlaceholderPage title="Bill of Quantities" />} />

              {/* Inventory */}
              <Route path="/inventory" element={<PlaceholderPage title="Inventory" />} />
              <Route path="/inventory/stock" element={<PlaceholderPage title="Stock Management" />} />
              <Route path="/inventory/issues" element={<PlaceholderPage title="Material Issues" />} />
              <Route path="/inventory/returns" element={<PlaceholderPage title="Material Returns" />} />
              <Route path="/inventory/transfers" element={<PlaceholderPage title="Stock Transfers" />} />

              {/* Reports */}
              <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
              <Route path="/reports/inventory" element={<PlaceholderPage title="Inventory Reports" />} />
              <Route path="/reports/procurement" element={<PlaceholderPage title="Procurement Reports" />} />
              <Route path="/reports/projects" element={<PlaceholderPage title="Project Reports" />} />

              {/* Settings */}
              <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
              <Route path="/settings/profile" element={<PlaceholderPage title="Profile Settings" />} />
              <Route path="/settings/notifications" element={<PlaceholderPage title="Notification Settings" />} />
              <Route path="/settings/security" element={<PlaceholderPage title="Security Settings" />} />

              {/* Admin */}
              <Route path="/admin" element={<PlaceholderPage title="Admin" />} />
              <Route path="/admin/users" element={<PlaceholderPage title="User Management" />} />
              <Route path="/admin/roles" element={<PlaceholderPage title="Role Management" />} />
              <Route path="/admin/audit-logs" element={<PlaceholderPage title="Audit Logs" />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
