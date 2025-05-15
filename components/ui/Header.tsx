import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/lib/theme';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightElement?: React.ReactNode;
  transparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightElement,
  transparent = false,
}) => {
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + theme.spacing.sm },
        transparent && styles.transparentHeader,
      ]}
    >
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <ArrowLeft
              size={24}
              color={transparent ? theme.colors.white : theme.colors.neutrals[800]}
            />
          </TouchableOpacity>
        )}
      </View>

      {title && (
        <Text
          style={[
            styles.title,
            transparent && styles.transparentTitle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      )}

      <View style={styles.rightSection}>
        {rightElement || <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutrals[200],
  },
  transparentHeader: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  leftSection: {
    width: 70,
    alignItems: 'flex-start',
  },
  backButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  title: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutrals[900],
    textAlign: 'center',
  },
  transparentTitle: {
    color: theme.colors.white,
  },
  rightSection: {
    width: 70,
    alignItems: 'flex-end',
  },
  placeholder: {
    width: 24,
  },
});

export default Header;