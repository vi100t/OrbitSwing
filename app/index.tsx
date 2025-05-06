import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function Index() {
  useEffect(() => {
    // Hide splash screen after a delay
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
  }, []);

  // Redirect to the home tab
  return <Redirect href="/(tabs)" />;
}