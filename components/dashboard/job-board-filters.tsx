'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface JobBoardFiltersProps {
  selectedDate: string;
  selectedBoard: string;
  availableBoards: string[];
  onDateChange: (date: string) => void;
  onBoardChange: (board: string) => void;
  isLoading?: boolean;
}

export function JobBoardFilters({
  selectedDate,
  selectedBoard,
  availableBoards,
  onDateChange,
  onBoardChange,
  isLoading = false,
}: JobBoardFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 mb-6">
      <div className="space-y-2">
        <Label htmlFor="date-filter">Filter by Date</Label>
        <Input
          id="date-filter"
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          disabled={isLoading}
          max={new Date().toISOString().split('T')[0]}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="board-filter">Filter by Job Board</Label>
        <Select
          value={selectedBoard || undefined}
          onValueChange={onBoardChange}
          disabled={isLoading}
        >
          <SelectTrigger id="board-filter">
            <SelectValue placeholder="Select a job board" />
          </SelectTrigger>
          <SelectContent>
            {availableBoards.map((board) => (
              <SelectItem key={board} value={board}>
                {board}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

