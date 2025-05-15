import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/lib/theme';

// Importando suas telas
import HomeScreen from '@/app/(app)/index';
import NotificationsScreen from '@/app/(app)/notifications';
import SettingsScreen from '@/app/(app)/settings';
import ProfileScreen from '@/app/(app)/profile';

const Drawer = createDrawerNavigator();

export default function AppLayout() {
  const { session } = useAuth();

  if (!session) return null;

  return (
      <Drawer.Navigator
        screenOptions={{
          drawerActiveTintColor: theme.colors.primary[500],
          drawerInactiveTintColor: theme.colors.neutrals[400],
          drawerLabelStyle: {
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: 14,
          },
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
      </Drawer.Navigator>
  );
}
