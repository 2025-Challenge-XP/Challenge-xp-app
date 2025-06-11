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
    if (Platform.OS === 'web') {
      // Web: usa o padrão sugerido pelo usuário
      const response = await fetch(profileImageUri);
      const blob = await response.blob();
      const fileName = `avatars/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
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
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      return publicUrlData.publicUrl;
    } else {
      // Mobile: usar fetch + FormData para upload direto
      let extension = profileImageUri.split('.').pop()?.toLowerCase() || 'jpg';
      let mimeType = 'image/jpeg';
      if (extension === 'png') mimeType = 'image/png';
      if (extension === 'webp') mimeType = 'image/webp';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
      const bucket = 'avatars';
      const formData = new FormData();
      formData.append('file', {
        uri: profileImageUri,
        name: fileName,
        type: mimeType,
      } as any);
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
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(`avatars/${fileName}`);
      return publicUrlData.publicUrl;
    }
  } catch (error) {
    console.error('Error processing image upload:', error);
    return null;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, nickname: string, completeName: string, telephone: string, address: string, profileImageUri: string): Promise<AuthError | null> => {
  console.log("imagem escolhida:", profileImageUri);
  
  try {
    // 1. Cria o usuário
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: nickname,
          last_name: completeName,
          telephone,
          address,
        },
      },
    });
    if (signUpError) {
      return { message: signUpError.message };
    }

    // 2. Faz login para garantir sessão válida
    const signInError = await signInWithEmail(email, password);
    if (signInError) {
      return signInError;
    }

    // 3. Faz upload da imagem de perfil se existir
    let profileImageUrl = '';
    if (profileImageUri) {
      profileImageUrl = await uploadProfileImage(profileImageUri) || '';
    }

    // 4. Atualiza o perfil do usuário com a URL da imagem
    if (profileImageUrl) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: profileImageUrl,
        },
      });
      if (updateError) {
        return { message: updateError.message };
      }
    }

    return null;
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