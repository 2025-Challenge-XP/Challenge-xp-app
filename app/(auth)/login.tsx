import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Link, router } from 'expo-router';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import AuthForm from '@/components/auth/AuthForm';
import { LoginFormData, loginSchema } from '@/lib/validation';
import { signInWithEmail } from '@/lib/auth';
import { theme } from '@/lib/theme';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    const result = await signInWithEmail(data.email, data.password);

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
          type="login"
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
          validationSchema={loginSchema}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Não possui uma conta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.footerLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => router.push('/(auth)/reset-password')}
        >
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
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
    marginBottom: theme.spacing.xxl,
    marginTop: theme.spacing.xl,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.round,
    marginBottom: theme.spacing.sm,
  },
  logoText: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxxl,
    color: theme.colors.primary[500],
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
  forgotPassword: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  forgotPasswordText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary[500],
  },
});
