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
    capricorn: require('../assets/images/zodiac/capricorn.png'),
    aquarius: require('../assets/images/zodiac/aquarius.png'),
    pisces: require('../assets/images/zodiac/pisces.png'),
    aries: require('../assets/images/zodiac/aries.png'),
    taurus: require('../assets/images/zodiac/taurus.png'),
    gemini: require('../assets/images/zodiac/gemini.png'),
    cancer: require('../assets/images/zodiac/cancer.png'),
    leo: require('../assets/images/zodiac/leo.png'),
    virgo: require('../assets/images/zodiac/virgo.png'),
    libra: require('../assets/images/zodiac/libra.png'),
    scorpio: require('../assets/images/zodiac/scorpio.png'),
    sagittarius: require('../assets/images/zodiac/sagittarius.png'),
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
