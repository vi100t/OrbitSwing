import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { CalendarEvent } from '../types/calendar';
import Colors from '../constants/Colors';
import { FONTS, SPACING, SHADOWS } from '../constants/Theme';
import GlassmorphicCard from './GlassmorphicCard';

interface CalendarViewProps {
  events: CalendarEvent[];
  onDayPress: (date: string) => void;
  onEventPress: (eventId: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onDayPress,
  onEventPress,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Format events for the calendar
  const formatMarkedDates = () => {
    const markedDates: any = {};
    
    events.forEach(event => {
      const dateStr = new Date(event.startTime).toISOString().split('T')[0];
      
      if (!markedDates[dateStr]) {
        markedDates[dateStr] = { dots: [] };
      }
      
      // Add a dot for this event
      markedDates[dateStr].dots.push({
        key: event.id,
        color: event.color,
      });
    });
    
    // Add selection marker
    if (selectedDate) {
      markedDates[selectedDate] = {
        ...markedDates[selectedDate],
        selected: true,
        selectedColor: Colors.light.primary[200],
      };
    }
    
    return markedDates;
  };
  
  // Get events for the selected date
  const getEventsForSelectedDate = () => {
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(selectedDateObj);
    nextDay.setDate(nextDay.getDate() + 1);
    
    return events.filter(event => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);
      
      return (
        (eventStart >= selectedDateObj && eventStart < nextDay) ||
        (eventEnd >= selectedDateObj && eventEnd < nextDay) ||
        (eventStart < selectedDateObj && eventEnd >= nextDay) ||
        (event.isAllDay &&
          eventStart.getFullYear() === selectedDateObj.getFullYear() &&
          eventStart.getMonth() === selectedDateObj.getMonth() &&
          eventStart.getDate() === selectedDateObj.getDate())
      );
    }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };
  
  // Format time for display
  const formatEventTime = (event: CalendarEvent) => {
    if (event.isAllDay) return 'All day';
    
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    
    return `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    onDayPress(day.dateString);
  };
  
  const eventsForSelectedDate = getEventsForSelectedDate();
  
  return (
    <View style={styles.container}>
      <GlassmorphicCard style={styles.calendarCard}>
        <Calendar
          markedDates={formatMarkedDates()}
          onDayPress={handleDayPress}
          hideExtraDays={false}
          enableSwipeMonths={true}
          markingType={'multi-dot'}
          theme={{
            calendarBackground: 'transparent',
            textSectionTitleColor: Colors.light.text,
            selectedDayBackgroundColor: Colors.light.primary[400],
            selectedDayTextColor: 'white',
            todayTextColor: Colors.light.primary[500],
            dayTextColor: Colors.light.text,
            textDisabledColor: Colors.light.neutral[400],
            dotColor: Colors.light.primary[400],
            selectedDotColor: 'white',
            arrowColor: Colors.light.primary[400],
            monthTextColor: Colors.light.text,
            indicatorColor: Colors.light.primary[400],
            textDayFontFamily: 'Rubik-Regular',
            textMonthFontFamily: 'Poppins-Medium',
            textDayHeaderFontFamily: 'Rubik-Medium',
          }}
        />
      </GlassmorphicCard>
      
      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>
          Events for {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </Text>
        
        {eventsForSelectedDate.length > 0 ? (
          eventsForSelectedDate.map(event => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventItem}
              onPress={() => onEventPress(event.id)}
            >
              <View style={[styles.eventColor, { backgroundColor: event.color }]} />
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>{formatEventTime(event)}</Text>
                {event.location && (
                  <Text style={styles.eventLocation}>{event.location}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noEventsText}>No events scheduled for this day</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarCard: {
    marginBottom: SPACING.md,
    padding: 8,
  },
  eventsContainer: {
    marginTop: SPACING.sm,
  },
  eventsTitle: {
    ...FONTS.body.medium,
    color: Colors.light.text,
    marginBottom: SPACING.sm,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  eventColor: {
    width: 4,
    borderRadius: 2,
    marginRight: SPACING.sm,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    ...FONTS.body.medium,
    color: Colors.light.text,
    marginBottom: 2,
  },
  eventTime: {
    ...FONTS.body.small,
    color: Colors.light.neutral[600],
    marginBottom: 2,
  },
  eventLocation: {
    ...FONTS.body.small,
    color: Colors.light.neutral[500],
  },
  noEventsText: {
    ...FONTS.body.regular,
    color: Colors.light.neutral[500],
    textAlign: 'center',
    marginTop: SPACING.md,
    fontStyle: 'italic',
  },
});

export default CalendarView;