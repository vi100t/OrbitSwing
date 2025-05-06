import { create } from 'zustand';
import { PomodoroSettings, PomodoroSession, PomodoroState } from '../types/pomodoro';

interface PomodoroStore {
  settings: PomodoroSettings;
  state: PomodoroState;
  history: PomodoroSession[];
  updateSettings: (updates: Partial<PomodoroSettings>) => void;
  startSession: (taskId?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  completeSession: () => void;
  skipSession: () => void;
  resetSession: () => void;
  logInterruption: () => void;
  updateTimeRemaining: (seconds: number) => void;
  getSessionsForDay: (date: Date) => PomodoroSession[];
  getCompletedSessionsCount: () => number;
  getTotalFocusTime: () => number; // in minutes
}

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const usePomodoroStore = create<PomodoroStore>((set, get) => ({
  settings: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  },
  
  state: {
    isActive: false,
    currentSession: null,
    sessionsCompleted: 0,
    timeRemaining: 25 * 60, // 25 minutes in seconds
  },
  
  history: [],
  
  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates },
      // Update timeRemaining if we're not in an active session
      state: state.state.isActive
        ? state.state
        : {
            ...state.state,
            timeRemaining:
              (updates.workDuration || state.settings.workDuration) * 60,
          },
    }));
  },
  
  startSession: (taskId) => {
    const { settings, state } = get();
    const sessionsCompleted = state.sessionsCompleted;
    
    // Determine session type
    let type: 'work' | 'shortBreak' | 'longBreak' = 'work';
    let duration = settings.workDuration;
    
    if (state.currentSession && state.currentSession.type === 'work') {
      // After work session, determine break type
      type = sessionsCompleted % settings.sessionsBeforeLongBreak === 0 
        ? 'longBreak' 
        : 'shortBreak';
      duration = type === 'longBreak' 
        ? settings.longBreakDuration 
        : settings.shortBreakDuration;
    }
    
    const newSession: PomodoroSession = {
      id: generateId(),
      startTime: new Date(),
      duration,
      type,
      ...(taskId ? { taskId } : {}),
      completed: false,
      interruptionCount: 0,
    };
    
    set({
      state: {
        isActive: true,
        currentSession: newSession,
        sessionsCompleted: state.sessionsCompleted,
        timeRemaining: duration * 60, // convert to seconds
      },
    });
  },
  
  pauseSession: () => {
    set((state) => ({
      state: {
        ...state.state,
        isActive: false,
      },
    }));
  },
  
  resumeSession: () => {
    set((state) => ({
      state: {
        ...state.state,
        isActive: true,
      },
    }));
  },
  
  completeSession: () => {
    const { state } = get();
    if (!state.currentSession) return;
    
    const completedSession = {
      ...state.currentSession,
      completed: true,
      endTime: new Date(),
    };
    
    // Add session to history
    set((state) => ({
      history: [...state.history, completedSession],
      state: {
        ...state.state,
        isActive: false,
        currentSession: null,
        // Increment sessionsCompleted only after work sessions
        sessionsCompleted: 
          completedSession.type === 'work'
            ? state.state.sessionsCompleted + 1
            : state.state.sessionsCompleted,
        timeRemaining: 0,
      },
    }));
  },
  
  skipSession: () => {
    const { state, settings } = get();
    if (!state.currentSession) return;
    
    // Add skipped session to history
    const skippedSession = {
      ...state.currentSession,
      completed: false,
      endTime: new Date(),
    };
    
    // Skip to the next session type
    let nextType: 'work' | 'shortBreak' | 'longBreak';
    let nextDuration: number;
    
    if (state.currentSession.type === 'work') {
      // After work, go to break
      nextType = 
        state.sessionsCompleted % settings.sessionsBeforeLongBreak === 0
          ? 'longBreak'
          : 'shortBreak';
      nextDuration = 
        nextType === 'longBreak'
          ? settings.longBreakDuration
          : settings.shortBreakDuration;
    } else {
      // After break, go to work
      nextType = 'work';
      nextDuration = settings.workDuration;
    }
    
    set((state) => ({
      history: [...state.history, skippedSession],
      state: {
        ...state.state,
        isActive: false,
        currentSession: null,
        // Only increment if we're skipping a work session
        sessionsCompleted: 
          skippedSession.type === 'work'
            ? state.state.sessionsCompleted + 1
            : state.state.sessionsCompleted,
        timeRemaining: nextDuration * 60,
      },
    }));
  },
  
  resetSession: () => {
    const { settings } = get();
    
    set({
      state: {
        isActive: false,
        currentSession: null,
        sessionsCompleted: 0,
        timeRemaining: settings.workDuration * 60,
      },
    });
  },
  
  logInterruption: () => {
    set((state) => {
      if (!state.state.currentSession) return state;
      
      return {
        state: {
          ...state.state,
          currentSession: {
            ...state.state.currentSession,
            interruptionCount: 
              (state.state.currentSession.interruptionCount || 0) + 1,
          },
        },
      };
    });
  },
  
  updateTimeRemaining: (seconds) => {
    set((state) => ({
      state: {
        ...state.state,
        timeRemaining: seconds,
      },
    }));
  },
  
  getSessionsForDay: (date) => {
    const { history } = get();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return history.filter((session) => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= targetDate && sessionDate < nextDay;
    });
  },
  
  getCompletedSessionsCount: () => {
    return get().history.filter((session) => 
      session.completed && session.type === 'work'
    ).length;
  },
  
  getTotalFocusTime: () => {
    return get().history
      .filter((session) => session.completed && session.type === 'work')
      .reduce((total, session) => total + session.duration, 0);
  },
}));