import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import StatCard from '../components/dashboard/StatCard';
import CustomerTable from '../components/customers/CustomerTable';
import { api } from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  dataset: {
    date: string;
    value: number;
  }[];
  label: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  tenure: number;
  avgOrder: number;
  totalSpent: number;
  churnRisk: 'low' | 'medium' | 'high';
  lastOrderDate?: string;
}

const Dashboard: React.FC = () => {
  const [highRiskCustomers, setHighRiskCustomers] = useState<Customer[]>([]);
  const [activityData, setActivityData] = useState<ChartData>({
    dataset: [],
    label: 'Customer Activity'
  });
  const [revenueData, setRevenueData] = useState<ChartData>({
    dataset: [],
    label: 'Revenue'
  });
  const [stats, setStats] = useState({
    totalCustomers: 0,
    mtdRevenue: 0,
    avgOrderValue: 0,
    highRiskCount: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const customers = await api.getCustomers();

      const riskyCustomers = customers.filter(c => c.churnRisk === 'high');
      setHighRiskCustomers(riskyCustomers.slice(0, 3));
      const highRiskCount = riskyCustomers.length;

      const validAvgOrders = customers
        .filter(c => c.avgOrderValue > 0)
        .map(c => c.avgOrderValue);

      const avgOrderValue = validAvgOrders.length > 0
        ? validAvgOrders.reduce((sum, val) => sum + val, 0) / validAvgOrders.length
        : 0;

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      const monthlyData: Record<string, { customers: number; revenue: number }> = {};
      let mtdRevenue = 0;
      let totalRevenue = 0;

      customers.forEach(customer => {
        totalRevenue += customer.totalSpent;
        const lastOrderDate = customer.lastOrderDate
          ? new Date(customer.lastOrderDate)
          : new Date(Date.now() - customer.tenure * 24 * 60 * 60 * 1000);

        const monthYear = `${lastOrderDate.getFullYear()}-${lastOrderDate.getMonth()}`;
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { customers: 0, revenue: 0 };
        }
        monthlyData[monthYear].customers += 1;
        monthlyData[monthYear].revenue += customer.totalSpent;

        if (lastOrderDate.getMonth() === currentMonth &&
          lastOrderDate.getFullYear() === currentYear) {
          mtdRevenue += customer.totalSpent;
        }
      });

      const monthsToShow = 6;
      const activityDataset = [];
      const revenueDataset = [];

      for (let i = monthsToShow - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
        const monthName = date.toLocaleString('default', { month: 'short' });

        activityDataset.push({
          date: monthName,
          value: monthlyData[monthYear]?.customers || 0
        });
        revenueDataset.push({
          date: monthName,
          value: monthlyData[monthYear]?.revenue || 0
        });
      }

      setActivityData({ label: 'Active Customers', dataset: activityDataset });
      setRevenueData({ label: 'Revenue', dataset: revenueDataset });
      setStats({
        totalCustomers: customers.length,
        mtdRevenue,
        avgOrderValue,
        highRiskCount,
        totalRevenue
      });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleViewAll = () => navigate('/customers');

  // Chart.js setup
  const activityChartData = {
    labels: activityData.dataset.map(d => d.date),
    datasets: [{
      label: activityData.label,
      data: activityData.dataset.map(d => d.value),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  const revenueChartData = {
    labels: revenueData.dataset.map(d => d.date),
    datasets: [{
      label: revenueData.label,
      data: revenueData.dataset.map(d => d.value),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            {loading ? 'Loading...' : `Last updated: ${lastUpdated}`}
            {isRefreshing && ' (Refreshing...)'}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={isRefreshing}
          className="flex items-center text-sm bg-primary-100 hover:bg-primary-200 px-3 py-1 rounded-md disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading dashboard data...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Customers" value={stats.totalCustomers} trend="up" emoji="👥" />
            <StatCard label="Revenue (MTD)" value={`$${stats.mtdRevenue.toLocaleString()}`} trend="up" emoji="💰" />
            <StatCard label="Avg. Order Value" value={`$${stats.avgOrderValue.toFixed(2)}`} trend="up" emoji="📊" />
            <StatCard label="Churn Risk Alerts" value={stats.highRiskCount} trend={stats.highRiskCount > 0 ? 'up' : 'down'} emoji="⚠️" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-medium text-gray-800">Customer Activity</h3>
              <p className="text-sm text-gray-500 mb-2">Last 6 months</p>
              <Line data={activityChartData} options={chartOptions} />
            </div>
            <div className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="text-lg font-medium text-gray-800">Revenue</h3>
              <p className="text-sm text-gray-500 mb-2">Last 6 months</p>
              <Line data={revenueChartData} options={chartOptions} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-800">At-Risk Customers</h2>
              <button onClick={handleViewAll} className="text-sm text-primary-600 hover:text-primary-700">
                View all →
              </button>
            </div>
            {stats.highRiskCount === 0 ? (
              <div className="text-center py-4">No high-risk customers found</div>
            ) : (
              <CustomerTable customers={highRiskCustomers} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
