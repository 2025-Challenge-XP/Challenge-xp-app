import { router } from 'expo-router';
import { supabase } from './supabase';

// Types
export type AuthError = {
  message: string;
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<AuthError | null> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { message: error.message };
    }

    // Redirect to the home screen
    router.replace('/(app)');
    return null;
  } catch (error: any) {
    return { message: error.message || 'An unexpected error occurred' };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, nickname: string): Promise<AuthError | null> => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
        first_name: nickname
        }
      },
    });

    if (error) {
      return { message: error.message };
    }

    // In production, you might want to show a "Verification email sent" screen instead
    // For now, we'll just sign the user in directly
    return await signInWithEmail(email, password);
  } catch (error: any) {
    return { message: error.message || 'An unexpected error occurred' };
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<AuthError | null> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'app://reset-password',
    });

    if (error) {
      return { message: error.message };
    }

    return null;
  } catch (error: any) {
    return { message: error.message || 'An unexpected error occurred' };
  }
};

// Sign out
export const signOut = async (): Promise<AuthError | null> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { message: error.message };
    }

    // Redirect to the login screen
    router.replace('/(auth)/login');
    return null;
  } catch (error: any) {
    return { message: error.message || 'An unexpected error occurred' };
  }
};

// Get the current logged in user
export const getCurrentUser = async () => {
  return (await supabase.auth.getSession()).data.session?.user || null;
};