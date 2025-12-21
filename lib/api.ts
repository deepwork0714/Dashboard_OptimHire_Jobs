const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000' || 'https://dynamogenous-surefootedly-cordell.ngrok-free.dev';

// Types
export interface SummaryResponse {
  latest_date: string;
  total_jobs: number;
  active_jobs: number;
  active_percentage: number;
}

export interface DailyDataPoint {
  date: string;
  total: number;
  active: number;
}

export interface DailyResponse {
  data: DailyDataPoint[];
}

export interface BoardStats {
  board: string;
  count: number;
  active: number;
  inactive: number;
}

export interface ByDateResponse {
  date: string;
  boards: BoardStats[];
}

export interface ByBoardDataPoint {
  date: string;
  total: number;
  active: number;
}

export interface ByBoardResponse {
  board: string;
  data: ByBoardDataPoint[];
}

// API functions
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return response.json();
}

export async function getSummary(): Promise<SummaryResponse> {
  return fetchAPI<SummaryResponse>('/dashboard/summary');
}

export async function getDaily(days: number = 7): Promise<DailyResponse> {
  return fetchAPI<DailyResponse>(`/dashboard/daily?days=${days}`);
}

export async function getByDate(date: string): Promise<ByDateResponse> {
  return fetchAPI<ByDateResponse>(`/dashboard/by-date?date=${date}`);
}

export async function getByBoard(board: string, days: number = 7): Promise<ByBoardResponse> {
  return fetchAPI<ByBoardResponse>(`/dashboard/by-board?board=${encodeURIComponent(board)}&days=${days}`);
}

