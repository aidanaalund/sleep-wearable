import { Tabs } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

function HexColorsMath(color1, op, color2) {
  // Convert hex strings to numbers
  const num1 = parseInt(color1.replace(/^#/, ''), 16);
  const num2 = parseInt(color2.replace(/^#/, ''), 16);

  let result = -1;
  switch(op) {
    case '*':
      result = Math.min(16777215, num1 * num2);
      break;
    case '+':
      result = Math.min(16777215, num1 + num2);
      break;
    case '-':
      result = Math.max(0,        num1 - num2);
      break;
  }

  return `#${result.toString(16).padStart(6, '0')}`;
}

export const diffColor         = '#111111';
export const BGColor1          = '#161616';
export const BGColor2          = HexColorsMath(BGColor1,'+',HexColorsMath(diffColor,'*','#000002'));
export const bordersColor      = '#000000';
export const buttonColor       = '#306aa0';
export const buttonChoiceColor = HexColorsMath(buttonColor,'-',HexColorsMath(diffColor,'*','#000005'));
export const textLightColor    = '#ffffff';
export const textDarkColor     = HexColorsMath(textLightColor,'-',HexColorsMath(diffColor,'*','#000005'));
export const textInverseColor  = HexColorsMath('#FFFFFF','-',textDarkColor);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveBackgroundColor: BGColor1,
        tabBarInactiveBackgroundColor: BGColor2,  
        tabBarActiveTintColor: textLightColor,
        tabBarInactiveTintColor: textDarkColor,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="info"
        options={{
          title: 'Information',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
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