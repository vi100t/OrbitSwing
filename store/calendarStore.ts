import { create } from 'zustand';
import { CalendarEvent } from '../types/calendar';
import Colors from '../constants/Colors';

interface CalendarState {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (eventId: string) => void;
  getEventsForDay: (date: Date) => CalendarEvent[];
  getEventsForRange: (startDate: Date, endDate: Date) => CalendarEvent[];
  getEventById: (eventId: string) => CalendarEvent | undefined;
}

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCalendarStore = create<CalendarState>((set, get) => ({
  events: [
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly team sync-up',
      startTime: new Date(new Date().setHours(10, 0, 0, 0)),
      endTime: new Date(new Date().setHours(11, 0, 0, 0)),
      location: 'Conference Room A',
      isAllDay: false,
      color: Colors.light.primary[400],
      reminderMinutes: [15, 60],
      recurrence: {
        frequency: 'weekly',
        interval: 1,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Dentist Appointment',
      description: 'Regular checkup',
      startTime: new Date(new Date().setDate(new Date().getDate() + 2).setHours(14, 30, 0, 0)),
      endTime: new Date(new Date().setDate(new Date().getDate() + 2).setHours(15, 30, 0, 0)),
      location: 'Dental Clinic',
      isAllDay: false,
      color: Colors.light.error[400],
      reminderMinutes: [60, 1440], // 1 hour and 1 day before
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Mom\'s Birthday',
      startTime: new Date(new Date().setDate(new Date().getDate() + 5).setHours(0, 0, 0, 0)),
      endTime: new Date(new Date().setDate(new Date().getDate() + 5).setHours(23, 59, 59, 999)),
      isAllDay: true,
      color: Colors.light.accent[400],
      reminderMinutes: [1440, 10080], // 1 day and 1 week before
      recurrence: {
        frequency: 'yearly',
        interval: 1,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  addEvent: (event) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ events: [...state.events, newEvent] }));
  },

  updateEvent: (eventId, updates) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === eventId
          ? { ...event, ...updates, updatedAt: new Date() }
          : event
      ),
    }));
  },

  deleteEvent: (eventId) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== eventId),
    }));
  },

  getEventsForDay: (date) => {
    const { events } = get();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return events.filter((event) => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      
      // Check if event occurs on the target date
      return (
        (eventStart >= targetDate && eventStart < nextDay) || // Starts on the day
        (eventEnd >= targetDate && eventEnd < nextDay) || // Ends on the day
        (eventStart < targetDate && eventEnd >= nextDay) || // Spans the entire day
        (event.isAllDay && 
          eventStart.getFullYear() === targetDate.getFullYear() &&
          eventStart.getMonth() === targetDate.getMonth() &&
          eventStart.getDate() === targetDate.getDate())
      );
    });
  },

  getEventsForRange: (startDate, endDate) => {
    const { events } = get();
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return events.filter((event) => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      
      // Check if event occurs within the date range
      return (
        (eventStart >= start && eventStart <= end) || // Starts within range
        (eventEnd >= start && eventEnd <= end) || // Ends within range
        (eventStart < start && eventEnd > end) // Spans the entire range
      );
    });
  },

  getEventById: (eventId) => {
    return get().events.find((event) => event.id === eventId);
  },
}));