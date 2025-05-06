export interface HabitLog {
  date: string; // YYYY-MM-DD format
  completed: boolean;
  note?: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  activeDays: number[]; // 0-6 for days of week
  targetPerDay?: number; // How many times per day
  currentStreak: number;
  longestStreak: number;
  startDate: string; // YYYY-MM-DD format
  color: string;
  icon?: string;
  reminderTime?: string; // HH:MM format
  logs: HabitLog[]; // Historical log data
  createdAt: Date;
  updatedAt: Date;
}