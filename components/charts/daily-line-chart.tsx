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
  mode?: 'total' | 'active';
}

export function DailyLineChart({ data, mode = 'total' }: DailyLineChartProps) {
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

  const yAxisDomain = mode === 'total' ? totalAxisDomain : activeAxisDomain;
  const yAxisLabel = mode === 'total' ? 'Total Jobs' : 'Active Jobs';

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
          domain={yAxisDomain}
          tickFormatter={formatNumber}
          className="text-xs"
          stroke="hsl(var(--muted-foreground))"
          label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend verticalAlign="top" height={30} />

        {mode === 'active' ? (
          <Line
            key={`line-active-${data.length}`}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={500}
            type="monotone"
            dataKey="active"
            stroke="hsl(142, 76%, 36%)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Active Jobs"
          />
        ) : (
          <Line
            key={`line-total-${data.length}`}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={500}
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Total Jobs"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0];
  const value = item?.value ?? 0;
  return (
    <div
      style={{
        backgroundColor: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: 'var(--radius)',
        padding: 8,
        boxShadow: '0 6px 18px rgba(0,0,0,0.25)'
      }}
    >
      <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>{new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
      <div style={{ marginTop: 6, fontSize: 16, fontWeight: 600, color: item?.color || 'hsl(var(--primary))' }}>{value.toLocaleString()}</div>
    </div>
  );
}

