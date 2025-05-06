import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
  title: 36,
};

export const SHADOWS = {
  small: {
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
  },
};

export const FONTS = {
  heading: {
    h1: {
      fontFamily: 'Poppins-Bold',
      fontSize: SIZES.title,
      lineHeight: SIZES.title * 1.2,
    },
    h2: {
      fontFamily: 'Poppins-Bold',
      fontSize: SIZES.xxxl,
      lineHeight: SIZES.xxxl * 1.2,
    },
    h3: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: SIZES.xxl,
      lineHeight: SIZES.xxl * 1.2,
    },
    h4: {
      fontFamily: 'Poppins-SemiBold',
      fontSize: SIZES.xl,
      lineHeight: SIZES.xl * 1.2,
    },
    h5: {
      fontFamily: 'Poppins-Medium',
      fontSize: SIZES.lg,
      lineHeight: SIZES.lg * 1.2,
    },
  },
  body: {
    regular: {
      fontFamily: 'Rubik-Regular',
      fontSize: SIZES.md,
      lineHeight: SIZES.md * 1.5,
    },
    medium: {
      fontFamily: 'Rubik-Medium',
      fontSize: SIZES.md,
      lineHeight: SIZES.md * 1.5,
    },
    bold: {
      fontFamily: 'Rubik-Bold',
      fontSize: SIZES.md,
      lineHeight: SIZES.md * 1.5,
    },
    small: {
      fontFamily: 'Rubik-Regular',
      fontSize: SIZES.sm,
      lineHeight: SIZES.sm * 1.5,
    },
    smallMedium: {
      fontFamily: 'Rubik-Medium',
      fontSize: SIZES.sm,
      lineHeight: SIZES.sm * 1.5,
    },
    caption: {
      fontFamily: 'Rubik-Regular',
      fontSize: SIZES.xs,
      lineHeight: SIZES.xs * 1.5,
    },
  },
};

export const GLASS = {
  regular: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dark: {
    backgroundColor: 'rgba(31, 26, 56, 0.55)',
    borderColor: 'rgba(255, 255, 255, 0.13)',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
};

export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCard: {
    ...GLASS.regular,
    ...SHADOWS.small,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  glassCardAccent: {
    ...GLASS.regular,
    ...SHADOWS.small,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary[400],
  },
  input: {
    ...FONTS.body.regular,
    backgroundColor: Colors.light.neutral[50],
    borderColor: Colors.light.neutral[200],
    borderWidth: 1,
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  button: {
    backgroundColor: Colors.light.primary[400],
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  buttonText: {
    ...FONTS.body.medium,
    color: 'white',
    textAlign: 'center',
  },
  textButton: {
    paddingVertical: SPACING.sm,
  },
  textButtonText: {
    ...FONTS.body.medium,
    color: Colors.light.primary[400],
  },
});