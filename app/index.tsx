import React, { useState } from 'react';
import SplashScreen from './SplashScreen';
import UploadImage from './UploadImage';
import ChatScreen from './ChatScreen';
import Dashboard from './Dashboard';
import MelekKartları from './MelekKartları'; // MelekKartları bileşenini ekleyin

export default function HomeScreen() {
  const [currentScreen, setCurrentScreen] = useState('SplashScreen');

  switch (currentScreen) {
    case 'MelekKartları':
      return <MelekKartları />;
    case 'Dashboard':
      return <Dashboard />;
    case 'ChatScreen':
      return <ChatScreen onSpeedUp={() => setCurrentScreen('MelekKartları')} />;
    case 'UploadImage':
      return (
        <UploadImage 
          onSubmit={() => setCurrentScreen('ChatScreen')} 
          onClose={() => setCurrentScreen('Dashboard')}
        />
      );
    case 'SplashScreen':
    default:
      return <SplashScreen onAnimationEnd={() => setCurrentScreen('ChatScreen')} />;
  }
}
