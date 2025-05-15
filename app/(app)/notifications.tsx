import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { theme } from '@/lib/theme';
import { Header } from '@/components/ui/Header';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Sample notification data
const notifications = [
  {
    id: '1',
    title: 'Welcome to BoltApp',
    message: 'Thank you for signing up! Explore all features of the app.',
    time: 'Just now',
    read: false,
  },
  {
    id: '2',
    title: 'Account setup',
    message: 'Your account has been successfully created and is ready to use.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    title: 'Security update',
    message: 'We have updated our security protocols to better protect your data.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '4',
    title: 'New feature available',
    message: 'Check out the new dashboard features we just launched!',
    time: '2 days ago',
    read: true,
  },
];

export default function NotificationsScreen() {
  const renderNotification = ({ item, index }: { item: typeof notifications[0], index: number }) => (
    <Animated.View 
      style={[styles.notificationItem, item.read && styles.readNotification]}
      entering={FadeInDown.delay(index * 100).duration(400)}
    >
      {!item.read && <View style={styles.unreadIndicator} />}
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaWrapper style={styles.container}>
     
      <View style={styles.content}>
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        )}
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutrals[50],
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  readNotification: {
    backgroundColor: theme.colors.neutrals[50],
    opacity: 0.9,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary[500],
    marginRight: theme.spacing.md,
    marginTop: 6,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[900],
    marginBottom: theme.spacing.xs,
  },
  notificationMessage: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[700],
    marginBottom: theme.spacing.sm,
  },
  notificationTime: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutrals[500],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutrals[500],
  },
});