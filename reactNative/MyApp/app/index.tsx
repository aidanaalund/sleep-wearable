/*
https://www.youtube.com/watch?v=1ETOnpmJloLK3Y
// for web app //
cd MyApp
npx expo start --tunnel
w
ctrl + c (close webapp)

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
I want to add Bluetooth functionality to my Electron app on Windows. 
*/