import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShoppingCart,
  FolderKanban,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, Badge } from '@/components/ui';
import { dashboardService } from '@/services/dashboard.service';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  href?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, trend, href }) => {
  const content = (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : trend === 'down' ? (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              ) : null}
              <span
                className={`text-sm font-medium ${
                  trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-400 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary-50 rounded-xl">
          {icon}
        </div>
      </div>
    </Card>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }
  return content;
};

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  });

  const { data: inventoryTrends } = useQuery({
    queryKey: ['inventory-trends'],
    queryFn: () => dashboardService.getInventoryTrends('weekly'),
  });

  const { data: categoryData } = useQuery({
    queryKey: ['stock-by-category'],
    queryFn: () => dashboardService.getStockValueByCategory(),
  });

  const { data: alerts } = useQuery({
    queryKey: ['dashboard-alerts'],
    queryFn: () => dashboardService.getAlerts(),
  });

  const { data: activities } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: () => dashboardService.getRecentActivities(5),
  });

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s what&apos;s happening with your inventory today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/reports"
            className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg border border-gray-300 bg-transparent hover:bg-gray-50 transition-colors"
          >
            View Reports
          </Link>
          <Link
            to="/procurement/purchase-orders/new"
            className="inline-flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors"
          >
            Create PO
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Inventory Value"
          value={formatCurrency(stats?.totalInventoryValue || 0)}
          change={12}
          trend="up"
          icon={<Package className="w-6 h-6 text-primary-600" />}
          href="/inventory"
        />
        <StatCard
          title="Active Materials"
          value={stats?.totalMaterials || 0}
          change={5}
          trend="up"
          icon={<Package className="w-6 h-6 text-primary-600" />}
          href="/materials"
        />
        <StatCard
          title="Pending Orders"
          value={stats?.pendingOrders || stats?.pendingRequests || 0}
          icon={<ShoppingCart className="w-6 h-6 text-primary-600" />}
          href="/procurement/purchase-orders"
        />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockCount || 0}
          trend="down"
          change={-8}
          icon={<AlertTriangle className="w-6 h-6 text-yellow-600" />}
          href="/inventory?filter=low-stock"
        />
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory trends chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Value Trend</h2>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inventoryTrends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  fill="#93C5FD"
                  fillOpacity={0.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category distribution pie chart */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Stock by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(categoryData || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {(categoryData || []).slice(0, 5).map((item, index) => (
              <div key={item.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600">{item.category}</span>
                </div>
                <span className="font-medium text-gray-900">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts and activities section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Alerts</h2>
            <Link to="/alerts" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {(alerts || []).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No active alerts</p>
            ) : (
              (alerts || []).slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-red-100'
                        : alert.severity === 'HIGH'
                        ? 'bg-orange-100'
                        : 'bg-yellow-100'
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        alert.severity === 'CRITICAL'
                          ? 'text-red-600'
                          : alert.severity === 'HIGH'
                          ? 'text-orange-600'
                          : 'text-yellow-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{alert.message}</p>
                  </div>
                  <Badge
                    variant={
                      alert.severity === 'CRITICAL'
                        ? 'danger'
                        : alert.severity === 'HIGH'
                        ? 'warning'
                        : 'default'
                    }
                    size="sm"
                  >
                    {alert.severity}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent activities */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Link to="/activities" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {(activities || []).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recent activities</p>
            ) : (
              (activities || []).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/materials/new"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Package className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">Add Material</span>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
          <Link
            to="/procurement/purchase-orders/new"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">Create PO</span>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
          <Link
            to="/procurement/grn/new"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Package className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">Receive Goods</span>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
          <Link
            to="/reports"
            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <span className="text-sm font-medium text-gray-700">Generate Report</span>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
          </Link>
        </div>
      </Card>
    </div>
  );
};

DashboardPage.displayName = 'DashboardPage';
