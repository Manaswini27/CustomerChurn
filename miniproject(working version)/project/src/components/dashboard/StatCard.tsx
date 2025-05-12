import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend: string;
  emoji: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, emoji }) => {
  const isPositive = trend.startsWith('+');
  
  return (
    <div className="bg-white rounded-xl shadow-soft p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
          <div className={`inline-flex items-center mt-2 text-xs font-medium ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend}
          </div>
        </div>
        <div className="text-2xl">{emoji}</div>
      </div>
    </div>
  );
};

export default StatCard;