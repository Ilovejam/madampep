import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Animated, ImageBackground, TouchableOpacity, Alert, Image, Modal, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import CustomHeader from '../components/CustomHeader';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';
import * as SecureStore from 'expo-secure-store';

export default function Falla() {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [timer, setTimer] = useState(900); // 900 saniye = 15 dakika
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();
  const [deviceId, setDeviceId] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          router.push({ pathname: '/Fal', params: { deviceId } }); // Süre bitince Fal ekranına yönlendir
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [router, deviceId]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 10000, // 10 saniye içinde 180 derece dönecek
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSpeedUpPress = () => {
    Alert.alert('Reklam İzle', 'Örnek bir reklam izliyorsunuz...', [
      { text: 'Tamam', onPress: () => setTimer(10) }
    ]);
  };

  const handleLokumlaPress = () => {
    setModalVisible(true);
  };

  const handleModalPress = () => {
    setModalVisible(false);
    router.push({ pathname: '/Fal', params: { deviceId } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>

        <View style={styles.sandTimerContainer}>
          <LottieView
            source={require('../assets/kumsaati.json')}
            autoPlay
            loop
            style={styles.sandTimer}
          />
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>00:{formatTime(timer)}</Text>
          </View>
          <View style={styles.speedUpContainer}>
            <Text style={styles.speedUpTitle}>Hızlandır</Text>
            <View style={styles.speedUpButtons}>
              <TouchableOpacity style={styles.speedUpButton} onPress={handleSpeedUpPress}>
                <Image source={require('../assets/images/videola.png')} style={styles.buttonImage} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.speedUpButton} onPress={handleLokumlaPress}>
                <Image source={require('../assets/images/lokumla.png')} style={styles.buttonImage} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={handleModalPress}>
            <BlurView intensity={10} style={styles.blurView}>
              <View style={styles.overlay}>
                <Image source={require('../assets/images/paywall.png')} style={styles.paywallImage} />
              </View>
            </BlurView>
          </TouchableOpacity>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    top:40
  },
  sandTimerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  sandTimer: {
    width: 300,
    height: 300,
  },
  timerText: {
    color: '#CDC3AB',
    fontSize: 20,
    marginVertical: 10,
    fontFamily:'DavidLibre'
  },
  timerContainer: {
    borderColor: '#CDC3AB', // Border rengi
    borderWidth: 1, // Border genişliği
    paddingHorizontal: 14, // İç boşluk
    paddingVertical:4,
    borderRadius: 10, // Köşeleri yuvarlama
    marginVertical: 10, // Üst ve alt boşluk
    backgroundColor: 'rgba(66, 66, 66, 0.05)', // Arka plan rengi %5 opacity
    alignItems: 'center', // İçeriği ortalamak için
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
  },
  blurView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Bu stil View'un tüm alanı kaplamasını sağlar
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Siyahımsı arka plan
    justifyContent: 'center',
    alignItems: 'center',
  },
  

  paywallImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    marginBottom: -290,
  },
  speedUpContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(66, 66, 66, 0.05)', // %5 opacity ile 424242 rengi
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(205, 195, 171, 0.15)', // %15 opacity ile CDC3AB rengi
  },
  speedUpTitle: {
    color: '#CDC3AB',
    fontSize: 30, // Font boyutu büyütüldü
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'DavidLibre', // Belirttiğiniz font
  },
  speedUpButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedUpButton: {
    alignItems: 'center',
    marginHorizontal: 30, // Ortak mesafe artırıldı
  },
  buttonImage: {
    width: 110, // Butonlar büyütüldü
    height: 110, // Butonlar büyütüldü
    resizeMode: 'contain',
  },
  buttonText: {
    color: 'white',
    fontSize: 18, // Font boyutu büyütüldü
    marginTop: 5,
    textAlign: 'center',
    fontFamily: 'DavidLibre', // Belirttiğiniz font
  },
});
