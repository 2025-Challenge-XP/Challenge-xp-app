import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import AuthForm from '@/components/auth/AuthForm';
import { ResetPasswordFormData, resetPasswordSchema } from '@/lib/validation';
import { resetPassword } from '@/lib/auth';
import { theme } from '@/lib/theme';
import Animated, { SlideInRight } from 'react-native-reanimated';
import { Header } from '@/components/ui/Header';

export default function ResetPasswordScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    
    const result = await resetPassword(data.email);
    
    if (result) {
      setError(result.message);
    } else {
      setIsSuccess(true);
    }
    
    setIsLoading(false);
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <Header showBackButton title="Reset Password" />
      
      <Animated.View 
        style={styles.content} 
        entering={SlideInRight.duration(400).springify()}
      >
        {isSuccess ? (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successMessage}>
              We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
            </Text>
            <Button
              title="Back to Login"
              onPress={() => router.push('/(auth)/login')}
              variant="primary"
              style={styles.successButton}
            />
          </View>
        ) : (
          <>
            <Text style={styles.headerText}>
              Enter your email address below and we'll send you instructions to reset your password.
            </Text>

            <AuthForm
              type="reset"
              onSubmit={handleResetPassword}
              isLoading={isLoading}
              error={error}
              validationSchema={resetPasswordSchema}
            />
          </>
        )}

        {!isSuccess && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </SafeAreaWrapper>
  );
}

// Import the Button component here to avoid circular dependencies
import { Button } from '@/components/ui/Button';

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
  headerText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[700],
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    maxWidth: 400,
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
  successContainer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.success[100],
    borderRadius: theme.borderRadius.lg,
    maxWidth: 400,
    width: '100%',
  },
  successTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.success[700],
    marginBottom: theme.spacing.md,
  },
  successMessage: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[800],
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  successButton: {
    backgroundColor: theme.colors.success[500],
    marginTop: theme.spacing.md,
  },
});