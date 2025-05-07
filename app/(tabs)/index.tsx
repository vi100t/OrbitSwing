import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { Plus, Check, Sparkles } from 'lucide-react-native';
import { Task } from '../../types/task';
import { useTaskStore } from '../../store/taskStore';
import { useHabitStore } from '../../store/habitStore';
import { usePomodoroStore } from '../../store/pomodoroStore';

import AnimatedBackground from '../../components/AnimatedBackground';
import GlassmorphicCard from '../../components/GlassmorphicCard';
import HabitStreak from '../../components/HabitStreak';
import Heatmap from '../../components/Heatmap';
import TaskItem from '../../components/TaskItem';
import AISuggestionBanner from '../../components/AISuggestionBanner';
import VoiceButton from '../../components/VoiceButton';

import Colors from '../../constants/Colors';
import { FONTS, SPACING } from '../../constants/Theme';

export default function Dashboard() {
  const navigation = useNavigation();

  // Sample state for expanded tasks
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>(
    {}
  );
  const [showAISuggestion, setShowAISuggestion] = useState(true);

  // Get tasks and habits from store
  const { tasks, toggleTaskCompletion, toggleSubTaskCompletion } =
    useTaskStore();
  const { habits } = useHabitStore();
  const { getCompletedSessionsCount, getTotalFocusTime } = usePomodoroStore();

  // Toggle task expansion
  const handleToggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Process tasks for dashboard
  const upcomingTasks: Task[] = tasks
    .filter((task) => !task.completed && task.dueDate)
    .sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dateA - dateB;
    })
    .slice(0, 3);

  // Get top habits
  const topHabits = habits
    .sort((a, b) => b.currentStreak - a.currentStreak)
    .slice(0, 3);

  // AI suggestion text (simulated)
  const aiSuggestion =
    "Based on your completed tasks, I suggest creating a 'Weekly Planning' habit every Sunday evening to organize your upcoming week.";

  // Handle voice input
  const handleVoiceInput = (text: string) => {
    console.log('Voice input:', text);
    // In a real app, this would parse the input and create tasks/habits
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header section */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Stats section */}
          <View style={styles.statsContainer}>
            <GlassmorphicCard style={styles.statCard}>
              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: Colors.light.primary[50] },
                  ]}
                >
                  <Check size={18} color={Colors.light.primary[400]} />
                </View>
                <Text style={styles.statValue}>
                  {tasks.filter((task) => task.completed).length}
                </Text>
                <Text style={styles.statLabel}>Tasks Done</Text>
              </View>
            </GlassmorphicCard>

            <GlassmorphicCard style={styles.statCard}>
              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: Colors.light.secondary[50] },
                  ]}
                >
                  <Sparkles size={18} color={Colors.light.secondary[400]} />
                </View>
                <Text style={styles.statValue}>
                  {getCompletedSessionsCount()}
                </Text>
                <Text style={styles.statLabel}>Focus Sessions</Text>
              </View>
            </GlassmorphicCard>

            <GlassmorphicCard style={styles.statCard}>
              <View style={styles.statItem}>
                <View
                  style={[
                    styles.statIconContainer,
                    { backgroundColor: Colors.light.accent[50] },
                  ]}
                >
                  <Clock size={18} color={Colors.light.accent[400]} />
                </View>
                <Text style={styles.statValue}>{getTotalFocusTime()}</Text>
                <Text style={styles.statLabel}>Focus Minutes</Text>
              </View>
            </GlassmorphicCard>
          </View>

          {/* AI Suggestion */}
          {showAISuggestion && (
            <AISuggestionBanner
              suggestion={aiSuggestion}
              onAccept={() => {
                // In a real app, this would add the suggested task/habit
                setShowAISuggestion(false);
              }}
              onDismiss={() => setShowAISuggestion(false)}
            />
          )}

          {/* Upcoming Tasks */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('tasks' as never)}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
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
                <Text style={styles.emptyText}>No upcoming tasks</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => navigation.navigate('tasks' as never)}
                >
                  <Plus size={18} color="white" />
                  <Text style={styles.addButtonText}>Add Task</Text>
                </TouchableOpacity>
              </GlassmorphicCard>
            )}
          </View>

          {/* Habits Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Habits</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {topHabits.map((habit) => (
              <HabitStreak
                key={habit.id}
                title={habit.title}
                streak={habit.currentStreak}
                longestStreak={habit.longestStreak}
                color={habit.color}
              />
            ))}

            {/* Heatmap */}
            {habits.length > 0 && (
              <Heatmap
                title="Activity Heatmap"
                logs={habits[0].logs}
                color={habits[0].color}
              />
            )}
          </View>
        </ScrollView>

        {/* Voice Button */}
        <View style={styles.voiceButtonContainer}>
          <VoiceButton onVoiceInput={handleVoiceInput} />
        </View>
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
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: 100, // Extra padding for voice button
  },
  header: {
    marginBottom: SPACING.lg,
  },
  welcomeText: {
    ...FONTS.heading.h1,
    color: Colors.light.text,
  },
  dateText: {
    ...FONTS.body.regular,
    color: Colors.light.neutral[600],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: SPACING.sm,
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    ...FONTS.heading.h3,
    color: Colors.light.text,
  },
  statLabel: {
    ...FONTS.body.small,
    color: Colors.light.neutral[600],
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...FONTS.heading.h3,
    color: Colors.light.text,
  },
  seeAllButton: {
    padding: SPACING.xs,
  },
  seeAllText: {
    ...FONTS.body.medium,
    color: Colors.light.primary[400],
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyText: {
    ...FONTS.body.regular,
    color: Colors.light.neutral[500],
    marginBottom: SPACING.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary[400],
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    ...FONTS.body.medium,
    color: 'white',
    marginLeft: 8,
  },
  voiceButtonContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
  },
});

import { Clock } from 'lucide-react-native';
