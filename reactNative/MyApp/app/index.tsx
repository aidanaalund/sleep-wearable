/*
https://www.youtube.com/watch?v=1ETOnpmJloLK3Y
// for web app //
npx expo start --tunnel
w
ctrl + c (close webapp)

// for pc //
npx expo export --platform web
npm run start:electron

// for mobile //
.\android\gradlew.bat --stop
taskkill /F /IM java.exe
npx expo prebuild --clean
npm run android               (error)

npx expo start --clear
npx expo run:android
a

adb reverse tcp:8081 tcp:8081 (wired)
npx react-native run-android

cd android && gradlew assembleRelease (APK)
cd ..
adb install android/app/build/outputs/apk/release/app-release.apk
*/

import { Redirect, usePathname } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const pathname = usePathname();
  
  useEffect(() => {
    console.log('Index pathname:', pathname);
  }, [pathname]);
  
  return <Redirect href="/(tabs)/calendar" />;
}