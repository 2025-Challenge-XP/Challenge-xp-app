import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import FormHeader from '../../../components/FormHeader';
import InputField from '../../../components/InputField';
import FormButton from '../../../components/FormButton';
import { useFormContext } from '../../../contexts/FormContext';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '@/contexts/AuthContext';


export default function PersonalInfoForm() {
  const navigation = useNavigation();
  const router = useRouter();
  const { formState, updateField } = useFormContext();
  const { user } = useAuth();
  
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    documentId: '',
    birthDate: '',
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateCPF = (cpf: string) => {
    const cpfClean = cpf.replace(/[^\d]/g, '');
    return cpfClean.length === 11;
  };

  const validarCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cleaned = cpf.replace(/[^\d]/g, '');

  // CPF deve ter 11 dígitos
  if (cleaned.length !== 11) return false;

  // Rejeita CPFs com todos os dígitos iguais (ex: 00000000000)
  if (/^(\d)\1+$/.test(cleaned)) return false;

  // Valida primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digito1 = (soma * 10) % 11;
  if (digito1 === 10 || digito1 === 11) digito1 = 0;

  if (digito1 !== parseInt(cleaned.charAt(9))) return false;

  // Valida segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  let digito2 = (soma * 10) % 11;
  if (digito2 === 10 || digito2 === 11) digito2 = 0;

  if (digito2 !== parseInt(cleaned.charAt(10))) return false;

  return true;
  };

  const validateBirthDate = (date: string) => {
    const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return datePattern.test(date);
  };

  const validateAge = (date: string) => {

    // Verifica se é maior de idade (18+)
    const [day, month, year] = date.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const handleCPFChange = (text: string) => {
    let formattedText = text.replace(/\D/g, '');
    if (formattedText.length > 11) {
      formattedText = formattedText.slice(0, 11);
    }
    
    // Add CPF formatting
    if (formattedText.length > 9) {
      formattedText = `${formattedText.slice(0, 3)}.${formattedText.slice(3, 6)}.${formattedText.slice(6, 9)}-${formattedText.slice(9)}`;
    } else if (formattedText.length > 6) {
      formattedText = `${formattedText.slice(0, 3)}.${formattedText.slice(3, 6)}.${formattedText.slice(6)}`;
    } else if (formattedText.length > 3) {
      formattedText = `${formattedText.slice(0, 3)}.${formattedText.slice(3)}`;
    }
    
    updateField('documentId', formattedText);
  };

  const handlePhoneChange = (text: string) => {
    let formattedText = text.replace(/\D/g, '');
    if (formattedText.length > 11) {
      formattedText = formattedText.slice(0, 11);
    }
    
    // Add phone formatting
    if (formattedText.length > 6) {
      formattedText = `(${formattedText.slice(0, 2)}) ${formattedText.slice(2, 7)}-${formattedText.slice(7)}`;
    } else if (formattedText.length > 2) {
      formattedText = `(${formattedText.slice(0, 2)}) ${formattedText.slice(2)}`;
    } else if (formattedText.length > 0) {
      formattedText = `(${formattedText}`;
    }
    
    updateField('phone', formattedText);
  };

  const handleBirthDateChange = (text: string) => {
    let formattedText = text.replace(/\D/g, '');
    if (formattedText.length > 8) {
      formattedText = formattedText.slice(0, 8);
    }
    
    // Add date formatting (DD/MM/YYYY)
    if (formattedText.length > 4) {
      formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2, 4)}/${formattedText.slice(4)}`;
    } else if (formattedText.length > 2) {
      formattedText = `${formattedText.slice(0, 2)}/${formattedText.slice(2)}`;
    }
    
    updateField('birthDate', formattedText);
  };

  const validate = () => {
    const newErrors = {
      fullName: '',
      email: '',
      documentId: '',
      birthDate: '',
    };
    
    let isValid = true;
    
    if (!formState.fullName.trim()) {
      newErrors.fullName = 'O nome completo é obrigatório';
      isValid = false;
    }
    
    if (!formState.email.trim()) {
      newErrors.email = 'O e-mail é obrigatório';
      isValid = false;
    } else if (!validateEmail(formState.email)) {
      newErrors.email = 'E-mail inválido';
      isValid = false;
    }
    
    if (!formState.documentId.trim()) {
      newErrors.documentId = 'O CPF é obrigatório';
      isValid = false;
    } else if (!validateCPF(formState.documentId)) {
      newErrors.documentId = 'CPF inválido';
      isValid = false;
    } else if (!validarCPF(formState.documentId)) {
      newErrors.documentId = 'Digitos do CPF inválidos';
      isValid = false;
    }
    
    if (!formState.birthDate.trim()) {
      newErrors.birthDate = 'A data de nascimento é obrigatória';
      isValid = false;
    } else if (!validateBirthDate(formState.birthDate)) {
      newErrors.birthDate = 'Data inválida (use DD/MM/AAAA)';
      isValid = false;
    } else if (!validateAge(formState.birthDate)) {
      newErrors.birthDate = 'Você deve ter pelo menos 18 anos';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validate()) {
      // @ts-ignore
      navigation.navigate('FormFinancial');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <FormHeader title="Informações Pessoais" step={1} totalSteps={5} showBackButton={true} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <InputField
            label="Nome Completo"
            placeholder="Digite seu nome completo"
            value={formState.fullName}
            onChangeText={(text) => updateField('fullName', text)}
            error={errors.fullName}
            autoCapitalize="words"
          />
          
          <InputField
            label="E-mail cadastrado"
            placeholder="Seu email cadastrado é:"
            value={user?.user_metadata.email || ''}
            onChangeText={(text) => updateField('email', text)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <InputField
            label="CPF"
            placeholder="000.000.000-00"
            value={formState.documentId}
            onChangeText={handleCPFChange}
            error={errors.documentId}
            keyboardType="numeric"
          />
          
          <InputField
            label="Data de Nascimento"
            placeholder="DD/MM/AAAA"
            value={formState.birthDate}
            onChangeText={handleBirthDateChange}
            error={errors.birthDate}
            keyboardType="numeric"
          />
          
          <InputField
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={formState.phone}
            onChangeText={handlePhoneChange}
            optional={true}
            keyboardType="phone-pad"
          />
          
          <View style={styles.buttonContainer}>
            <FormButton
              title="Continuar"
              onPress={handleNext}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
  },
  buttonContainer: {
    marginTop: 24,
  },
});