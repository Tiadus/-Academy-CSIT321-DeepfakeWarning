import { Tabs } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, View, SafeAreaView } from "react-native";

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors['dark'].tint,
        tabBarInactiveTintColor: Colors['dark'].tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          borderColor: "transparent",
          backgroundColor: '#000003',
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: ({ focused }) => (
            <Text className={focused ? 'text-app-secondary-glow' : 'text-border-outline'}>
              Home
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: 'Detect',
          tabBarLabel: ({ focused }) => (
            <Text className={focused ? 'text-app-secondary-glow' : 'text-border-outline'}>
              Detect
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'radio' : 'radio-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(phone)"
        options={{
          title: 'Contact',
          tabBarLabel: ({ focused }) => (
            <Text className={focused ? 'text-app-secondary-glow' : 'text-border-outline'}>
              Contact
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'call' : 'call-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(education)"
        options={{
          title: 'Education',
          tabBarLabel: ({ focused }) => (
            <Text className={focused ? 'text-app-secondary-glow' : 'text-border-outline'}>
              Lessons
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Setting',
          tabBarLabel: ({ focused }) => (
            <Text className={focused ? 'text-app-secondary-glow' : 'text-border-outline'}>
              Settings
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'cog' : 'cog-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
