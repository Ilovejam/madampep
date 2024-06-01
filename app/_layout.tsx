import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

import { useColorScheme } from '@/hooks/useColorScheme';
import CustomHeader from '../components/CustomHeader';
import React from 'react';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    DavidLibre: require('../assets/fonts/DavidLibre-Medium.ttf'),
  });
  const backgroundMusicRef = useRef(null);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    async function playBackgroundMusic() {
      try {
        const { sound } = await Audio.Sound.createAsync(require('../assets/back.mp3'));
        await sound.setIsLoopingAsync(true); // Müziği loop yaparak çalmak
        await sound.playAsync();
        backgroundMusicRef.current = sound;
      } catch (error) {
        console.error('Error loading and playing sound', error);
      }
    }

    playBackgroundMusic();

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.unloadAsync();
      }
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.safeArea}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="+not-found"
            options={{ header: () => <CustomHeader zodiacSign={undefined} isBotTyping={undefined} /> }}
          />
          <Stack.Screen
            name="dashboard"
            options={{ headerShown: false }}
          />
          {/* Diğer ekranlarınızı burada tanımlayın ve CustomHeader'ı kullanın */}
        </Stack>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
});
