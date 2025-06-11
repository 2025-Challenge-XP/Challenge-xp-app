import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { Button } from '@/components/ui/Button';
import { theme } from '@/lib/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ChatInputProps {
  loading?: boolean;
  onSend: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ loading, onSend }) => {
  const [input, setInput] = useState('');
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', padding: theme.spacing.lg, backgroundColor: theme.colors.white, paddingBottom: insets.bottom }}>
      <TextInput
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: theme.colors.neutrals[200],
          borderRadius: theme.borderRadius.md,
          padding: 12,
          marginRight: 8,
          backgroundColor: theme.colors.neutrals[50],
        }}
        placeholder="Digite sua mensagem..."
        value={input}
        onChangeText={setInput}
        editable={!loading}
        returnKeyType="send"
        onSubmitEditing={handleSend}
      />
      <Button onPress={handleSend} disabled={loading || !input.trim()} title="Enviar" />
    </View>
  );
};
