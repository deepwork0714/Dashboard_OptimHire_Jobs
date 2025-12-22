'use client';

import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ByBoardDataPoint } from '@/lib/api';

interface BoardLineChartProps {
  data: ByBoardDataPoint[];
  boardName: string;
}

export function BoardLineChart({ data, boardName }: BoardLineChartProps) {
  // Calculate dynamic Y-axis domain with padding for Total Jobs
  const calculateTotalAxisDomain = () => {
    if (!data || data.length === 0) return [1, 100];
    
    let minValue = Infinity;
    let maxValue = 0;
    
    data.forEach((item) => {
      const total = item.total ?? 0;
      minValue = Math.min(minValue, total);
      maxValue = Math.max(maxValue, total);
    });
    
    minValue = isFinite(minValue) ? minValue : 1;
    const padding = Math.max((maxValue - minValue) * 0.1, 10);
    
    return [Math.max(minValue - padding, 1), maxValue + padding];
  };

  // Calculate dynamic Y-axis domain with padding for Active Jobs
  const calculateActiveAxisDomain = () => {
    if (!data || data.length === 0) return [1, 100];
    
    let minValue = Infinity;
    let maxValue = 0;
    
    data.forEach((item) => {
      const active = item.active ?? 0;
      minValue = Math.min(minValue, active);
      maxValue = Math.max(maxValue, active);
    });
    
    minValue = isFinite(minValue) ? minValue : 1;
    const padding = Math.max((maxValue - minValue) * 0.1, 10);
    
    return [Math.max(minValue - padding, 1), maxValue + padding];
  };

  const totalAxisDomain = calculateTotalAxisDomain();
  const activeAxisDomain = calculateActiveAxisDomain();

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
      <ComposedChart
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
          yAxisId="left"
          scale="log"
          domain={totalAxisDomain}
          tickFormatter={formatNumber}
          className="text-xs"
          stroke="hsl(var(--primary))"
          label={{ value: 'Total Jobs', angle: -90, position: 'insideLeft' }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          scale="log"
          domain={activeAxisDomain}
          tickFormatter={formatNumber}
          className="text-xs"
          stroke="hsl(142, 76%, 36%)"
          label={{ value: 'Active Jobs', angle: 90, position: 'insideRight' }}
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

        <Area
          yAxisId="right"
          type="monotone"
          dataKey="active"
          fill="hsl(142, 76%, 36%)"
          stroke="hsl(142, 76%, 36%)"
          fillOpacity={0.3}
          strokeWidth={2}
          name="Active Jobs"
          animationDuration={400}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="total"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          name="Total Jobs"
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={500}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

