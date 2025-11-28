/*
https://www.youtube.com/watch?v=1ETOJloLK3Y
cd MyApp
npx expo start --tunnel
w

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
I am having trouble with booting up my React Native app with Electron. 
The web app works fine, but Electron shows "Unmatched Route \n Page could not be found. \n file:///C:/home". 
I have to click the "Go back" button which then shows my entire app working properly. 
I want to make it so that the "Unmatched Route" window never shows up and my app just boots up properly. 
I do not want to use the server approach. 
*/