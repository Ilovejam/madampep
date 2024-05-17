import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import CustomHeader from '../components/CustomHeader'; // CustomHeader'ı import edin

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    DavidLibre: require('../assets/fonts/DavidLibre-Medium.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false}} // CustomHeader'ı kullanın
        />
        <Stack.Screen
          name="+not-found"
          options={{ header: () => <CustomHeader /> }} // CustomHeader'ı kullanın
        />
        <Stack.Screen
          name="dashboard"
          options={{ headerShown: false }} // Dashboard ekranı için header'ı gizleyin
        />
        {/* Diğer ekranlarınızı burada tanımlayın ve CustomHeader'ı kullanın */}
      </Stack>
    </ThemeProvider>
  );
}
