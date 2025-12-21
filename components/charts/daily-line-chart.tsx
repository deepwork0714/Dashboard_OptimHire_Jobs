'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DailyDataPoint } from '@/lib/api';

interface DailyLineChartProps {
  data: DailyDataPoint[];
}

export function DailyLineChart({ data }: DailyLineChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          className="text-xs"
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          tickFormatter={formatNumber}
          className="text-xs"
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
          labelFormatter={(label) => formatDate(label)}
          formatter={(value: number) => [
            value.toLocaleString(),
            '',
          ]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          name="Total Jobs"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={500}
        />
        <Line
          type="monotone"
          dataKey="active"
          stroke="hsl(142, 76%, 36%)"
          strokeWidth={2}
          name="Active Jobs"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

