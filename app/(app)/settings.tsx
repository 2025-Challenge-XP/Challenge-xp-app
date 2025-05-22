import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaWrapper } from '@/components/ui/SafeAreaWrapper';
import { theme } from '@/lib/theme';
import { Header } from '@/components/ui/Header';
import { signOut } from '@/lib/auth';
import { BellRing, Moon, ShieldCheck, CircleHelp as HelpCircle, FileText, Mail, LogOut, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
  // Dummy state for switches
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
    // No need to navigate, signOut already handles this
  };

  // Settings sections
  type SettingsItem = {
    id: string;
    icon: React.ReactNode;
    title: string;
    type: 'switch' | 'link';
    value?: boolean;
    onToggle?: () => void;
  };

  type SettingsSection = {
    title: string;
    items: SettingsItem[];
  };

  const sections: SettingsSection[] = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          icon: <BellRing size={22} color={theme.colors.primary[500]} />,
          title: 'Notifications',
          type: 'switch',
          value: notifications,
          onToggle: () => setNotifications(!notifications),
        },
        {
          id: 'darkMode',
          icon: <Moon size={22} color={theme.colors.primary[500]} />,
          title: 'Dark Mode',
          type: 'switch',
          value: darkMode,
          onToggle: () => setDarkMode(!darkMode),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          icon: <HelpCircle size={22} color={theme.colors.primary[500]} />,
          title: 'Help Center',
          type: 'link',
        },
        {
          id: 'contact',
          icon: <Mail size={22} color={theme.colors.primary[500]} />,
          title: 'Contact Us',
          type: 'link',
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          id: 'privacy',
          icon: <ShieldCheck size={22} color={theme.colors.primary[500]} />,
          title: 'Privacy Policy',
          type: 'link',
        },
        {
          id: 'terms',
          icon: <FileText size={22} color={theme.colors.primary[500]} />,
          title: 'Terms of Service',
          type: 'link',
        },
      ],
    },
  ];

  const renderSettingsItem = (
    item: {
      id: string;
      icon: React.ReactNode;
      title: string;
      type: 'switch' | 'link';
      value?: boolean;
      onToggle?: () => void;
    },
    index: number
  ) => (
    <Animated.View
      key={item.id}
      entering={FadeInDown.delay(100 + index * 50).duration(400)}
      style={styles.settingsItem}
    >
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>{item.icon}</View>
        <Text style={styles.settingsItemTitle}>{item.title}</Text>
      </View>
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{
            false: theme.colors.neutrals[300],
            true: theme.colors.primary[300],
          }}
          thumbColor={item.value ? theme.colors.primary[500] : theme.colors.white}
        />
      ) : (
        <ChevronRight size={20} color={theme.colors.neutrals[400]} />
      )}
    </Animated.View>
  );

  return (
    <SafeAreaWrapper style={styles.container}>      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, index) => 
                renderSettingsItem(item, sectionIndex * 10 + index)
              )}
            </View>
          </View>
        ))}

        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={theme.colors.error[500]} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutrals[50],
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[700],
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.sm,
  },
  sectionContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutrals[100],
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutrals[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingsItemTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutrals[900],
  },
  logoutSection: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.error[100],
    borderRadius: theme.borderRadius.md,
  },
  logoutText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.error[500],
    marginLeft: theme.spacing.sm,
  },
  versionContainer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
  },
  versionText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutrals[500],
  },
});