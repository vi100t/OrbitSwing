import { create } from 'zustand';
import { Task, TaskPriority, TaskCategory, SubTask } from '../types/task';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  addSubTask: (taskId: string, subTask: Omit<SubTask, 'id' | 'createdAt'>) => void;
  updateSubTask: (taskId: string, subTaskId: string, updates: Partial<SubTask>) => void;
  deleteSubTask: (taskId: string, subTaskId: string) => void;
  toggleSubTaskCompletion: (taskId: string, subTaskId: string) => void;
  getTasksByCategory: (category: TaskCategory) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  getCompletedTasks: () => Task[];
  getIncompleteTasks: () => Task[];
}

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Draft and submit the project proposal for the new client',
      completed: false,
      priority: 'high',
      category: 'work',
      dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      subTasks: [
        {
          id: '1-1',
          title: 'Research client background',
          completed: true,
          createdAt: new Date(),
        },
        {
          id: '1-2',
          title: 'Create project timeline',
          completed: false,
          createdAt: new Date(),
        },
        {
          id: '1-3',
          title: 'Prepare budget estimation',
          completed: false,
          createdAt: new Date(),
        },
      ],
      importance: 4,
      urgency: 4,
      tags: ['work', 'client', 'proposal'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'Grocery shopping',
      description: 'Buy groceries for the week',
      completed: false,
      priority: 'medium',
      category: 'personal',
      dueDate: new Date(Date.now() + 86400000), // 1 day from now
      subTasks: [
        {
          id: '2-1',
          title: 'Make shopping list',
          completed: true,
          createdAt: new Date(),
        },
        {
          id: '2-2',
          title: 'Check pantry for existing items',
          completed: true,
          createdAt: new Date(),
        },
        {
          id: '2-3',
          title: 'Visit grocery store',
          completed: false,
          createdAt: new Date(),
        },
      ],
      importance: 3,
      urgency: 3,
      tags: ['personal', 'shopping', 'groceries'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      title: 'Morning jog',
      description: 'Go for a 30-minute morning jog',
      completed: false,
      priority: 'medium',
      category: 'health',
      recurring: {
        frequency: 'daily',
        interval: 1,
      },
      subTasks: [],
      importance: 4,
      urgency: 2,
      tags: ['health', 'exercise', 'routine'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  updateTask: (taskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      ),
    }));
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));
  },

  toggleTaskCompletion: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed, updatedAt: new Date() }
          : task
      ),
    }));
  },

  addSubTask: (taskId, subTask) => {
    const newSubTask: SubTask = {
      ...subTask,
      id: generateId(),
      createdAt: new Date(),
    };
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: [...task.subTasks, newSubTask],
              updatedAt: new Date(),
            }
          : task
      ),
    }));
  },

  updateSubTask: (taskId, subTaskId, updates) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map((subTask) =>
                subTask.id === subTaskId
                  ? { ...subTask, ...updates }
                  : subTask
              ),
              updatedAt: new Date(),
            }
          : task
      ),
    }));
  },

  deleteSubTask: (taskId, subTaskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.filter(
                (subTask) => subTask.id !== subTaskId
              ),
              updatedAt: new Date(),
            }
          : task
      ),
    }));
  },

  toggleSubTaskCompletion: (taskId, subTaskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subTasks: task.subTasks.map((subTask) =>
                subTask.id === subTaskId
                  ? { ...subTask, completed: !subTask.completed }
                  : subTask
              ),
              updatedAt: new Date(),
            }
          : task
      ),
    }));
  },

  getTasksByCategory: (category) => {
    return get().tasks.filter((task) => task.category === category);
  },

  getTasksByPriority: (priority) => {
    return get().tasks.filter((task) => task.priority === priority);
  },

  getCompletedTasks: () => {
    return get().tasks.filter((task) => task.completed);
  },

  getIncompleteTasks: () => {
    return get().tasks.filter((task) => !task.completed);
  },
}));