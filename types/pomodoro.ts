export interface PomodoroSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsBeforeLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export interface PomodoroSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  type: 'work' | 'shortBreak' | 'longBreak';
  taskId?: string;
  completed: boolean;
  interruptionCount: number;
}

export interface PomodoroState {
  isActive: boolean;
  currentSession: PomodoroSession | null;
  sessionsCompleted: number;
  timeRemaining: number; // in seconds
}