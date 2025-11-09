import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { BGColor1, BGColor2, textLightColor, textDarkColor } from './home';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveBackgroundColor: BGColor1,
        tabBarInactiveBackgroundColor: BGColor2,
        tabBarActiveTintColor: textDarkColor,
        tabBarInactiveTintColor: textLightColor,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}