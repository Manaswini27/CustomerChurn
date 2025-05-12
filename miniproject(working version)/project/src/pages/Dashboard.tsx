import React from 'react';
import StatCard from '../components/dashboard/StatCard';
import ChartCard from '../components/dashboard/ChartCard';
import CustomerTable from '../components/customers/CustomerTable';
import { 
  dashboardStats, 
  mockOrdersData, 
  mockRevenueData, 
  mockCustomers
} from '../data/mockData';

const Dashboard: React.FC = () => {
  // Get top customers with high churn risk for quick view
  const highRiskCustomers = mockCustomers
    .filter(customer => customer.churnRisk === 'high')
    .slice(0, 3);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back to your business insights</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            emoji={stat.emoji}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Orders Over Time" 
          subtitle="Last 90 days"
          data={mockOrdersData} 
        />
        <ChartCard 
          title="Revenue" 
          subtitle="Last 90 days"
          data={mockRevenueData} 
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800">At-Risk Customers</h2>
          <a 
            href="/customers" 
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View all →
          </a>
        </div>
        <CustomerTable customers={highRiskCustomers} />
      </div>
    </div>
  );
};

export default Dashboard;