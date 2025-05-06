import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';

import { useCalendarStore } from '../../store/calendarStore';
import { useTaskStore } from '../../store/taskStore';

import AnimatedBackground from '../../components/AnimatedBackground';
import CalendarView from '../../components/CalendarView';
import GlassmorphicCard from '../../components/GlassmorphicCard';

import Colors from '../../constants/Colors';
import { FONTS, SPACING } from '../../constants/Theme';

export default function CalendarScreen() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Get events from store
  const { events, getEventById } = useCalendarStore();
  const { tasks } = useTaskStore();
  
  // Handle day press
  const handleDayPress = (date: string) => {
    console.log('Day pressed:', date);
    setSelectedEventId(null);
  };
  
  // Handle event press
  const handleEventPress = (eventId: string) => {
    setSelectedEventId(eventId);
  };
  
  // Get selected event
  const selectedEvent = selectedEventId ? getEventById(selectedEventId) : null;
  
  // Format event date and time
  const formatEventDateTime = (startTime: Date, endTime: Date, isAllDay: boolean) => {
    if (isAllDay) {
      return new Date(startTime).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
    
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    // Check if same day
    const sameDay = 
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate();
    
    if (sameDay) {
      return `${startDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })}, ${startDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })} - ${endDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    }
    
    // Different days
    return `${startDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}, ${startDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })} - ${endDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })}, ${endDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };
  
  // Get related task
  const getRelatedTask = (taskId?: string) => {
    if (!taskId) return null;
    return tasks.find(task => task.id === taskId);
  };
  
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <CalendarView
            events={events}
            onDayPress={handleDayPress}
            onEventPress={handleEventPress}
          />
          
          {selectedEvent && (
            <GlassmorphicCard style={styles.eventDetailCard}>
              <View style={[styles.eventColorBadge, { backgroundColor: selectedEvent.color }]} />
              <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
              
              <Text style={styles.eventTime}>
                {formatEventDateTime(
                  selectedEvent.startTime,
                  selectedEvent.endTime,
                  selectedEvent.isAllDay
                )}
              </Text>
              
              {selectedEvent.location && (
                <Text style={styles.eventLocation}>{selectedEvent.location}</Text>
              )}
              
              {selectedEvent.description && (
                <Text style={styles.eventDescription}>{selectedEvent.description}</Text>
              )}
              
              {selectedEvent.relatedTaskId && (
                <View style={styles.relatedTaskContainer}>
                  <Text style={styles.relatedTaskLabel}>Related Task:</Text>
                  <Text style={styles.relatedTaskTitle}>
                    {getRelatedTask(selectedEvent.relatedTaskId)?.title || 'Unknown task'}
                  </Text>
                </View>
              )}
              
              <View style={styles.eventActions}>
                <TouchableOpacity style={styles.eventActionButton}>
                  <Text style={styles.eventActionText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.eventActionButton, styles.deleteButton]}
                >
                  <Text style={[styles.eventActionText, styles.deleteButtonText]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </GlassmorphicCard>
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
  content: {
    padding: SPACING.md,
    flex: 1,
  },
  eventDetailCard: {
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  eventColorBadge: {
    width: 50,
    height: 6,
    borderRadius: 3,
    marginBottom: SPACING.sm,
  },
  eventTitle: {
    ...FONTS.heading.h3,
    color: Colors.light.text,
    marginBottom: SPACING.xs,
  },
  eventTime: {
    ...FONTS.body.regular,
    color: Colors.light.neutral[700],
    marginBottom: SPACING.sm,
  },
  eventLocation: {
    ...FONTS.body.regular,
    color: Colors.light.neutral[600],
    marginBottom: SPACING.sm,
  },
  eventDescription: {
    ...FONTS.body.regular,
    color: Colors.light.text,
    marginBottom: SPACING.md,
  },
  relatedTaskContainer: {
    backgroundColor: Colors.light.neutral[100],
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  relatedTaskLabel: {
    ...FONTS.body.small,
    color: Colors.light.neutral[600],
    marginBottom: 2,
  },
  relatedTaskTitle: {
    ...FONTS.body.medium,
    color: Colors.light.text,
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  eventActionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.primary[50],
    marginLeft: SPACING.sm,
  },
  eventActionText: {
    ...FONTS.body.medium,
    color: Colors.light.primary[600],
  },
  deleteButton: {
    backgroundColor: Colors.light.error[50],
  },
  deleteButtonText: {
    color: Colors.light.error[600],
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
});