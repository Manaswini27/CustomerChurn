import { Customer, ChatMessage, ChartData } from '../types';

// Mock customers data
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Emma Johnson',
    email: 'emma@example.com',
    tenure: 365,
    avgOrderValue: 75.50,
    totalSpent: 1205.75,
    loyaltyTier: 'loyal',
    lastOrder: '2023-05-15',
    churnRisk: 'low',
  },
  {
    id: '2',
    name: 'Michael Smith',
    email: 'michael@example.com',
    tenure: 180,
    avgOrderValue: 42.25,
    totalSpent: 590.50,
    loyaltyTier: 'regular',
    lastOrder: '2023-04-28',
    churnRisk: 'medium',
  },
  {
    id: '3',
    name: 'Sophia Garcia',
    email: 'sophia@example.com',
    tenure: 30,
    avgOrderValue: 38.75,
    totalSpent: 116.25,
    loyaltyTier: 'new',
    lastOrder: '2023-05-10',
    churnRisk: 'medium',
  },
  {
    id: '4',
    name: 'William Chen',
    email: 'william@example.com',
    tenure: 450,
    avgOrderValue: 68.20,
    totalSpent: 2455.20,
    loyaltyTier: 'loyal',
    lastOrder: '2023-05-02',
    churnRisk: 'low',
  },
  {
    id: '5',
    name: 'Olivia Kim',
    email: 'olivia@example.com',
    tenure: 90,
    avgOrderValue: 29.99,
    totalSpent: 239.92,
    loyaltyTier: 'regular',
    lastOrder: '2023-03-25',
    churnRisk: 'high',
  },
  {
    id: '6',
    name: 'James Wilson',
    email: 'james@example.com',
    tenure: 270,
    avgOrderValue: 45.50,
    totalSpent: 1137.50,
    loyaltyTier: 'loyal',
    lastOrder: '2023-05-08',
    churnRisk: 'low',
  },
  {
    id: '7',
    name: 'Ava Martinez',
    email: 'ava@example.com',
    tenure: 45,
    avgOrderValue: 32.25,
    totalSpent: 129.00,
    loyaltyTier: 'new',
    lastOrder: '2023-04-12',
    churnRisk: 'high',
  },
  {
    id: '8',
    name: 'Noah Thompson',
    email: 'noah@example.com',
    tenure: 210,
    avgOrderValue: 52.75,
    totalSpent: 738.50,
    loyaltyTier: 'regular',
    lastOrder: '2023-05-01',
    churnRisk: 'medium',
  },
];

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    text: 'Hi! I need help understanding my customer churn prediction.',
    sender: 'user',
    timestamp: new Date('2023-05-15T10:23:00'),
  },
  {
    id: '2',
    text: 'Of course! I can help you understand customer churn prediction. What specific aspects would you like to know more about?',
    sender: 'ai',
    timestamp: new Date('2023-05-15T10:23:15'),
  },
  {
    id: '3',
    text: 'I notice that Olivia Kim has a high churn risk. What factors are contributing to this?',
    sender: 'user',
    timestamp: new Date('2023-05-15T10:24:30'),
  },
  {
    id: '4',
    text: 'Looking at Olivia Kim\'s data, I can see several risk factors: her last order was over 45 days ago, her average order value is lower than your customer average, and her engagement with your email campaigns has dropped by 40% over the last 60 days. Would you like recommendations for re-engagement strategies?',
    sender: 'ai',
    timestamp: new Date('2023-05-15T10:24:45'),
  },
];

// Mock chart data
export const mockOrdersData: ChartData = {
  label: 'Orders',
  dataset: [
    { date: '2023-01-01', value: 12 },
    { date: '2023-01-15', value: 19 },
    { date: '2023-02-01', value: 18 },
    { date: '2023-02-15', value: 14 },
    { date: '2023-03-01', value: 15 },
    { date: '2023-03-15', value: 21 },
    { date: '2023-04-01', value: 25 },
    { date: '2023-04-15', value: 22 },
    { date: '2023-05-01', value: 30 },
    { date: '2023-05-15', value: 29 },
  ],
};

export const mockRevenueData: ChartData = {
  label: 'Revenue',
  dataset: [
    { date: '2023-01-01', value: 450 },
    { date: '2023-01-15', value: 670 },
    { date: '2023-02-01', value: 640 },
    { date: '2023-02-15', value: 520 },
    { date: '2023-03-01', value: 580 },
    { date: '2023-03-15', value: 780 },
    { date: '2023-04-01', value: 950 },
    { date: '2023-04-15', value: 890 },
    { date: '2023-05-01', value: 1200 },
    { date: '2023-05-15', value: 1100 },
  ],
};

// Dashboard stats
export const dashboardStats = [
  { label: 'Total Customers', value: 157, trend: '+12%', emoji: '👥' },
  { label: 'Revenue (MTD)', value: '$4,890', trend: '+8%', emoji: '💰' },
  { label: 'Avg. Order Value', value: '$52.35', trend: '+5%', emoji: '🛍️' },
  { label: 'Churn Risk Alerts', value: '3', trend: '-2', emoji: '⚠️' },
];