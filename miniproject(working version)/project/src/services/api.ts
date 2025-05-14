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
    const responseData = await axios.get(`${API_BASE_URL}/customers`);
    console.log('Customer added:', customer);////here we were sending a message that said added successfully not the customer data intitally then we changed it to the customer data
    return responseData.data;
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

  sendChatMessage: async (message: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, { 
        message 
      });
      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      return { 
        response: "Sorry, the chatbot isn't working right now. Please try again later." 
  }
}
}
};
