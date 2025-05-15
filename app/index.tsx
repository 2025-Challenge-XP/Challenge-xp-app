import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, isLoading } = useAuth();
  
  // While checking auth state, show nothing
  if (isLoading) {
    return null;
  }
  
  // Redirect based on authentication state
  return session ? (
    <Redirect href="/(app)" />
  ) : (
    <Redirect href="/(auth)/login" />
  );
}