import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import FormButton from '../../../components/FormButton';
import { useFormContext } from '../../../contexts/FormContext';
import { CircleCheck as CheckCircle2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';


export default function SuccessScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  
  const { formState } = useFormContext();

  const getInvestorProfileText = () => {
    let profile = '';
    
    if (formState.riskTolerance === 'conservative') {
      profile = 'Conservador';
    } else if (formState.riskTolerance === 'moderate') {
      profile = 'Moderado';
    } else if (formState.riskTolerance === 'aggressive') {
      profile = 'Arrojado';
    }
    
    return profile;
  };

  const viewSummary = () => {
      // @ts-ignore
      navigation.navigate('Summary');
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIconContainer}>
          <CheckCircle2 size={80} color="#10B981" />
        </View>
        
        <Text style={styles.title}>Questionário Concluído!</Text>
        <Text style={styles.subtitle}>
          Obrigado por completar o questionário de perfil de investidor.
        </Text>
        
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Seu Perfil de Investidor</Text>
            <Text style={styles.profileText}>{getInvestorProfileText()}</Text>
            <Text style={styles.cardDescription}>
              Com base nas suas respostas, identificamos seu perfil de investidor.
              Isso nos ajudará a oferecer recomendações mais adequadas ao seu perfil.
            </Text>
          </View>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.nextStepsContainer}>
          <Text style={styles.nextStepsTitle}>Próximos Passos</Text>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Revisar Perfil</Text>
              <Text style={styles.stepDescription}>
                Você pode verificar o resumo das suas respostas a qualquer momento
              </Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Receber Recomendações</Text>
              <Text style={styles.stepDescription}>
                Com base no seu perfil, mostraremos investimentos adequados para você
              </Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Iniciar sua Jornada</Text>
              <Text style={styles.stepDescription}>
                Comece a investir de acordo com seu perfil e objetivos
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <FormButton
            title="Ver Resumo do Perfil"
            onPress={viewSummary}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
    paddingTop: 32,
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  cardContainer: {
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  profileText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 16,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  nextStepsContainer: {
    marginBottom: 32,
  },
  nextStepsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  stepContent: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  buttonContainer: {
    marginBottom: 16,
  },
});