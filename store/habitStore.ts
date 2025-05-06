import { create } from 'zustand';
import { Habit, HabitLog } from '../types/habit';
import Colors from '../constants/Colors';

interface HabitState {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'currentStreak' | 'longestStreak' | 'logs' | 'createdAt' | 'updatedAt'>) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  logHabitCompletion: (habitId: string, date: string, completed: boolean, note?: string) => void;
  calculateStreak: (habitId: string) => number;
  getHabitsByFrequency: (frequency: 'daily' | 'weekly' | 'custom') => Habit[];
  getActiveHabits: () => Habit[];
  getHabitLogs: (habitId: string, startDate: string, endDate: string) => HabitLog[];
}

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Helper to calculate current date string
const getCurrentDateString = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
};

// Get date from n days ago
const getDateStringDaysAgo = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
};

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [
    {
      id: '1',
      title: 'Morning Meditation',
      description: '10 minutes of mindfulness meditation',
      frequency: 'daily',
      activeDays: [0, 1, 2, 3, 4, 5, 6], // All days
      currentStreak: 5,
      longestStreak: 14,
      startDate: getDateStringDaysAgo(30),
      color: Colors.light.primary[400],
      reminderTime: '08:00',
      logs: Array.from({ length: 30 }, (_, i) => ({
        date: getDateStringDaysAgo(i),
        completed: i < 5 || (i > 10 && i < 15) || (i > 20 && i < 25),
      })),
      createdAt: new Date(Date.now() - 86400000 * 30),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Drink Water',
      description: '8 glasses of water daily',
      frequency: 'daily',
      activeDays: [0, 1, 2, 3, 4, 5, 6], // All days
      targetPerDay: 8,
      currentStreak: 12,
      longestStreak: 20,
      startDate: getDateStringDaysAgo(40),
      color: Colors.light.secondary[400],
      logs: Array.from({ length: 40 }, (_, i) => ({
        date: getDateStringDaysAgo(i),
        completed: i < 12 || (i > 15 && i < 25) || (i > 30 && i < 35),
      })),
      createdAt: new Date(Date.now() - 86400000 * 40),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Weekly Review',
      description: 'Review goals and plan for next week',
      frequency: 'weekly',
      activeDays: [0], // Sunday
      currentStreak: 3,
      longestStreak: 8,
      startDate: getDateStringDaysAgo(60),
      color: Colors.light.accent[400],
      logs: Array.from({ length: 9 }, (_, i) => ({
        date: getDateStringDaysAgo(i * 7),
        completed: i < 3 || i === 5 || i === 7,
      })),
      createdAt: new Date(Date.now() - 86400000 * 60),
      updatedAt: new Date(),
    },
  ],

  addHabit: (habit) => {
    const newHabit: Habit = {
      ...habit,
      id: generateId(),
      currentStreak: 0,
      longestStreak: 0,
      logs: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ habits: [...state.habits, newHabit] }));
  },

  updateHabit: (habitId, updates) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === habitId
          ? { ...habit, ...updates, updatedAt: new Date() }
          : habit
      ),
    }));
  },

  deleteHabit: (habitId) => {
    set((state) => ({
      habits: state.habits.filter((habit) => habit.id !== habitId),
    }));
  },

  logHabitCompletion: (habitId, date, completed, note) => {
    set((state) => {
      const habits = [...state.habits];
      const habitIndex = habits.findIndex((h) => h.id === habitId);
      
      if (habitIndex === -1) return state;
      
      const habit = habits[habitIndex];
      
      // Check if log for this date already exists
      const logIndex = habit.logs.findIndex((log) => log.date === date);
      
      if (logIndex !== -1) {
        // Update existing log
        habit.logs[logIndex] = { 
          ...habit.logs[logIndex], 
          completed, 
          ...(note ? { note } : {}) 
        };
      } else {
        // Add new log
        habit.logs.push({ date, completed, ...(note ? { note } : {}) });
      }
      
      // Calculate new streak
      const streak = get().calculateStreak(habitId);
      habit.currentStreak = streak;
      habit.longestStreak = Math.max(habit.longestStreak, streak);
      habit.updatedAt = new Date();
      
      return { habits };
    });
  },

  calculateStreak: (habitId) => {
    const habit = get().habits.find((h) => h.id === habitId);
    if (!habit) return 0;
    
    const today = getCurrentDateString();
    const sortedLogs = [...habit.logs]
      .filter((log) => log.completed)
      .sort((a, b) => (a.date > b.date ? -1 : 1));
    
    if (sortedLogs.length === 0) return 0;
    
    // Check if the habit was completed today
    const isTodayCompleted = sortedLogs[0].date === today;
    
    // If habit is daily, check consecutive days
    if (habit.frequency === 'daily') {
      let streak = isTodayCompleted ? 1 : 0;
      
      for (let i = isTodayCompleted ? 1 : 0; i < sortedLogs.length; i++) {
        const currentDate = new Date(sortedLogs[i].date);
        const prevDate = new Date(sortedLogs[i - 1].date);
        
        // Check if dates are consecutive
        const diffTime = Math.abs(prevDate.getTime() - currentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
      
      return streak;
    }
    
    // If habit is weekly, check consecutive weeks
    if (habit.frequency === 'weekly') {
      let streak = isTodayCompleted ? 1 : 0;
      
      for (let i = isTodayCompleted ? 1 : 0; i < sortedLogs.length; i++) {
        const currentDate = new Date(sortedLogs[i].date);
        const prevDate = new Date(sortedLogs[i - 1].date);
        
        // Check if weeks are consecutive
        const diffTime = Math.abs(prevDate.getTime() - currentDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays <= 14 && diffDays >= 6) {
          streak++;
        } else {
          break;
        }
      }
      
      return streak;
    }
    
    // For custom frequency, just count completed days
    return sortedLogs.length;
  },

  getHabitsByFrequency: (frequency) => {
    return get().habits.filter((habit) => habit.frequency === frequency);
  },

  getActiveHabits: () => {
    return get().habits;
  },

  getHabitLogs: (habitId, startDate, endDate) => {
    const habit = get().habits.find((h) => h.id === habitId);
    if (!habit) return [];
    
    return habit.logs.filter(
      (log) => log.date >= startDate && log.date <= endDate
    );
  },
}));