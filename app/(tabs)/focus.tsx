import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, BarChart, Calendar } from 'lucide-react-native';

import { usePomodoroStore } from '../../store/pomodoroStore';
import { useTaskStore } from '../../store/taskStore';

import AnimatedBackground from '../../components/AnimatedBackground';
import GlassmorphicCard from '../../components/GlassmorphicCard';
import PomodoroTimer from '../../components/PomodoroTimer';

import Colors from '../../constants/Colors';
import { FONTS, SPACING } from '../../constants/Theme';

export default function FocusScreen() {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'timer' | 'stats' | 'schedule'>('timer');
  
  // Get pomodoro state from store
  const { 
    settings, 
    state, 
    startSession, 
    pauseSession, 
    resumeSession, 
    completeSession, 
    skipSession, 
    updateTimeRemaining,
    history,
    getSessionsForDay, 
  } = usePomodoroStore();
  
  // Local timer state
  const [minutes, setMinutes] = useState(state.timeRemaining / 60);
  const [seconds, setSeconds] = useState(state.timeRemaining % 60);
  
  // Get incomplete tasks from store
  const { tasks } = useTaskStore();
  const incompleteTasks = tasks.filter(task => !task.completed);
  
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (state.isActive) {
      interval = setInterval(() => {
        if (state.timeRemaining <= 0) {
          // Timer finished
          clearInterval(interval);
          completeSession();
          return;
        }
        
        const newTimeRemaining = state.timeRemaining - 1;
        updateTimeRemaining(newTimeRemaining);
        
        setMinutes(Math.floor(newTimeRemaining / 60));
        setSeconds(newTimeRemaining % 60);
      }, 1000);
    } else {
      // Update display when paused
      setMinutes(Math.floor(state.timeRemaining / 60));
      setSeconds(state.timeRemaining % 60);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.isActive, state.timeRemaining]);
  
  // Session actions
  const handleStartSession = () => {
    state.isActive ? pauseSession() : (state.currentSession ? resumeSession() : startSession());
  };
  
  const handleSkipSession = () => {
    skipSession();
  };
  
  // Get session type name
  const getSessionTypeName = (type: 'work' | 'shortBreak' | 'longBreak') => {
    switch (type) {
      case 'work': return 'Focus Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
    }
  };
  
  // Format time
  const formatTime = (minutes: number) => {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };
  
  // Get today's sessions
  const todaySessions = getSessionsForDay(new Date());
  const focusSessionsToday = todaySessions.filter(
    session => session.type === 'work' && session.completed
  );
  const totalFocusTimeToday = focusSessionsToday.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Tab navigation */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'timer' && styles.activeTab]}
            onPress={() => setActiveTab('timer')}
          >
            <Clock 
              size={20} 
              color={activeTab === 'timer' ? Colors.light.primary[400] : Colors.light.neutral[500]} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'timer' && styles.activeTabText,
              ]}
            >
              Timer
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'stats' && styles.activeTab]}
            onPress={() => setActiveTab('stats')}
          >
            <BarChart 
              size={20} 
              color={activeTab === 'stats' ? Colors.light.primary[400] : Colors.light.neutral[500]} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'stats' && styles.activeTabText,
              ]}
            >
              Stats
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'schedule' && styles.activeTab]}
            onPress={() => setActiveTab('schedule')}
          >
            <Calendar 
              size={20} 
              color={activeTab === 'schedule' ? Colors.light.primary[400] : Colors.light.neutral[500]} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'schedule' && styles.activeTabText,
              ]}
            >
              Schedule
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'timer' && (
            <>
              <PomodoroTimer
                minutes={minutes}
                seconds={seconds}
                isActive={state.isActive}
                sessionType={state.currentSession?.type || 'work'}
                onStart={handleStartSession}
                onPause={pauseSession}
                onSkip={handleSkipSession}
              />
              
              <GlassmorphicCard style={styles.sessionsCard}>
                <Text style={styles.sessionsTitle}>Today's Sessions</Text>
                
                {todaySessions.length > 0 ? (
                  <>
                    <View style={styles.sessionsSummary}>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{focusSessionsToday.length}</Text>
                        <Text style={styles.summaryLabel}>Sessions</Text>
                      </View>
                      
                      <View style={styles.summaryDivider} />
                      
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{formatTime(totalFocusTimeToday)}</Text>
                        <Text style={styles.summaryLabel}>Focus Time</Text>
                      </View>
                    </View>
                    
                    <View style={styles.sessionsList}>
                      {todaySessions.slice(0, 5).map((session, index) => (
                        <View key={session.id} style={styles.sessionItem}>
                          <View 
                            style={[
                              styles.sessionTypeBadge,
                              session.type === 'work' 
                                ? styles.workBadge 
                                : (session.type === 'shortBreak' 
                                  ? styles.shortBreakBadge 
                                  : styles.longBreakBadge)
                            ]}
                          />
                          <View style={styles.sessionInfo}>
                            <Text style={styles.sessionType}>
                              {getSessionTypeName(session.type)}
                            </Text>
                            <Text style={styles.sessionTime}>
                              {new Date(session.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })} · {session.duration} min
                            </Text>
                          </View>
                          <View style={styles.sessionStatus}>
                            {session.completed ? (
                              <Text style={styles.completedStatus}>Completed</Text>
                            ) : (
                              <Text style={styles.skippedStatus}>Skipped</Text>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                ) : (
                  <Text style={styles.noSessionsText}>
                    No focus sessions today. Start your first session!
                  </Text>
                )}
              </GlassmorphicCard>
              
              <GlassmorphicCard style={styles.tasksCard}>
                <Text style={styles.tasksTitle}>Tasks to Focus On</Text>
                
                {incompleteTasks.length > 0 ? (
                  <View style={styles.tasksList}>
                    {incompleteTasks.slice(0, 5).map((task) => (
                      <TouchableOpacity 
                        key={task.id} 
                        style={styles.taskItem}
                        onPress={() => {
                          // In a real app, this would select a task for the focus session
                        }}
                      >
                        <Text style={styles.taskTitle} numberOfLines={1}>
                          {task.title}
                        </Text>
                        <View 
                          style={[
                            styles.priorityBadge,
                            task.priority === 'urgent' && styles.urgentBadge,
                            task.priority === 'high' && styles.highBadge,
                            task.priority === 'medium' && styles.mediumBadge,
                            task.priority === 'low' && styles.lowBadge,
                          ]}
                        >
                          <Text style={styles.priorityText}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noTasksText}>
                    No tasks available. Add some tasks to focus on!
                  </Text>
                )}
              </GlassmorphicCard>
            </>
          )}
          
          {activeTab === 'stats' && (
            <>
              <GlassmorphicCard style={styles.statsCard}>
                <Text style={styles.statsTitle}>Focus Statistics</Text>
                
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{history.length}</Text>
                    <Text style={styles.statLabel}>Total Sessions</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {history.filter(session => session.completed && session.type === 'work').length}
                    </Text>
                    <Text style={styles.statLabel}>Completed</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {formatTime(
                        history
                          .filter(session => session.completed && session.type === 'work')
                          .reduce((sum, session) => sum + session.duration, 0)
                      )}
                    </Text>
                    <Text style={styles.statLabel}>Total Focus Time</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>
                      {history
                        .filter(session => session.type === 'work')
                        .reduce((sum, session) => sum + session.interruptionCount, 0)}
                    </Text>
                    <Text style={styles.statLabel}>Interruptions</Text>
                  </View>
                </View>
              </GlassmorphicCard>
              
              <GlassmorphicCard style={styles.settingsCard}>
                <Text style={styles.settingsTitle}>Timer Settings</Text>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Work Duration</Text>
                  <View style={styles.durationControls}>
                    <TouchableOpacity 
                      style={styles.durationButton}
                      onPress={() => {
                        if (settings.workDuration > 5) {
                          usePomodoroStore.getState().updateSettings({
                            workDuration: settings.workDuration - 5,
                          });
                        }
                      }}
                    >
                      <Text style={styles.durationButtonText}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.durationValue}>{settings.workDuration} min</Text>
                    
                    <TouchableOpacity 
                      style={styles.durationButton}
                      onPress={() => {
                        usePomodoroStore.getState().updateSettings({
                          workDuration: settings.workDuration + 5,
                        });
                      }}
                    >
                      <Text style={styles.durationButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Short Break</Text>
                  <View style={styles.durationControls}>
                    <TouchableOpacity 
                      style={styles.durationButton}
                      onPress={() => {
                        if (settings.shortBreakDuration > 1) {
                          usePomodoroStore.getState().updateSettings({
                            shortBreakDuration: settings.shortBreakDuration - 1,
                          });
                        }
                      }}
                    >
                      <Text style={styles.durationButtonText}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.durationValue}>{settings.shortBreakDuration} min</Text>
                    
                    <TouchableOpacity 
                      style={styles.durationButton}
                      onPress={() => {
                        usePomodoroStore.getState().updateSettings({
                          shortBreakDuration: settings.shortBreakDuration + 1,
                        });
                      }}
                    >
                      <Text style={styles.durationButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Long Break</Text>
                  <View style={styles.durationControls}>
                    <TouchableOpacity 
                      style={styles.durationButton}
                      onPress={() => {
                        if (settings.longBreakDuration > 5) {
                          usePomodoroStore.getState().updateSettings({
                            longBreakDuration: settings.longBreakDuration - 5,
                          });
                        }
                      }}
                    >
                      <Text style={styles.durationButtonText}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.durationValue}>{settings.longBreakDuration} min</Text>
                    
                    <TouchableOpacity 
                      style={styles.durationButton}
                      onPress={() => {
                        usePomodoroStore.getState().updateSettings({
                          longBreakDuration: settings.longBreakDuration + 5,
                        });
                      }}
                    >
                      <Text style={styles.durationButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Sessions Before Long Break</Text>
                  <View style={styles.durationControls}>
                    <TouchableOpacity 
                      style={styles.durationButton}
                      onPress={() => {
                        if (settings.sessionsBeforeLongBreak > 1) {
                          usePomodoroStore.getState().updateSettings({
                            sessionsBeforeLongBreak: settings.sessionsBeforeLongBreak - 1,
                          });
                        }
                      }}
                    >
                      <Text style={styles.durationButtonText}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.durationValue}>{settings.sessionsBeforeLongBreak}</Text>
                    
                    <TouchableOpacity 
                      style={styles.durationButton}
                      onPress={() => {
                        usePomodoroStore.getState().updateSettings({
                          sessionsBeforeLongBreak: settings.sessionsBeforeLongBreak + 1,
                        });
                      }}
                    >
                      <Text style={styles.durationButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </GlassmorphicCard>
            </>
          )}
          
          {activeTab === 'schedule' && (
            <GlassmorphicCard style={styles.scheduleCard}>
              <Text style={styles.scheduleTitle}>Focus Schedule</Text>
              <Text style={styles.comingSoonText}>Coming soon!</Text>
            </GlassmorphicCard>
          )}
        </ScrollView>
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
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(230, 230, 230, 0.7)',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: Colors.light.primary[50],
  },
  tabText: {
    ...FONTS.body.medium,
    color: Colors.light.neutral[500],
    marginLeft: 6,
  },
  activeTabText: {
    color: Colors.light.primary[500],
  },
  content: {
    padding: SPACING.md,
  },
  sessionsCard: {
    marginBottom: SPACING.md,
  },
  sessionsTitle: {
    ...FONTS.heading.h4,
    color: Colors.light.text,
    marginBottom: SPACING.sm,
  },
  sessionsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    ...FONTS.heading.h3,
    color: Colors.light.text,
  },
  summaryLabel: {
    ...FONTS.body.small,
    color: Colors.light.neutral[500],
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.light.neutral[200],
  },
  sessionsList: {},
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral[100],
  },
  sessionTypeBadge: {
    width: 4,
    height: 24,
    borderRadius: 2,
    marginRight: SPACING.sm,
  },
  workBadge: {
    backgroundColor: Colors.light.primary[400],
  },
  shortBreakBadge: {
    backgroundColor: Colors.light.secondary[400],
  },
  longBreakBadge: {
    backgroundColor: Colors.light.success[400],
  },
  sessionInfo: {
    flex: 1,
  },
  sessionType: {
    ...FONTS.body.medium,
    color: Colors.light.text,
  },
  sessionTime: {
    ...FONTS.body.small,
    color: Colors.light.neutral[500],
  },
  sessionStatus: {},
  completedStatus: {
    ...FONTS.body.small,
    color: Colors.light.success[500],
  },
  skippedStatus: {
    ...FONTS.body.small,
    color: Colors.light.neutral[500],
  },
  noSessionsText: {
    ...FONTS.body.regular,
    color: Colors.light.neutral[500],
    textAlign: 'center',
    marginVertical: SPACING.md,
    fontStyle: 'italic',
  },
  tasksCard: {
    marginBottom: SPACING.md,
  },
  tasksTitle: {
    ...FONTS.heading.h4,
    color: Colors.light.text,
    marginBottom: SPACING.sm,
  },
  tasksList: {},
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral[100],
  },
  taskTitle: {
    ...FONTS.body.medium,
    color: Colors.light.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.light.neutral[200],
  },
  urgentBadge: {
    backgroundColor: Colors.light.error[100],
  },
  highBadge: {
    backgroundColor: Colors.light.accent[100],
  },
  mediumBadge: {
    backgroundColor: Colors.light.warning[100],
  },
  lowBadge: {
    backgroundColor: Colors.light.neutral[200],
  },
  priorityText: {
    ...FONTS.body.small,
    color: Colors.light.text,
  },
  noTasksText: {
    ...FONTS.body.regular,
    color: Colors.light.neutral[500],
    textAlign: 'center',
    marginVertical: SPACING.md,
    fontStyle: 'italic',
  },
  statsCard: {
    marginBottom: SPACING.md,
  },
  statsTitle: {
    ...FONTS.heading.h4,
    color: Colors.light.text,
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: Colors.light.neutral[50],
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.heading.h3,
    color: Colors.light.primary[500],
    marginBottom: 4,
  },
  statLabel: {
    ...FONTS.body.small,
    color: Colors.light.neutral[600],
    textAlign: 'center',
  },
  settingsCard: {
    marginBottom: SPACING.md,
  },
  settingsTitle: {
    ...FONTS.heading.h4,
    color: Colors.light.text,
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral[100],
  },
  settingLabel: {
    ...FONTS.body.regular,
    color: Colors.light.text,
    flex: 1,
  },
  durationControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.light.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationButtonText: {
    ...FONTS.body.medium,
    color: Colors.light.text,
  },
  durationValue: {
    ...FONTS.body.medium,
    color: Colors.light.text,
    marginHorizontal: SPACING.sm,
    minWidth: 60,
    textAlign: 'center',
  },
  scheduleCard: {
    flex: 1,
    marginBottom: SPACING.md,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleTitle: {
    ...FONTS.heading.h4,
    color: Colors.light.text,
    marginBottom: SPACING.md,
  },
  comingSoonText: {
    ...FONTS.body.medium,
    color: Colors.light.neutral[500],
    marginTop: SPACING.md,
  },
});