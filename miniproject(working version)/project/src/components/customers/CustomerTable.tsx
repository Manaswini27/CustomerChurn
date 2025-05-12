import React from 'react';
import { Customer } from '../../types';

interface CustomerTableProps {
  customers: Customer[];
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers }) => {
  const getChurnRiskBadge = (risk: Customer['churnRisk']) => {
    switch (risk) {
      case 'low':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Low
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Medium
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            High ⚠️
          </span>
        );
      default:
        return null;
    }
  };
  
  const getLoyaltyBadge = (tier: Customer['loyaltyTier']) => {
    switch (tier) {
      case 'new':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-accent-100 text-accent-800">
            New
          </span>
        );
      case 'regular':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-secondary-100 text-secondary-800">
            Regular
          </span>
        );
      case 'loyal':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
            Loyal ✨
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loyalty
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tenure
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg. Order
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Churn Risk
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getLoyaltyBadge(customer.loyaltyTier)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.tenure} days
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${customer.avgOrderValue.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${customer.totalSpent.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getChurnRiskBadge(customer.churnRisk)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;