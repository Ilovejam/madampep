import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, ImageBackground, FlatList, TextInput, TouchableOpacity, Keyboard, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Audio } from 'expo-av';
import SplashScreen from './SplashScreen';
import UploadImage from './UploadImage';
import ChatScreen from './ChatScreen';
import Dashboard from './Dashboard';
import MelekKartları from './MelekKartları';
import Falla from './Falla';
import Fal from './Fal';

export default function HomeScreen() {
  const [currentScreen, setCurrentScreen] = useState('SplashScreen');
  const backgroundMusicRef = useRef(null);

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

  switch (currentScreen) {
    case 'MelekKartları':
      return <MelekKartları />;
    case 'Dashboard':
      return <Dashboard />;
    case 'Falla':
      return <Falla />;
    case 'Fal':
      return <Fal />;
    case 'ChatScreen':
      return <ChatScreen onSpeedUp={() => setCurrentScreen('MelekKartları')} />;
    case 'SplashScreen':
    default:
      return <SplashScreen onAnimationEnd={() => setCurrentScreen('ChatScreen')} />;
  }
  return (
    <View style={{ flex: 1 }}>
      {content}
    </View>
  );

}
