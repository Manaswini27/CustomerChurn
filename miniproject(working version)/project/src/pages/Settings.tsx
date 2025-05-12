import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart, User, Bell, Lock, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'Jane Smith',
    email: user?.email || '',
    businessName: 'Sweet Delights Bakery',
    notifyChurnRisk: true,
    notifyNewCustomers: true,
    notifyReports: true,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally save to the backend
    alert('Settings saved!');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-soft">
        <div className="sm:flex sm:divide-x">
          {/* Sidebar */}
          <nav className="sm:w-64 p-4 sm:p-6">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User size={18} className="mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'notifications' 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bell size={18} className="mr-2" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'security' 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Lock size={18} className="mr-2" />
                Security
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center p-4 bg-accent-50 rounded-lg">
                <div className="text-center">
                  <Heart className="h-6 w-6 text-accent-500 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-gray-800">HomeBiz Insight</h3>
                  <p className="text-xs text-gray-500 mt-1">Version 1.0.0</p>
                </div>
              </div>
            </div>
          </nav>
          
          {/* Content */}
          <div className="flex-1 p-4 sm:p-6">
            <form onSubmit={handleSubmit}>
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              )}
              
              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifyChurnRisk"
                          name="notifyChurnRisk"
                          type="checkbox"
                          checked={formData.notifyChurnRisk}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifyChurnRisk" className="font-medium text-gray-700">
                          Churn Risk Alerts
                        </label>
                        <p className="text-gray-500">Get notified when customers are at risk of churning</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifyNewCustomers"
                          name="notifyNewCustomers"
                          type="checkbox"
                          checked={formData.notifyNewCustomers}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifyNewCustomers" className="font-medium text-gray-700">
                          New Customer Notifications
                        </label>
                        <p className="text-gray-500">Get notified when new customers register</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifyReports"
                          name="notifyReports"
                          type="checkbox"
                          checked={formData.notifyReports}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifyReports" className="font-medium text-gray-700">
                          Weekly Reports
                        </label>
                        <p className="text-gray-500">Receive weekly business performance reports</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800">Security Settings</h2>
                  
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 pt-5 border-t border-gray-200">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <Save size={18} className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;