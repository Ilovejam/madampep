import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const { width } = Dimensions.get('window');

const getZodiacSign = (day, month) => {
  if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) return 'capricorn';
  if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) return 'aquarius';
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'pisces';
  if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) return 'aries';
  if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) return 'taurus';
  if ((month == 5 && day >= 21) || (month == 6 && day <= 21)) return 'gemini';
  if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) return 'cancer';
  if ((month == 7 && day >= 23) || (month == 8 && day <= 23)) return 'leo';
  if ((month == 8 && day >= 24) || (month == 9 && day <= 23)) return 'virgo';
  if ((month == 9 && day >= 24) || (month == 10 && day <= 23)) return 'libra';
  if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) return 'scorpio';
  if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) return 'sagittarius';
  return 'unknown';
};

export default function CustomHeader({ isBotTyping, showFrame = false, showBackButton = true }) {
  const navigation = useNavigation();
  const [currentZodiac, setCurrentZodiac] = useState(null);
  const [isProfileDataAvailable, setIsProfileDataAvailable] = useState(false);

  const handleBackPress = () => {
    navigation.navigate('Dashboard');
  };

  const handleLottiePress = () => {
    if (isProfileDataAvailable) {
      navigation.navigate('Profile'); // Tıklanıldığında Profile ekranına yönlendir
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        let deviceId = await SecureStore.getItemAsync('deviceId');
        if (!deviceId) {
          console.error('Device ID not found');
          setIsProfileDataAvailable(false);
          return;
        }
        
        const response = await axios.get('https://madampep-backend.vercel.app/api/profile', {
          params: { deviceId }
        });
        
        const { name, birthDate } = response.data;
  
        if (name && birthDate) {
          setIsProfileDataAvailable(true);
          const [day, month] = birthDate.split('.').map(Number);
          const zodiacSign = getZodiacSign(day, month);
          setCurrentZodiac(zodiacSign);
        } else {
          setIsProfileDataAvailable(false);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setIsProfileDataAvailable(false);
      }
    };
  
    fetchProfileData();
  }, []);

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
  };

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity onPress={handleBackPress}>
          <Image source={require('../assets/icons/right-arrow.png')} style={[styles.backIcon, styles.rotatedIcon]} />
        </TouchableOpacity>
      )}
      <View style={styles.headerTitleContainer}>
        <TouchableOpacity onPress={handleLottiePress} disabled={!isProfileDataAvailable}>
          <LottieView
            source={require('../assets/eye.json')}
            autoPlay
            loop
            style={styles.headerImage}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Madampep</Text>
          <Text style={styles.headerSubtitle}>{isBotTyping ? 'yazıyor...' : 'online'}</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        {showFrame && (
          <Image source={require('../assets/images/frame.png')} style={styles.profileImageLokum} />
        )}
        {currentZodiac && (
          <Image source={zodiacImages[currentZodiac]} style={styles.profileImage} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: width, // Cihaz genişliğini ayarlamak için
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    flex: 1,
  },
  backButton: {},
  backIcon: {
    width: width * 0.06,
    height: width * 0.06,
    resizeMode: 'contain',
  },
  rotatedIcon: {
    transform: [{ rotate: '180deg' }],
  },
  headerImage: {
    width: 45, // Lottie animasyonu büyütüldü
    height: 45, // Lottie animasyonu büyütüldü
    marginRight: 20, // Animasyon ile metin arasındaki boşluk artırıldı
  },
  headerTitle: {
    color: '#FBEFD1',
    fontSize: 18,
    fontFamily: 'DavidLibre',
  },
  headerSubtitle: {
    color: 'green',
    fontSize: 12,
  },
  profileImage: {
    width: 40, // Boyutları ayarlandı
    height: 40, // Boyutları ayarlandı
    marginRight: 10,
  },
  
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
