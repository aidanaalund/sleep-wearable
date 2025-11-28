import { Redirect, usePathname } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const pathname = usePathname();
  
  useEffect(() => {
    console.log('Index pathname:', pathname);
  }, [pathname]);
  
  return <Redirect href="/(tabs)/home" />;
}

/*
I want to boot up my React Native app using Electron. 
I already have a dist/ folder that contains the html files, but all I see is index when booting up the app.

My file structure looks like this...
app/_layout.tsx
app/index.tsx
app/modal.tsx
app/(tabs)/_layout.tsx
app/(tabs)/account.tsx
app/(tabs)/home.tsx

How should I fix this? 
*/