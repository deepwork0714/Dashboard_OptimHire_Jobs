'use client';

import {
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BoardStats } from '@/lib/api';

interface BoardBarChartProps {
  data: BoardStats[];
}

export function BoardBarChart({ data }: BoardBarChartProps) {
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
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="board"
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
          // Show absolute and percentage in tooltip (guard against missing payload fields)
          formatter={(value: number, name: string, props: any) => {
            const payload = props && props.payload ? props.payload : {};
            const total = payload.count ?? ((payload.active ?? 0) + (payload.inactive ?? 0)) ?? 0;
            const pct = total > 0 ? (value / total) * 100 : 0;
            return [`${value.toLocaleString()} (${pct.toFixed(1)}%)`, name];
          }}
        />
        <Legend />
        {/* Use stacked bars so each board shows a single bar with active + inactive segments */}
        <Bar
          dataKey="active"
          fill="hsl(142, 76%, 36%)"
          name="Active"
          radius={[4, 4, 0, 0]}
          stackId="a"
          animationDuration={500}
        >
          {/* Percentage label inside active segment */}
          <LabelList
            dataKey="active"
            content={(props: any) => {
              const { x = 0, y = 0, width = 0, height = 0, value = 0 } = props || {};
              const payload = props?.payload ?? {};
              const total = payload.count ?? ((payload.active ?? 0) + (payload.inactive ?? 0));
              if (!total || !width) return null;
              const pct = total > 0 ? (value / total) * 100 : 0;
              const cx = x + width / 2;
              const cy = y + height / 2;
              const text = `${pct.toFixed(0)}%`;
              return (
                <text
                  x={cx}
                  y={cy}
                  fill="#fff"
                  fontSize={12}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ pointerEvents: 'none' }}
                >
                  {text}
                </text>
              );
            }}
          />
        </Bar>
        <Bar
          dataKey="inactive"
          fill="hsl(var(--muted-foreground))"
          name="Inactive"
          radius={[0, 0, 4, 4]}
          stackId="a"
          animationDuration={500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

