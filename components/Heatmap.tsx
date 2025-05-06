import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HabitLog } from '../types/habit';
import Colors from '../constants/Colors';
import { FONTS, SPACING } from '../constants/Theme';
import GlassmorphicCard from './GlassmorphicCard';

interface HeatmapProps {
  title: string;
  logs: HabitLog[];
  color?: string;
  days?: number; // Number of days to show, default 30
}

const Heatmap: React.FC<HeatmapProps> = ({
  title,
  logs,
  color = Colors.light.primary[400],
  days = 30,
}) => {
  // Get dates for the last N days
  const getDates = () => {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = formatDate(date);
      dates.push(dateString);
    }
    
    return dates;
  };
  
  // Format date to YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;
  };
  
  // Get month names for the dates
  const getMonthLabels = () => {
    const dates = getDates();
    const months: { month: string; position: number }[] = [];
    let currentMonth = '';
    
    dates.forEach((dateStr, index) => {
      const date = new Date(dateStr);
      const monthName = date.toLocaleString('default', { month: 'short' });
      
      if (monthName !== currentMonth) {
        months.push({ month: monthName, position: index });
        currentMonth = monthName;
      }
    });
    
    return months;
  };
  
  // Get cell color based on completion status
  const getCellColor = (dateStr: string) => {
    const log = logs.find((l) => l.date === dateStr);
    
    if (!log) return Colors.light.neutral[200]; // No data
    if (log.completed) return color; // Completed
    return Colors.light.neutral[300]; // Not completed
  };
  
  // Get cell opacity based on completion status
  const getCellOpacity = (dateStr: string) => {
    const log = logs.find((l) => l.date === dateStr);
    
    if (!log) return 0.2; // No data
    if (log.completed) return 1; // Completed
    return 0.4; // Not completed
  };
  
  const dates = getDates();
  const monthLabels = getMonthLabels();
  
  return (
    <GlassmorphicCard style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.container}>
        {/* Month labels */}
        <View style={styles.monthLabelsContainer}>
          {monthLabels.map((item, index) => (
            <Text
              key={index}
              style={[
                styles.monthLabel,
                {
                  position: 'absolute',
                  left: (item.position * (CELL_SIZE + CELL_MARGIN * 2)) + 4,
                }
              ]}
            >
              {item.month}
            </Text>
          ))}
        </View>
        
        {/* Heatmap grid */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.grid}>
            {dates.map((dateStr, index) => {
              const date = new Date(dateStr);
              const dayNumber = date.getDate();
              
              return (
                <View key={dateStr} style={styles.dateCell}>
                  <View 
                    style={[
                      styles.cell,
                      {
                        backgroundColor: getCellColor(dateStr),
                        opacity: getCellOpacity(dateStr),
                      }
                    ]}
                  />
                  <Text style={styles.dayNumber}>{dayNumber}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </GlassmorphicCard>
  );
};

const CELL_SIZE = 22;
const CELL_MARGIN = 2;

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  title: {
    ...FONTS.body.medium,
    color: Colors.light.text,
    marginBottom: 16,
  },
  container: {
    height: 70,
  },
  monthLabelsContainer: {
    height: 20,
    flexDirection: 'row',
    position: 'relative',
  },
  monthLabel: {
    ...FONTS.body.caption,
    color: Colors.light.neutral[500],
  },
  scrollContent: {
    paddingTop: 4,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateCell: {
    width: CELL_SIZE + CELL_MARGIN * 2,
    alignItems: 'center',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: CELL_MARGIN,
    borderRadius: 4,
  },
  dayNumber: {
    ...FONTS.body.caption,
    color: Colors.light.neutral[500],
    fontSize: 8,
    marginTop: 2,
  },
});

export default Heatmap;