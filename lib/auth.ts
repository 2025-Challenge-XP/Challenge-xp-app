import { router } from 'expo-router';
import { supabase } from './supabase';
import { supabaseUrl } from './supabase';
import { Platform } from 'react-native';

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
    let extension = profileImageUri.split('.').pop()?.toLowerCase() || 'jpg';
    let mimeType = 'image/jpeg';
    if (extension === 'png') mimeType = 'image/png';
    if (extension === 'webp') mimeType = 'image/webp';

    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
    const bucket = 'avatars';
    let publicUrl = '';

    if (Platform.OS === 'web') {
      // Web: usar SDK normalmente
      const response = await fetch(profileImageUri);
      const fileBlob = await response.blob();
      const { error } = await supabase.storage
        .from(bucket)
        .upload(`avatars/${fileName}`, fileBlob, {
          contentType: mimeType,
          upsert: true,
        });
      if (error) {
        console.error('Error de web:');
        console.error('Error uploading image:', error.message);
        return null;
      }
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(`avatars/${fileName}`);
      publicUrl = publicUrlData.publicUrl;
    } else {
      // Mobile: usar fetch + FormData para upload direto
      const formData = new FormData();
      formData.append('file', {
        uri: profileImageUri,
        name: fileName,
        type: mimeType,
      } as any);

      // Usa supabaseUrl do arquivo de configuração
      const apiUrl = `${supabaseUrl}/storage/v1/object/${bucket}/avatars/${fileName}`;

      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Error uploading image:', errText);
        return null;
      }
      // Monta a URL pública
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(`avatars/${fileName}`);
      publicUrl = publicUrlData.publicUrl;
    }
    return publicUrl;
  } catch (error) {
    console.error('Error processing image upload:', error);
    return null;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, nickname: string, profileImageUri: string): Promise<AuthError | null> => {
  try {
    // Upload profile image and get public URL
    let profileImageUrl = '';
    if (profileImageUri) {
      profileImageUrl = await uploadProfileImage(profileImageUri) || '';
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