import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import FormHeader from '../../../components/FormHeader';
import FormButton from '../../../components/FormButton';
import RadioOption from '../../../components/RadioOption';
import CheckboxOption from '../../../components/CheckboxOption';
import InputField from '../../../components/InputField';
import { useFormContext } from '../../../contexts/FormContext';
import { useNavigation } from '@react-navigation/native';

export default function PreferencesForm() {
  const router = useRouter();
  const navigation = useNavigation();
  const { formState, updateField, updateNestedField } = useFormContext();
  
  const [errors, setErrors] = useState({
    liquidityPreference: '',
    assetInterests: '',
    otherAsset: '',
  });

  const validate = () => {
    const newErrors = {
      liquidityPreference: '',
      assetInterests: '',
      otherAsset: '',
    };
    
    let isValid = true;
    
    if (!formState.liquidityPreference) {
      newErrors.liquidityPreference = 'Selecione sua preferência por liquidez';
      isValid = false;
    }
    
    const hasAnyAssetInterest = 
      formState.assetInterests.fixedIncome ||
      formState.assetInterests.stocks ||
      formState.assetInterests.realEstateFunds ||
      formState.assetInterests.multiMarketFunds ||
      formState.assetInterests.crypto ||
      formState.assetInterests.etfs ||
      formState.assetInterests.other;
      
    if (!hasAnyAssetInterest) {
      newErrors.assetInterests = 'Selecione pelo menos um tipo de ativo';
      isValid = false;
    }
    
    if (formState.assetInterests.other && !formState.assetInterests.otherText.trim()) {
      newErrors.otherAsset = 'Especifique o outro tipo de ativo';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validate()) {
      // @ts-ignore
      navigation.navigate('FormTerms');
    }
  };

  return (
    <>
      <FormHeader title="Preferências Pessoais" step={4} totalSteps={5} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Liquidity Preference Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferência por liquidez:</Text>
            
            <RadioOption
              label="Alta"
              value="high"
              selected={formState.liquidityPreference === 'high'}
              onSelect={() => updateField('liquidityPreference', 'high')}
              description="Preciso ter acesso rápido aos recursos quando necessário"
            />
            
            <RadioOption
              label="Média"
              value="medium"
              selected={formState.liquidityPreference === 'medium'}
              onSelect={() => updateField('liquidityPreference', 'medium')}
              description="Posso aguardar alguns dias para acessar parte dos recursos"
            />
            
            <RadioOption
              label="Baixa"
              value="low"
              selected={formState.liquidityPreference === 'low'}
              onSelect={() => updateField('liquidityPreference', 'low')}
              description="Posso deixar os recursos investidos por longos períodos"
            />
            
            {errors.liquidityPreference ? (
              <Text style={styles.errorText}>{errors.liquidityPreference}</Text>
            ) : null}
          </View>
          
          {/* ESG Interest Section */}
          <View style={styles.section}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                Interesse em investimentos sustentáveis / ESG
              </Text>
              <Switch
                value={formState.esgInterest}
                onValueChange={(value) => updateField('esgInterest', value)}
                trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                thumbColor={formState.esgInterest ? '#2563EB' : '#CBD5E1'}
              />
            </View>
          </View>
          
          {/* Previous Investment Experience Section */}
          <View style={styles.section}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>
                Já investiu antes?
              </Text>
              <Switch
                value={formState.previousInvestmentExperience}
                onValueChange={(value) => updateField('previousInvestmentExperience', value)}
                trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                thumbColor={formState.previousInvestmentExperience ? '#2563EB' : '#CBD5E1'}
              />
            </View>
          </View>
          
          {/* Asset Types Interest Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipos de ativos de interesse:</Text>
            <Text style={styles.sectionSubtitle}>Selecione todas as opções aplicáveis</Text>
            
            <CheckboxOption
              label="Renda Fixa"
              selected={formState.assetInterests.fixedIncome}
              onSelect={() => 
                updateNestedField('assetInterests', 'fixedIncome', !formState.assetInterests.fixedIncome)
              }
            />
            
            <CheckboxOption
              label="Ações"
              selected={formState.assetInterests.stocks}
              onSelect={() => 
                updateNestedField('assetInterests', 'stocks', !formState.assetInterests.stocks)
              }
            />
            
            <CheckboxOption
              label="Fundos Imobiliários"
              selected={formState.assetInterests.realEstateFunds}
              onSelect={() => 
                updateNestedField('assetInterests', 'realEstateFunds', !formState.assetInterests.realEstateFunds)
              }
            />
            
            <CheckboxOption
              label="Fundos Multimercado"
              selected={formState.assetInterests.multiMarketFunds}
              onSelect={() => 
                updateNestedField('assetInterests', 'multiMarketFunds', !formState.assetInterests.multiMarketFunds)
              }
            />
            
            <CheckboxOption
              label="Criptoativos"
              selected={formState.assetInterests.crypto}
              onSelect={() => 
                updateNestedField('assetInterests', 'crypto', !formState.assetInterests.crypto)
              }
            />
            
            <CheckboxOption
              label="ETFs"
              selected={formState.assetInterests.etfs}
              onSelect={() => 
                updateNestedField('assetInterests', 'etfs', !formState.assetInterests.etfs)
              }
            />
            
            <CheckboxOption
              label="Outros"
              selected={formState.assetInterests.other}
              onSelect={() => 
                updateNestedField('assetInterests', 'other', !formState.assetInterests.other)
              }
            />
            
            {formState.assetInterests.other && (
              <InputField
                label="Especifique"
                placeholder="Outros tipos de ativos"
                value={formState.assetInterests.otherText}
                onChangeText={(text) => 
                  updateNestedField('assetInterests', 'otherText', text)
                }
                error={errors.otherAsset}
              />
            )}
            
            {errors.assetInterests ? (
              <Text style={styles.errorText}>{errors.assetInterests}</Text>
            ) : null}
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Suas preferências pessoais nos ajudam a refinar as recomendações e 
              oferecer produtos mais alinhados com seus interesses e necessidades.
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: -12,
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    flex: 1,
    marginRight: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
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