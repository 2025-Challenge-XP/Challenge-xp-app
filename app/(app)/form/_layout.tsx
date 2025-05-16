import { Stack } from 'expo-router';
import { FormProvider } from '../../../contexts/FormContext';

export default function FormLayout() {
  return (
    <FormProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="personal" />
        <Stack.Screen name="financial" />
        <Stack.Screen name="investor" />
        <Stack.Screen name="preferences" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="success" />
      </Stack>
    </FormProvider>
  );
}