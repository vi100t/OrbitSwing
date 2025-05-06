import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withSequence, withDelay } from 'react-native-reanimated';
import { CheckCircle, Circle, ChevronRight, ChevronDown } from 'lucide-react-native';
import { Task } from '../types/task';
import Colors from '../constants/Colors';
import { FONTS, SPACING } from '../constants/Theme';
import GlassmorphicCard from './GlassmorphicCard';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onToggleExpand: (taskId: string) => void;
  onToggleSubTask: (taskId: string, subTaskId: string) => void;
  expanded: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onToggleExpand,
  onToggleSubTask,
  expanded,
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const subTasksHeight = useSharedValue(0);
  const initialRender = useRef(true);
  
  useEffect(() => {
    // Skip animation on initial render
    if (initialRender.current) {
      initialRender.current = false;
      subTasksHeight.value = expanded ? (task.subTasks.length * 40 + 10) : 0;
      return;
    }
    
    subTasksHeight.value = withTiming(
      expanded ? (task.subTasks.length * 40 + 10) : 0,
      { duration: 300 }
    );
  }, [expanded, task.subTasks.length]);
  
  const handleTaskPress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    onToggleExpand(task.id);
  };
  
  const handleCompletePress = () => {
    // Animate the task when completed
    if (!task.completed) {
      scale.value = withSequence(
        withTiming(1.05, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
    } else {
      opacity.value = withSequence(
        withTiming(0.5, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
    }
    
    onToggleComplete(task.id);
  };
  
  // Define animated styles
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  const animatedSubTasksStyle = useAnimatedStyle(() => ({
    height: subTasksHeight.value,
    opacity: expanded ? withDelay(100, withTiming(1, { duration: 200 })) : withTiming(0, { duration: 200 }),
  }));
  
  // Priority color mapping
  const priorityColor = {
    low: Colors.light.neutral[400],
    medium: Colors.light.warning[400],
    high: Colors.light.accent[400],
    urgent: Colors.light.error[400],
  };
  
  // Format due date
  const formatDueDate = () => {
    if (!task.dueDate) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays <= 7) return `In ${diffDays} days`;
    
    return dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      <GlassmorphicCard style={[styles.card, task.completed && styles.completedCard]}>
        <View style={styles.mainContent}>
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={handleCompletePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {task.completed ? (
              <CheckCircle color={Colors.light.primary[400]} size={24} />
            ) : (
              <Circle color={Colors.light.neutral[500]} size={24} />
            )}
          </TouchableOpacity>
          
          <Pressable 
            style={styles.taskContent} 
            onPress={handleTaskPress}
          >
            <View style={styles.taskHeader}>
              <Text 
                style={[styles.title, task.completed && styles.completedTitle]}
                numberOfLines={2}
              >
                {task.title}
              </Text>
              
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => onToggleExpand(task.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {expanded ? (
                  <ChevronDown size={18} color={Colors.light.neutral[500]} />
                ) : (
                  <ChevronRight size={18} color={Colors.light.neutral[500]} />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.taskFooter}>
              {task.dueDate && (
                <View style={[styles.badge, { backgroundColor: Colors.light.neutral[200] }]}>
                  <Text style={styles.badgeText}>{formatDueDate()}</Text>
                </View>
              )}
              
              <View 
                style={[
                  styles.badge, 
                  { backgroundColor: Colors.light.neutral[200] }
                ]}
              >
                <View 
                  style={[
                    styles.priorityDot, 
                    { backgroundColor: priorityColor[task.priority] }
                  ]} 
                />
                <Text style={styles.badgeText}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Text>
              </View>
              
              {task.subTasks.length > 0 && (
                <View style={[styles.badge, { backgroundColor: Colors.light.neutral[200] }]}>
                  <Text style={styles.badgeText}>
                    {task.subTasks.filter(st => st.completed).length}/{task.subTasks.length}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>
        
        {task.subTasks.length > 0 && (
          <Animated.View style={[styles.subTasksContainer, animatedSubTasksStyle]}>
            {task.subTasks.map(subTask => (
              <View key={subTask.id} style={styles.subTask}>
                <TouchableOpacity 
                  style={styles.subTaskCheckbox} 
                  onPress={() => onToggleSubTask(task.id, subTask.id)}
                >
                  {subTask.completed ? (
                    <CheckCircle size={18} color={Colors.light.primary[300]} />
                  ) : (
                    <Circle size={18} color={Colors.light.neutral[400]} />
                  )}
                </TouchableOpacity>
                <Text style={[styles.subTaskText, subTask.completed && styles.completedSubTask]}>
                  {subTask.title}
                </Text>
              </View>
            ))}
          </Animated.View>
        )}
      </GlassmorphicCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    padding: 0,
  },
  completedCard: {
    opacity: 0.8,
  },
  mainContent: {
    flexDirection: 'row',
    padding: 16,
  },
  checkboxContainer: {
    paddingRight: 12,
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    ...FONTS.body.medium,
    flex: 1,
    marginRight: 8,
    color: Colors.light.text,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: Colors.light.neutral[500],
  },
  expandButton: {
    paddingLeft: 8,
    alignSelf: 'flex-start',
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  badgeText: {
    ...FONTS.body.smallMedium,
    color: Colors.light.neutral[700],
  },
  subTasksContainer: {
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  subTask: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subTaskCheckbox: {
    marginRight: 10,
  },
  subTaskText: {
    ...FONTS.body.small,
    color: Colors.light.text,
    flex: 1,
  },
  completedSubTask: {
    textDecorationLine: 'line-through',
    color: Colors.light.neutral[500],
  },
});

export default TaskItem;