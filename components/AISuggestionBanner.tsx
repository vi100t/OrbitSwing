import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Lightbulb, X, Plus } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { FONTS, SPACING, SHADOWS } from '../constants/Theme';
import GlassmorphicCard from './GlassmorphicCard';

interface AISuggestionProps {
  suggestion: string;
  onAccept: () => void;
  onDismiss: () => void;
}

const AISuggestionBanner: React.FC<AISuggestionProps> = ({
  suggestion,
  onAccept,
  onDismiss,
}) => {
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
  };
  
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <GlassmorphicCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Lightbulb size={18} color={Colors.light.primary[400]} />
          </View>
          <Text style={styles.title}>AI Suggestion</Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onDismiss}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <X size={16} color={Colors.light.neutral[500]} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.suggestionText}>{suggestion}</Text>
        
        <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
          <Plus size={16} color="white" />
          <Text style={styles.acceptButtonText}>Add to Tasks</Text>
        </TouchableOpacity>
      </GlassmorphicCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  card: {
    padding: SPACING.md,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    ...FONTS.body.medium,
    color: Colors.light.primary[500],
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  suggestionText: {
    ...FONTS.body.regular,
    color: Colors.light.text,
    marginBottom: SPACING.md,
  },
  acceptButton: {
    backgroundColor: Colors.light.primary[400],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  acceptButtonText: {
    ...FONTS.body.medium,
    color: 'white',
    marginLeft: 8,
  },
});

export default AISuggestionBanner;