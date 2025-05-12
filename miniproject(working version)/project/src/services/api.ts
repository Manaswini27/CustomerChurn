import axios from 'axios';
import { Customer, ChatMessage } from '../types';

const API_BASE_URL = 'http://localhost:5000';

export const api = {
  getCustomers: async () => {
    const response = await axios.get(`${API_BASE_URL}/customers`);
    return response.data;
  },

  addCustomer: async (customer: Customer) => {
    const response = await axios.post(`${API_BASE_URL}/customers`, customer);
    return response.data;
  },

  predictChurn: async (customerId: string, features: any) => {
    const response = await axios.post(`${API_BASE_URL}/predict`, {
      customerId,
      ...features
    });
    return response.data;
  },

  getOrders: async () => {
    const response = await axios.get(`${API_BASE_URL}/orders`);
    return response.data;
  },

  sendChatMessage: async (message: string, customerId?: string) => {
    const response = await axios.post(`${API_BASE_URL}/chat`, {
      message,
      customerId
    });
    return response.data;
  }
};