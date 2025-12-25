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
  // Calculate dynamic Y-axis domain with padding
  const calculateYAxisDomain = () => {
    if (!data || data.length === 0) return [0, 100];
    
    let maxValue = 0;
    data.forEach((item) => {
      const total = (item.active ?? 0) + (item.inactive ?? 0);
      maxValue = Math.max(maxValue, total);
    });
    
    const padding = Math.max(maxValue * 0.1, 10);
    const minValue = Math.max(0, 0 - padding);
    const max = maxValue + padding;
    
    return [minValue, max];
  };

  const yAxisDomain = calculateYAxisDomain();

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
    <ResponsiveContainer width="100%" height={360}>
      <BarChart
        data={data}
        margin={{ top: 14, right: 16, left: 10, bottom: 6 }}
      >
        <defs>
          <linearGradient id="barActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,200,255,0.98)" />
            <stop offset="100%" stopColor="rgba(0,200,255,0.6)" />
          </linearGradient>
          <linearGradient id="barInactive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(200,255,0,0.85)" />
            <stop offset="100%" stopColor="rgba(200,255,0,0.4)" />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="2 6" className="stroke-muted/20" />
        <XAxis
          dataKey="board"
          className="text-xs"
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          domain={yAxisDomain}
          tickFormatter={formatNumber}
          className="text-xs"
          stroke="hsl(var(--muted-foreground))"
        />
        <Tooltip content={<BarCustomTooltip />} />

        <Legend verticalAlign="top" height={28} />

        <Bar
          dataKey="inactive"
          fill="url(#barInactive)"
          name="Inactive"
          radius={0}
          stackId="a"
          animationDuration={500}
        />
        <Bar
          dataKey="active"
          fill="url(#barActive)"
          name="Active"
          radius={0}
          stackId="a"
          animationDuration={500}
        >
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
                  fontWeight={600}
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
      </BarChart>
    </ResponsiveContainer>
  );
}

function BarCustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  const entries = payload.map((p: any) => ({ name: p.name, value: p.value ?? 0, color: p.color || p.fill }));
  const total = entries.reduce((s: number, e: any) => s + (e.value || 0), 0);
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
      <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>{label}</div>
      <div style={{ marginTop: 6 }}>
        {entries.map((e: any) => (
          <div key={e.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ color: e.color, fontWeight: 600 }}>{e.name + ": "}</div>
            <div>{e.value.toLocaleString()}</div>
          </div>
        ))}
        <hr style={{ border: "none", borderTop: "2px solid hsl(var(--border))", margin: "8px 0" }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ fontWeight: 600 }}>{"Total : "}</div>
          <div>{total.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

