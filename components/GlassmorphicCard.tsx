import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Colors from '../constants/Colors';
import { SHADOWS } from '../constants/Theme';

interface GlassmorphicCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  borderRadius?: number;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  style,
  intensity = 50,
  tint = 'light',
  borderRadius = 16,
}) => {
  return (
    <View style={[styles.container, { borderRadius }, style]}>
      <BlurView intensity={intensity} tint={tint} style={[styles.blurContent, { borderRadius }]}>
        <View style={styles.innerContent}>{children}</View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    ...SHADOWS.medium,
    backgroundColor: Colors.light.card,
    borderColor: Colors.light.cardBorder,
    borderWidth: 1,
  },
  blurContent: {
    overflow: 'hidden',
    flex: 1,
  },
  innerContent: {
    flex: 1,
    padding: 16,
  },
});

export default GlassmorphicCard;