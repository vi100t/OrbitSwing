import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Moon, HelpCircle, RefreshCw, FileText, LogOut, ChevronRight } from 'lucide-react-native';

import AnimatedBackground from '../../components/AnimatedBackground';
import GlassmorphicCard from '../../components/GlassmorphicCard';

import Colors from '../../constants/Colors';
import { FONTS, SPACING } from '../../constants/Theme';

export default function SettingsScreen() {
  // Sample state for switches
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [syncCalendar, setSyncCalendar] = React.useState(true);
  
  // Settings sections
  const accountSettings = [
    {
      icon: <User size={22} color={Colors.light.primary[400]} />,
      title: 'Account',
      description: 'Manage your account details and preferences',
    },
    {
      icon: <Bell size={22} color={Colors.light.accent[400]} />,
      title: 'Notifications',
      description: 'Control when and how you get notified',
      toggle: {
        value: notifications,
        onValueChange: setNotifications,
      },
    },
    {
      icon: <Moon size={22} color={Colors.light.secondary[400]} />,
      title: 'Dark Mode',
      description: 'Toggle dark mode on or off',
      toggle: {
        value: darkMode,
        onValueChange: setDarkMode,
      },
    },
  ];
  
  const dataSettings = [
    {
      icon: <RefreshCw size={22} color={Colors.light.primary[400]} />,
      title: 'Sync Calendar',
      description: 'Connect and sync with Apple/Google Calendar',
      toggle: {
        value: syncCalendar,
        onValueChange: setSyncCalendar,
      },
    },
    {
      icon: <FileText size={22} color={Colors.light.secondary[400]} />,
      title: 'Export Data',
      description: 'Export your tasks, habits, and statistics',
    },
  ];
  
  const supportSettings = [
    {
      icon: <HelpCircle size={22} color={Colors.light.primary[400]} />,
      title: 'Help & Support',
      description: 'Get help with using the app',
    },
    {
      icon: <LogOut size={22} color={Colors.light.error[400]} />,
      title: 'Log Out',
      description: 'Sign out of your account',
    },
  ];
  
  // Render setting item
  const renderSettingItem = (item: any, index: number, isLast: boolean) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.settingItem,
        !isLast && styles.settingItemBorder,
      ]}
      onPress={() => {
        // Handle press
      }}
    >
      <View style={styles.settingIcon}>{item.icon}</View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingDescription}>{item.description}</Text>
      </View>
      
      {item.toggle ? (
        <Switch
          value={item.toggle.value}
          onValueChange={item.toggle.onValueChange}
          trackColor={{
            false: Colors.light.neutral[300],
            true: Colors.light.primary[300],
          }}
          thumbColor={
            item.toggle.value ? Colors.light.primary[500] : Colors.light.neutral[50]
          }
        />
      ) : (
        <ChevronRight size={20} color={Colors.light.neutral[400]} />
      )}
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <AnimatedBackground />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* App information */}
          <View style={styles.appInfo}>
            <View style={styles.appIconPlaceholder}>
              <Text style={styles.appIconText}>AI</Text>
            </View>
            <Text style={styles.appName}>AI Productivity</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
          </View>
          
          {/* Account Settings */}
          <Text style={styles.sectionTitle}>Account</Text>
          <GlassmorphicCard style={styles.settingsCard}>
            {accountSettings.map((item, index) =>
              renderSettingItem(item, index, index === accountSettings.length - 1)
            )}
          </GlassmorphicCard>
          
          {/* Data Settings */}
          <Text style={styles.sectionTitle}>Data</Text>
          <GlassmorphicCard style={styles.settingsCard}>
            {dataSettings.map((item, index) =>
              renderSettingItem(item, index, index === dataSettings.length - 1)
            )}
          </GlassmorphicCard>
          
          {/* Support Settings */}
          <Text style={styles.sectionTitle}>Support</Text>
          <GlassmorphicCard style={styles.settingsCard}>
            {supportSettings.map((item, index) =>
              renderSettingItem(item, index, index === supportSettings.length - 1)
            )}
          </GlassmorphicCard>
          
          {/* About */}
          <View style={styles.about}>
            <Text style={styles.aboutText}>
              AI Productivity © 2025. All rights reserved.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  appInfo: {
    alignItems: 'center',
    marginVertical: SPACING.xl,
  },
  appIconPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.light.primary[400],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  appIconText: {
    ...FONTS.heading.h2,
    color: 'white',
  },
  appName: {
    ...FONTS.heading.h3,
    color: Colors.light.text,
    marginBottom: 4,
  },
  appVersion: {
    ...FONTS.body.small,
    color: Colors.light.neutral[500],
  },
  sectionTitle: {
    ...FONTS.heading.h4,
    color: Colors.light.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    marginLeft: 4,
  },
  settingsCard: {
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.neutral[100],
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...FONTS.body.medium,
    color: Colors.light.text,
    marginBottom: 2,
  },
  settingDescription: {
    ...FONTS.body.small,
    color: Colors.light.neutral[600],
  },
  about: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  aboutText: {
    ...FONTS.body.small,
    color: Colors.light.neutral[500],
    textAlign: 'center',
  },
});