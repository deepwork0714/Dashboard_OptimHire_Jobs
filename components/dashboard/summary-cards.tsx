'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SummaryResponse, DailyResponse, getDaily } from '@/lib/api';
import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SummaryCardsProps {
  data: SummaryResponse | null;
  isLoading: boolean;
  availableBoards?: number;
}

export function SummaryCards({ data, isLoading, availableBoards = 0 }: SummaryCardsProps) {
  const [dailyData, setDailyData] = useState<DailyResponse | null>(null);
  const [riseRate, setRiseRate] = useState<number>(100);

  // Calculate rise rate from daily data
  useEffect(() => {
    const calculateRiseRate = async () => {
      try {
        const daily = await getDaily(2); // Get last 2 days of data
        setDailyData(daily);
        
        if (daily.data.length >= 2) {
          // Get the last two days : current day and previous day
          const sortedData = [...daily.data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-2);

          const previousTotal = sortedData[0].total;
          const currentTotal = sortedData[1].total;
          console.log('Previous Total:', previousTotal, 'Current Total:', currentTotal);
          if (previousTotal > 0) {
            const rate = ((currentTotal - previousTotal) / previousTotal) * 100;
            setRiseRate(rate);
          } else {
            setRiseRate(100); // Default to 100% if previous was 0
          }
        } else {
          setRiseRate(100); // Default to 100% if only 1 day of data
        }
      } catch (error) {
        console.error('Error calculating rise rate:', error);
        setRiseRate(100); // Default to 100% on error
      }
    };

    if (data) {
      calculateRiseRate();
    }
  }, [data]);
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
            <div className="text-xs text-muted-foreground/70">
              Rise Rate: <span className={riseRate >= 0 ? 'text-green-500' : 'text-red-500'}>
                {riseRate >= 0 ? '+' : ''}{riseRate.toFixed(2)}%
              </span>
            </div>
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

