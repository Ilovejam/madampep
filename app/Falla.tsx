import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, Animated, ImageBackground, TouchableOpacity, Alert, Image, Modal, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import CustomHeader from '../components/CustomHeader';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';
import * as SecureStore from 'expo-secure-store';
import { v4 as uuidv4 } from 'uuid';

const { width, height } = Dimensions.get('window');

export default function Falla() {
  const route = useRoute();
  const initialMessages = route.params?.initialMessages || [];
  const deviceId = route.params?.deviceId;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [timer, setTimer] = useState(900); // 900 saniye = 15 dakika
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

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
          router.push({ pathname: '/Fal', params: { deviceId, initialMessages } }); // Süre bitince Fal ekranına yönlendir
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [router, deviceId, initialMessages]);

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
    router.push({ pathname: '/Fal', params: { deviceId, initialMessages } }); // Initial messages'ı da gönder
  };

  return (
    <ImageBackground source={require('../assets/images/background.png')} style={styles.background}>
      <SafeAreaView style={styles.safeArea}>
        <CustomHeader showBackButton={false} showHeaderOptimals={true} />
        <View style={styles.sandTimerContainer}>
          <View style={styles.messageContainer}>
            <View style={styles.messageBubble}>
              <Text style={styles.messageText}>
                Ne çok şey var böyle... Aslında şöyle tatlı bi’ şeyler olsa, keyfimiz yerine gelirdi, hızlanırdık biraz...
              </Text>
            </View>
          </View>
          <LottieView
            source={require('../assets/kumsaati.json')}
            autoPlay
            loop
            style={styles.sandTimer}
          />
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
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
  sandTimerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.05,
  },
  sandTimer: {
    width: width * 0.6,
    height: width * 0.6,
  },
  timerText: {
    color: '#CDC3AB',
    fontSize: width * 0.05,
    marginVertical: height * 0.02,
    fontFamily: 'DavidLibre',
  },
  timerContainer: {
    borderColor: '#CDC3AB', // Border rengi
    borderWidth: 1, // Border genişliği
    paddingHorizontal: width * 0.04, // İç boşluk
    paddingVertical: height * 0.01,
    borderRadius: width * 0.02, // Köşeleri yuvarlama
    marginVertical: height * 0.02, // Üst ve alt boşluk
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
    marginBottom: -height * 0.3,
  },
  speedUpContainer: {
    alignItems: 'center',
    marginTop: height * 0.03,
    backgroundColor: 'rgba(66, 66, 66, 0.05)', // %5 opacity ile 424242 rengi
    padding: height * 0.02,
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: 'rgba(205, 195, 171, 0.15)', // %15 opacity ile CDC3AB rengi
  },
  speedUpTitle: {
    color: '#CDC3AB',
    fontSize: width * 0.08, // Font boyutu büyütüldü
    marginBottom: height * 0.02,
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
    marginHorizontal: width * 0.08, // Ortak mesafe artırıldı
  },
  buttonImage: {
    width: width * 0.25, // Butonlar büyütüldü
    height: width * 0.25, // Butonlar büyütüldü
    resizeMode: 'contain',
  },
  buttonText: {
    color: 'white',
    fontSize: width * 0.045, // Font boyutu büyütüldü
    marginTop: height * 0.01,
    textAlign: 'center',
    fontFamily: 'DavidLibre', // Belirttiğiniz font
  },
  messageContainer: {
    flexDirection: 'row',
    marginLeft: width * 0.04,
    justifyContent: 'flex-start',
    alignItems: 'flex-start', // Align content to the start
    alignSelf: 'flex-start', // Align bubble to the start
  },
  messageBubble: {
    maxWidth: '75%',
    padding: width * 0.03,
    borderRadius: width * 0.04,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
  },
  messageText: {
    color: '#FBEFD1',
    fontSize: width * 0.045,
    fontFamily: 'DavidLibre',
  },
});
