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
import * as ImagePicker from 'expo-image-picker';
import { Camera, Pencil } from 'lucide-react-native'; // certifique-se de ter esse pacote instalado


export default function RegisterScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState(''); 

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }

    console.log(result);
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    // Aqui você pode enviar a imagem para o backend junto com os dados do formulário
    const result = await signUpWithEmail(data.email, data.password, data.nickname, profileImage? profileImage : "");

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
      <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8} style={styles.imagePickerContainer}>
        {profileImage ? (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editIcon} onPress={handlePickImage}>
              <Pencil color="#fff" size={18} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderImage}>
            <Camera color="#aaa" size={32} />
            <TouchableOpacity style={styles.editIcon} onPress={handlePickImage}>
              <Pencil color="#fff" size={18} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

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
  imagePickerContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.neutrals[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: theme.colors.neutrals[600],
    fontFamily: theme.typography.fontFamily.medium,
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


imageWrapper: {
  position: 'relative',
  width: 100,
  height: 100,
},

editIcon: {
  position: 'absolute',
  bottom: 4,
  right: 4,
  backgroundColor: theme.colors.primary[500],   
  borderRadius: 16,
  padding: 6,
},
});

