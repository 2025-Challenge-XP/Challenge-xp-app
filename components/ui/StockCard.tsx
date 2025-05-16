import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StockCardProps {
  shortName?: string;
  symbol?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  fiftyTwoWeekRange?: { low?: number; high?: number };
  dividendYield?: number;
  dividendRate?: number;
  trailingPE?: number;
  forwardPE?: number;
  marketCap?: number;
}

export default function StockCard({
  shortName,
  symbol,
  regularMarketPrice,
  regularMarketChange,
  regularMarketChangePercent,
  fiftyTwoWeekRange,
  dividendYield,
  dividendRate,
  trailingPE,
  forwardPE,
  marketCap,
}: StockCardProps) {
  function formatMarketCap(num?: number): string {
    if (typeof num !== 'number' || isNaN(num)) return 'N/A';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  }

  const isPositive = (regularMarketChange ?? 0) >= 0;
  const changeColor = isPositive ? '#4caf50' : '#f44336';
  const changeSign = isPositive ? '▲' : '▼';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>
        {shortName ?? 'N/A'} <Text style={styles.symbol}>({symbol ?? 'N/A'})</Text>
      </Text>

      <View style={styles.row}>
        <Text style={styles.price}>
          R$ {typeof regularMarketPrice === 'number' ? regularMarketPrice.toFixed(2) : 'N/A'}
        </Text>
        <Text style={[styles.change, { color: changeColor }]}>
          {changeSign}{' '}
          {typeof regularMarketChange === 'number' ? regularMarketChange.toFixed(2) : 'N/A'} (
          {typeof regularMarketChangePercent === 'number'
            ? regularMarketChangePercent.toFixed(2)
            : 'N/A'}
          %)
        </Text>
      </View>

      <Text style={styles.subtext}>
        52 Semanas: R${' '}
        {typeof fiftyTwoWeekRange?.low === 'number'
          ? fiftyTwoWeekRange.low.toFixed(2)
          : 'N/A'}{' '}
        - R${' '}
        {typeof fiftyTwoWeekRange?.high === 'number'
          ? fiftyTwoWeekRange.high.toFixed(2)
          : 'N/A'}
      </Text>

      <Text style={styles.subtext}>
        Dividendos:{' '}
        {typeof dividendYield === 'number' ? dividendYield.toFixed(2) : 'N/A'}% (R${' '}
        {typeof dividendRate === 'number' ? dividendRate.toFixed(2) : 'N/A'}/ação)
      </Text>

      <Text style={styles.subtext}>
        P/L:{' '}
        {typeof trailingPE === 'number' ? trailingPE.toFixed(2) : 'N/A'} (atual),{' '}
        {typeof forwardPE === 'number' ? forwardPE.toFixed(2) : 'N/A'} (futuro)
      </Text>

      <Text style={styles.subtext}>
        Valor de mercado: R$ {formatMarketCap(marketCap)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    width: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  symbol: {
    fontWeight: '500',
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  change: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  subtext: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
