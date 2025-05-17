import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/lib/theme';
import StockCard from './StockCard';

type Props = {
  visible: boolean;
  searchText: string;
  onChangeSearchText: (text: string) => void;
  onClose: () => void;
};

const API_KEY = 'b3e71e3c4e464163a25b11f81032a3d1'; // Substitua pela sua chave

export const StockSearchModal = ({
  visible,
  searchText,
  onChangeSearchText,
  onClose,
}: Props) => {
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Autocomplete
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText.length >= 2) {
        fetchSuggestions(searchText);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const fetchSuggestions = async (text: string) => {
    setLoadingSuggestions(true);
    try {
      const response = await fetch(
        'https://oziwendirtmqquvqkree.supabase.co/functions/v1/clever-service',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aXdlbmRpcnRtcXF1dnFrcmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwOTA4MzksImV4cCI6MjA2MjY2NjgzOX0.PjysWhT8Y32PldsP3OsAefhiKfxjF8naRDhrrSddRVQ',
          },
          body: JSON.stringify({ query: text }),
        }
      );
      const data = await response.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch (error) {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const onSearch = async (symbol: string) => {
    setLoading(true);
    setErrorMsg(null);
    setStockInfo(null);
    try {
      const response = await fetch('https://oziwendirtmqquvqkree.supabase.co/functions/v1/hello-world', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96aXdlbmRpcnRtcXF1dnFrcmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwOTA4MzksImV4cCI6MjA2MjY2NjgzOX0.PjysWhT8Y32PldsP3OsAefhiKfxjF8naRDhrrSddRVQ`,
        },
        body: JSON.stringify({ symbol }),
      });

      if (!response.ok) {
        throw new Error(`Erro na resposta: ${response.statusText}`);
      }

      const stockData = await response.json();
      setStockInfo(stockData);
    } catch (error) {
      setErrorMsg('Erro ao buscar ação.');
      setStockInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (symbol: string) => {
    onChangeSearchText(symbol);
    setSuggestions([]); // Fecha as sugestões
    setTimeout(() => setSuggestions([]), 0); // Força atualização
    onSearch(symbol);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Buscar ação</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.primary[700]} />
            </Pressable>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              value={searchText}
              onChangeText={onChangeSearchText}
              placeholder="Ex: PETR4"
              style={styles.textInput}
              autoCapitalize="characters"
              autoFocus
              placeholderTextColor={theme.colors.neutrals[400]}
            />
            <Pressable style={styles.searchButton} onPress={() => onSearch(searchText)} disabled={loading}>
              <Ionicons name="search" size={22} color={theme.colors.white} />
            </Pressable>
          </View>
          {loadingSuggestions && <ActivityIndicator size="small" color={theme.colors.primary[500]} />}
          {suggestions.length > 0 && (
            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => `${item.symbol}_${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item.symbol)}>
                  <Text style={styles.suggestionItem}>
                    {item.symbol} - {item.name} {item.exchange ? `(${item.exchange})` : ''}
                  </Text>
                </TouchableOpacity>
              )}
              style={styles.suggestionsList}
            />
          )}
          <View style={{ marginTop: theme.spacing.md, justifyContent: 'center', alignItems: 'center' }}>
            {loading && <ActivityIndicator color={theme.colors.primary[500]} />}
            {errorMsg && (
              <Text style={styles.errorText}>{errorMsg}</Text>
            )}
            {stockInfo && (
              <StockCard {...stockInfo} />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.medium,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.primary[800],
  },
  closeButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    height: 44,
    borderWidth: 2,
    borderColor: theme.colors.primary[300],
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary[900],
    backgroundColor: theme.colors.neutrals[100],
  },
  searchButton: {
    backgroundColor: theme.colors.primary[500],
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: theme.colors.primary[500],
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary[900],
  },
  suggestionsList: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 8,
  },
});