import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, withRepeat, withSequence, cancelAnimation } from 'react-native-reanimated';
import { Mic } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import Colors from '../constants/Colors';
import { FONTS, SHADOWS } from '../constants/Theme';

interface VoiceButtonProps {
  onVoiceInput: (text: string) => void;
}

const SAMPLE_VOICE_RESPONSES = [
  "Add yoga to habits, every morning at 7 AM",
  "Schedule a meeting with John tomorrow at 2 PM",
  "Remind me to call mom on Sunday",
  "Create a new task to finish project proposal by Friday",
  "Add weekly grocery shopping to my tasks",
];

const VoiceButton: React.FC<VoiceButtonProps> = ({ onVoiceInput }) => {
  const [isListening, setIsListening] = useState(false);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  const simulateVoiceRecognition = () => {
    // In a real app, we would use Voice Recognition API
    // For this demo, we'll simulate it with a random response
    const randomResponse = SAMPLE_VOICE_RESPONSES[
      Math.floor(Math.random() * SAMPLE_VOICE_RESPONSES.length)
    ];
    
    // Simulate processing time
    setTimeout(() => {
      onVoiceInput(randomResponse);
      setIsListening(false);
      
      // Cancel animations
      cancelAnimation(scale);
      cancelAnimation(opacity);
      
      // Reset values
      scale.value = withTiming(1);
      opacity.value = withTiming(1);
      
      // Speak the confirmation
      Speech.speak("I heard: " + randomResponse, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
      });
    }, 2000);
  };
  
  const handlePress = () => {
    if (isListening) {
      setIsListening(false);
      
      // Cancel animations
      cancelAnimation(scale);
      cancelAnimation(opacity);
      
      // Reset values
      scale.value = withTiming(1);
      opacity.value = withTiming(1);
    } else {
      setIsListening(true);
      
      // Start pulsating animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1
      );
      
      // Start opacity animation
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1
      );
      
      // Simulate voice recognition
      simulateVoiceRecognition();
    }
  };
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.buttonContainer, animatedStyle]}>
        <TouchableOpacity
          style={[
            styles.button,
            isListening && styles.activeButton,
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Mic size={24} color={isListening ? 'white' : Colors.light.primary[400]} />
        </TouchableOpacity>
      </Animated.View>
      
      <Text style={styles.label}>
        {isListening ? 'Listening...' : 'Voice'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonContainer: {
    ...SHADOWS.medium,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: Colors.light.primary[400],
  },
  label: {
    ...FONTS.body.small,
    marginTop: 4,
    color: Colors.light.text,
  },
});

export default VoiceButton;