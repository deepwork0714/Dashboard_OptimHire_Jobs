'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SummaryCards } from '@/components/dashboard/summary-cards';
import { JobBoardFilters } from '@/components/dashboard/job-board-filters';
import { DailyLineChart } from '@/components/charts/daily-line-chart';
import { BoardBarChart } from '@/components/charts/board-bar-chart';
import { BoardLineChart } from '@/components/charts/board-line-chart';
import {
  getSummary,
  getDaily,
  getByDate,
  getByBoard,
  type SummaryResponse,
  type DailyResponse,
  type ByDateResponse,
  type ByBoardResponse,
} from '@/lib/api';

export default function DashboardPage() {
  // State for summary data
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  // State for daily data
  const [dailyData, setDailyData] = useState<DailyResponse | null>(null);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [dailyError, setDailyError] = useState<string | null>(null);

  // Days filter for daily chart (default to 7 days)
  const [dailyDays, setDailyDays] = useState<number>(7);

  // State for board/date filters
  // Default selected date: today's date in YYYY-MM-DD (so the date picker defaults to today)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [availableBoards, setAvailableBoards] = useState<string[]>([]);

  // State for board/date data
  const [boardDateData, setBoardDateData] = useState<ByDateResponse | null>(null);
  const [boardDateLoading, setBoardDateLoading] = useState(false);
  const [boardDateError, setBoardDateError] = useState<string | null>(null);

  // State for board-specific data
  const [boardData, setBoardData] = useState<ByBoardResponse | null>(null);
  const [boardLoading, setBoardLoading] = useState(false);
  const [boardError, setBoardError] = useState<string | null>(null);

  // Days filter for board chart (default to 7 days)
  const [boardDays, setBoardDays] = useState<number>(7);

  // Track if initial date fetch has been done to prevent duplicate calls
  const initialDateFetchDone = useRef(false);


  // Fetch summary data
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        const data = await getSummary();
        setSummary(data);
      } catch (error) {
        setSummaryError(error instanceof Error ? error.message : 'Failed to load summary');
        console.error('Error fetching summary:', error);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
  }, []);

  // Fetch daily data (runs on mount and when dailyDays changes)
  useEffect(() => {
    const fetchDaily = async () => {
      try {
        setDailyLoading(true);
        setDailyError(null);
        const data = await getDaily(dailyDays);
        setDailyData(data);
      } catch (error) {
        setDailyError(error instanceof Error ? error.message : 'Failed to load daily data');
        console.error('Error fetching daily data:', error);
      } finally {
        setDailyLoading(false);
      }
    };

    fetchDaily();
  }, [dailyDays]);

  // Fetch available boards from latest date
  useEffect(() => {
    const fetchBoards = async () => {
      if (!summary) return;

      try {
        const data = await getByDate(summary.latest_date);
        const boards = data.boards.map((b) => b.board).sort();
        setAvailableBoards(boards);
      } catch (error) {
        console.error('Error fetching boards:', error);
      }
    };

    fetchBoards();
  }, [summary]);

  // Handlers for filter changes (mutually exclusive)
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (date) {
      setSelectedBoard(''); // Clear board when date is selected
    }
  };

  const handleBoardChange = (board: string) => {
    setSelectedBoard(board);
    if (board) {
      setSelectedDate(''); // Clear date when board is selected
    }
  };

  // Fetch data when date is selected
  useEffect(() => {
    if (!selectedDate) {
      setBoardDateData(null);
      return;
    }

    const fetchByDate = async () => {
      try {
        setBoardDateLoading(true);
        setBoardDateError(null);
        const data = await getByDate(selectedDate);
        setBoardDateData(data);
      } catch (error) {
        setBoardDateError(error instanceof Error ? error.message : 'Failed to load data for selected date');
        console.error('Error fetching data by date:', error);
      } finally {
        setBoardDateLoading(false);
      }
    };

    fetchByDate();
  }, [selectedDate]);

  // Fetch data when board is selected or boardDays changes
  useEffect(() => {
    if (!selectedBoard) {
      setBoardData(null);
      return;
    }

    const fetchByBoard = async () => {
      try {
        setBoardLoading(true);
        setBoardError(null);
        const data = await getByBoard(selectedBoard, boardDays);
        setBoardData(data);
      } catch (error) {
        setBoardError(error instanceof Error ? error.message : 'Failed to load data for selected board');
        console.error('Error fetching data by board:', error);
      } finally {
        setBoardLoading(false);
      }
    };

    fetchByBoard();
  }, [selectedBoard, boardDays]);

  // Determine what chart to show in section 3
  const showDateChart = selectedDate && !selectedBoard;
  const showBoardChart = selectedBoard && !selectedDate;
  const isLoadingBoardDate = boardDateLoading || boardLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Real-time job posting statistics and analytics
          </p>
        </div>

        {/* Section 1: Summary Cards */}
        <div>
          <SummaryCards data={summary} isLoading={summaryLoading} availableBoards={availableBoards.length} />
          {summaryError && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
              {summaryError}
            </div>
          )}
        </div>

        {/* Section 2: Job Status by Daily */}
        <Card>
          <CardHeader>
            <div className="w-full flex items-start justify-between">
              <div>
                <CardTitle>Job Status by Daily</CardTitle>
                <CardDescription>
                  Total and active jobs over the last {dailyDays} days
                </CardDescription>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-muted-foreground">Range:</label>
                <select
                  className="rounded-md border bg-background px-2 py-1 text-sm"
                  value={dailyDays}
                  onChange={(e) => setDailyDays(Number(e.target.value))}
                >
                  <option value={7}>Last 7 days</option>
                  <option value={14}>Last 14 days</option>
                </select>

                <button
                  type="button"
                  className="rounded-md border bg-background px-3 py-1 text-sm hover:bg-accent/10"
                  onClick={() => {
                    if (!dailyData) return;
                    const filename = `daily-data-${dailyDays}d.json`;
                    const blob = new Blob([JSON.stringify(dailyData.data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Save as JSON
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {dailyLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : dailyError ? (
              <div className="flex items-center justify-center h-[400px] text-destructive">
                {dailyError}
              </div>
            ) : dailyData && dailyData.data.length > 0 ? (
              <DailyLineChart data={dailyData.data} />
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                No daily data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 3: Job Status by Job Board & Daily */}
        <Card>
          <CardHeader>
            <div className="w-full flex items-start justify-between">
              <div>
                <CardTitle>Job Status by Job Board & Daily</CardTitle>
                <CardDescription>
                  Filter by date to see board breakdown, or by board to see daily trends
                </CardDescription>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-muted-foreground">Range:</label>
                <select
                  className="rounded-md border bg-background px-2 py-1 text-sm"
                  value={boardDays}
                  onChange={(e) => setBoardDays(Number(e.target.value))}
                >
                  <option value={7}>Last 7 days</option>
                  <option value={14}>Last 14 days</option>
                </select>

                <button
                  type="button"
                  className="rounded-md border bg-background px-3 py-1 text-sm hover:bg-accent/10"
                  onClick={() => {
                    if (!boardData) return;
                    const filename = `board-${boardData.board}-${boardDays}d.json`;
                    const blob = new Blob([JSON.stringify(boardData.data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Save as JSON
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <JobBoardFilters
              selectedDate={selectedDate}
              selectedBoard={selectedBoard}
              availableBoards={availableBoards}
              onDateChange={handleDateChange}
              onBoardChange={handleBoardChange}
              isLoading={isLoadingBoardDate}
            />

            {isLoadingBoardDate ? (
              <Skeleton className="h-[400px] w-full" />
            ) : showDateChart && boardDateData ? (
              boardDateError ? (
                <div className="flex items-center justify-center h-[400px] text-destructive">
                  {boardDateError}
                </div>
              ) : boardDateData.boards.length > 0 ? (
                <BoardBarChart data={boardDateData.boards} />
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  No data available for selected date
                </div>
              )
            ) : showBoardChart && boardData ? (
              boardError ? (
                <div className="flex items-center justify-center h-[400px] text-destructive">
                  {boardError}
                </div>
              ) : boardData.data.length > 0 ? (
                <BoardLineChart data={boardData.data} boardName={boardData.board} />
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  No data available for selected board
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                Select a date or job board to view data
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

