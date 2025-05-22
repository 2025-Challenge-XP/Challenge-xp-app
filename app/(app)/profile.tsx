import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { Header } from '@/components/ui/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { theme } from '@/lib/theme';
import { Button } from '@/components/ui/Button';
import { AtSign, CreditCard as Edit2, Shield, Clock, User as UserIcon } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [lastLogin, setLastLogin] = useState<Date | null>(null);
  const email = user?.email || 'No email';
  const username = user?.user_metadata.first_name || 'User';
  const avatar = user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/1270076/pexels-photo-1270076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  console.log('User:', user);
  console.log('Avatar:', avatar);
  
  // Get user metadata
  useEffect(() => {
    if (user?.created_at) {
      setLastLogin(new Date(user.last_sign_in_at || user.created_at));
    }
  }, [user]);

  const formatDate = (date: Date | null) => {
    if (!date) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaWrapper style={styles.container}>      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={styles.profileHeader}
          entering={FadeIn.duration(600)}
        >
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: avatar }} 
              style={styles.avatar}
            />
            <View style={styles.editAvatarButton}>
              <Edit2 size={16} color={theme.colors.white} />
            </View>
          </View>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.email}>{email}</Text>
          <Button 
            title="Edit Profile" 
            variant="outline"
            onPress={() => {}}
            size="sm"
            style={styles.editButton}
          />
        </Animated.View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoContainer}>
            <InfoItem 
              icon={<UserIcon size={20} color={theme.colors.primary[500]} />}
              label="Username"
              value={username}
              delay={100}
            />
            
            <InfoItem 
              icon={<AtSign size={20} color={theme.colors.primary[500]} />}
              label="Email"
              value={email}
              delay={200}
            />
            
            <InfoItem 
              icon={<Clock size={20} color={theme.colors.primary[500]} />}
              label="Last Login"
              value={formatDate(lastLogin)}
              delay={300}
            />
            
            <InfoItem 
              icon={<Shield size={20} color={theme.colors.primary[500]} />}
              label="Account Status"
              value="Active"
              delay={400}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

// Information item component
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, delay }) => (
  <Animated.View 
    style={styles.infoItem}
    entering={FadeInDown.delay(delay).duration(400)}
  >
    <View style={styles.infoIconContainer}>{icon}</View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </Animated.View>
);

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