import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types/task';
import Colors from '../constants/Colors';
import { FONTS, SPACING } from '../constants/Theme';
import GlassmorphicCard from './GlassmorphicCard';

interface EisenhowerMatrixProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
}

// Group tasks by quadrant based on importance and urgency
const groupTasksByQuadrant = (tasks: Task[]) => {
  const quadrants = {
    q1: [] as Task[], // Important & Urgent
    q2: [] as Task[], // Important & Not Urgent
    q3: [] as Task[], // Not Important & Urgent
    q4: [] as Task[], // Not Important & Not Urgent
  };
  
  tasks.forEach(task => {
    if (task.importance > 3 && task.urgency > 3) {
      quadrants.q1.push(task);
    } else if (task.importance > 3 && task.urgency <= 3) {
      quadrants.q2.push(task);
    } else if (task.importance <= 3 && task.urgency > 3) {
      quadrants.q3.push(task);
    } else {
      quadrants.q4.push(task);
    }
  });
  
  return quadrants;
};

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks, onSelectTask }) => {
  const incompleteTasks = tasks.filter(task => !task.completed);
  const quadrants = groupTasksByQuadrant(incompleteTasks);
  
  // Render task item
  const renderTaskItem = (task: Task) => (
    <TouchableOpacity
      key={task.id}
      style={styles.taskItem}
      onPress={() => onSelectTask(task.id)}
    >
      <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
    </TouchableOpacity>
  );
  
  return (
    <GlassmorphicCard style={styles.card}>
      <Text style={styles.title}>Eisenhower Matrix</Text>
      
      <View style={styles.matrix}>
        {/* Headers */}
        <View style={styles.headerRow}>
          <View style={styles.cornerCell} />
          <Text style={styles.headerText}>Urgent</Text>
          <Text style={styles.headerText}>Not Urgent</Text>
        </View>
        
        {/* Important Row */}
        <View style={styles.row}>
          <Text style={[styles.headerText, styles.verticalHeader]}>Important</Text>
          
          {/* Q1: Important & Urgent */}
          <View style={[styles.quadrant, styles.q1]}>
            <Text style={styles.quadrantLabel}>DO</Text>
            {quadrants.q1.length > 0 ? (
              quadrants.q1.slice(0, 3).map(renderTaskItem)
            ) : (
              <Text style={styles.emptyText}>No tasks</Text>
            )}
            {quadrants.q1.length > 3 && (
              <Text style={styles.moreText}>+{quadrants.q1.length - 3} more</Text>
            )}
          </View>
          
          {/* Q2: Important & Not Urgent */}
          <View style={[styles.quadrant, styles.q2]}>
            <Text style={styles.quadrantLabel}>SCHEDULE</Text>
            {quadrants.q2.length > 0 ? (
              quadrants.q2.slice(0, 3).map(renderTaskItem)
            ) : (
              <Text style={styles.emptyText}>No tasks</Text>
            )}
            {quadrants.q2.length > 3 && (
              <Text style={styles.moreText}>+{quadrants.q2.length - 3} more</Text>
            )}
          </View>
        </View>
        
        {/* Not Important Row */}
        <View style={styles.row}>
          <Text style={[styles.headerText, styles.verticalHeader]}>Not Important</Text>
          
          {/* Q3: Not Important & Urgent */}
          <View style={[styles.quadrant, styles.q3]}>
            <Text style={styles.quadrantLabel}>DELEGATE</Text>
            {quadrants.q3.length > 0 ? (
              quadrants.q3.slice(0, 3).map(renderTaskItem)
            ) : (
              <Text style={styles.emptyText}>No tasks</Text>
            )}
            {quadrants.q3.length > 3 && (
              <Text style={styles.moreText}>+{quadrants.q3.length - 3} more</Text>
            )}
          </View>
          
          {/* Q4: Not Important & Not Urgent */}
          <View style={[styles.quadrant, styles.q4]}>
            <Text style={styles.quadrantLabel}>ELIMINATE</Text>
            {quadrants.q4.length > 0 ? (
              quadrants.q4.slice(0, 3).map(renderTaskItem)
            ) : (
              <Text style={styles.emptyText}>No tasks</Text>
            )}
            {quadrants.q4.length > 3 && (
              <Text style={styles.moreText}>+{quadrants.q4.length - 3} more</Text>
            )}
          </View>
        </View>
      </View>
    </GlassmorphicCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  title: {
    ...FONTS.heading.h3,
    color: Colors.light.text,
    marginBottom: SPACING.md,
  },
  matrix: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cornerCell: {
    width: 80,
  },
  headerText: {
    ...FONTS.body.medium,
    color: Colors.light.text,
    flex: 1,
    textAlign: 'center',
  },
  verticalHeader: {
    width: 80,
    textAlignVertical: 'center',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 16,
  },
  quadrant: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  q1: {
    backgroundColor: Colors.light.error[50],
    borderColor: Colors.light.error[200],
    borderWidth: 1,
  },
  q2: {
    backgroundColor: Colors.light.primary[50],
    borderColor: Colors.light.primary[200],
    borderWidth: 1,
  },
  q3: {
    backgroundColor: Colors.light.warning[50],
    borderColor: Colors.light.warning[200],
    borderWidth: 1,
  },
  q4: {
    backgroundColor: Colors.light.neutral[50],
    borderColor: Colors.light.neutral[200],
    borderWidth: 1,
  },
  quadrantLabel: {
    ...FONTS.body.smallMedium,
    textAlign: 'center',
    marginBottom: 8,
    color: Colors.light.text,
  },
  taskItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 6,
    borderRadius: 4,
    marginBottom: 4,
  },
  taskTitle: {
    ...FONTS.body.small,
    color: Colors.light.text,
  },
  emptyText: {
    ...FONTS.body.small,
    color: Colors.light.neutral[500],
    textAlign: 'center',
    fontStyle: 'italic',
  },
  moreText: {
    ...FONTS.body.caption,
    color: Colors.light.neutral[500],
    textAlign: 'center',
    marginTop: 4,
  },
});

export default EisenhowerMatrix;