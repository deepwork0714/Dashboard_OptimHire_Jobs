'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SummaryResponse } from '@/lib/api';
import { TrendingUp } from 'lucide-react';

interface SummaryCardsProps {
  data: SummaryResponse | null;
  isLoading: boolean;
  availableBoards?: number;
}

export function SummaryCards({ data, isLoading, availableBoards = 0 }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <p className="text-xs text-muted-foreground/70">As of {new Date(data.latest_date).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold text-primary">{data.total_jobs.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground/70">Growth <span className="text-accent">+{(data.total_change ?? 0).toFixed(1)}%</span></div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <p className="text-xs text-muted-foreground/70">Currently active listings</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold text-primary">{data.active_jobs.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground/70">Percent <span className="text-accent">{data.active_percentage.toFixed(2)}%</span></div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-sm font-medium">Boards</CardTitle>
            <p className="text-xs text-muted-foreground/70">Available job boards</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-extrabold text-primary">{availableBoards}</div>
            <div className="text-xs text-muted-foreground/70">Active <span className="text-accent">{data.active_percentage.toFixed(2)}%</span></div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

