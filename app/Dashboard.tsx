import React from 'react';
import { StyleSheet, View, Text, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
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
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
        <CustomHeader></CustomHeader>
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
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    padding: 20,
    alignItems: 'center',
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
    backgroundColor: '#000000',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  cardInactive: {
    backgroundColor: '#000000',
    opacity: 0.6,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#FBEFD1',
    fontSize: 18,
    fontFamily: 'DavidLibre-Regular',
  },
  cardTitleInactive: {
    color: '#FBEFD1',
    fontSize: 18,
    fontFamily: 'DavidLibre-Regular',
    opacity: 0.6,
  },
});
