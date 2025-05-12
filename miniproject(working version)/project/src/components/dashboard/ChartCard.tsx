import React from 'react';
import { ChartData } from '../../types';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: ChartData;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, data }) => {
  // This is a simplified chart component using CSS
  // In a real application, you would use a charting library like Chart.js or recharts
  
  const maxValue = Math.max(...data.dataset.map(item => item.value));
  
  return (
    <div className="bg-white rounded-xl shadow-soft p-4 hover:shadow-md transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      
      <div className="h-60 flex items-end space-x-1">
        {data.dataset.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          
          return (
            <div 
              key={index} 
              className="flex-1 flex flex-col items-center group"
            >
              <div 
                className="w-full bg-primary-200 hover:bg-primary-300 transition-all rounded-t-sm"
                style={{ height: `${height}%` }}
              ></div>
              <div className="mt-2 text-xxs text-gray-500 hidden md:block">
                {new Date(item.date).toLocaleDateString(undefined, { 
                  month: 'short', 
                  day: 'numeric'
                })}
              </div>
              <div className="hidden group-hover:block absolute -mt-16 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap">
                {data.label}: {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartCard;