import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import AuthForm from '@/components/auth/AuthForm';
import { RegisterFormData, registerSchema } from '@/lib/validation';
import { signUpWithEmail } from '@/lib/auth';
import { theme } from '@/lib/theme';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { Header } from '@/components/ui/Header';

export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    
    const result = await signUpWithEmail(data.email, data.password, data.nickname);
    
    if (result) {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      
      <Animated.View 
        style={styles.content} 
        entering={SlideInRight.duration(400).springify()}
      >
        <AuthForm
          type="register"
          onSubmit={handleRegister}
          isLoading={isLoading}
          error={error}
          validationSchema={registerSchema}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoImage: {
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.round,
  },
  footer: {
    flexDirection: 'row',
    marginTop: theme.spacing.lg,
    justifyContent: 'center',
  },
  footerText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[600],
  },
  footerLink: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary[500],
  },
});