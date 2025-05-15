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

export const uploadProfileImage = async (profileImageUri: string): Promise<string | null> => {
  try {
    // Fetch the image as a blob
    const response = await fetch(profileImageUri);
    const blob = await response.blob();

    // Generate a unique filename
    const fileName = `avatars/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

    // Upload the blob to Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) {
      console.error('Error uploading image:', error.message);
      return null;
    }

    // Get the public URL of the uploaded image
    const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error processing image upload:', error);
    return null;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, nickname: string, profileImageUri: string): Promise<AuthError | null> => {
  try {
    // Upload profile image and get public URL
    const profileImageUrl = await uploadProfileImage(profileImageUri);

    if (!profileImageUrl) {
      return { message: 'Failed to upload profile image' };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: nickname,
          avatar_url: profileImageUrl,
        },
      },
    });

    if (error) {
      return { message: error.message };
    }

    // In production, you might want to show a "Verification email sent" screen instead
    // For now, we'll just sign the user in directly
    console.log('Signing up with email:', email, 'and password:', password);
    console.log('Nickname:', nickname);
    console.log('Profile image:', profileImageUri);
    return await signInWithEmail(email, password);
  } catch (error: any) {
    return { message: error.message || 'An unexpected error occurred' };
  }
};

export const base64ToBlob = (base64: string, contentType: string = ''): Blob => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
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