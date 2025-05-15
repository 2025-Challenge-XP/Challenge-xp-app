import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, UserRound } from 'lucide-react-native';

import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { theme } from '@/lib/theme';

interface AuthFormProps {
  type: 'login' | 'register' | 'reset';
  onSubmit: (data: any) => void;
  isLoading: boolean;
  error?: string | null;
  validationSchema: z.ZodSchema<any>;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  isLoading,
  error,
  validationSchema,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
    },
  });

  // Form configuration based on type
  const formConfig = {
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account',
      buttonText: 'Sign In',
      fields: ['email', 'password'],
    },
    register: {
      title: 'Create Account',
      subtitle: 'Sign up for a new account',
      buttonText: 'Create Account',
      fields: ['email', 'password', 'confirmPassword', 'nickname'],
    },
    reset: {
      title: 'Reset Password',
      subtitle: 'Enter your email to receive a reset link',
      buttonText: 'Send Reset Link',
      fields: ['email'],
    },
  }[type];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
      keyboardVerticalOffset={-120}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.formContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{formConfig.title}</Text>
          <Text style={styles.subtitle}>{formConfig.subtitle}</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.form}>
          {formConfig.fields.includes('nickname') && (
            <Controller
              control={control}
              name="nickname"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Como gostaria de ser chamado?"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Algum apelido?"
                  error={errors.nickname?.message?.toString()}
                  icon={<UserRound size={20} color={theme.colors.neutrals[500]} />}
                  returnKeyType="done"
                />
              )}
            />
          )}

          {formConfig.fields.includes('email') && (
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message?.toString()}
                  icon={<Mail size={20} color={theme.colors.neutrals[500]} />}
                  returnKeyType="next"
                />
              )}
            />
          )}

          {formConfig.fields.includes('password') && (
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Your password"
                  secureTextEntry
                  error={errors.password?.message?.toString()}
                  icon={<Lock size={20} color={theme.colors.neutrals[500]} />}
                  returnKeyType={type === 'login' ? 'done' : 'next'}
                />
              )}
            />
          )}

          {formConfig.fields.includes('confirmPassword') && (
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Confirm password"
                  secureTextEntry
                  error={errors.confirmPassword?.message?.toString()}
                  icon={<Lock size={20} color={theme.colors.neutrals[500]} />}
                  returnKeyType="done"
                />
              )}
            />
          )}

          <Button
            title={formConfig.buttonText}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            fullWidth
            size="lg"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    width: '100%',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xxxl,
    color: theme.colors.neutrals[900],
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[600],
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    backgroundColor: theme.colors.error[100],
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.error[500],
    textAlign: 'center',
  },
});

export default AuthForm;
