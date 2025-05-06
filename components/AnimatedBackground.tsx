import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Colors from '../constants/Colors';

const { width, height } = Dimensions.get('window');

interface Bubble {
  id: number;
  position: Animated.ValueXY;
  size: number;
  color: string;
  opacity: Animated.Value;
  animation: Animated.CompositeAnimation;
}

const BUBBLE_COLORS = [
  Colors.light.primary[200],
  Colors.light.secondary[200],
  Colors.light.accent[200],
  Colors.light.success[200],
  Colors.light.primary[100],
];

const createBubbles = (count: number): Bubble[] => {
  return Array.from({ length: count }, (_, index) => {
    const size = Math.random() * 60 + 40; // Between 40 and 100
    const position = new Animated.ValueXY({
      x: Math.random() * width,
      y: Math.random() * height,
    });
    const opacity = new Animated.Value(Math.random() * 0.3 + 0.2); // Between 0.2 and 0.5
    
    // Create animation for this bubble
    const moveX = width + size;
    const moveY = height + size;
    const duration = Math.random() * 15000 + 20000; // Between 20-35s
    
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(position, {
          toValue: {
            x: Math.random() * moveX - size / 2,
            y: Math.random() * moveY - size / 2,
          },
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(position, {
          toValue: {
            x: Math.random() * moveX - size / 2,
            y: Math.random() * moveY - size / 2,
          },
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    
    return {
      id: index,
      position,
      size,
      color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
      opacity,
      animation,
    };
  });
};

const AnimatedBackground: React.FC = () => {
  const [bubbles, setBubbles] = React.useState<Bubble[]>([]);
  
  useEffect(() => {
    const newBubbles = createBubbles(8);
    setBubbles(newBubbles);
    
    // Start animations
    newBubbles.forEach(bubble => bubble.animation.start());
    
    return () => {
      // Stop animations on unmount
      newBubbles.forEach(bubble => bubble.animation.stop());
    };
  }, []);
  
  return (
    <View style={styles.container}>
      {bubbles.map(bubble => (
        <Animated.View
          key={bubble.id}
          style={[
            styles.bubble,
            {
              width: bubble.size,
              height: bubble.size,
              borderRadius: bubble.size / 2,
              backgroundColor: bubble.color,
              opacity: bubble.opacity,
              transform: [
                { translateX: bubble.position.x },
                { translateY: bubble.position.y },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: -1,
  },
  bubble: {
    position: 'absolute',
  },
});

export default AnimatedBackground;