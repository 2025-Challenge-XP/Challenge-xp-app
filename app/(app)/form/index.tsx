import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import FormButton from '../../../components/FormButton';

export default function FormIntro() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/form/personal');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Descubra Seu Perfil de Investidor</Text>
          <Text style={styles.subtitle}>
            Complete este questionário para revelar seu perfil de investidor e receber recomendações personalizadas.
          </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/7567444/pexels-photo-7567444.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>O questionário inclui:</Text>
          
          <View style={styles.stepItem}>
            <View style={[styles.stepIcon, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.stepNumber}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Informações Pessoais</Text>
              <Text style={styles.stepDescription}>
                Dados para identificação e conformidade com a LGPD
              </Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={[styles.stepIcon, { backgroundColor: '#F0FDF4' }]}>
              <Text style={styles.stepNumber}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Perfil Financeiro</Text>
              <Text style={styles.stepDescription}>
                Informações sobre sua situação financeira atual
              </Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={[styles.stepIcon, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Perfil de Investidor</Text>
              <Text style={styles.stepDescription}>
                Questões para avaliar sua tolerância ao risco e objetivos
              </Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={[styles.stepIcon, { backgroundColor: '#EFF6FF' }]}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Preferências Pessoais</Text>
              <Text style={styles.stepDescription}>
                Detalhes sobre seus interesses específicos em investimentos
              </Text>
            </View>
          </View>
          
          <View style={styles.stepItem}>
            <View style={[styles.stepIcon, { backgroundColor: '#F0FDF4' }]}>
              <Text style={styles.stepNumber}>5</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepLabel}>Termos e Consentimentos</Text>
              <Text style={styles.stepDescription}>
                Autorizações necessárias para processamento dos dados
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.timeEstimate}>
          <Text style={styles.timeText}>⏱️ Tempo estimado: 5 minutos</Text>
        </View>

        <FormButton
          title="Começar Questionário"
          onPress={handleStart}
          style={styles.startButton}
        />

        <Text style={styles.disclaimer}>
          Seus dados são protegidos e utilizados apenas para gerar recomendações personalizadas conforme a Lei Geral de Proteção de Dados (LGPD).
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  stepsContainer: {
    marginBottom: 32,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  stepNumber: {
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
    color: '#1E293B',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  timeEstimate: {
    marginBottom: 32,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
  startButton: {
    marginBottom: 24,
  },
  disclaimer: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});