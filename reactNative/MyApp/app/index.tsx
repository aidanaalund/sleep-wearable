import { Redirect } from 'expo-router';
//import { Stack } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
  //return <Stack.Screen name="(tabs)/home" options={{ headerShown: false }} />;
}

/*
I want to boot up my React Native app using Electron. 
I already have a dist/ folder that contains the html files, but all I see is index.

My file structure looks like this...
app/_layout.tsx
app/index.tsx
app/modal.tsx
app/(tabs)/_layout.tsx
app/(tabs)/account.tsx
app/(tabs)/home.tsx

How should I fix this? 
*/