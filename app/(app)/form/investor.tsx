import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import FormHeader from '../../../components/FormHeader';
import FormButton from '../../../components/FormButton';
import RadioOption from '../../../components/RadioOption';
import CheckboxOption from '../../../components/CheckboxOption';
import InputField from '../../../components/InputField';
import { useFormContext } from '../../../contexts/FormContext';
import { useNavigation } from '@react-navigation/native';


export default function InvestorProfileForm() {
  const router = useRouter();
  const navigation = useNavigation();
  const { formState, updateField, updateNestedField } = useFormContext();
  
  const [errors, setErrors] = useState({
    knowledgeLevel: '',
    riskTolerance: '',
    objectives: '',
    investmentHorizon: '',
    otherObjective: '',
  });

  const validate = () => {
    const newErrors = {
      knowledgeLevel: '',
      riskTolerance: '',
      objectives: '',
      investmentHorizon: '',
      otherObjective: '',
    };
    
    let isValid = true;
    
    if (!formState.knowledgeLevel) {
      newErrors.knowledgeLevel = 'Selecione seu nível de conhecimento';
      isValid = false;
    }
    
    if (!formState.riskTolerance) {
      newErrors.riskTolerance = 'Selecione sua tolerância ao risco';
      isValid = false;
    }
    
    const hasAnyObjective = 
      formState.objectives.emergencyReserve ||
      formState.objectives.retirement ||
      formState.objectives.realEstate ||
      formState.objectives.shortTermProfit ||
      formState.objectives.other;
      
    if (!hasAnyObjective) {
      newErrors.objectives = 'Selecione pelo menos um objetivo';
      isValid = false;
    }
    
    if (formState.objectives.other && !formState.objectives.otherText.trim()) {
      newErrors.otherObjective = 'Descreva seu outro objetivo';
      isValid = false;
    }
    
    if (!formState.investmentHorizon) {
      newErrors.investmentHorizon = 'Selecione seu horizonte de investimento';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validate()) {
      // @ts-ignore
      navigation.navigate('FormPreferences');
    }
  };

  return (
    <>
      <FormHeader title="Perfil de Investidor" step={3} totalSteps={5} />
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Knowledge Level Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nível de conhecimento em investimentos:</Text>
            
            <RadioOption
              label="Iniciante"
              value="beginner"
              selected={formState.knowledgeLevel === 'beginner'}
              onSelect={() => updateField('knowledgeLevel', 'beginner')}
              description="Tenho pouco ou nenhum conhecimento sobre investimentos"
            />
            
            <RadioOption
              label="Intermediário"
              value="intermediate"
              selected={formState.knowledgeLevel === 'intermediate'}
              onSelect={() => updateField('knowledgeLevel', 'intermediate')}
              description="Conheço alguns conceitos e já investi em produtos básicos"
            />
            
            <RadioOption
              label="Avançado"
              value="advanced"
              selected={formState.knowledgeLevel === 'advanced'}
              onSelect={() => updateField('knowledgeLevel', 'advanced')}
              description="Tenho amplo conhecimento e experiência em diversos tipos de investimentos"
            />
            
            {errors.knowledgeLevel ? (
              <Text style={styles.errorText}>{errors.knowledgeLevel}</Text>
            ) : null}
          </View>
          
          {/* Risk Tolerance Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tolerância ao risco:</Text>
            
            <RadioOption
              label="Conservador"
              value="conservative"
              selected={formState.riskTolerance === 'conservative'}
              onSelect={() => updateField('riskTolerance', 'conservative')}
              description="Priorizo segurança, mesmo com retornos menores"
            />
            
            <RadioOption
              label="Moderado"
              value="moderate"
              selected={formState.riskTolerance === 'moderate'}
              onSelect={() => updateField('riskTolerance', 'moderate')}
              description="Busco equilíbrio entre segurança e rentabilidade"
            />
            
            <RadioOption
              label="Agressivo"
              value="aggressive"
              selected={formState.riskTolerance === 'aggressive'}
              onSelect={() => updateField('riskTolerance', 'aggressive')}
              description="Aceito maiores riscos em busca de retornos elevados"
            />
            
            {errors.riskTolerance ? (
              <Text style={styles.errorText}>{errors.riskTolerance}</Text>
            ) : null}
          </View>
          
          {/* Investment Objectives Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Objetivos principais:</Text>
            <Text style={styles.sectionSubtitle}>Selecione todas as opções aplicáveis</Text>
            
            <CheckboxOption
              label="Reserva de emergência"
              selected={formState.objectives.emergencyReserve}
              onSelect={() => 
                updateNestedField('objectives', 'emergencyReserve', !formState.objectives.emergencyReserve)
              }
            />
            
            <CheckboxOption
              label="Aposentadoria"
              selected={formState.objectives.retirement}
              onSelect={() => 
                updateNestedField('objectives', 'retirement', !formState.objectives.retirement)
              }
            />
            
            <CheckboxOption
              label="Compra de imóvel"
              selected={formState.objectives.realEstate}
              onSelect={() => 
                updateNestedField('objectives', 'realEstate', !formState.objectives.realEstate)
              }
            />
            
            <CheckboxOption
              label="Lucro no curto prazo"
              selected={formState.objectives.shortTermProfit}
              onSelect={() => 
                updateNestedField('objectives', 'shortTermProfit', !formState.objectives.shortTermProfit)
              }
            />
            
            <CheckboxOption
              label="Outros"
              selected={formState.objectives.other}
              onSelect={() => 
                updateNestedField('objectives', 'other', !formState.objectives.other)
              }
            />
            
            {formState.objectives.other && (
              <InputField
                label="Especifique"
                placeholder="Descreva seu objetivo"
                value={formState.objectives.otherText}
                onChangeText={(text) => 
                  updateNestedField('objectives', 'otherText', text)
                }
                error={errors.otherObjective}
              />
            )}
            
            {errors.objectives ? (
              <Text style={styles.errorText}>{errors.objectives}</Text>
            ) : null}
          </View>
          
          {/* Investment Horizon Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Horizonte de investimento:</Text>
            
            <RadioOption
              label="Curto prazo (até 2 anos)"
              value="short"
              selected={formState.investmentHorizon === 'short'}
              onSelect={() => updateField('investmentHorizon', 'short')}
              description="Preciso dos recursos em até 2 anos"
            />
            
            <RadioOption
              label="Médio prazo (2 a 5 anos)"
              value="medium"
              selected={formState.investmentHorizon === 'medium'}
              onSelect={() => updateField('investmentHorizon', 'medium')}
              description="Planejo utilizar os recursos entre 2 e 5 anos"
            />
            
            <RadioOption
              label="Longo prazo (mais de 5 anos)"
              value="long"
              selected={formState.investmentHorizon === 'long'}
              onSelect={() => updateField('investmentHorizon', 'long')}
              description="Posso manter os investimentos por mais de 5 anos"
            />
            
            {errors.investmentHorizon ? (
              <Text style={styles.errorText}>{errors.investmentHorizon}</Text>
            ) : null}
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
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 8,
  },
});