export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'work' | 'personal' | 'health' | 'education' | 'finance' | 'other';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: Date;
  reminderTime?: Date;
  subTasks: SubTask[];
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    days?: number[]; // For weekly, days of week (0-6)
    interval?: number; // E.g., every 2 weeks
  };
  importance: number; // 1-5 for Eisenhower Matrix
  urgency: number; // 1-5 for Eisenhower Matrix
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}