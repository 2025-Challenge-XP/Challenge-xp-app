import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated, // Adicionado
} from 'react-native';
import { useFormContext } from '../../contexts/FormContext';
import { router } from 'expo-router';
import { CreditCard as Edit2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import FormButton from '../../components/FormButton';
import LottieView from 'lottie-react-native';
import { set } from 'zod';

export default function SummaryScreen() {
  const { formState } = useFormContext();
  const { salvarDados } = useFormContext();

  const [salvandoDados, setSalvandoDados] = React.useState(false);
  const colorAnim = React.useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  // Helper function to format currency
  const formatCurrency = (value: string) => {
    if (!value) return 'Não informado';
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 'Não informado';

    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  // Helper function to get knowledge level text
  const getKnowledgeLevelText = () => {
    switch (formState.knowledgeLevel) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      default:
        return 'Não informado';
    }
  };

  // Helper function to get risk tolerance text
  const getRiskToleranceText = () => {
    switch (formState.riskTolerance) {
      case 'conservative':
        return 'Conservador';
      case 'moderate':
        return 'Moderado';
      case 'aggressive':
        return 'Agressivo';
      default:
        return 'Não informado';
    }
  };

  // Helper function to get investment horizon text
  const getInvestmentHorizonText = () => {
    switch (formState.investmentHorizon) {
      case 'short':
        return 'Curto prazo (até 2 anos)';
      case 'medium':
        return 'Médio prazo (2 a 5 anos)';
      case 'long':
        return 'Longo prazo (mais de 5 anos)';
      default:
        return 'Não informado';
    }
  };

  // Helper function to get liquidity preference text
  const getLiquidityPreferenceText = () => {
    switch (formState.liquidityPreference) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Não informado';
    }
  };

  // Helper function to navigate to edit sections
  const navigateToSection = (section: string) => {
    // @ts-ignore
    navigation.navigate(`${section}`);
  };

  const handleSalvar = () => {
    if (salvarDados) salvarDados();
    setSalvandoDados(true);
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 400, // tempo da transição para verde
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 400, // tempo da transição de volta para azul
          useNativeDriver: false,
        }).start(() => setSalvandoDados(false));
      }, 1200); // tempo que fica verde
    });
    setTimeout(() => {
      navigateToSection('Home');    
    }, 2000); // tempo para voltar para a tela inicial
  };

  const buttonBackgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#2563EB', '#86c772'], // azul para verde
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Resumo do Perfil</Text>
        <Text style={styles.subtitle}>
          Confira abaixo todas as informações do seu perfil de investidor e faça
          ajustes, se necessário.
        </Text>

        <Text style={styles.subtitle}>
          Depois de revisar, clique no botão "Salvar" para confirmar suas
          informações.
        </Text>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigateToSection('FormPersonal')}
            >
              <Edit2 size={16} color="#2563EB" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome Completo:</Text>
              <Text style={styles.infoValue}>
                {formState.fullName || 'Não informado'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>E-mail:</Text>
              <Text style={styles.infoValue}>
                {formState.email || 'Não informado'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CPF:</Text>
              <Text style={styles.infoValue}>
                {formState.documentId || 'Não informado'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data de Nascimento:</Text>
              <Text style={styles.infoValue}>
                {formState.birthDate || 'Não informado'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Telefone:</Text>
              <Text style={styles.infoValue}>
                {formState.phone || 'Não informado'}
              </Text>
            </View>
          </View>
        </View>

        {/* Financial Profile Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Perfil Financeiro</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigateToSection('FormFinancial')}
            >
              <Edit2 size={16} color="#2563EB" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Renda Mensal:</Text>
              <Text style={styles.infoValue}>
                {formatCurrency(formState.monthlyIncome)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Patrimônio Total:</Text>
              <Text style={styles.infoValue}>
                {formatCurrency(formState.totalAssets)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Valor para Investir:</Text>
              <Text style={styles.infoValue}>
                {formatCurrency(formState.investmentAmount)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Aportes Mensais:</Text>
              <Text style={styles.infoValue}>
                {formState.monthlyContribution.hasContribution
                  ? formatCurrency(formState.monthlyContribution.amount)
                  : 'Não pretende fazer aportes'}
              </Text>
            </View>
          </View>
        </View>

        {/* Investor Profile Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Perfil de Investidor</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigateToSection('Forminvestor')}
            >
              <Edit2 size={16} color="#2563EB" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Conhecimento:</Text>
              <Text style={styles.infoValue}>{getKnowledgeLevelText()}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tolerância ao Risco:</Text>
              <Text style={styles.infoValue}>{getRiskToleranceText()}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Objetivos:</Text>
              <View style={styles.objectivesList}>
                {formState.objectives.emergencyReserve && (
                  <View style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>
                      Reserva de emergência
                    </Text>
                  </View>
                )}
                {formState.objectives.retirement && (
                  <View style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>Aposentadoria</Text>
                  </View>
                )}
                {formState.objectives.realEstate && (
                  <View style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>Compra de imóvel</Text>
                  </View>
                )}
                {formState.objectives.shortTermProfit && (
                  <View style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>
                      Lucro no curto prazo
                    </Text>
                  </View>
                )}
                {formState.objectives.other && (
                  <View style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>
                      {formState.objectives.otherText}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Horizonte:</Text>
              <Text style={styles.infoValue}>{getInvestmentHorizonText()}</Text>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Preferências Pessoais</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigateToSection('FormPreferences')}
            >
              <Edit2 size={16} color="#2563EB" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Liquidez:</Text>
              <Text style={styles.infoValue}>
                {getLiquidityPreferenceText()}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Interesse em ESG:</Text>
              <Text style={styles.infoValue}>
                {formState.esgInterest ? 'Sim' : 'Não'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Experiência Prévia:</Text>
              <Text style={styles.infoValue}>
                {formState.previousInvestmentExperience ? 'Sim' : 'Não'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ativos de Interesse:</Text>
              <View style={styles.objectivesList}>
                {formState.assetInterests.fixedIncome && (
                  <View style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>Renda Fixa</Text>
                  </View>
                )}
                {formState.assetInterests.stocks && (
                  <View style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>Ações</Text>
                  </View>
                )}
                {formState.assetInterests.realEstateFunds && (
                  <View style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>
                      Fundos Imobiliários
                    </Text>
                  </View>
                )}
                {formState.assetInterests.multiMarketFunds && (
                  <View style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>
                      Fundos Multimercado
                    </Text>
                  </View>
                )}
                {formState.assetInterests.crypto && (
                  <View style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>Criptoativos</Text>
                  </View>
                )}
                {formState.assetInterests.etfs && (
                  <View style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>ETFs</Text>
                  </View>
                )}
                {formState.assetInterests.other && (
                  <View style={styles.objectiveItem}>
                    <Text style={styles.objectiveText}>
                      {formState.assetInterests.otherText}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Consents Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Consentimentos</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigateToSection('FormTerms')}
            >
              <Edit2 size={16} color="#2563EB" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Termos de Uso:</Text>
              <Text style={styles.infoValue}>
                {formState.termsAccepted ? 'Aceito' : 'Não aceito'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Uso de Dados:</Text>
              <Text style={styles.infoValue}>
                {formState.dataUseConsent ? 'Autorizado' : 'Não autorizado'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.button, { backgroundColor: buttonBackgroundColor }]}> 
          <FormButton
            title={salvandoDados ? '' : 'Confirmar Dados'}
            onPress={handleSalvar}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', elevation: 0 }}
          >
            {salvandoDados && (
              <LottieView
                source={require('../../assets/icons/SalveIcon.json')}
                autoPlay
                loop={false}
                speed={0.5}
                style={{ width: 32, height: 32 }}
                colorFilters={[
                  { keypath: 'Stroke 1', color: '#fff' },
                  { keypath: 'Fill 1', color: '#fff' },
                ]}
              />
            )}
          </FormButton>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  buttonContainer: {
    marginBottom: 16,
    marginHorizontal: 24,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  editButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#334155',
  },
  objectivesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  objectiveItem: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  objectiveText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,

  },
  buttonSuccess: {
    backgroundColor: '#c1e7d5', // verde
  },
});
