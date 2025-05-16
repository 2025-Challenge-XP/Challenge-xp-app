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
import SummaryScreen from '@/app/(app)/summary';
import FormPersonal from '@/app/(app)/form/personal';
import FormFinancial from '@/app/(app)/form/financial';
import Forminvestor from '@/app/(app)/form/investor';
import FormPreferences from '@/app/(app)/form/preferences';
import FormTerms from '@/app/(app)/form/terms';
import FormSuccess from '@/app/(app)/form/success';




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
        <Drawer.Screen name="Summary" component={SummaryScreen} />
        <Drawer.Screen
          name="FormPersonal"
          component={FormPersonal}
          options={{ drawerItemStyle: { display: 'none' } }}
        />
        <Drawer.Screen
          name="FormFinancial"
          component={FormFinancial}
          options={{ drawerItemStyle: { display: 'none' } }}
        />
        <Drawer.Screen
          name="Forminvestor"
          component={Forminvestor}
          options={{ drawerItemStyle: { display: 'none' } }}
        />
        <Drawer.Screen
          name="FormPreferences"
          component={FormPreferences}
          options={{ drawerItemStyle: { display: 'none' } }}
        />
        <Drawer.Screen
          name="FormTerms"
          component={FormTerms}
          options={{ drawerItemStyle: { display: 'none' } }}
        />
        <Drawer.Screen
          name="FormSuccess"
          component={FormSuccess}
          options={{ drawerItemStyle: { display: 'none' } }}
        />

      </Drawer.Navigator>
  );
}
