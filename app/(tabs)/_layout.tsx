import React from 'react';
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Calendar, BarChart3, Clock, Settings } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import { useAppFonts } from '../../hooks/useFonts';

export default function TabLayout() {
  const { fontsLoaded, fontError } = useAppFonts();
  
  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary[400],
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle: { 
          backgroundColor: Platform.OS === 'web' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.95)', 
          borderTopColor: 'rgba(230, 230, 230, 0.7)',
        },
        tabBarLabelStyle: {
          fontFamily: 'Rubik-Regular',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: Platform.OS === 'web' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.95)',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(230, 230, 230, 0.7)',
        },
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          title: "Focus",
          tabBarIcon: ({ color, size }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}