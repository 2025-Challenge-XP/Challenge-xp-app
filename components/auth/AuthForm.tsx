import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, UserRound, Home, Contact } from 'lucide-react-native';

import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { theme } from '@/lib/theme';
import { on } from 'events';

import * as ImagePicker from 'expo-image-picker';
import { Camera, Pencil } from 'lucide-react-native'; 


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
    clearErrors,
    setValue,
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
      completeName: '',
      telephone: '',
      address: '',
      profileImage: '', 
    },
  });

  const [step, setStep] = useState(1);

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
      setValue('profileImage', result.assets[0].uri); 
    }

  };
  

  
  const formConfig = {
    login: {
      title: 'Bem-vindo de volta',
      subtitle: 'Entre na sua conta',
      buttonText: 'Entrar',
      fields: ['email', 'password'],
    },
    register: {
      title: 'Criar conta',
      subtitle: 'Cadastre-se para uma nova conta',
      buttonText: 'Criar conta',
      fields: [
        'email',
        'password',
        'confirmPassword',
        'nickname',
        'completeName',
        'telephone',
        'address',
        'profileImage',
      ],
    },
    reset: {
      title: 'Redefinir senha',
      subtitle: 'Digite seu e-mail para receber um link de redefinição',
      buttonText: 'Enviar link de redefinição',
      fields: ['email'],
    },
  }[type];

  
  if (type === 'login') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
        keyboardVerticalOffset={-120}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={styles.formContainer}
        >
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
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-mail"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="exemplo@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message?.toString()}
                  icon={<Mail size={20} color={theme.colors.neutrals[500]} />}
                  returnKeyType="next"
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Senha"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Sua senha"
                  secureTextEntry
                  error={errors.password?.message?.toString()}
                  icon={<Lock size={20} color={theme.colors.neutrals[500]} />}
                  returnKeyType="done"
                />
              )}
            />
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
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
      keyboardVerticalOffset={-120}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.formContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{formConfig.title}</Text>
          <Text style={styles.subtitle}>{formConfig.subtitle}</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {step === 1 && (
          <View style={styles.form}>
            {formConfig.fields.includes('completeName') && (
              <Controller
                control={control}
                name="completeName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Nome completo"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Seu nome completo"
                    error={errors.completeName?.message?.toString()}
                    icon={
                      <UserRound size={20} color={theme.colors.neutrals[500]} />
                    }
                    returnKeyType="done"
                  />
                )}
              />
            )}

            {formConfig.fields.includes('telephone') && (
              <Controller
                control={control}
                name="telephone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Telefone"
                    value={value}
                    onChangeText={text => {
                      
                      let cleaned = text.replace(/\D/g, '');
                      
                      if (cleaned.length > 2) {
                        cleaned = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
                      }
                      if (cleaned.length > 10) {
                        cleaned = `${cleaned.slice(0, 10)}-${cleaned.slice(10, 14)}`;
                      }
                      
                      cleaned = cleaned.slice(0, 15);
                      onChange(cleaned);
                    }}
                    onBlur={onBlur}
                    placeholder="(99) 99999-9999"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    error={errors.telephone?.message?.toString()}
                    icon={<Contact size={20} color={theme.colors.neutrals[500]} />}
                    returnKeyType="next"
                  />
                )}
              />
            )}

            {formConfig.fields.includes('address') && (
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="CEP"
                    value={value}
                    onChangeText={text => {
                      
                      let cleaned = text.replace(/\D/g, '');
                      
                      if (cleaned.length > 5) {
                        cleaned = cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
                      }
                      onChange(cleaned);
                    }}
                    onBlur={onBlur}
                    placeholder="12345-678"
                    keyboardType="phone-pad"
                    error={errors.address?.message?.toString()}
                    icon={<Lock size={20} color={theme.colors.neutrals[500]} />}
                    returnKeyType="done"
                  />
                )}
              />
            )}

            <Button
              title={formConfig.buttonText}
              onPress={handleSubmit(
                () => {
                  
                  setStep(2);
                },
                (formErrors) => {
                  
                  if (!formErrors.address && !formErrors.telephone && !formErrors.completeName) {
                    clearErrors();
                    setStep(2);

                  }
                  
                  
                }
              )}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.button}
            />
          </View>
        )}
        {step === 2 && (
          <View style={styles.form}>
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

            {formConfig.fields.includes('nickname') && (
              <Controller
                control={control}
                name="nickname"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Apelido"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Seu apelido"
                    error={errors.nickname?.message?.toString()}
                    icon={
                      <UserRound size={20} color={theme.colors.neutrals[500]} />
                    }
                    returnKeyType="done"
                  />
                )}
              />
            )}

            <Button
              title="Enviar"
              onPress={handleSubmit(
                () => {
                  
                  setStep(2);
                },
                (formErrors) => {
                  
                  if (!formErrors.nickname) {
                    clearErrors();
                    setStep(3);

                  }
                  
                  
                }
              )}
              loading={isLoading}
              fullWidth
              size="lg"
              style={styles.button}
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.form}>
            {formConfig.fields.includes('email') && (
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="E-mail"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="exemplo@email.com"
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
                    label="Senha"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Sua senha"
                    secureTextEntry
                    error={errors.password?.message?.toString()}
                    icon={<Lock size={20} color={theme.colors.neutrals[500]} />}
                    returnKeyType="done"
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
                    label="Confirmar senha"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Confirme sua senha"
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
        )}
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
  editIcon: {
  position: 'absolute',
  bottom: 4,
  right: 4,
  backgroundColor: theme.colors.primary[500],   
  borderRadius: 16,
  padding: 6,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
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
    backgroundColor: '#2563EB',

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
