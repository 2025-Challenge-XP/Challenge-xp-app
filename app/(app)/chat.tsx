import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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

// Componente para exibir a lista de mensagens (deve ser implementado separadamente)
const MessageList = ({ messages, userId }: { messages: any[]; userId: string }) => {
  // Implemente a renderização das mensagens neste componente
  return (
    <View style={{ flex: 1 }}>
      {/* Exemplo de renderização simples */}
      {messages.map((msg, idx) => (
        <View key={idx} style={{ alignItems: msg.userId === userId ? 'flex-end' : 'flex-start', marginVertical: 4 }}>
          <View style={{ backgroundColor: msg.userId === userId ? theme.colors.primary[100] : theme.colors.neutrals[200], borderRadius: 12, padding: 8, maxWidth: '80%' }}>
            <Text style={{ color: theme.colors.neutrals[900] }}>{msg.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default function ChatScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<any[]>([]); // Lista de mensagens
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Sempre rola para o final quando as mensagens mudam
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Função para enviar mensagem do usuário e processar resposta do backend
  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMessage = { userId: user?.id || 'me', text };
    setMessages((msgs) => [...msgs, userMessage]);
    setLoading(true);
    try {
      // Troque este fetch pela sua chamada real ao backend
      const response = await fetch('https://seu-backend.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });
      const data = await response.json();
      const botMessage = { userId: 'bot', text: data.answer || 'Erro ao obter resposta.' };
      setMessages((msgs) => [...msgs, botMessage]);
    } catch (e) {
      setMessages((msgs) => [...msgs, { userId: 'bot', text: 'Erro ao conectar ao servidor.' }]);
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
          <MessageList messages={messages} userId={user?.id || 'me'} />
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