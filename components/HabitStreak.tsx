import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { FONTS, SPACING } from '../constants/Theme';
import GlassmorphicCard from './GlassmorphicCard';

interface HabitStreakProps {
  title: string;
  streak: number;
  longestStreak: number;
  color?: string;
}

const HabitStreak: React.FC<HabitStreakProps> = ({
  title,
  streak,
  longestStreak,
  color = Colors.light.primary[400],
}) => {
  // Scale flame size and color intensity based on streak length
  const getFlameSize = () => {
    if (streak < 3) return 20;
    if (streak < 7) return 24;
    if (streak < 14) return 28;
    if (streak < 30) return 32;
    return 36;
  };
  
  // Get flame color based on streak
  const getFlameColor = () => {
    if (streak < 3) return Colors.light.neutral[400];
    if (streak < 7) return Colors.light.warning[300];
    if (streak < 14) return Colors.light.warning[400];
    if (streak < 30) return Colors.light.accent[400];
    return Colors.light.error[400];
  };
  
  return (
    <GlassmorphicCard style={styles.card}>
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <Flame size={getFlameSize()} color={getFlameColor()} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Current</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{longestStreak}</Text>
              <Text style={styles.statLabel}>Best</Text>
            </View>
          </View>
        </View>
      </View>
    </GlassmorphicCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
    padding: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...FONTS.body.medium,
    color: Colors.light.text,
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
  },
  statValue: {
    ...FONTS.heading.h4,
    color: Colors.light.text,
  },
  statLabel: {
    ...FONTS.body.small,
    color: Colors.light.neutral[500],
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.light.neutral[200],
    marginHorizontal: SPACING.md,
  },
});

export default HabitStreak;