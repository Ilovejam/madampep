import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { Audio } from 'expo-av';
import SplashScreen from './SplashScreen';
import UploadImage from './UploadImage';
import ChatScreen from './ChatScreen';
import Dashboard from './Dashboard';
import MelekKartları from './MelekKartları';
import Falla from './Falla';
import Fal from './Fal';
import ProfileScreen from './Profile';
import * as SecureStore from 'expo-secure-store';
import 'react-native-get-random-values'; // getRandomValues desteği eklemek için
import { v4 as uuidv4 } from 'uuid';

export default function HomeScreen() {
  const [currentScreen, setCurrentScreen] = useState('SplashScreen');
  const backgroundMusicRef = useRef(null);
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    const getDeviceId = async () => {
      try {
        let id = await SecureStore.getItemAsync('deviceId');
        if (!id) {
          id = uuidv4();
          await SecureStore.setItemAsync('deviceId', id);
        }
        setDeviceId(id);
        console.log('Device ID:', id); // Device ID'yi konsolda görmek için
      } catch (error) {
        console.error('Error getting or setting device ID', error);
      }
    };

    getDeviceId();
  }, []);

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
    case 'ProfileScreen':
      return <ProfileScreen />;
    case 'ChatScreen':
      return <ChatScreen onSpeedUp={() => setCurrentScreen('MelekKartları')} />;
    case 'SplashScreen':
    default:
      return <SplashScreen onAnimationEnd={() => setCurrentScreen('ChatScreen')} />;
  }
  
  return (
    <View style={{ flex: 1 }}>
      <Text>Device ID: {deviceId}</Text> {/* Device ID'yi göstermek için */}
    </View>
  );
}
