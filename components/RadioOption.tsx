import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface RadioOptionProps {
  label: string;
  value: string;
  selected: boolean;
  onSelect: () => void;
  description?: string;
}

const RadioOption: React.FC<RadioOptionProps> = ({
  label,
  selected,
  onSelect,
  description,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View style={styles.radioContainer}>
          <View style={styles.radioOuter}>
            {selected && <View style={styles.radioInner} />}
          </View>
          <Text style={[styles.label, selected && styles.labelSelected]}>
            {label}
          </Text>
        </View>
        {description && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  containerSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  contentContainer: {
    flex: 1,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  labelSelected: {
    color: '#1E293B',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    marginLeft: 36,
  },
});

export default RadioOption;