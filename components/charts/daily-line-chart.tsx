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
    <ResponsiveContainer width="100%" height={320}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 24, left: 8, bottom: 6 }}
      >
        <CartesianGrid strokeDasharray="3 6" className="stroke-muted/20" />
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
          formatter={(value: number, name: string) => [
            value.toLocaleString(),
            name,
          ]}
        />
        <Legend verticalAlign="top" height={30} />

        <Line
          type="monotone"
          dataKey="total"
          stroke="hsl(188, 100%, 50%)"
          strokeWidth={3}
          dot={false}
          activeDot={{ r: 5 }}
          name="Total Jobs"
          animationDuration={400}
        />
        <Line
          type="monotone"
          dataKey="active"
          stroke="hsl(96, 100%, 50%)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          name="Active Jobs"
          animationDuration={400}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

