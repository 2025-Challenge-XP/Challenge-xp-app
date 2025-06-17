import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { Header } from '@/components/ui/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { Button } from '@/components/ui/Button';
import { AtSign, CreditCard as Edit2, Shield, Clock, User as UserIcon } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatInput } from '../../components/ChatInput';
import { startChat, sendMessage, Usuario } from '@/lib/gemini';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFormContext } from '../../contexts/FormContext';
import Markdown from 'react-native-markdown-display';


// Card para exibir dados financeiros
function FinancialDataCard({ data }: { data: any }) {
  return (
    <View style={{
      backgroundColor: theme.colors.white,
      borderRadius: 14,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.colors.neutrals[100],
      minWidth: 220,
      maxWidth: '80%',
    }}>
      <Text style={{ fontFamily: theme.typography.fontFamily.bold, fontSize: 18, color: theme.colors.primary[700], marginBottom: 2 }}>{data.titulo}</Text>
      <Text style={{ color: theme.colors.neutrals[700], marginBottom: 6 }}>{data.descricao}</Text>
      <Text style={{ fontSize: 22, fontFamily: theme.typography.fontFamily.bold, color: theme.colors.success[700], marginBottom: 2 }}>{data.valor}</Text>
      <Text style={{
        color:
          typeof data.variacao_dia === 'string' && data.variacao_dia.startsWith('-')
            ? theme.colors.error[700]
            : theme.colors.success[700],
        fontWeight: 'bold',
        marginBottom: 2,
      }}>
        {data.variacao_dia ?? '--'}
      </Text>
      <Text style={{ color: theme.colors.neutrals[500], fontSize: 12 }}>Fonte: {data.fonte} | {data.data}</Text>
    </View>
  );
}

// Componente para exibir a lista de mensagens (deve ser implementado separadamente)
const MessageList = ({ messages, userId }: { messages: any[]; userId: string }) => {
  return (
    <View style={{ flex: 1 }}>
      {messages.map((msg, idx) => {
        const isUser = msg.userId === userId;
        // Se for mensagem do bot e tipo dado_financeiro, renderiza o card
        if (msg.userId === 'bot' && msg.tipo === 'dado_financeiro') {
          return (
            <View key={idx} style={{ alignItems: 'flex-start', marginVertical: 4 }}>
              <FinancialDataCard data={msg} />
            </View>
          );
        }
        // Mensagem comum
        return (
          <View key={idx} style={{ alignItems: isUser ? 'flex-end' : 'flex-start', marginVertical: 8 }}>
            <View style={{ backgroundColor: isUser ? theme.colors.primary[100] : theme.colors.neutrals[200], borderRadius: 12, padding: 8, maxWidth: '90%' }}>
              {msg.userId === 'bot' ? (
                <Markdown>{msg.text}</Markdown>
              ) : (
                <Text style={{ color: theme.colors.neutrals[900] }}>{msg.text}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default function ChatScreen() {
  const { user } = useAuth();
  const { formState, recuperarDados } = useFormContext();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<any[]>([
    {
      userId: 'bot',
      text: 'Olá! Sou seu assistente financeiro. Como posso te ajudar hoje?'
    }
  ]); // Lista de mensagens
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Recupera dados do formulário ao abrir o chat
  useEffect(() => {
    if (recuperarDados) recuperarDados();
  }, []);

  // Sempre rola para o final quando as mensagens mudam
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Sempre rola para o final quando o teclado aparece
  useEffect(() => {
    const keyboardListener = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });
    return () => keyboardListener.remove();
  }, []);

  // Função para montar o objeto Usuario a partir do formState
  function usuarioFromFormState(): Usuario {
    return {
      fullName: formState.fullName || 'Usuário',
      birthDate: formState.birthDate || '1990-01-01',
      knowledgeLevel: formState.knowledgeLevel || 'iniciante',
      riskTolerance: formState.riskTolerance || 'moderado',
      objectives: {
        realEstate: formState.objectives?.realEstate || false,
        retirement: formState.objectives?.retirement || false,
        shortTermProfit: formState.objectives?.shortTermProfit || false,
        emergencyReserve: formState.objectives?.emergencyReserve || false,
      },
      assetInterests: {
        crypto: formState.assetInterests?.crypto || false,
        stocks: formState.assetInterests?.stocks || false,
        fixedIncome: formState.assetInterests?.fixedIncome || false,
        realEstateFunds: formState.assetInterests?.realEstateFunds || false,
      },
      monthlyIncome: formState.monthlyIncome || '',
      investmentAmount: formState.investmentAmount || '',
      liquidityPreference: formState.liquidityPreference || '',
      monthlyContribution: {
        amount: formState.monthlyContribution?.amount || '',
        hasContribution: formState.monthlyContribution?.hasContribution || false,
      },
    };
  }

  // Função para enviar mensagem do usuário e processar resposta do Gemini via SDK
  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const usuario = usuarioFromFormState();
      const localUserId = userId || usuario.fullName.replace(/\s+/g, "_").toLowerCase();
      const userMessage = { userId: localUserId, text };
      setMessages((msgs) => [...msgs, userMessage]);
      // Inicia o chat se ainda não foi iniciado
      if (!chatStarted) {
        const result = await startChat(usuario);
        setUserId(result.userId);
        setChatStarted(true);
      }
      // Envia a mensagem para o Gemini
      const resposta = await sendMessage(localUserId, text);
      // A resposta já chega formatada como objeto JSON ou array de objetos
      if (Array.isArray(resposta)) {
        resposta.forEach((item) => {
          if (item.tipo === 'dado_financeiro') {
            setMessages((msgs) => [...msgs, { userId: 'bot', ...item }]);
          } else {
            setMessages((msgs) => [...msgs, { userId: 'bot', text: item.resposta || item.text || 'Erro ao obter resposta.' }]);
          }
        });
      } else {
        const respostaObj = resposta;
        if (respostaObj.tipo === 'dado_financeiro') {
          setMessages((msgs) => [...msgs, { userId: 'bot', ...respostaObj }]);
        } else {
          // Garante que respostaObj.resposta seja string
          let texto = respostaObj.resposta || respostaObj.text || 'Erro ao obter resposta.';
          if (typeof texto !== 'string') {
            try {
              texto = JSON.stringify(texto, null, 2);
            } catch {
              texto = 'Erro ao processar resposta do assistente.';
            }
          }
          // Remove aspas duplas extras e quebras de linha do início/fim, mesmo com espaços/quebras de linha
          if (typeof texto === 'string') {
            texto = texto.trim();
            texto = texto.replace(/^["\s\n]+|["\s\n]+$/g, '');
          }
          setMessages((msgs) => [...msgs, { userId: 'bot', text: texto }]);
        }
      }
    } catch (e) {
      setMessages((msgs) => [...msgs, { userId: 'bot', text: 'Erro ao conectar ao Gemini ou recuperar dados.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + 80}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, padding: theme.spacing.lg }}
          keyboardShouldPersistTaps="handled"
        >
          <MessageList messages={messages} userId={userId || (formState.fullName || 'usuário').replace(/\s+/g, '_').toLowerCase()} />
        </ScrollView>
        <ChatInput loading={loading} onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutrals[50],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.white,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.white,
    ...theme.shadows.medium,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary[500],
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
    ...theme.shadows.small,
  },
  username: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutrals[900],
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[600],
    marginBottom: theme.spacing.md,
  },
  editButton: {
    minWidth: 140,
  },
  infoSection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutrals[900],
    marginBottom: theme.spacing.md,
  },
  infoContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutrals[100],
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutrals[500],
  },
  infoValue: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[900],
  },
});