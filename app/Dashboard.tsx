import React from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react'; // useLayoutEffect'i import edin
import CustomHeader from '@/components/CustomHeader';
export default function Dashboard() {
    const navigation = useNavigation();

    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, [navigation]);

  const handleCardPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.safeArea} >
      <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
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
          {/* <TouchableOpacity style={styles.cardInactive} onPress={() => handleCardPress('YıldızHaritası')}>
            <Text style={styles.cardTitleInactive}>Yıldız Haritası</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.cardInactive} onPress={() => handleCardPress('BurçYorumları')}>
            <Text style={styles.cardTitleInactive}>Burç Yorumları</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black', // Ekranınızın arka plan rengi
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    borderColor: 'rgba(205, 195, 171, 0.15)',
  },
  eyeAnimation: {
    width: 80,
    height: 80,
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
