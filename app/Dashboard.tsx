import React from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect, useState } from 'react';
import CustomHeader from '@/components/CustomHeader';

export default function Dashboard() {
  const navigation = useNavigation();
  const [zodiacSign, setZodiacSign] = useState('Avatar');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleCardPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader showFrame={true} showBackButton={false} />
        <ScrollView contentContainerStyle={styles.container}>
          <LottieView
            source={require('../assets/eye.json')}
            autoPlay
            loop
            style={styles.eyeAnimation}
          />
          <TouchableOpacity style={styles.card} onPress={() => handleCardPress('ChatScreen')}>
            <Text style={styles.cardTitle}>Kahve Falı</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardInactive} onPress={() => handleCardPress('Tarot')}>
            <Text style={styles.cardTitleInactive}>Tarot Falı</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardInactive} onPress={() => handleCardPress('RüyaTabiri')}>
            <Text style={styles.cardTitleInactive}>Rüya Tabiri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardInactive} onPress={() => handleCardPress('MelekKartları')}>
            <Text style={styles.cardTitleInactive}>Melek Kartları</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cardInactive} onPress={() => handleCardPress('BurçYorumları')}>
            <Text style={styles.cardTitleInactive}>Burç Yorumları</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    borderColor: 'rgba(205, 195, 171, 0.15)',
  },
  eyeAnimation: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },  
  versionText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(66, 66, 66, 0.05)', 
    borderColor: '#CDC3AB',
    borderWidth: 1,
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  cardInactive: {
    backgroundColor: 'rgba(66, 66, 66, 0.05)', 
    borderColor: 'rgba(205, 195, 171, 0.1)',
    borderWidth: 1,
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#CDC3AB',
    fontSize: 25,
    fontFamily: 'DavidLibre',
  },
  cardTitleInactive: {
    color: '#CDC3AB',
    fontSize: 25,
    fontFamily: 'DavidLibre',
    opacity: 0.1,
  },
});
