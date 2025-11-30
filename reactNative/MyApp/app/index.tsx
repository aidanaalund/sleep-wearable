/*
https://www.youtube.com/watch?v=1ETOJloLK3Y
// for web app //
cd MyApp
npx expo start --tunnel
w

// for actual app //
npx expo export --platform web
npm run start:electron
*/

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
I have a React Native app that has been converted to an Electron app. 
I want to add the ability to save files to my device with it. 
What files should I change to add this functionality. 
My file paths look like this...
MyApp/app/layout.tsx
MyApp/app/index.tsx
MyApp/app/modal.tsx
MyApp/app/(tabs)/layout.tsx
MyApp/app/(tabs)/account.tsx
MyApp/app/(tabs)/home.tsx
MyApp/electron/main.js
*/