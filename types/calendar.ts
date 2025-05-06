export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isAllDay: boolean;
  color: string;
  relatedTaskId?: string;
  reminderMinutes?: number[];
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number; // e.g., every 2 weeks
    endDate?: Date;
    count?: number; // number of occurrences
  };
  createdAt: Date;
  updatedAt: Date;
}