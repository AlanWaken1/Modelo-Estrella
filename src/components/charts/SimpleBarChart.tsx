'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SimpleBarChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: string | number;
  }>;
  dataKey?: string;
  xAxisKey?: string;
  title?: string;
  color?: string;
}

export default function SimpleBarChart({
  data,
  dataKey = 'value',
  xAxisKey = 'name',
  title,
  color = '#8884d8'
}: SimpleBarChartProps) {
  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
