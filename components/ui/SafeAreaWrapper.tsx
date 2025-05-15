import React, { ReactNode } from 'react';
import { StyleSheet, View, StatusBar, ColorValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/lib/theme';

interface SafeAreaWrapperProps {
  children: ReactNode;
  style?: object;
  backgroundColor?: ColorValue;
  barStyle?: 'light-content' | 'dark-content' | 'default';
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  style,
  backgroundColor = theme.colors.white,
  barStyle = 'dark-content',
  edges = ['top', 'right', 'bottom', 'left'],
}) => {
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }, style]}
      edges={edges}
    >
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeAreaWrapper;