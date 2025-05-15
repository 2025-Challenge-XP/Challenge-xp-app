import { Dimensions } from 'react-native';

// Screen dimensions
const { width, height } = Dimensions.get('window');

// Color palette
export const colors = {
  // Primary Colors
  primary: {
    100: '#E6EEFF',
    200: '#CCDDFF',
    300: '#99BBFF',
    400: '#6699FF',
    500: '#0055FF', // Main Primary
    600: '#0044CC',
    700: '#003399',
    800: '#002266',
    900: '#001133',
  },
  // Secondary/Accent Colors
  accent: {
    100: '#EFEBFF',
    200: '#DED7FF',
    300: '#BDB0FF',
    400: '#9D88FF',
    500: '#7856FF', // Main Accent
    600: '#6045CC',
    700: '#483499',
    800: '#302366',
    900: '#181133',
  },
  // Semantic Colors
  success: {
    100: '#E6F9F1',
    300: '#8CE3C0',
    500: '#10B981', // Main Success
    700: '#087F5B',
  },
  warning: {
    100: '#FFF8E6',
    300: '#FFE08C',
    500: '#F59E0B', // Main Warning
    700: '#B45309',
  },
  error: {
    100: '#FEECEB',
    300: '#F9A8A2',
    500: '#EF4444', // Main Error
    700: '#B91C1C',
  },
  // Neutrals
  neutrals: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  // Basic
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    body: 1.5, // 150% of the font size
    heading: 1.2, // 120% of the font size
  },
};

// Spacing (8px grid)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Screen sizes
export const screenSize = {
  width,
  height,
};

// Shadows
export const shadows = {
  small: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Border radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

// Animation durations
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Theme object for easy export
export const theme = {
  colors,
  typography,
  spacing,
  screenSize,
  shadows,
  borderRadius,
  animation,
};

export default theme;