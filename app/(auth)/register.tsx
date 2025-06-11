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


  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    // Aqui você pode enviar a imagem para o backend junto com os dados do formulário
    const result = await signUpWithEmail(data.email, data.password, data.nickname, data.completeName, data.telephone, data.address, data.profileImage ? data.profileImage : "");

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
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.footerLink}>Entrar</Text>
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

