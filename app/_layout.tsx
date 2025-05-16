import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Redirect, SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { FormProvider } from '@/contexts/FormContext';
import { ReactNode } from 'react';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Root layout wrapper that provides auth context
function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);

  useFrameworkReady();

  // Effect to prepare app and hide splash screen
  useEffect(() => {
    async function prepare() {
      try {
        // Add any app initialization logic here
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulating initialization
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the app to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Effect to hide the splash screen
  useEffect(() => {
    if (appIsReady && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady, isLoading]);

  // Show nothing while both loading states are active
  if (!appIsReady || isLoading) {
    return null;
  }

  // Redirect based on authentication state
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

// Root layout component
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  useFrameworkReady();
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <FormProvider>
          <RootLayoutNav />
          {children}
        </FormProvider>
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}