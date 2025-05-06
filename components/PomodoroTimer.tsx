import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withRepeat, Easing } from 'react-native-reanimated';
import { Play, Pause, SkipForward, Clock } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { FONTS, SPACING } from '../constants/Theme';
import GlassmorphicCard from './GlassmorphicCard';

interface PomodoroTimerProps {
  minutes: number;
  seconds: number;
  isActive: boolean;
  sessionType: 'work' | 'shortBreak' | 'longBreak';
  onStart: () => void;
  onPause: () => void;
  onSkip: () => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  minutes,
  seconds,
  isActive,
  sessionType,
  onStart,
  onPause,
  onSkip,
}) => {
  // Animation values
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  // Session type color mapping
  const sessionColors = {
    work: Colors.light.primary[400],
    shortBreak: Colors.light.secondary[400],
    longBreak: Colors.light.success[400],
  };
  
  const sessionNames = {
    work: 'Work Session',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };
  
  // Format time display
  const formatTime = (min: number, sec: number) => {
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };
  
  // Start pulse animation when timer is active
  useEffect(() => {
    if (isActive) {
      scale.value = withRepeat(
        withTiming(1.05, { duration: 1000, easing: Easing.ease }),
        -1,
        true
      );
      
      rotation.value = withRepeat(
        withTiming(360, { duration: 12000, easing: Easing.linear }),
        -1,
        false
      );
    } else {
      scale.value = withTiming(1);
      rotation.value = withTiming(rotation.value);
    }
  }, [isActive]);
  
  // Animated styles
  const circleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
    ],
  }));
  
  const clockHandStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
    ],
  }));
  
  return (
    <GlassmorphicCard style={styles.card}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{sessionNames[sessionType]}</Text>
        </View>
        
        <View style={styles.timerContainer}>
          <Animated.View 
            style={[
              styles.outerCircle, 
              { borderColor: sessionColors[sessionType] },
              circleStyle,
            ]}
          >
            <View style={styles.innerCircle}>
              <Text style={styles.timeText}>{formatTime(minutes, seconds)}</Text>
              
              <Animated.View 
                style={[
                  styles.clockHand, 
                  { backgroundColor: sessionColors[sessionType] },
                  clockHandStyle,
                ]}
              />
              
              <View 
                style={[
                  styles.clockCenter, 
                  { backgroundColor: sessionColors[sessionType] },
                ]}
              />
            </View>
          </Animated.View>
        </View>
        
        <View style={styles.buttonsContainer}>
          {isActive ? (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: Colors.light.neutral[200] }]} 
              onPress={onPause}
            >
              <Pause size={20} color={Colors.light.text} />
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: sessionColors[sessionType] }]} 
              onPress={onStart}
            >
              <Play size={20} color="white" />
              <Text style={[styles.buttonText, { color: 'white' }]}>Start</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: Colors.light.neutral[200] }]} 
            onPress={onSkip}
          >
            <SkipForward size={20} color={Colors.light.text} />
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GlassmorphicCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  container: {
    alignItems: 'center',
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    ...FONTS.heading.h3,
    color: Colors.light.text,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.md,
  },
  outerCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timeText: {
    ...FONTS.heading.h2,
    color: Colors.light.text,
  },
  clockHand: {
    position: 'absolute',
    width: 2,
    height: 60,
    bottom: 75,
    borderRadius: 1,
    transformOrigin: '0 60px',
  },
  clockCenter: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginHorizontal: 8,
  },
  buttonText: {
    ...FONTS.body.medium,
    marginLeft: 8,
    color: Colors.light.text,
  },
});

export default PomodoroTimer;