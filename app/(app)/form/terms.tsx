import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import FormHeader from '../../../components/FormHeader';
import FormButton from '../../../components/FormButton';
import { useFormContext } from '../../../contexts/FormContext';
import { Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function TermsForm() {
  const router = useRouter();
  const navigation = useNavigation();
  const { formState, updateField } = useFormContext();
  const { salvarDados } = useFormContext();
  
  
  const [errors, setErrors] = useState({
    terms: '',
  });

  const validate = () => {
    const newErrors = {
      terms: '',
    };
    
    let isValid = true;
    
    if (!formState.termsAccepted || !formState.dataUseConsent) {
      newErrors.terms = 'É necessário aceitar os termos e consentimentos para continuar';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      if (salvarDados) {
        salvarDados();
        // @ts-ignore
        navigation.navigate('FormSuccess');
      }
    }
  };

  return (
    <>
      <FormHeader title="Termos e Consentimentos" step={5} totalSteps={5} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Finalização do Questionário</Text>
            <Text style={styles.infoText}>
              Estamos quase lá! Para finalizar seu perfil de investidor, 
              precisamos do seu consentimento para processamento dos dados.
            </Text>
          </View>
          
          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>Termos e Consentimentos</Text>
            
            <View style={styles.termItem}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => updateField('termsAccepted', !formState.termsAccepted)}
              >
                {formState.termsAccepted ? (
                  <View style={styles.checkboxSelected}>
                    <Check size={16} color="#FFFFFF" strokeWidth={3} />
                  </View>
                ) : (
                  <View style={styles.checkboxUnselected} />
                )}
              </TouchableOpacity>
              
              <View style={styles.termContent}>
                <Text style={styles.termText}>
                  Aceito os{' '}
                  <Text 
                    style={styles.termLink}
                    onPress={() => Linking.openURL('https://www.exemplo.com/termos')}
                  >
                    termos de uso
                  </Text>
                  {' '}e{' '}
                  <Text 
                    style={styles.termLink}
                    onPress={() => Linking.openURL('https://www.exemplo.com/privacidade')}
                  >
                    política de privacidade
                  </Text>
                </Text>
              </View>
            </View>
            
            <View style={styles.termItem}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => updateField('dataUseConsent', !formState.dataUseConsent)}
              >
                {formState.dataUseConsent ? (
                  <View style={styles.checkboxSelected}>
                    <Check size={16} color="#FFFFFF" strokeWidth={3} />
                  </View>
                ) : (
                  <View style={styles.checkboxUnselected} />
                )}
              </TouchableOpacity>
              
              <View style={styles.termContent}>
                <Text style={styles.termText}>
                  Autorizo o uso dos meus dados para fins de recomendação de investimentos com base em IA
                </Text>
              </View>
            </View>
            
            {errors.terms ? (
              <Text style={styles.errorText}>{errors.terms}</Text>
            ) : null}
          </View>
          
          <View style={styles.privacySection}>
            <Text style={styles.privacyTitle}>Proteção de Dados</Text>
            <Text style={styles.privacyText}>
              Conforme previsto na Lei Geral de Proteção de Dados (LGPD), seus dados 
              serão utilizados exclusivamente para as finalidades informadas e estarão 
              protegidos por medidas de segurança técnicas e administrativas.
            </Text>
            <Text style={styles.privacyText}>
              Você pode solicitar acesso, correção ou exclusão dos seus dados a 
              qualquer momento através dos nossos canais de atendimento.
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <FormButton
              title="Finalizar Questionário"
              onPress={handleSubmit}
            />
          </View>
        </View>
      </ScrollView>
    </>
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
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  termsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  checkboxUnselected: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  checkboxSelected: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termContent: {
    flex: 1,
  },
  termText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
  },
  termLink: {
    color: '#2563EB',
    textDecorationLine: 'underline',
  },
  privacySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 8,
  },
});