import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import FormHeader from '../../../components/FormHeader';
import FormButton from '../../../components/FormButton';
import CurrencyInput from '../../../components/CurrencyInput';
import { useFormContext } from '../../../contexts/FormContext';
import { useNavigation } from '@react-navigation/native';


export default function FinancialProfileForm() {
  const navigation = useNavigation();
  const router = useRouter();
  const { formState, updateField, updateNestedField } = useFormContext();
  
  const [errors, setErrors] = useState({
    monthlyIncome: '',
    totalAssets: '',
    investmentAmount: '',
    monthlyContributionAmount: '',
  });

  const validate = () => {
    const newErrors = {
      monthlyIncome: '',
      totalAssets: '',
      investmentAmount: '',
      monthlyContributionAmount: '',
    };
    
    let isValid = true;
    
    if (!formState.monthlyIncome.trim()) {
      newErrors.monthlyIncome = 'A renda mensal é obrigatória';
      isValid = false;
    }
    
    if (!formState.totalAssets.trim()) {
      newErrors.totalAssets = 'O patrimônio total é obrigatório';
      isValid = false;
    }
    
    if (!formState.investmentAmount.trim()) {
      newErrors.investmentAmount = 'O valor disponível para investir é obrigatório';
      isValid = false;
    }
    
    if (formState.monthlyContribution.hasContribution && !formState.monthlyContribution.amount.trim()) {
      newErrors.monthlyContributionAmount = 'O valor do aporte mensal é obrigatório';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validate()) {
      // @ts-ignore
      navigation.navigate('Forminvestor');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <FormHeader title="Perfil Financeiro" step={2} totalSteps={5} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <CurrencyInput
            label="Renda Mensal Aproximada"
            value={formState.monthlyIncome}
            onChangeValue={(value) => updateField('monthlyIncome', value)}
            error={errors.monthlyIncome}
          />
          
          <CurrencyInput
            label="Patrimônio Total Estimado"
            value={formState.totalAssets}
            onChangeValue={(value) => updateField('totalAssets', value)}
            error={errors.totalAssets}
          />
          
          <CurrencyInput
            label="Valor Disponível para Investir"
            value={formState.investmentAmount}
            onChangeValue={(value) => updateField('investmentAmount', value)}
            error={errors.investmentAmount}
          />
          
          <View style={styles.contributionContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                Pretende fazer aportes mensais?
              </Text>
              <Switch
                value={formState.monthlyContribution.hasContribution}
                onValueChange={(value) => 
                  updateNestedField('monthlyContribution', 'hasContribution', value)
                }
                trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                thumbColor={formState.monthlyContribution.hasContribution ? '#2563EB' : '#CBD5E1'}
              />
            </View>
            
            {formState.monthlyContribution.hasContribution && (
              <CurrencyInput
                label="Valor Estimado do Aporte Mensal"
                value={formState.monthlyContribution.amount}
                onChangeValue={(value) => 
                  updateNestedField('monthlyContribution', 'amount', value)
                }
                error={errors.monthlyContributionAmount}
              />
            )}
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Essas informações são importantes para conhecer seu perfil financeiro 
              e oferecer recomendações adequadas à sua situação atual.
            </Text>
          </View>
          
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
  contributionContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  infoContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 8,
  },
});