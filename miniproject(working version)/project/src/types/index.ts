// Customer types
export interface Customer {
  id: string;
  name: string;
  email: string;
  tenure: number; // in days
  avgOrderValue: number;
  totalSpent: number;
  loyaltyTier: 'new' | 'regular' | 'loyal';
  lastOrder: string; // date string
  churnRisk: 'low' | 'medium' | 'high';
}

// Chat types
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface ChartData {
  dataset: ChartDataPoint[];
  label: string;
}