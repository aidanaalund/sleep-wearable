/*
https://www.youtube.com/watch?v=1ETOJloLK3Y
cd MyApp
npx expo start --tunnel
w

npx expo export --platform web
npm run start:electron
*/

import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BGColor1, BGColor2, textDarkColor, textLightColor } from './home';

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