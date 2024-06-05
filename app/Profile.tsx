import React, { useLayoutEffect, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState({
    name: null,
    birthDate: null,
    id: null,
  });
  const [deviceId, setDeviceId] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchDeviceId = async () => {
      try {
        let id = await SecureStore.getItemAsync('deviceId');
        if (!id) {
          id = uuidv4();
          await SecureStore.setItemAsync('deviceId', id);
        }
        setDeviceId(id);
      } catch (error) {
        console.error('Error getting or setting device ID', error);
      }
    };

    fetchDeviceId();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!deviceId) return;

      try {
        const response = await axios.get('https://madampep-backend.vercel.app/api/profile', {
          params: { deviceId }
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setProfileData({ name: null, birthDate: null, id: null });
      }
    };

    fetchProfileData();
  }, [deviceId]);

  const goToSettings = () => {
    navigation.navigate('Settings');
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Image source={require('../assets/icons/right-arrow.png')} style={[styles.backIcon, styles.rotatedIcon]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToSettings} style={styles.settingsButton}>
            <Image source={require('../assets/icons/settings.png')} style={styles.settingsIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.overlay} />
        <Image source={require('../assets/images/profileheader.png')} style={styles.zodiacImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profileData.name || 'Adınızı giriniz'}</Text>
          <Text style={styles.birthDate}>{profileData.birthDate || 'Doğum tarihinizi giriniz'}</Text>
          <View style={styles.idContainer}>
            <Text style={styles.idLabel}>ID :</Text>
            <Text style={styles.idValue}>{profileData.id || 'Kimlik bilgisi eksik'}</Text>
          </View>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <Image source={require('../assets/icons/archive.png')} style={styles.menuIcon} />
            <Text style={styles.menuText}>Fal Arşivi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Image source={require('../assets/icons/tasks.png')} style={styles.menuIcon} />
            <Text style={styles.menuText}>Tatlı Görevler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Image source={require('../assets/icons/send.png')} style={styles.menuIcon} />
            <Text style={styles.menuText}>Arkadaşıma Lokum Gönder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: height * 0.05, // Ekranın üst kısmından yüzde 5 oranında aşağıda
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    zIndex: 2, // Üstte görünmesini sağlıyoruz
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
  settingsButton: {
    // Ayarlar butonu için stil
  },
  settingsIcon: {
    width: width * 0.06, // İkon boyutunu küçültüyoruz
    height: width * 0.06, // İkon boyutunu küçültüyoruz
    tintColor: '#CDC3AB',
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    top: height * 0.25, // Ekranın üst kısmından yüzde 25 oranında aşağıda
    backgroundColor: 'rgba(66, 66, 66, 0.05)',
    width: '90%', // Çerçeveyi küçültüyoruz
    height: '60%', // Çerçeveyi küçültüyoruz
    borderColor: 'rgba(205, 195, 171, 0.15)',
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zodiacImage: {
    width: width * 0.4, // Genişliği ekran genişliğine göre oranlıyoruz
    height: width * 0.4, // Yüksekliği ekran genişliğine göre oranlıyoruz
    position: 'absolute',
    top: height * 0.15, // Ekranın üst kısmından yüzde 15 oranında aşağıda
    zIndex: 1,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: height * 0.2, // Zodiac resminin ve overlay'in altına yerleştiriyoruz
    zIndex: 0,
  },
  name: {
    color: '#FBEFD1',
    fontSize: width * 0.06, // Font boyutunu ekran genişliğine göre oranlıyoruz
    fontFamily: 'DavidLibre',
  },
  birthDate: {
    color: '#FBEFD1',
    fontSize: width * 0.05, // Font boyutunu ekran genişliğine göre oranlıyoruz
    fontFamily: 'DavidLibre',
    marginVertical: height * 0.01,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(136, 58, 197, 0.1)', // %10 opacity ile 883AC5 rengi
    borderRadius: 10,
    padding: width * 0.02, // Padding değerini ekran genişliğine göre oranlıyoruz
    borderWidth: 1,
    borderColor: 'rgba(205, 195, 171, 0.25)', // %25 opacity ile CDC3AB rengi
  },
  idLabel: {
    color: 'rgba(205, 195, 171, 0.5)', // %50 opacity ile CDC3AB rengi
    fontSize: width * 0.04, // Font boyutunu ekran genişliğine göre oranlıyoruz
    fontFamily: 'DavidLibre',
  },
  idValue: {
    color: 'rgba(205, 195, 171, 0.5)', // %50 opacity ile CDC3AB rengi
    fontSize: width * 0.04, // Font boyutunu ekran genişliğine göre oranlıyoruz
    fontFamily: 'DavidLibre',
    marginLeft: width * 0.01,
  },  
  menu: {
    width: '80%',
    textAlign: 'center', // Yazıları merkeze hizalıyoruz
    marginTop: height * 0.03, // Margin değerini ekran yüksekliğine göre oranlıyoruz
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(66, 66, 66, 0.05)',
    borderRadius: 10,
    padding: width * 0.04, // Padding değerini ekran genişliğine göre oranlıyoruz
    marginBottom: height * 0.01, // Margin değerini ekran yüksekliğine göre oranlıyoruz
    borderWidth: 1,
    borderColor: 'rgba(205, 195, 171, 0.15)',
  },
  menuIcon: {
    width: width * 0.06, // İkon boyutunu ekran genişliğine göre oranlıyoruz
    height: width * 0.06, // İkon boyutunu ekran genişliğine göre oranlıyoruz
    tintColor: '#CDC3AB',
    marginRight: width * 0.03, // Margin değerini ekran genişliğine göre oranlıyoruz
    resizeMode: 'contain',
  },
  menuText: {
    color: '#FBEFD1',
    fontSize: width * 0.045, // Font boyutunu ekran genişliğine göre oranlıyoruz
    fontFamily: 'DavidLibre',
    textAlign: 'center', // Yazıları merkeze hizalıyoruz
    flex: 1, // Yazıların kalan alanı kaplamasını sağlıyoruz
  },
});
