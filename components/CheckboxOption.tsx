import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckboxOptionProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  description?: string;
}

const CheckboxOption: React.FC<CheckboxOptionProps> = ({
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
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkboxOuter, selected && styles.checkboxOuterSelected]}>
            {selected && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxOuter: {
    height: 24,
    width: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxOuterSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
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

export default CheckboxOption;