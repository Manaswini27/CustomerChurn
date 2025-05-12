import React, { useState } from 'react';
import CustomerTable from '../components/customers/CustomerTable';
import { mockCustomers } from '../data/mockData';
import { Search, Users, Filter, Plus } from 'lucide-react';
import { api } from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '../types';
import { useEffect } from 'react';


const Customers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    tenure: 0,
    avgOrderValue: 0,
    totalSpent: 0,
    loyaltyTier: 'new' as const,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const response = await api.getCustomers();
        console.log('Fetched data:', response); // Log the fetched data
        setCustomers(response);
        setFetchError(null);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setFetchError('Failed to load customers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on search term and filter
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
  
    if (filter === 'all') {
      return matchesSearch; // Only search term matters for 'all'
    }
  
    let matchesCategory = false; // Default: doesn't match category
  
    if (filter === 'high-risk') {
      matchesCategory = customer.churnRisk === 'high';
    } else if (filter === 'medium-risk') {
      matchesCategory = customer.churnRisk === 'medium';
    } else if (filter === 'low-risk') {
      matchesCategory = customer.churnRisk === 'low';
    } else if (filter === 'loyal') {
      matchesCategory = customer.loyaltyTier === 'loyal';
    } else if (filter === 'new') {
        matchesCategory = customer.loyaltyTier === 'new';
    }
  
    return matchesSearch && matchesCategory; // BOTH search AND category must match
  });

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const customerData: Customer = {
        id: uuidv4(),
        ...newCustomer,
        lastOrder: new Date().toISOString(),
        churnRisk: 'low', // Default value, backend might update this
       // churnProbability: 0 // Default value
      };

      const response = await api.addCustomer(customerData);
      
      // Add the new customer to local state
      setCustomers(prev => [...prev, response]);
      
      setShowAddModal(false);
      setNewCustomer({
        name: '',
        email: '',
        tenure: 0,
        avgOrderValue: 0,
        totalSpent: 0,
        loyaltyTier: 'new',
      });
    } catch (error) {
      console.error('Error adding customer:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Customers</h1>
          <p className="text-gray-500 mt-1">Manage your customer relationships</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Customer
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="sm:w-64">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="w-5 h-5 text-gray-400" />
            </div>
            <select
              className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Customers</option>
              <option value="high-risk">High Risk</option>
              <option value="medium-risk">Medium Risk</option>
              <option value="low-risk">Low Risk</option>
              <option value="loyal">Loyal Customers</option>
              <option value="new">New Customers</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-soft p-4 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="h-5 w-5 text-primary-500" />
            </div>
            <h2 className="ml-2 text-lg font-medium text-gray-800">Customer List</h2>
          </div>
          <div className="text-sm text-gray-500">
            {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'}
          </div>
        </div>
        
        {isLoading && !customers.length ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">Loading customers...</p>
          </div>
        ) : fetchError ? (
          <div className="py-8 text-center text-red-500">
            <p>{fetchError}</p>
          </div>
        ) : filteredCustomers.length > 0 ? (
          <CustomerTable customers={filteredCustomers} />
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No customers found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Customer</h3>
            <form onSubmit={handleAddCustomer}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tenure (days)
                  </label>
                  <input
                    type="number"
                    value={newCustomer.tenure}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, tenure: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Average Order Value
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCustomer.avgOrderValue}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, avgOrderValue: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Spent
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newCustomer.totalSpent}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, totalSpent: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;