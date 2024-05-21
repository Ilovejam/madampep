import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CustomHeader({ zodiacSign }) {
  const navigation = useNavigation();
  const [currentZodiac, setCurrentZodiac] = useState('Avatar');

  const handleBackPress = () => {
    navigation.navigate('Dashboard');
  };

  useEffect(() => {
    console.log('Received Zodiac Sign Prop:', zodiacSign); // Debugging
    if (zodiacSign) {
      setCurrentZodiac(zodiacSign);
    }
  }, [zodiacSign]);

  const zodiacImages = {
    capricorn: require('../assets/burçlar/capricorn.png'),
    aquarius: require('../assets/burçlar/aquarius.png'),
    pisces: require('../assets/burçlar/pisces.png'),
    aries: require('../assets/burçlar/aries.png'),
    taurus: require('../assets/burçlar/taurus.png'),
    gemini: require('../assets/burçlar/gemini.png'),
    cancer: require('../assets/burçlar/cancer.png'),
    leo: require('../assets/burçlar/leo.png'),
    virgo: require('../assets/burçlar/virgo.png'),
    libra: require('../assets/burçlar/libra.png'),
    scorpio: require('../assets/burçlar/scorpio.png'),
    sagittarius: require('../assets/burçlar/sagittarius.png'),
    Avatar: require('../assets/images/Avatar.png'),  // Varsayılan resim
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Image source={require('../assets/images/eye.png')} style={styles.headerImage} />
        <View>
          <Text style={styles.headerTitle}>Madampep</Text>
          <Text style={styles.headerSubtitle}>online</Text>
        </View>
      </View>
      <Image source={require('../assets/images/frame.png')} style={[styles.profileImageLokum, styles.marginRight]} />
      <Image source={zodiacImages[currentZodiac]} style={styles.profileImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flex: 1,
  },
  headerImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerTitle: {
    color: '#FBEFD1',
    fontSize: 18,
    fontFamily: 'DavidLibre-Regular',
  },
  headerSubtitle: {
    color: 'green',
    fontSize: 12,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  profileImageLokum: {
    width: 50,
    height: 35,
  },
  marginRight: {
    marginRight: 5,
  },
});
