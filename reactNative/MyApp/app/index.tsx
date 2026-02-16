/*
https://www.youtube.com/watch?v=1ETOnpmJloLK3Y
// for web app //
cd MyApp
npx expo start --tunnel
w
ctrl + c (close webapp)

// for pc //
npx expo export --platform web
npm run start:electron

// for mobile //
npx expo prebuild --clean
npm run android               (error)
npx expo run:android          (black screen)

adb reverse tcp:8081 tcp:8081 (wired/apk)
npx react-native run-android  (wired/apk)
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