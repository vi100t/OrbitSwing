import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Filter, ListFilter } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTaskStore } from '../../store/taskStore';
import { Task, TaskCategory, TaskPriority } from '../../types/task';

import AnimatedBackground from '../../components/AnimatedBackground';
import GlassmorphicCard from '../../components/GlassmorphicCard';
import TaskItem from '../../components/TaskItem';
import EisenhowerMatrix from '../../components/EisenhowerMatrix';

import Colors from '../../constants/Colors';
import { FONTS, SPACING } from '../../constants/Theme';

export default function TasksScreen() {
  // States
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'matrix'>('list');
  
  // Animation values
  const searchHeight = useSharedValue(0);
  const searchOpacity = useSharedValue(0);
  const [showSearch, setShowSearch] = useState(false);
  
  // Task store
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskCompletion, 
    toggleSubTaskCompletion,
  } = useTaskStore();
  
  // Toggle search bar
  const toggleSearch = () => {
    if (showSearch) {
      searchHeight.value = withTiming(0);
      searchOpacity.value = withTiming(0, {}, () => {
        setShowSearch(false);
      });
    } else {
      setShowSearch(true);
      searchHeight.value = withTiming(50);
      searchOpacity.value = withTiming(1);
    }
  };
  
  // Toggle task expansion
  const handleToggleExpand = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };
  
  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    
    // Category filter
    if (categoryFilter && task.category !== categoryFilter) {
      return false;
    }
    
    // Priority filter
    if (priorityFilter && task.priority !== priorityFilter) {
      return false;
    }
    
    // Completed filter
    if (!showCompleted && task.completed) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by completed status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by due date if available
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    
    // Then by priority
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  // Search bar animation style
  const searchAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: searchHeight.value,
      opacity: searchOpacity.value,
      overflow: 'hidden',
    };
  });
  
  // Category chips
  const categories: TaskCategory[] = ['work', 'personal', 'health', 'education', 'finance', 'other'];
  
  // Priority chips
  const priorities: TaskPriority[] = ['urgent', 'high', 'medium', 'low'];
  
  // Handle task selection from matrix
  const handleTaskSelect = (taskId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: true,
    }));
    
    // In a real app, this might navigate to task details
  };
  
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerControls}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={toggleSearch}
            >
              <Search size={22} color={Colors.light.text} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.headerButton, 
                { backgroundColor: viewMode === 'matrix' ? Colors.light.primary[100] : 'transparent' },
              ]}
              onPress={() => setViewMode(viewMode === 'list' ? 'matrix' : 'list')}
            >
              <ListFilter 
                size={22} 
                color={viewMode === 'matrix' ? Colors.light.primary[500] : Colors.light.text} 
              />
            </TouchableOpacity>
          </View>
          
          {/* Search bar */}
          {showSearch && (
            <Animated.View style={[styles.searchContainer, searchAnimatedStyle]}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search tasks..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={Colors.light.neutral[400]}
              />
            </Animated.View>
          )}
          
          {/* Filter chips */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {/* Show/hide completed */}
            <TouchableOpacity
              style={[
                styles.filterChip,
                showCompleted && styles.activeFilterChip,
              ]}
              onPress={() => setShowCompleted(!showCompleted)}
            >
              <Text 
                style={[
                  styles.filterChipText,
                  showCompleted && styles.activeFilterChipText,
                ]}
              >
                Completed
              </Text>
            </TouchableOpacity>
            
            {/* Category filters */}
            {categories.map(category => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  categoryFilter === category && styles.activeFilterChip,
                ]}
                onPress={() => {
                  setCategoryFilter(categoryFilter === category ? null : category);
                }}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    categoryFilter === category && styles.activeFilterChipText,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* Priority filters */}
            {priorities.map(priority => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.filterChip,
                  priorityFilter === priority && styles.activeFilterChip,
                ]}
                onPress={() => {
                  setPriorityFilter(priorityFilter === priority ? null : priority);
                }}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    priorityFilter === priority && styles.activeFilterChipText,
                  ]}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Main content */}
        <View style={styles.content}>
          {viewMode === 'list' ? (
            // List view
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tasksList}
            >
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    expanded={expandedTasks[task.id] || false}
                    onToggleComplete={toggleTaskCompletion}
                    onToggleExpand={handleToggleExpand}
                    onToggleSubTask={toggleSubTaskCompletion}
                  />
                ))
              ) : (
                <GlassmorphicCard style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No tasks match your filters</Text>
                </GlassmorphicCard>
              )}
            </ScrollView>
          ) : (
            // Matrix view
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.tasksList}
            >
              <EisenhowerMatrix 
                tasks={tasks.filter(task => !task.completed)} 
                onSelectTask={handleTaskSelect}
              />
              
              {expandedTasks && Object.keys(expandedTasks).length > 0 && (
                <View style={styles.selectedTaskContainer}>
                  <Text style={styles.selectedTaskTitle}>Selected Task</Text>
                  {Object.entries(expandedTasks)
                    .filter(([id, expanded]) => expanded)
                    .map(([id]) => {
                      const task = tasks.find(t => t.id === id);
                      if (!task) return null;
                      return (
                        <TaskItem
                          key={task.id}
                          task={task}
                          expanded={true}
                          onToggleComplete={toggleTaskCompletion}
                          onToggleExpand={handleToggleExpand}
                          onToggleSubTask={toggleSubTaskCompletion}
                        />
                      );
                    })}
                </View>
              )}
            </ScrollView>
          )}
        </View>
        
        {/* Floating add button */}
        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  searchContainer: {
    marginBottom: SPACING.sm,
  },
  searchInput: {
    ...FONTS.body.regular,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    color: Colors.light.text,
  },
  filtersContainer: {
    paddingBottom: SPACING.sm,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: Colors.light.primary[400],
  },
  filterChipText: {
    ...FONTS.body.small,
    color: Colors.light.text,
  },
  activeFilterChipText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  tasksList: {
    padding: SPACING.md,
    paddingBottom: 100, // Extra space for the add button
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyText: {
    ...FONTS.body.regular,
    color: Colors.light.neutral[500],
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primary[400],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  selectedTaskContainer: {
    marginTop: SPACING.lg,
  },
  selectedTaskTitle: {
    ...FONTS.heading.h4,
    color: Colors.light.text,
    marginBottom: SPACING.sm,
  },
});